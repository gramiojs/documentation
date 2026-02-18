---
name: composer
description: "@gramio/composer — the type-safe middleware composition library powering GramIO internals. Named Composer deduplication, isolation groups, scoped/global propagation, when(), inspect(), trace(), custom methods via createComposer()."
---

# @gramio/composer

General-purpose, type-safe middleware composition library. Powers GramIO's internals. Useful for plugin authors and framework builders.

Package: `@gramio/composer`

## Core Methods

| Method | Description |
|--------|-------------|
| `use(...mw)` | Register raw middleware `(ctx, next) => unknown` |
| `derive(handler)` | Enrich context with per-request computed values |
| `decorate(values, opts?)` | Enrich context with static values (zero overhead, same reference) |
| `guard(predicate)` | Continue chain only if predicate returns true |
| `when(condition, fn)` | Build-time conditional middleware registration |
| `branch(predicate, onTrue, onFalse?)` | Runtime conditional routing |
| `group(fn)` | Isolated sub-composer with scoped context |
| `extend(other)` | Merge another composer/plugin into this one |
| `inspect()` | Get `MiddlewareInfo[]` — metadata about registered middleware |
| `trace(handler)` | Opt-in per-middleware instrumentation |
| `on(event, handler)` | Event-specific handler (EventComposer only) |
| `compose()` | Compile to a single `ComposedMiddleware` function |
| `run(ctx, next?)` | Run the compiled middleware chain |

## decorate() vs derive()

```typescript
// derive() — function called per request, result merged into context
app.derive(async (ctx) => ({ user: await db.findUser(ctx.id) }));

// decorate() — object assigned once, same reference every request
app.decorate({ db: myDatabase, config: appConfig });
```

## when() — Build-time Conditionals

```typescript
const app = new Composer()
    .when(process.env.NODE_ENV !== "production", (c) =>
        c.use(verboseLogger)
    )
    .when(config.auth, (c) =>
        c.derive(() => ({ user: getUser() }))
    );
// Properties from when() blocks are typed as Partial (optional)
```

## inspect() — Middleware Metadata

```typescript
app.inspect();
// [
//   { index: 0, type: "derive", name: "getUser", scope: "local" },
//   { index: 1, type: "guard", name: "isAdmin", scope: "local" },
//   { index: 2, type: "use", name: "handleRequest", scope: "local" },
// ]
// With plugin origin: { ..., plugin: "auth" }
```

## trace() — Observability

```typescript
app.trace((entry, ctx) => {
    const span = tracer.startSpan(`${entry.type}:${entry.name}`);
    return (error) => {
        if (error) span.recordException(error);
        span.end();
    };
});
// Zero overhead when trace() not called
```

## Named Composers & Deduplication

Give a Composer a `name` to enable structural deduplication. GramIO tracks extended names in a `Set` (`["~"].extended`). The key is `name:JSON.stringify(seed)`. If the key is already present, `extend()` is a no-op.

```typescript
const withUser = new Composer({ name: "withUser" })
    .derive(async (ctx) => ({ user: await db.getUser(ctx.from?.id) }))
    .as("scoped");

const app = new Composer()
    .extend(withUser) // ✅ registered, key "withUser:null" added
    .extend(withUser); // ⏭️  key exists → skipped
```

**Dedup is transitive.** If `adminRouter` extends `withUser`, and `bot` extends `adminRouter`, the key `"withUser:null"` transfers to `bot`'s extended set. Any later `bot.extend(withUser)` is a no-op.

```typescript
const a = new Composer({ name: "a" }).use(mwA);
const b = new Composer({ name: "b" }).extend(a); // b.extended = {"a:null"}

const app = new Composer()
    .extend(b) // app.extended = {"b:null", "a:null"}
    .extend(a); // "a:null" already present → skipped
```

## Scope System

```typescript
// local (default) — isolated via Object.create(ctx), results don't leak to parent
// scoped — added as plain fn to parent, results propagate to parent and siblings
// global — propagates through all extend() calls

const plugin = new Composer({ name: "auth" })
    .derive(getUser)
    .as("scoped"); // promote all middleware to scoped scope

app.extend(plugin); // getUser visible in app's downstream
```

### Isolation groups (local scope internals)

When `parent.extend(other)`, all `local`-scope middleware from `other` are wrapped in a single isolation group via `Object.create(ctx)`:

```typescript
// Effectively what happens with local-scoped extend():
const isolated = async (ctx, next) => {
    const scopedCtx = Object.create(ctx); // proto-chain: reads from ctx, writes to scopedCtx
    await chain(scopedCtx, noopNext);     // derive writes to scopedCtx, NOT to ctx
    return next();                        // ctx is unchanged
};
```

**Key**: reads propagate up the proto-chain (`scopedCtx.user` finds `ctx.user` if set), but writes stay in `scopedCtx` and don't reach `ctx`.

### ⚠️ Dedup ≠ shared data

Naming removes middleware at **registration** time. If `withUser` (local scope) is only in sub-composers, dedup removes it from the second router — but the first router's isolation group still owns the data:

```
isolated_adminRouter: [decorate, derive, adminHandlers] ← ctx.user written here
isolated_chatRouter:  [chatHandlers]                    ← ctx.user NOT visible ❌
```

TypeScript types are correct; runtime behavior is not. **This is the only place in GramIO where types and runtime diverge.**

**Fix**: extend `withUser` with `.as("scoped")` at the **top level before** the routers. Then dedup skips it inside sub-composers, but the derive has already run on the real `ctx`:

```typescript
const withUser = new Composer({ name: "withUser" })
    .decorate({ db })
    .derive(async (ctx) => ({ user: await db.getUser(ctx.from?.id ?? 0) }))
    .as("scoped"); // no isolation → writes to real ctx

const bot = new Bot(TOKEN)
    .extend(withUser)    // ← FIRST: runs on real ctx
    .extend(adminRouter) // dedup: withUser inside → skipped
    .extend(chatRouter); // dedup: withUser inside → skipped
// ctx.user readable by all routers via proto-chain ✅
```

**When it doesn't matter**: mutually exclusive routers (guard stops one path before the other starts) — each update touches only one isolation group.

## Production Architecture Pattern

```typescript
// middleware/user.ts — shared base
export const withUser = new Composer({ name: "withUser" })
    .decorate({ db })
    .derive(async (ctx) => ({ user: await db.getUser(ctx.from?.id ?? 0) }))
    .as("scoped");

// routers/admin.ts — extends withUser for types; guard gating
export const adminRouter = new Composer({ name: "adminRouter" })
    .extend(withUser)                          // types ✅, dedup skips runtime if bot extends first
    .guard((ctx) => ctx.user.role === "admin")
    .command("ban",   (ctx) => ctx.send(`Banned by ${ctx.user.name}`))
    .command("stats", async (ctx) => ctx.send((await ctx.db.getUser(42)).name));

// routers/chat.ts — second layer: withChat scoped to message
const withChat = new Composer({ name: "withChat" })
    .derive("message", async (ctx) => ({ chatRecord: await db.getChat(ctx.chat.id) }))
    .as("scoped");

export const chatRouter = new Composer({ name: "chatRouter" })
    .extend(withUser)  // types ✅
    .extend(withChat)  // ctx.chatRecord ✅ (Partial outside message handlers)
    .on("message", (ctx) => ctx.send(`${ctx.user.name} in ${ctx.chatRecord.title}`));

// bot.ts — flat assembly
const bot = new Bot(TOKEN)
    .extend(withUser)    // ← must be first
    .extend(adminRouter)
    .extend(chatRouter)
    .command("start", (ctx) => ctx.send("Hello!"));
```

Note: `ctx.chat` (no suffix) is GramIO's built-in Telegram event property — use `chatRecord` or another name for DB-derived chat objects.

## createComposer() — Custom Framework Methods

```typescript
import { createComposer, eventTypes } from "@gramio/composer";

const { Composer } = createComposer({
    discriminator: (ctx: BaseCtx) => ctx.updateType,
    types: eventTypes<{ message: MessageCtx }>(),
    methods: {
        hears(trigger: RegExp | string, handler: (ctx: MessageCtx) => unknown) {
            return this.on("message", (ctx, next) => {
                const text = ctx.text;
                if (typeof trigger === "string" ? text === trigger : trigger.test(text ?? ""))
                    return handler(ctx);
                return next();
            });
        },
    },
});

// Custom methods preserved through all chains
bot.hears(/hello/, h1).on("message", h2).hears(/bye/, h3);
```

- `types: eventTypes<TEventMap>()` — phantom type inference for event map without explicit generics
- Runtime conflict check if method name clashes with built-in

<!--
Source: https://gramio.dev/extend/composer
-->
