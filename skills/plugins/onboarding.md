---
name: "@gramio/onboarding"
description: "Declarative user-onboarding tutorials for GramIO. Multi-flow concurrency, scope-aware rendering, refusal ladder, persistent storage. Use for one-time tutorials/feature intros — NOT for forms or wizards (use @gramio/scenes for those)."
---

# @gramio/onboarding

Walk a user through your bot's features one step at a time. Decorates a working bot — does NOT own the interaction the way scenes do. Status: `0.1.0` alpha.

## When to use this vs scenes

- **Onboarding** — one-time tutorial / feature intro, multiple parallel walkthroughs.
- **Scenes** — forms with validation, wizards with branching, anything that owns the interaction.

## Setup

```ts
import { Bot } from "gramio";
import { createOnboarding } from "@gramio/onboarding";

const welcome = createOnboarding({ id: "welcome" })
    .step("hi",    { text: "Hi! I'll show you around.", buttons: ["next", "exit"] })
    .step("links", {
        text: "Send me any link — I'll download it.",
        buttons: ["next", "dismiss"],
        advanceOn: (ctx) => ctx.is("message") && /https?:\/\//.test(ctx.text ?? ""),
    })
    .step("done",  { text: "All set!" })
    .onComplete((ctx) => ctx.send("Welcome aboard! /help is always available."))
    .build();

const bot = new Bot(process.env.BOT_TOKEN!).extend(welcome);

bot.command("start", (ctx) => {
    ctx.onboarding.welcome.start();
    return ctx.send("Let's start!");
});
```

## Three ways to advance a step

| Trigger | Setup |
|---|---|
| Button | `buttons: ["next"]` in step config |
| Predicate | `advanceOn: (ctx) => boolean` — fires on `message` while flow is active |
| Programmatic | `ctx.onboarding.<flow>.next({ from: "<currentStepId>" })` from any handler |

**Recommended pattern** for `advanceOn` + business handler — call `next({ from })` **without `await`** at the end of the handler:

```ts
bot.on("message", async (ctx) => {
    if (!/https?:\/\//.test(ctx.text ?? "")) return;
    await ctx.send(`Downloading ${ctx.text}…`);
    ctx.onboarding.welcome.next({ from: "links" }); // fire-and-forget
});
```

The `from` guard makes the call idempotent against a racing button click.

## Refusal ladder

```
next → skip → exit → dismiss → disableAll
                                 (user-level, all flows)
```

- `skip` — step-level (move on, mark skipped)
- `exit` — flow-level (always available)
- `dismiss` — persistent (future `start()` returns `"dismissed"`)
- `ctx.onboarding.disableAll()` — opts user out of every flow until `enableAll()`
- `ctx.onboarding.exitAll()` — non-persistent nuke

## Multi-flow concurrency

```ts
createOnboarding({ id: "welcome", concurrency: "queue" })   // default
createOnboarding({ id: "premium", concurrency: "preempt" }) // pauses active onto LIFO stack
createOnboarding({ id: "tips",    concurrency: "parallel" }) // no coordination
```

`StartResult` codes: `"started"`, `"resumed"`, `"already-active"`, `"already-completed"`, `"dismissed"`, `"opted-out"`, `"queued"`, `"preempted"`.

## Scope-aware rendering

```ts
.step("invite", { text: "...", renderIn: "dm" })       // string preset
.step("group",  { text: "...", renderIn: "group" })
.step("custom", { text: "...", renderIn: (ctx) => ctx.chat?.type === "supergroup" })
```

If the scope doesn't match, the step is deferred and re-renders on the next eligible update.

## Storage

Default in-memory (dev only). For production, pass any `@gramio/storage` adapter:

```ts
import { redisStorage } from "@gramio/storage-redis";
import { Redis } from "ioredis";

createOnboarding({
    id: "welcome",
    storage: redisStorage(new Redis()),
}).step(/* ... */).build();
```

Adapter authors verify against the contract:

```ts
import { getStorageContractCases } from "@gramio/onboarding";
for (const { name, run } of getStorageContractCases(() => myStorage())) {
    test(`storage: ${name}`, () => run());
}
```

## `@gramio/views` integration (lazy globals)

Pair with `@gramio/views` 0.2+ — `withOnboardingGlobals()` produces a thunk consumed by `buildRender`'s lazy-globals support, so views always see the live onboarding tokens for the current step:

```ts
import { initViewsBuilder } from "@gramio/views";
import { withOnboardingGlobals, type OnboardingViewCtx } from "@gramio/onboarding";

interface Globals {
    user: { id: number; name: string };
    onboarding: OnboardingViewCtx | undefined;
}
const defineView = initViewsBuilder<Globals>();

bot.derive(["message", "callback_query"], (ctx) => ({
    render: defineView.buildRender(
        ctx,
        withOnboardingGlobals({ user: { id: ctx.from!.id, name: ctx.from!.firstName } }),
    ),
}));
```

In a step's `view`, `globals.onboarding` is either a live token bundle (`flowId`, `stepId`, `data`, callback strings `next` / `skip` / `exit` / `dismiss` / `exitAll` / `goto(id)`) or `undefined` outside an onboarding-driven render.

## Typing `ctx.onboarding` (just works since v0.2.0)

`bot.extend(welcome)` widens the bot's context with `onboarding: OnboardingNamespace & { <flowId>: FlowControl<Steps> }` automatically — no module augmentation, no cast. Flow id is captured from `createOnboarding({ id: "welcome" })` (literal type), Steps from the `.step(...)` chain:

```ts
import { Bot } from "gramio";
import { createOnboarding } from "@gramio/onboarding";

const welcome = createOnboarding({ id: "welcome" })
    .step("hi", { text: "hi" })
    .step("done", { text: "done!" })
    .build();

const bot = new Bot(token).extend(welcome);

bot.command("start", (ctx) => {
    ctx.onboarding.welcome.start();              // ✅ typed
    ctx.onboarding.welcome.goto("hi");           // ✅ Steps narrowed
    // ctx.onboarding.welcome.goto("xyz");        // ❌ TS error: not in Steps
    return ctx.send("ok");
});
```

Multiple flows compose via gramio's standard derive intersection — extending two onboarding plugins gives `ctx.onboarding.welcome` and `ctx.onboarding.premium` simultaneously, each with its own typed Steps union.

> [!NOTE]
> If you're stuck on `@gramio/onboarding@0.1.0`, types are lost at `OnboardingBuilder.build(): Plugin` — bump to `^0.2.0` or declare module augmentation manually:
>
> ```ts
> declare module "@gramio/onboarding" {
>     interface OnboardingNamespace {
>         welcome: FlowControl<"hi" | "done">;
>     }
> }
> ```

## Rules

- **Decorator, not owner.** A bot must already work without the plugin. Onboarding is opt-in, fire-and-forget.
- **`ctx.onboarding.*` never throws.** Errors forward to `bot.errorHandler` with `{ source: "onboarding", flowId, op }`. Don't wrap in `try/catch`.
- **Use `from: stepId` for `next()`** — without it, a racing button click can advance twice.
- **Don't refactor multi-step OAuth/data-collection into onboarding** — those are forms; use scenes.
- **Storage is mandatory in production.** The default in-memory storage loses state on restart.
- **Use `^0.2.0` or newer** to get propagated derive types through `bot.extend()`.
