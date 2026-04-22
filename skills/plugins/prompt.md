---
name: prompt
description: Interactive in-memory prompts with @gramio/prompt — send and wait for one response in-process. NOT persistent across restarts; use Scenes `.ask()` for any multi-step or connect flow that must survive deploys.
---

# Prompt Plugin

Package: `@gramio/prompt`

> **⚠️ Read this before reaching for `prompt` in a multi-step flow.**
>
> `@gramio/prompt` is **in-memory only**. The Promise returned by `context.prompt(...)` / `context.wait(...)` lives in the current Node.js process. The moment the process restarts — deploy, crash, container reschedule, dyno cycling, `Ctrl-C` in dev — the Promise is garbage-collected and:
>
> - The user's next message is **not** treated as the awaited answer.
> - **No error** is thrown; the bot silently "forgets" the user was mid-prompt.
> - The user sees nothing happen and usually gives up.
>
> **This is fatal for** OAuth-connect flows (Spotify/Last.fm/VK/Yandex/Subsonic/ListenBrainz/SoundCloud style "enter client id → validate → enter secret"), onboarding wizards, payment collection, any question-sequence that matters.
>
> **Use `@gramio/prompt` only for:**
>
> - Single-question prompts where losing the flow on restart is acceptable (throwaway confirmations, debug helpers, `/test` commands).
> - Flows that complete in seconds inside a single handler call and the user can re-trigger trivially.
>
> **For everything else — especially "ask → validate → ask again" connect flows — use [Scenes](scenes.md) with `.ask("field", zodSchema, "prompt message")`.** Scenes persist step index and collected answers via the configured storage (Redis / Cloudflare / custom) and rehydrate on the next update after restart. `.ask()` kills the same `firstTime` branching and validation-retry boilerplate as `prompt`, plus it's durable.
>
> If a reviewer or AI suggests "replace this 7-step scene with `context.prompt(...)` to save lines" — reject it. That refactor trades correctness under restart for ~30 lines of code, and the bug it introduces is silent.

Use this plugin for single-question, in-process prompts. For multi-step flows, see [scenes](scenes.md).

## Setup

```typescript
import { prompt } from "@gramio/prompt";

bot.extend(prompt({
    timeoutStrategy: "on-timer",  // "on-answer" (default) or "on-timer"
    defaults: {
        timeout: 30000,            // ms
    },
}));
```

## prompt() — Send + Wait

```typescript
// Wait for text message
const answer = await context.prompt("message", "What is your name?");
// answer is MessageContext

// Wait for callback query (with keyboard)
const answer = await context.prompt("callback_query", "Choose:", {
    reply_markup: new InlineKeyboard()
        .text("Option A", "a")
        .text("Option B", "b"),
});
// answer is CallbackQueryContext

// With validation + transform
const name = await context.prompt("message", "Enter name:", {
    validate: (ctx) => ctx.text && ctx.text.length >= 2,
    transform: (ctx) => ctx.text!.trim(),
});
// name is string (transformed)
```

## wait() — Just Wait (no message sent)

```typescript
const answer = await context.wait();                    // any update
const answer = await context.wait("message");            // message only
const answer = await context.wait("message", {
    validate: (ctx) => /^\d+$/.test(ctx.text ?? ""),
    transform: (ctx) => Number(ctx.text),
    timeout: 10000,
});
```

## waitWithAction() — Wait + Execute Simultaneously

```typescript
const [answer, sentMessage] = await context.waitWithAction(
    "message",
    () => context.send("Please enter your email:"),
    { timeout: 30000 }
);
```

## Timeout Handling

Timeout throws `PromptCancelError` (error kind: `"prompt-cancel"`):

```typescript
bot.onError(({ kind, error }) => {
    if (kind === "prompt-cancel") {
        // handle timeout
    }
});
```

Strategies:
- `"on-answer"` (default) — timeout resets on each user message
- `"on-timer"` — fixed timer from prompt start
