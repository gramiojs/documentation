---
title: "@gramio/composer — Type-Safe Middleware Composition"
head:
    - - meta
      - name: "description"
        content: "Deep dive into @gramio/composer: the middleware composition engine powering GramIO. Learn decorate(), when(), inspect(), trace(), and how to create custom framework methods."
    - - meta
      - name: "keywords"
        content: "gramio, composer, middleware, decorate, when, inspect, trace, observability, plugin development, TypeScript"
---

# @gramio/composer

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/composer?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/composer)
[![JSR](https://jsr.io/badges/@gramio/composer)](https://jsr.io/@gramio/composer)

</div>

`@gramio/composer` is the general-purpose, type-safe middleware composition library that powers GramIO's internals. If you're writing a plugin, building a framework on top of GramIO, or just want to understand how context enrichment works — this is the place to start.

## Installation

::: code-group

```bash [npm]
npm install @gramio/composer
```

```bash [yarn]
yarn add @gramio/composer
```

```bash [pnpm]
pnpm add @gramio/composer
```

```bash [bun]
bun add @gramio/composer
```

:::

## Core Concepts

A `Composer` is a chainable middleware pipeline. Each method registers a new middleware step and returns the (updated) composer for chaining:

```ts
import { Composer } from "@gramio/composer";

const app = new Composer<{ request: Request }>()
    .use(logger)
    .derive(fetchUser)
    .guard(isAuthenticated)
    .use(handler);
```

### use()

Register raw middleware. The handler receives `(context, next)` and must call `next()` to continue the chain:

```ts
app.use(async (ctx, next) => {
    console.log("before");
    await next();
    console.log("after");
});
```

### derive()

Enriches context with computed values. The returned object is merged into the context for all downstream middleware:

```ts
app.derive(async (ctx) => {
    const user = await db.findUser(ctx.userId);
    return { user };
});
// ctx.user is now available downstream
```

### decorate()

Like `derive()`, but for static values that don't need per-request computation. Assigns the object once at registration time and reuses the same reference — zero function call overhead:

```ts
app.decorate({ db: myDatabase, config: appConfig });
// ctx.db and ctx.config available on every request, no overhead
```

Supports scoping with `{ as: "scoped" }` or `{ as: "global" }` to propagate through `extend()`.

### guard()

Only continues the chain if the predicate returns true:

```ts
app.guard((ctx) => ctx.user.isAdmin);
// Subsequent middleware only runs for admins
```

### when()

Build-time conditional middleware registration. The condition is evaluated once at startup, not per-request. Properties added inside the block are typed as `Partial` (optional):

```ts
const app = new Composer()
    .when(process.env.NODE_ENV !== "production", (c) =>
        c.use(verboseLogger)
    )
    .when(config.features.analytics, (c) =>
        c.derive(() => ({ analytics: createAnalyticsClient() }))
    );
```

Differences from `branch()`:
- `when()` — condition evaluated **once at startup** (build-time)
- `branch()` — condition evaluated **on every request** (runtime)

Nested `when()` blocks work. Dedup keys, error handlers, and error definitions propagate from the conditional block.

## Observability

### inspect()

Returns a read-only snapshot of all registered middleware with metadata:

```ts
const app = new Composer()
    .derive(function getUser() { return { user: "alice" }; })
    .guard(function isAdmin() { return true; })
    .use(async function handleRequest(_, next) { return next(); });

app.inspect();
// [
//   { index: 0, type: "derive", name: "getUser", scope: "local" },
//   { index: 1, type: "guard", name: "isAdmin", scope: "local" },
//   { index: 2, type: "use", name: "handleRequest", scope: "local" },
// ]
```

When a named plugin is extended, the `plugin` field shows the source:

```ts
const auth = new Composer({ name: "auth" })
    .derive(function getUser() { return { user: "alice" }; })
    .as("scoped");

new Composer().extend(auth).inspect();
// [{ index: 0, type: "derive", name: "getUser", scope: "local", plugin: "auth" }]
```

### trace()

Opt-in per-middleware instrumentation hook. Zero overhead when not used — middleware functions are passed through unwrapped when no tracer is set:

```ts
app.trace((entry, ctx) => {
    const span = tracer.startSpan(`${entry.type}:${entry.name ?? "anonymous"}`);
    span.setAttributes({
        "middleware.index": entry.index,
        "middleware.scope": entry.scope,
        ...(entry.plugin && { "middleware.plugin": entry.plugin }),
    });
    return (error) => {
        if (error) span.recordException(error as Error);
        span.end();
    };
});
```

The `TraceHandler` callback:
1. Is called before each middleware executes with `MiddlewareInfo` and context
2. May return a cleanup function `(error?: unknown) => void`
3. Cleanup is called after middleware completes (with no args on success, with the error on failure)
4. Errors still propagate to `onError` after cleanup

## Scope System

The scope system controls how middleware propagates when one composer extends another:

| Scope | Behavior |
|-------|---------|
| `"local"` (default) | Isolated inside an isolation wrapper — context does not leak to parent |
| `"scoped"` | Adds directly to parent as a local entry — visible to parent's downstream middleware |
| `"global"` | Adds to parent as global — continues propagating through further `extend()` calls |

Promote a whole composer to a scope with `.as()`:

```ts
const plugin = new Composer({ name: "auth" })
    .derive(function getUser() { return { user: "alice" }; })
    .as("scoped"); // everything in this composer is scoped

app.extend(plugin); // getUser is now visible in app's downstream
```

## Error Handling

```ts
class NotFoundError extends Error {}

const app = new Composer()
    .error("NotFound", NotFoundError)
    .onError(({ error, kind, context }) => {
        if (kind === "NotFound") {
            context.send("Resource not found");
            return "handled";
        }
    })
    .use(() => { throw new NotFoundError("Item missing"); });
```

Multiple `onError()` handlers are evaluated in order — the first to return a non-undefined value wins. Errors without a matching handler are logged via `console.error`.

## Plugin Development

For plugin authors, `@gramio/composer` is the foundation of GramIO's `Plugin` class. The concepts map directly:

```ts
import { Plugin } from "gramio";

// Plugin uses the same Composer API internally
const myPlugin = new Plugin("my-plugin")
    .decorate({ db: myDatabase })        // static enrichment
    .derive(async () => ({ user: ... })) // per-request enrichment
    .on("message", handler);            // event handler
```

For advanced plugin creation that needs custom shorthand methods or observability, work directly with `@gramio/composer`.

## createComposer() — Building Custom Frameworks

If you're building a framework on top of `@gramio/composer` and need custom shorthand methods (like GramIO's own `hears()`, `command()`, `reaction()`), use `createComposer()`:

```ts
import { createComposer, eventTypes } from "@gramio/composer";

const { Composer } = createComposer({
    discriminator: (ctx: BaseCtx) => ctx.updateType,
    types: eventTypes<{ message: MessageCtx; callback_query: CallbackCtx }>(),
    methods: {
        hears(trigger: RegExp | string, handler: (ctx: MessageCtx) => unknown) {
            return this.on("message", (ctx, next) => {
                const text = ctx.text;
                if (typeof trigger === "string" ? text === trigger : trigger.test(text ?? ""))
                    return handler(ctx);
                return next();
            });
        },
        command(cmd: string, handler: (ctx: MessageCtx) => unknown) {
            return this.on("message", (ctx, next) => {
                if (ctx.text?.startsWith(`/${cmd}`)) return handler(ctx);
                return next();
            });
        },
    },
});

// Custom methods survive through all chain operations:
const app = new Composer()
    .hears(/hello/, h1)  // custom method
    .on("message", h2)   // built-in — TMethods still preserved
    .hears(/bye/, h3);   // custom method still available
```

**`types` + `eventTypes()`**: TypeScript cannot partially infer type arguments. The `types` phantom field with `eventTypes()` helper lets you specify `TEventMap` without losing `TMethods` inference:

```ts
// Instead of explicit type parameters (can't infer TMethods):
createComposer<BaseCtx, { message: MessageCtx }>({ ... })

// Use the phantom types pattern:
createComposer({
    discriminator: (ctx: BaseCtx) => ctx.updateType,
    types: eventTypes<{ message: MessageCtx }>(), // inferred, not explicit
    methods: { /* TMethods inferred from here */ },
})
```

A runtime conflict check throws if a `methods` key collides with a built-in method name.
