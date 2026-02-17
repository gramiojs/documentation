---
name: prompt
description: Interactive prompts with @gramio/prompt — send message and wait for response, with validation, transform, and timeout support.
---

# Prompt Plugin

Package: `@gramio/prompt`

Simpler alternative to Scenes for single-question flows.

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
