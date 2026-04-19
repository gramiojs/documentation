---
name: middleware-routing
description: How GramIO resolves overlapping handlers across commands, callback queries, events, and plugins — order, `next()`, shared CallbackData conflicts, and the centralized-router pattern.
---

# Middleware Routing

GramIO's update flow is a classic Koa-style middleware chain: each update walks top-to-bottom through registered middleware, and **the first handler whose matcher accepts the update wins**. Subsequent handlers only run if the winner explicitly calls `next()`.

This page covers the rules that matter most when building non-trivial bots — especially when multiple plugins register handlers for overlapping updates.

## Registration Order Determines Priority

Handlers run in the order they were registered. With `bot.extend(plugin)`, the plugin's middleware is appended at that point.

```typescript
bot
    .callbackQuery("refresh", (ctx) => ctx.answer("A"))   // wins for "refresh"
    .callbackQuery("refresh", (ctx) => ctx.answer("B"));  // never runs

bot
    .extend(menuPlugin)   // registers .callbackQuery("refresh", …)
    .extend(adminPlugin); // registers .callbackQuery("refresh", …) — never runs
```

Rule of thumb: the **earliest registered handler that matches** fires, and everything after is silent unless the winner calls `next()`.

## `next()` — Explicit Chain Continuation

To allow later handlers to also run, call `await next()`:

```typescript
bot.use(async (ctx, next) => {
    console.log("before");
    await next();
    console.log("after");
});
```

Most trigger shortcuts (`.command`, `.callbackQuery`, `.hears`, `.on`) do **not** call `next()` automatically when they match — they treat a match as "this handler owns the update". If you want fan-out to multiple handlers, use a shared entry handler that dispatches, or build a centralized router (below).

## Overlapping `CallbackData` Across Plugins

The most common routing bug in multi-plugin bots: two plugins register handlers for the **same** `CallbackData` schema (or overlapping regex / string). Only the first-registered fires:

```typescript
// ❌ Silent conflict — adminRouter's "refresh" never fires
const menuRouter  = new Plugin("menu").callbackQuery(nav, (ctx)  => { /* A */ });
const adminRouter = new Plugin("admin").callbackQuery(nav, (ctx) => { /* B */ });

bot.extend(menuRouter).extend(adminRouter);
// All `nav` callbacks go to menuRouter; adminRouter's handler is dead code.
```

**Symptoms in the wild**: "nav button X works, nav button Y does nothing". No error, no warning — the second handler is simply never reached.

## Fix 1: Centralized Router (Recommended)

Keep **one** `.callbackQuery(nav, …)` registration and branch inside it using the packed payload:

```typescript
import { CallbackData } from "gramio";

const nav = new CallbackData("nav").enum("to", ["home", "history", "admin"]);

bot.callbackQuery(nav, async (ctx) => {
    switch (ctx.queryData.to) {
        case "home":    return renderHome(ctx);
        case "history": return renderHistory(ctx);
        case "admin":   return renderAdmin(ctx);
    }
});
```

This is the cleanest pattern for a nav bar that spans multiple feature plugins — each feature exposes a `render*(ctx)` function, and the router wires them up.

## Fix 2: Separate `CallbackData` Per Plugin

Give each plugin its own schema (= different hash prefix, no collision):

```typescript
// plugins/menu.ts
export const menuNav = new CallbackData("menu:nav").enum("to", ["home", "history"]);

// plugins/admin.ts
export const adminAction = new CallbackData("admin:act").enum("act", ["ban", "stats"]);
```

Now both can register their own handlers without conflict.

## Fix 3: Opt-in Fallthrough with `next()`

If you genuinely want a chain of handlers inspecting the same event, have earlier handlers call `next()` when they don't consume:

```typescript
menuRouter.callbackQuery(nav, async (ctx, next) => {
    if (ctx.queryData.to !== "home") return next(); // let others try
    return renderHome(ctx);
});
```

Use sparingly — it is easy to miss a `next()` and reintroduce the "silent conflict" bug.

## Scenes and the Outer Chain

`scenes([…])` registers as a single middleware on a handful of event types (`message`, `callback_query`, etc.). By default it uses `passthrough: true` — updates that arrive while a user is in a scene but don't match the scene's current step fall through to outer handlers. This is what lets a global `/cancel` command work even while a user is mid-wizard.

**Important**: passthrough also means a nav-button callback press during a scene will reach your bot-level `callbackQuery(nav, …)` handler. Combine that with [Global Scene Exit](../plugins/scenes.md#global-scene-exit-nav-buttons--cancel) to avoid leaving the user stuck in a scene after they navigate away.

## Detecting the Bug

If a handler "doesn't fire", check in this order:

1. Does the matcher actually match? (e.g. `CallbackData.filter(ctx.data!)` returns true?)
2. Is an earlier handler consuming the update without `next()`?
3. Is the user inside a scene that greedily owns the update (`passthrough: false`)?
4. Is the plugin registered via `bot.extend(...)` at all?

A one-liner debug middleware can prove #1/#2:

```typescript
bot.use(async (ctx, next) => {
    if (ctx.is("callback_query")) console.log("cb:", ctx.data);
    await next();
    // if you see "cb:" but never see the handler log, someone earlier consumed it
});
```

## Summary

- First match wins; add `next()` only if you want fallthrough.
- Shared `CallbackData` across plugins → collision → silent dead code. Prefer centralized routing or distinct schemas.
- `scenes` with default `passthrough: true` lets outer handlers see updates; exit active scenes in global nav to avoid stuck users.
- Debug with a top-level `bot.use` middleware before blaming the matcher.

<!--
Related: [callback-data](callback-data.md), [composer](composer.md), [scenes](../plugins/scenes.md)
-->
