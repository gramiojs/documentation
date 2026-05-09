---
title: Onboarding plugin
head:
    - - meta
      - name: "description"
        content: "@gramio/onboarding — declarative user-onboarding tutorials for GramIO. Multi-flow concurrency, scope-aware rendering, refusal ladder, persistent storage, optional @gramio/views integration."
    - - meta
      - name: "keywords"
        content: "gramio, telegram bot, onboarding, tutorial, walkthrough, plugin, scenes alternative, user education, multi-flow"
---

# Onboarding

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/onboarding?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/onboarding)
[![JSR](https://jsr.io/badges/@gramio/onboarding)](https://jsr.io/@gramio/onboarding)

</div>

::: warning Status: alpha
`@gramio/onboarding` is published as `0.1.0` and the public API is stable but the surface is still maturing. File issues at [gramiojs/onboarding](https://github.com/gramiojs/onboarding/issues) if you hit edges.
:::

Declarative user tutorials for GramIO bots. Walk users through your bot's features one step at a time — advance on a "Next" button, on the user actually doing the thing the step describes (`advanceOn`), or programmatically from a real handler (`ctx.onboarding.<flow>.next({ from })`).

Onboarding flows compose independently of each other (`welcome`, `premium-upsell`, `new-feature`, …) with three concurrency modes (`queue`, `preempt`, `parallel`) and a four-step refusal ladder (`next → skip → exit → dismiss → disableAll`).

## Installation

::: pm-add @gramio/onboarding
:::

## Quick start

```ts twoslash
import { Bot } from "gramio";
import { createOnboarding } from "@gramio/onboarding";

const welcome = createOnboarding({ id: "welcome" })
    .step("hi", { text: "Hi! I'll show you around.", buttons: ["next", "exit"] })
    .step("links", {
        text: "Send me any link — I'll download it.",
        buttons: ["next", "dismiss"],
        // Auto-advance when the user actually does it
        advanceOn: (ctx) => ctx.is("message") && /https?:\/\//.test(ctx.text ?? ""),
    })
    .step("done", { text: "All set!" })
    .onComplete((ctx) => ctx.send("Welcome aboard! /help is always available."))
    .build();

const bot = new Bot(process.env.BOT_TOKEN!).extend(welcome);

bot.command("start", (ctx) => {
    ctx.onboarding.welcome.start();
    return ctx.send("Let's start!");
});

bot.start();
```

## How a step advances

A step ends in one of four ways:

| Trigger | Setup |
|---|---|
| **"Next" button** | `buttons: ["next"]` in the step config |
| **`advanceOn` predicate** | `advanceOn: (ctx) => boolean \| Promise<boolean>` — fires on a regular `message` while the flow is active |
| **Programmatic `next()`** | `ctx.onboarding.<flow>.next({ from: "<currentStepId>" })` from any handler. The `from` guard makes the call idempotent against a racing button click. |
| **`goto(id)` / `skip()`** | Jump to a specific step or skip the current one |

The recommended pattern for `advanceOn` plus a real business handler is to call `next({ from })` **without `await`** at the end of the handler — the onboarding bubble arrives after the user's actual reply, the call is fire-and-forget, and predicate / handler don't drift apart:

```ts
bot.on("message", async (ctx) => {
    if (!/https?:\/\//.test(ctx.text ?? "")) return;
    await ctx.send(`Downloading ${ctx.text}…`);
    ctx.onboarding.welcome.next({ from: "links" }); // fire-and-forget
});
```

## Refusal ladder

| Button | What it does |
|---|---|
| `skip` | Step-level — moves to the next step, marks current as skipped |
| `exit` | Flow-level — exits this flow only. Always available as the universal escape hatch. |
| `dismiss` | Persistent — exits this flow **and** marks it as dismissed; future `start()` returns `"dismissed"` |
| (no button) — call `ctx.onboarding.disableAll()` | User-level — opts the user out of every flow until `enableAll()` |
| (no button) — call `ctx.onboarding.exitAll()` | Nuclear — exits every active flow |

Pick which buttons render per scope (DM vs group):

```ts
.step("hi", {
    text: "Hi!",
    buttons: ["next", "exit", "dismiss"],
    controls: {
        dm:    { dismiss: true,  exit: true },
        group: { dismiss: false, exit: true },  // no dismiss in groups
    },
})
```

## Multi-flow concurrency

When two flows want to start at the same time, the `concurrency` option per flow decides:

```ts
const welcome = createOnboarding({ id: "welcome", concurrency: "queue" }).step(/* ... */).build();
const premium = createOnboarding({ id: "premium", concurrency: "preempt" }).step(/* ... */).build();
```

| Mode | Behavior |
|---|---|
| `"queue"` (default) | `start()` returns `"queued"` if another flow is live; auto-starts on terminal of the first |
| `"preempt"` | Pauses active flows onto a LIFO stack (returns `"preempted"`), resumes them when this flow ends |
| `"parallel"` | No coordination — multiple flows render together |

Coordination state lives on a per-user `global:<scopeKey>` record, so it survives process restarts.

## Scope-aware rendering

Some steps only make sense in DMs, others only in groups. Use `renderIn` and the runner defers the step until an eligible chat appears:

```ts
.step("invite-friends", {
    text: "Invite a friend!",
    renderIn: "dm",                         // string preset
})
.step("group-only", {
    text: "Only renders in groups",
    renderIn: "group",
})
.step("custom", {
    text: "Renders only in supergroups with a topic",
    renderIn: (ctx) => ctx.is("message") && ctx.chat?.type === "supergroup" && !!ctx.chat.isForum,
})
```

If the current scope doesn't match, `renderStep` returns `{ pending: true }` and re-renders on the next eligible update. Flow completion waits for the pending re-render to actually succeed, so a deferred terminal step doesn't auto-complete prematurely.

## `@gramio/views` integration

Pair onboarding with [`@gramio/views`](/plugins/official/views) for views that re-render with fresh tokens every step. The plugin exposes a `withOnboardingGlobals()` helper that produces a thunk consumed by `@gramio/views` 0.2's lazy-globals support:

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
        withOnboardingGlobals({
            user: { id: ctx.from!.id, name: ctx.from!.firstName },
        }),
    ),
}));
```

In a step's `view`, `globals.onboarding` is either the live token bundle for the current step or `undefined` (outside an onboarding-driven render). Tokens include `flowId`, `stepId`, `data`, and the callback strings `next` / `skip` / `exit` / `dismiss` / `exitAll` / `goto(id)` for use as button `callback_data`.

## Storage

Onboarding persists per-user records via any [`@gramio/storage`](/storages) adapter. Pass a storage instance — or rely on the default in-memory one for development:

```ts
import { redisStorage } from "@gramio/storage-redis";
import { Redis } from "ioredis";

const welcome = createOnboarding({
    id: "welcome",
    storage: redisStorage(new Redis()),
}).step(/* ... */).build();
```

Adapter authors can verify their adapter against the full onboarding contract using the framework-agnostic `getStorageContractCases(make)` helper:

```ts
import { getStorageContractCases } from "@gramio/onboarding";
import { test } from "vitest"; // or bun:test, jest, etc.

for (const { name, run } of getStorageContractCases(() => myStorage())) {
    test(`storage contract: ${name}`, () => run());
}
```

The contract pins: get-missing is `undefined`, round-trips preserve structure, set overwrites, has reflects presence, delete clears, nested data survives serialization, and flow-vs-global keys coexist under one scope.

## API

### `createOnboarding(opts)`

```ts
interface CreateOnboardingOpts {
    id: string;                          // unique per ctx.onboarding namespace
    storage?: Storage<OnboardingStorageMap>;
    concurrency?: "queue" | "preempt" | "parallel";   // default "queue"
    timeoutMs?: number;
    resumeOnStart?: boolean;             // default true
    scope?: "user" | ((ctx) => string); // scope key resolver
    controls?: ControlsConfig;          // per-scope (dm/group) button visibility
    errors?: "forward-to-bot" | "throw"; // default "forward-to-bot"
}
```

Returns an `OnboardingBuilder` chain:

| Method | Description |
|---|---|
| `.step(id, config)` | Append a step. Throws on duplicate id. |
| `.onComplete(handler)` | Fires after the terminal step's render |
| `.onExit(handler)` | Fires when user/timeout/preempt/exitAll exits the flow |
| `.onDismiss(handler)` | Fires when the user dismisses |
| `.onStepChange(handler)` | Fires on each step transition |
| `.onMissingStep(handler)` | Recover from a stale `stepId` (e.g. after a flow rename) |
| `.build()` | Returns a GramIO `Plugin` to pass to `bot.extend(...)` |

### `ctx.onboarding.<flowId>` — `FlowControl`

```ts
interface FlowControl<Steps extends string> {
    readonly status: "null" | "active" | "exited" | "completed" | "dismissed" | "paused";
    readonly isActive: boolean;
    readonly isDismissed: boolean;
    readonly currentStep: Steps | null;
    readonly data: Record<string, unknown>;

    start(opts?: { from?: Steps; force?: boolean }): Promise<StartResult>;
    next(opts?: { from?: Steps }): Promise<NextResult>;
    goto(id: Steps): Promise<void>;
    skip(): Promise<void>;
    exit(): Promise<void>;
    dismiss(): Promise<void>;
}
```

`StartResult` is one of `"started"`, `"resumed"`, `"already-active"`, `"already-completed"`, `"dismissed"`, `"opted-out"`, `"queued"`, `"preempted"`. `NextResult` is one of `"advanced"`, `"completed"`, `"inactive"`, `"step-mismatch"`.

### `ctx.onboarding.disableAll()` / `enableAll()` / `exitAll()`

Cross-flow controls. `disableAll()` persists user-level opt-out; `exitAll()` exits every currently active flow but doesn't persist. `allDisabled` is a getter for the persistent state.

## When to use this vs scenes

| Need | Use |
|---|---|
| One-time tutorial / feature introduction | **`@gramio/onboarding`** |
| Multi-step form collecting data with validation | [`@gramio/scenes`](/plugins/official/scenes) |
| Wizard that branches based on input | [`@gramio/scenes`](/plugins/official/scenes) |
| Multiple parallel feature walkthroughs | **`@gramio/onboarding`** (multi-flow) |
| Pause/resume across days, persistence | Either — both persist |

Onboarding flows are designed to **decorate** a bot that already works without them; scenes own the entire interaction while a user is inside.
