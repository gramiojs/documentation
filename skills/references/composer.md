---
name: composer
description: "@gramio/composer — the type-safe middleware composition library powering GramIO internals. decorate(), when(), inspect(), trace(), custom methods via createComposer()."
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

## Scope System

```typescript
// local (default) — isolated, doesn't leak to parent
// scoped — merges directly into parent's downstream
// global — propagates through further extend() calls

const plugin = new Composer({ name: "auth" })
    .derive(getUser)
    .as("scoped"); // promote everything to scoped

app.extend(plugin); // getUser visible in app's downstream
```

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
