---
title: Structuring Large Bots with Composer
head:
    - - meta
      - name: "description"
        content: "Learn how to split a growing GramIO bot into modules using Composer. Share context across files with derive(), type handlers correctly, and compose feature routers into a clean bot architecture."
    - - meta
      - name: "keywords"
        content: "GramIO Composer, modular bot architecture, split bot files, reusable middleware, derive context, TypeScript bot structure, feature modules, bot routing"
---

# Structuring Large Bots with Composer

When a bot grows beyond a single file, the chain in `bot.ts` becomes hard to read. GramIO's answer is `Composer` — the same building block `Bot` is built on. You can extract any part of the chain into a `Composer`, type it independently, and merge it back with `.extend()`.

::: tip Reference
This guide focuses on practical patterns. For the complete API surface — `when()`, `inspect()`, `trace()`, scope system — see the [Middleware & Context](/extend/middleware) reference.
:::

---

## The Problem

A bot with many features ends up looking like this:

```ts
const bot = new Bot(token)
    .derive(fetchUser)
    .derive(fetchChat)
    .command("start", ...)
    .command("help", ...)
    .command("ban", ...)
    .command("kick", ...)
    .command("stats", ...)
    .on("message", ...)
    .callbackQuery("confirm", ...)
    .callbackQuery("cancel", ...)
    // ... 50 more handlers
    .start();
```

`Composer` lets you split this into focused modules that each own their handlers and context enrichment.

---

## What is a Composer?

`Composer` is the class that powers `Bot` itself. Everything you can chain on a `Bot` — `.command()`, `.on()`, `.derive()`, `.guard()`, `.extend()` — works identically on a `Composer`.

The difference: a `Composer` isn't a bot. It has no token, no API connection. It's a pipeline segment you compose into a bot with `.extend()`.

```ts
import { Composer } from "@gramio/composer";

// A self-contained feature module
const adminRouter = new Composer()
    .guard((ctx) => ctx.from?.id === ADMIN_ID)
    .command("ban",   (ctx) => ctx.send("Banned!"))
    .command("stats", (ctx) => ctx.send("Stats..."));

// Merged into the bot at this point in the chain
const bot = new Bot(token)
    .extend(adminRouter)
    .start();
```

---

## Splitting into Files

The most common use: one file per feature.

```ts
// src/features/start.ts
import { Composer } from "@gramio/composer";

export const startRouter = new Composer()
    .command("start", (ctx) => ctx.send("Hello! 👋"))
    .command("help",  (ctx) => ctx.send("Commands: /start /help"));
```

```ts
// src/features/admin.ts
import { Composer } from "@gramio/composer";

const ADMIN_ID = Number(process.env.ADMIN_ID);

export const adminRouter = new Composer()
    .guard((ctx) => ctx.from?.id === ADMIN_ID, (ctx) => ctx.send("Admins only."))
    .command("broadcast", (ctx) => ctx.send("Broadcasting..."))
    .command("stats",     (ctx) => ctx.send("Stats..."));
```

```ts
// src/bot.ts
import { Bot } from "gramio";
import { startRouter } from "./features/start";
import { adminRouter } from "./features/admin";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(startRouter)
    .extend(adminRouter)
    .start();
```

Clean, readable, each feature isolated.

---

## Sharing Context Across Modules

Often multiple modules need the same data — a user record, config, a database connection. Extract it into shared middleware:

```ts
// src/middleware/user.ts
import { Composer } from "@gramio/composer";

export const withUser = new Composer()
    .derive(async (ctx) => ({
        user: await db.getUser(ctx.from?.id ?? 0),
    }))
    .as("scoped"); // writes ctx.user to the real ctx, not a local copy
```

Extend it in your feature module to get the type:

```ts
// src/features/profile.ts
import { Composer } from "@gramio/composer";
import { withUser } from "../middleware/user";

export const profileRouter = new Composer()
    .extend(withUser)  // ctx.user is now typed
    .command("profile", (ctx) =>
        ctx.send(`Name: ${ctx.user.name}`)
        //              ^? { name: string, ... }
    );
```

Then in `bot.ts`, extend `withUser` **before** the routers so the derive runs on the real context:

```ts
import { Bot } from "gramio";
import { withUser } from "./middleware/user";
import { profileRouter } from "./features/profile";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(withUser)      // ← first: ctx.user lands on the real ctx
    .extend(profileRouter) // ← withUser inside is deduplicated (skipped)
    .start();
```

::: info Why `.as("scoped")`?
By default, `.extend()` isolates the inner context so its derives don't leak out. `.as("scoped")` opts out of isolation — the derive writes directly to the parent context, so downstream code can read `ctx.user` from anywhere in the chain.

See [Middleware & Context → Scope System](/extend/middleware#production-architecture) for the full picture.
:::

---

## Typing Handlers in Separate Files

When you extract a handler to a standalone function, TypeScript needs a type annotation. Use `ContextOf` from `@gramio/composer`:

```ts
// src/middleware/user.ts
import { Composer, type ContextOf } from "@gramio/composer";

export const withUser = new Composer()
    .derive(() => ({
        user: { name: "Alice", role: "admin" as "admin" | "user" },
    }))
    .as("scoped");

export type WithUser = ContextOf<typeof withUser>;
```

```ts
// src/handlers/profile.ts
import type { WithUser } from "../middleware/user";

export async function handleProfile(ctx: WithUser) {
    await ctx.send(`Hello, ${ctx.user.name}! Role: ${ctx.user.role}`);
    //                        ^? string              ^? "admin" | "user"
}
```

```ts
// src/features/profile.ts
import { Composer } from "@gramio/composer";
import { withUser } from "../middleware/user";
import { handleProfile } from "../handlers/profile";

export const profileRouter = new Composer()
    .extend(withUser)
    .command("profile", handleProfile);
```

---

## Static Dependencies with decorate()

For things that don't change per request — database clients, config, service instances — use `decorate()` instead of `derive()`. It assigns the value once at startup:

```ts
// src/middleware/deps.ts
import { Composer } from "@gramio/composer";
import { db } from "../db";
import { config } from "../config";

export const withDeps = new Composer()
    .decorate({ db, config })
    .as("scoped");
```

```ts
// src/features/admin.ts
import { Composer } from "@gramio/composer";
import { withDeps } from "../middleware/deps";

export const adminRouter = new Composer()
    .extend(withDeps)
    .command("stats", async (ctx) => {
        const count = await ctx.db.countUsers();
        //                   ^? your DB type
        ctx.send(`Users: ${count} (env: ${ctx.config.environment})`);
    });
```

---

## Suggested File Structure

```
src/
  bot.ts                  ← assembles everything
  middleware/
    user.ts               ← withUser (derive + as scoped)
    deps.ts               ← withDeps (decorate + as scoped)
  features/
    start.ts              ← /start, /help
    profile.ts            ← /profile, /settings
    admin.ts              ← /ban, /stats (with guard)
    shop.ts               ← /buy, /balance
  handlers/               ← extracted handler functions (typed)
    profile.ts
    admin.ts
```

```ts
// src/bot.ts
import { Bot } from "gramio";
import { withDeps }      from "./middleware/deps";
import { withUser }      from "./middleware/user";
import { startRouter }   from "./features/start";
import { profileRouter } from "./features/profile";
import { adminRouter }   from "./features/admin";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(withDeps)       // db, config — available everywhere
    .extend(withUser)       // ctx.user — available everywhere
    .extend(startRouter)
    .extend(profileRouter)
    .extend(adminRouter)
    .onError(({ kind, error }) => console.error(kind, error))
    .start();
```

---

## Composer vs Plugin

`Plugin` does not expose the full `Composer` API — for example `when()`, `branch()`, `inspect()`, and `trace()` are not available on `Plugin`. For internal bot structure, always prefer `Composer`.

Use `Plugin` only when:
- You're publishing a reusable package for others to `bot.extend()`
- You need to hook into the **API request lifecycle** (`preRequest`, `onResponse`, `onResponseError`) — these hooks are only available on `Plugin`, not `Composer`

```ts
import { Plugin } from "gramio";

// ✅ Plugin — for distribution or API lifecycle hooks
export const rateLimitPlugin = new Plugin("rate-limit")
    .preRequest((ctx) => {
        console.log("→", ctx.method);
        return ctx;
    });

// ✅ Composer — for everything else inside your own bot
import { Composer } from "@gramio/composer";
const adminRouter = new Composer()
    .guard((ctx) => ctx.from?.id === ADMIN_ID)
    .command("ban", (ctx) => ctx.send("Banned!"));
```

---

## Summary

| What | How |
|------|-----|
| Split handlers into files | `new Composer()` per feature, `bot.extend(router)` |
| Share `ctx.user` across modules | `withUser.as("scoped")` + extend it first in `bot.ts` |
| Add DB / config to context | `decorate({ db, config }).as("scoped")` |
| Type a handler in a separate file | `ContextOf<typeof composer>` from `@gramio/composer` |
| Guard a whole module | `.guard(predicate)` at the top of the Composer chain |
| Internal module / router | `Composer` — full API, prefer for your own bot |
| Distributable package or API lifecycle hooks | `Plugin` — `preRequest` / `onResponse` only here |
