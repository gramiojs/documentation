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
import { sessionPlugin } from "@gramio/session";

bot.extend(sessionPlugin({ key: "session", initial: () => ({}) }))
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
