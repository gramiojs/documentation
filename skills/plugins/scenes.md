---
name: scenes
description: Multi-step conversation flows with @gramio/scenes — steps, state management, params, ask with validation, and navigation.
---

# Scenes Plugin

Package: `@gramio/scenes`

> **Two step forms, both supported (v0.7+).** Since v0.7 `Scene` extends `EventComposer`, so the whole bot-level DSL (`.on`/`.derive`/`.decorate`/`.guard`/`.command`/`.callbackQuery`/`.hears`) is available directly on a scene. Steps can be declared two equally-valid ways — **builder steps** (`.step("name", c => c.enter().on())`, recommended for new code) and **event-filter steps** (`.step("message", handler)`). Mix them freely in one scene. Builder steps are documented first; event-filter steps further down.

## Builder steps (v0.7+, recommended)

Pass a builder callback to `.step(name, c => …)`. The per-step composer `c` exposes lifecycle hooks plus the full event surface:

| Method | Description |
|--------|-------------|
| `c.enter(handler)` | Runs once on first entry to the step |
| `c.message(text \| fn)` | Sugar for `c.enter(ctx => ctx.send(text))` |
| `c.exit(handler)` | Runs when leaving the step |
| `c.fallback(handler)` | Catch-all for updates no other step handler claimed |
| `c.on` / `c.command` / `c.callbackQuery` / `c.hears` | Event handlers, same as the bot-level DSL |
| `c.events([...])` | Narrow the step's update whitelist (default `message`, `callback_query`) |

```typescript
import { Scene, scenes } from "@gramio/scenes";

const checkout = new Scene("checkout")
    .step("ask-name", (c) =>
        c
            .message("What's your name?")           // sent once on entry
            .on("message", (ctx) => ctx.scene.update({ name: ctx.text })),
    )
    .step("confirm", (c) =>
        c
            .enter((ctx) => ctx.send(`${ctx.scene.state.name}, confirm? (yes/no)`))
            .hears("yes", (ctx) => ctx.scene.exit())
            .fallback((ctx) => ctx.send("Please answer yes or no")),
    );

bot.extend(scenes([checkout])).command("checkout", (ctx) => ctx.scene.enter(checkout));
```

**State auto-inference:** the shape passed to `ctx.scene.update({...})` inside a builder step is threaded into `ctx.scene.state` for every later step — **no `.state<T>()` needed**:

```typescript
new Scene("signup")
    .step("ask", (c) => c.on("message", (ctx) => ctx.scene.update({ name: ctx.text! })))
    .step("greet", (c) => c.enter((ctx) => {
        ctx.scene.state.name; // ✅ inferred as string
    }));
```

**Reusable step modules — `scene.extend(otherScene)`:** a `Scene` created with **no name** is a step module — a reusable block of steps you `.extend()` into named scenes. Modules can't be entered directly (`scenes([...])` rejects them). Named-step collisions throw; numeric steps are renumbered.

```typescript
const confirm = new Scene().step("confirm", (c) =>      // unnamed = module
    c
        .enter((ctx) => ctx.send("Are you sure?"))
        .callbackQuery("yes", (ctx) => ctx.scene.step.next())
        .callbackQuery("no", (ctx) => ctx.scene.exit()),
);

const order = new Scene("order")
    .step("review", (c) => c.enter((ctx) => ctx.send("Review your order")))
    .extend(confirm)                                    // pulls in the "confirm" step
    .step("done", (c) => c.enter((ctx) => ctx.send("Order placed!")));
```

## Define a Scene (event-filter form)

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
| `context.scene.reenter(params?)` | Restart from step 0. Accepts new params (v0.5+) when scene was declared with `.params<T>()` |
| `context.scene.go(stepId)` | Jump to specific step |
| `context.scene.enterSub(sub, params?)` | Push current scene onto parent stack, run sub-scene to completion, then auto-resume on the next step (v0.5+) |
| `context.scene.exitSub(returnData?)` | Inside a sub-scene: return to the parent scene's next step. Typed via `.exitData<T>()` on the sub-scene |

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

`.ask(field, schema, prompt)` is the **persistent** equivalent of `@gramio/prompt`'s `context.prompt(...)`. It sends the prompt, parses the user's reply through the schema, retries on validation error, and stores the parsed value on `context.scene.state[field]` — all while persisting step index and collected state to the configured storage, so the flow survives process restarts. Use this, not `@gramio/prompt`, for any multi-step / OAuth-connect / onboarding flow (see [Critical Concept #14 in SKILL.md](../SKILL.md)).

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

> **v0.7:** scene-level `.derive()` / `.decorate()` results are now visible **inside** `onEnter` — they apply on the entry update before `onEnter` fires. So `.derive(async ctx => ({ user: await loadUser(ctx) })).onEnter(ctx => track(ctx.user))` works in one chain.

## Scene .onExit() — Run Logic on Scene Exit (v0.7+)

Symmetric to `onEnter`. Fires when the user leaves the scene — via `ctx.scene.exit()`, `ctx.scene.exitSub()`, or `ctx.scene.reenter()` — **before** storage is torn down. Use for cleanup, analytics, or a "thanks for completing" message.

```typescript
const scene = new Scene("survey")
    .onEnter((ctx) => ctx.send("Let's start the survey!"))
    .step("q1", (c) => c.message("Question 1?").on("message", handler))
    .onExit((ctx) => ctx.send("Thanks for completing the survey!"));
```

When a scene merged via `scene.extend(otherScene)` defines `onExit`, the host scene's hook wins; the extended scene's is copied only when the host has none.

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

## Sub-scenes — `enterSub` / `exitSub` (v0.5+)

Scenes nest. `ctx.scene.enterSub(sub, params?)` pushes the current scene onto a parent stack, runs the sub-scene, then auto-resumes on the parent's next step. The stack is persisted, so a process restart resumes correctly. Use `.exitData<T>()` on the sub-scene to type the data it returns:

```typescript
const pickAddress = new Scene("pick-address")
    .exitData<{ address: string }>()
    .step("ask", (ctx) => ctx.send("Send your address"))
    .step("save", (ctx) => ctx.scene.exitSub({ address: ctx.text! }));

const checkout = new Scene("checkout")
    .step("address", async (ctx) => {
        await ctx.scene.enterSub(pickAddress);  // pauses checkout
    })
    .step("confirm", (ctx) => {
        // pickAddress resolved — exitData merged into parent state
        return ctx.send("Confirm order?");
    });
```

## Passthrough — global commands during a scene (v0.6 default)

`scenes()` accepts `passthrough: boolean` (default `true` since v0.6): updates that arrive while a user is in a scene but don't match the current step **fall through to outer handlers**. Global `bot.command("cancel")` / `bot.command("help")` finally fire mid-scene without the scene swallowing them; `firstTime` is preserved so the user doesn't lose their place.

```typescript
const bot = new Bot(token)
    .extend(scenes([signupScene]))                       // passthrough: true
    .command("cancel", (ctx) => ctx.scene?.exit())        // fires mid-scene
    .command("help", (ctx) => ctx.send("/cancel to abort"));
```

Set `passthrough: false` to restore the legacy greedy behavior (scene consumes every update for the active user). Do this only if you want hard isolation from outer handlers.

> [!WARNING]
> Passthrough also means top-level `callbackQuery(nav, …)` sees button clicks during a scene. Combine with [Global Scene Exit](#global-scene-exit-nav-buttons--cancel) above so users don't end up stuck after a nav click.
