---
name: scenes
description: Multi-step conversation flows with @gramio/scenes — steps, state management, params, ask with validation, and navigation.
---

# Scenes Plugin

Package: `@gramio/scenes`

## Define a Scene

```typescript
import { Scene, scenesDerives } from "@gramio/scenes";

const registration = new Scene("registration")
    .params<{ referral?: string }>()  // typed entry params
    .step("message", (context) => {
        if (context.scene.step.firstTime) {
            return context.send("What is your name?");
        }
        if (!context.text) return context.send("Please send text.");
        context.scene.update({ name: context.text });
        return context.scene.step.next();
    })
    .step("message", (context) => {
        if (context.scene.step.firstTime) {
            return context.send(`Hi ${context.scene.state.name}! Age?`);
        }
        const age = Number(context.text);
        if (Number.isNaN(age)) return context.send("Enter a number.");
        context.scene.update({ age });
        return context.scene.step.next();
    })
    .step("message", async (context) => {
        if (context.scene.step.firstTime) {
            return context.send(`Confirm: ${JSON.stringify(context.scene.state)} (yes/no)`);
        }
        if (context.text === "yes") {
            await context.send("Done!");
            return context.scene.exit();
        }
        return context.scene.reenter(); // restart
    });
```

## Register and Enter

```typescript
import { scenes } from "@gramio/scenes";
import { session } from "@gramio/session";

bot.extend(session({ key: "session", initial: () => ({}) }))
   .extend(scenes([registration]))
   .command("register", (context) =>
       context.scene.enter(registration, { referral: context.args })
   )
   .command("cancel", (context) => context.scene.exit());
```

## Scene Context API

| Property/Method | Description |
|----------------|-------------|
| `scene.onEnter(handler)` | Register handler that runs once on scene entry |
| `context.scene.state` | Accumulated data from `.update()` calls |
| `context.scene.params` | Entry params from `.enter()` |
| `context.scene.update(data)` | Merge data into state |
| `context.scene.enter(scene, params?)` | Enter a scene |
| `context.scene.exit()` | Leave current scene |
| `context.scene.reenter()` | Restart from step 0 |
| `context.scene.go(stepId)` | Jump to specific step |

## Step Navigation

| Property/Method | Description |
|----------------|-------------|
| `context.scene.step.firstTime` | `true` on first visit to this step |
| `context.scene.step.next()` | Advance to next step |
| `context.scene.step.previous()` | Go to previous step |
| `context.scene.step.go(n)` | Jump to step index |
| `context.scene.step.id` | Current step index |
| `context.scene.step.previousId` | Previous step index |

## Step Semantics (Important)

`step.go(N)` / `step.next()` / `step.previous()` **do** run the scene's middleware chain immediately after advancing the index — but each `.step(updateName, handler)` adds an internal guard `if (context.is(updateName))`. That means:

- `step.next()` from a **`callback_query`** context into a step declared as `.step("message", …)` → the next step's handler **will not fire** (guard fails), because the current update is not a message. It will fire on the *next* incoming message.
- `step.next()` from a **`message`** context into a `.step("message", …)` step → fires immediately with `firstTime: true`.
- `step.next()` into an update-type-agnostic `.step(handler)` (no `updateName`) → fires immediately regardless of current update type.

**Practical rules:**

1. If a step transition happens from a callback and the next step waits for a message, **send the prompt in the current handler *before* calling `step.next()`** — the user sees the prompt immediately and the next incoming message is handled by the new step with `firstTime: false`:

   ```typescript
   .step("callback_query", async (ctx) => {
       if (ctx.data === "begin") {
           await ctx.send("What's your name?");
           return ctx.scene.step.next(); // move index; next message lands in step N+1
       }
   })
   .step("message", (ctx) => {
       // firstTime will be false here because the prompt was already sent above
       ctx.scene.update({ name: ctx.text });
       return ctx.scene.step.next();
   })
   ```

2. If a step must handle **both** callbacks and messages (e.g. "choose from buttons or type manually"), declare it with an array: `.step(["message", "callback_query"], handler)`. That is also what `.ask()` does internally.

3. If you want to **render UI the first time a step is visited** (classic wizard pattern), check `ctx.scene.step.firstTime` at the top of the handler and `return ctx.send(...)` — do not combine with `step.next()` inside the same branch.

4. If a step needs arbitrary logic without input, use the update-type-agnostic overload `.step((ctx, next) => …)`.

## Global Scene Exit (nav buttons / /cancel)

A common pitfall: a user enters a wizard scene, then presses a top-level nav button (e.g. "◀ back"). Because `passthrough: true` is the default, the scene lets updates fall through to outer handlers — but the scene itself stays active in storage. You need to explicitly exit it from your global handler. Register `scenesDerives(list, { withCurrentScene: true, storage })` **before** `scenes(list, { storage })` (sharing the same storage), which exposes `ctx.scene.exit()` everywhere:

```typescript
import { scenes, scenesDerives } from "@gramio/scenes";
import { inMemoryStorage } from "@gramio/storage";

const storage = inMemoryStorage();
const list = [orderScene];

bot
    .extend(scenesDerives(list, { withCurrentScene: true, storage }))
    .extend(scenes(list, { storage }))
    .callbackQuery(nav, async (ctx) => {
        if (ctx.scene.current) await ctx.scene.exit(); // drop user out of any active scene first
        return renderMenu(ctx);
    });
```

Key rule: **the two plugins must share the same `storage` instance** — otherwise `scene.exit()` from `scenesDerives` writes to a different store than where `scenes` reads, and the user stays stuck.

## Ask with Validation (Standard Schema / Zod)

```typescript
import { z } from "zod";

const scene = new Scene("feedback")
    .ask("age", z.coerce.number().min(1).max(150), "How old are you?")
    .step("message", (context) => {
        // context.scene.state.age is typed as number
        return context.send(`You are ${context.scene.state.age}`);
    });
```

### onInvalidInput option (custom error handling)

```typescript
const scene = new Scene("registration")
    .ask(
        "age",
        z.coerce.number().min(18, "Must be 18+"),
        "How old are you?",
        {
            onInvalidInput: async (context, error) => {
                await context.send(`❌ ${error.message}\nPlease try again.`);
            }
        }
    );
```

## Scene .onEnter() — Run Logic on Scene Entry

```typescript
const scene = new Scene("welcome")
    .onEnter((context) => {
        return context.send("You've entered the scene!");
    })
    .step("message", handler);
```

The handler is async-compatible and awaited before proceeding to the first step.

## Scene .on() — Register Handler for All Steps

```typescript
const scene = new Scene("example")
    .on("callback_query", (context) => {
        // Handles callback queries during ANY step of this scene
    })
    .step("message", handler1)
    .step("message", handler2);
```

## scene.extend() — Sharing Plugin Context

Use `scene.extend(plugin)` to bring a plugin's derived types and middleware into a scene's handler chain. Plugin types are available in all steps and `onEnter`:

```typescript
const withUser = new Plugin("withUser")
    .derive(async (ctx) => {
        const user = await db.users.findById(ctx.from!.id);
        return { user };
    });

const profileScene = new Scene("profile")
    .extend(withUser)        // ctx.user is typed in all steps
    .onEnter(async (ctx) => {
        // ctx.user available here too
        return ctx.send(`Hello ${ctx.user.name}!`);
    })
    .step("message", async (ctx) => {
        ctx.user.name; // ✅ typed
        return ctx.scene.exit();
    });
```

`scene.extend()` also accepts `EventComposer` instances (not just `Plugin`):

```typescript
const withArgs = someComposer.derive(["message"], (ctx) => ({
    args: ctx.text?.split(" ").slice(1) ?? [],
}));

const scene = new Scene("search")
    .extend(withArgs)  // EventComposer accepted
    .step("message", (ctx) => {
        ctx.args; // ✅ typed
    });
```

> **Deduplication:** If the plugin is already extended at the bot level, the scene engine skips re-running it inside the scene — no double execution.

> **Sharing a bot-level composer with scenes (i18n, auth, tracing):** for infrastructure used by *both* bot-level handlers and scene steps, don't duplicate the derive inside the scene. Reach for a named `.as("scoped")` composer extended on the bot and declared on each scene via `Scene.extend(composer)` — dedup keeps the derive single-run, types flow into every step. See [scene-composer-inheritance](../references/scene-composer-inheritance.md) for the canonical pattern and the file-split layout that avoids circular imports.

## scenesDerives

Get scene data before scenes plugin processes:

```typescript
bot.extend(scenesDerives()) // must use same storage + scenes list
   .extend(scenes([myScene]));
```

## With Redis Storage

```typescript
import { redisStorage } from "@gramio/storage-redis";

bot.extend(scenes([myScene], { storage: redisStorage(redis) }));
```
