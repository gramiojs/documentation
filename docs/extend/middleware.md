---
title: "Middleware & Context — How Updates Flow Through GramIO"
head:
    - - meta
      - name: "description"
        content: "Learn how GramIO's middleware pipeline works: how updates flow, how derive() builds typed context, how guard() filters, and how to compose reusable middleware groups with Plugin."
    - - meta
      - name: "keywords"
        content: "gramio, middleware, context, derive, decorate, guard, plugin, compose, reuse, type inference, pipeline, update handling, TypeScript"
---

# Middleware & Context

Every Telegram update that arrives at your bot is just **data flowing through a pipeline**. GramIO gives you a type-safe, chainable API to shape that pipeline exactly how you need — layer by layer, with TypeScript tracking everything along the way.

::: tip Quick orientation
If you're looking for the low-level engine that powers all this, see [@gramio/composer](./composer.md).
This page focuses on the patterns you'll actually use when building bots.
:::

## The Mental Model

Think of your bot as an assembly line. An update enters from the left, passes through each station, and exits (or gets stopped) on the right:

```
Update → [logger] → [fetchUser] → [guard: isAdmin?] → [handler] → Response
                                         ↓ false
                                      (stopped)
```

Each "station" is a middleware. They run **in registration order**. The key insight: **every method returns the updated bot**, so you always chain.

## Walk Through It Interactively

Toggle `user.isAdmin` to see how a guard changes what reaches the handler:

<UpdatePipelineVisualizer />

Watch how `ctx` grows as each `derive()` fires, and how the guard completely blocks the handler when the condition isn't met.

## Always Chain

GramIO's type system is built on method chaining. Each method records what it added to `ctx` and returns the updated type. If you break the chain, TypeScript loses that information:

```ts twoslash
import { Bot } from "gramio";
// ---cut---
// ✅ Correct — types flow through the chain
const bot = new Bot(process.env.BOT_TOKEN as string)
    .derive(() => ({ db: { getUser: (id: number) => ({ name: "Alice" }) } }))
    .command("start", (ctx) => {
        ctx.db.getUser(1); // ✅ fully typed
    });
```

```ts twoslash
import { Bot } from "gramio";
// ---cut---
// ❌ Breaking the chain loses types
const bot = new Bot(process.env.BOT_TOKEN as string);
bot.derive(() => ({ db: { getUser: (id: number) => ({ name: "Alice" }) } }));
bot.command("start", (ctx) => {
    // @ts-expect-error — ctx.db doesn't exist! The derive was registered on a
    // different (discarded) type than the one .command() sees.
    ctx.db;
});
```

Always build your bot as one chained expression, or save the intermediate result and continue from it:

```ts twoslash
import { Bot } from "gramio";
// ---cut---
const withDb = new Bot(process.env.BOT_TOKEN as string)
    .derive(() => ({ db: { getUser: (id: number) => ({ name: "Alice" }) } }));

// Continue chaining from the result — types are preserved
withDb.command("start", (ctx) => {
    ctx.db.getUser(1); // ✅
});
```

## Enriching Context: derive()

`derive()` runs a function **per update** and merges the returned object into `ctx`. Everything registered after it sees the new properties — fully typed.

```ts twoslash
import { Bot } from "gramio";
// ---cut---
const bot = new Bot(process.env.BOT_TOKEN as string)
    .derive(async () => {
        // In real code: const user = await db.getUser(ctx.from!.id)
        const user = { id: 42, name: "Alice", isAdmin: false };
        return { user };
    })
    .command("start", async (ctx) => {
        ctx.user.name; // ✅ string — TypeScript knows!
        //   ^?
        await ctx.send(`Hello, ${ctx.user.name}!`);
    });
```

### Scoped derive()

Run a derive only for specific update types to keep context lean:

```ts twoslash
import { Bot } from "gramio";
// ---cut---
const bot = new Bot(process.env.BOT_TOKEN as string)
    // Only runs when the update is a message
    .derive("message", (ctx) => ({
        wordCount: (ctx.text ?? "").split(" ").length,
    }))
    .on("message", (ctx) => {
        ctx.wordCount; // ✅ available here
        //  ^?
    });
```

Use `.is()` for type narrowing in a global handler:

```ts
const bot = new Bot(process.env.BOT_TOKEN as string)
    .derive("message", () => ({ isMessage: true as const }))
    .use((ctx) => {
        if (ctx.is("message")) {
            ctx.isMessage; // ✅ narrowed
        }
    });
```

## Static Values: decorate()

When you have values that don't change per request — a database connection, a config object, a service client — use `decorate()`. The object is assigned **once** at startup, not re-created on every update:

```ts twoslash
import { Bot } from "gramio";
// ---cut---
const db = { getUser: (id: number) => Promise.resolve({ name: "Alice" }) };
const config = { maxRetries: 3, environment: "production" as const };

const bot = new Bot(process.env.BOT_TOKEN as string)
    .decorate({ db, config })
    .command("start", async (ctx) => {
        const user = await ctx.db.getUser(ctx.from!.id);
        //                  ^?
        ctx.send(`Hello! (env: ${ctx.config.environment})`);
    });
```

| | `derive()` | `decorate()` |
|---|---|---|
| Runs | Per update | Once at startup |
| Use for | Fetched/computed values | DB connections, clients, config |
| Overhead | Function call per update | Zero — same reference every time |

## Routing: on()

`.on()` registers a handler for a specific update type. The chain **continues** regardless of whether the type matched — it's not a stopper, it's a type-specific handler:

```ts
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    // Only runs for text messages
    .on("message", (ctx) => ctx.send("Got a message!"))
    // Only runs for inline button presses
    .on("callback_query", (ctx) => ctx.answerCallbackQuery("Clicked!"));
    // Both are registered — each only fires for its own update type
```

## Build-Time Conditionals: when()

::: info Composer-level API
`when()` is available on `Composer` from `@gramio/composer`. Create your pipeline as a `Composer`, then pass it to `bot.extend()`.
:::

Register middleware conditionally at **startup** (not per-request) using `when()`. The middleware is either registered or not — there's no runtime overhead:

```ts
import { Bot } from "gramio";
import { Composer } from "@gramio/composer";

const pipeline = new Composer()
    .when(
        process.env.NODE_ENV !== "production",
        (c) => c.use(async (ctx, next) => {
            const start = Date.now();
            await next();
            console.log(`[${ctx.updateType}] ${Date.now() - start}ms`);
        })
    )
    .derive(() => ({ timestamp: Date.now() }));

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(pipeline)
    .command("start", (ctx) => ctx.send("Hello!"));
```

Properties added inside a `when()` block are typed as **`Partial`** (optional) — TypeScript correctly reflects that the middleware might not be registered.

## Composing & Reusing Middleware

The real power comes when you extract common middleware into a **`Composer`** and reuse it across your bot:

```ts
import { Bot } from "gramio";
import { Composer } from "@gramio/composer";

// ── shared middleware ─────────────────────────────────────────────────
const db = {
    getUser: (id: number) =>
        Promise.resolve({ id, name: "Alice", premium: true }),
};

const userMiddleware = new Composer()
    .derive(async () => ({
        // In real code: user: await db.getUser(ctx.from!.id)
        user: await db.getUser(0),
    }));

// ── bot ───────────────────────────────────────────────────────────────
const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(userMiddleware)       // user is now available everywhere below
    .command("start", (ctx) => {
        ctx.user.name;            // ✅ typed — came from userMiddleware.derive()
        ctx.send(`Hello, ${ctx.user.name}!`);
    })
    .command("profile", (ctx) => {
        ctx.send(`Premium: ${ctx.user.premium}`);
    });
```

`Composer` from `@gramio/composer` is the building block for reusable middleware. Think of it as a named, extractable pipeline segment.

### Middleware order matters

Middleware runs in **registration order**. A `Composer` injects its middleware at the point where you call `.extend()`:

```ts
import { Bot } from "gramio";
import { Composer } from "@gramio/composer";

const logger = new Composer().use(async (ctx, next) => {
    console.log("before:", ctx.updateType);
    await next();
    console.log("after");
});

const bot = new Bot(process.env.BOT_TOKEN as string)
    .use(async (_, next) => { console.log("1"); await next() })  // 1st
    .extend(logger)                                               // 2nd (logger's middleware)
    .use(async (_, next) => { console.log("3"); await next() })  // 3rd
    .command("start", () => console.log("4"));                   // 4th
```

## Using Context Types in Handler Functions

Handlers defined inline always have correct types inferred. But when you extract a handler to a separate function, you need to annotate the parameter. Build the composer first and derive its type:

```ts
import { Bot } from "gramio";
import { Composer } from "@gramio/composer";

const userMiddleware = new Composer().derive(() => ({
    user: { name: "Alice", premium: true as boolean },
}));

// Derive the context type from the composer
type WithUser = typeof userMiddleware extends Composer<infer C, any> ? C : never;

// Use it in a standalone handler function
async function greetHandler(ctx: WithUser) {
    await ctx.send(`Hello, ${ctx.user.name}!`);
}

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(userMiddleware)
    .command("greet", greetHandler);
```

::: tip Prefer inline handlers for small functions
For simple handlers, keeping them inline in the chain is the most ergonomic — types are inferred automatically. Extract to standalone functions when the logic is complex enough to deserve its own test or file.
:::

## Practical Patterns

### Reusable user middleware

```ts
import { Bot } from "gramio";
import { Composer } from "@gramio/composer";

const db = {
    getUser: (id: number) =>
        Promise.resolve({ id, name: "Alice", role: "admin" as "admin" | "user" }),
};

// Fetch user — reusable on any event type
const withUser = new Composer()
    .derive(async (ctx) => ({
        db,
        user: await db.getUser(ctx.from?.id ?? 0),
    }));

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(withUser)
    .command("profile", (ctx) => ctx.send(`Hello, ${ctx.user.name}!`))
    .command("role",    (ctx) => ctx.send(`Role: ${ctx.user.role}`));
```

### Splitting into files

```ts
// middleware/user.ts
import { Composer } from "@gramio/composer";
export const withUser = new Composer()
    .derive(async (ctx) => ({ user: await db.getUser(ctx.from?.id ?? 0) }));

// bot.ts
import { withUser } from "./middleware/user";
const bot = new Bot(TOKEN)
    .extend(withUser)
    .command("start", (ctx) => { /* ctx.user available */ });
```

### Feature flag middleware

```ts
import { Bot } from "gramio";
import { Composer } from "@gramio/composer";

const FEATURES = {
    betaAnalytics: process.env.FEATURE_ANALYTICS === "true",
    debugMode:     process.env.NODE_ENV !== "production",
};

// Build the conditional pipeline with Composer
const featurePipeline = new Composer()
    .when(FEATURES.debugMode, (c) => c.use(async (ctx, next) => {
        const start = Date.now();
        await next();
        console.log(`[${ctx.updateType}] ${Date.now() - start}ms`);
    }));

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(featurePipeline)
    .command("start", (ctx) => ctx.send("Hello!"));
```

## Summary

| Method | When to use |
|--------|-------------|
| `use(fn)` | Raw middleware — needs `next()` call, wraps the whole chain |
| `derive(fn)` | Add computed values to `ctx` per update |
| `derive(type, fn)` | Same, but only for specific update types |
| `decorate(obj)` | Add static values (DB clients, config) once at startup |
| `on(type, fn)` | Handle specific update types (chain always continues) |
| `when(cond, fn)` | Build-time conditional registration (Composer-level) |
| `extend(composer)` | Merge a `Composer` into the pipeline at this position |

For the underlying engine (including `guard()`, `branch()`, `inspect()`, `trace()`), see [@gramio/composer](./composer.md).
