---
title: Testing Telegram Bots — Event-driven test framework for GramIO

head:
    - - meta
      - name: "description"
        content: "Learn how to test your Telegram bot built with GramIO. Event-driven test framework with user actors, chat simulation, API mocking, and inline button clicks — all without real HTTP requests."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, testing, unit tests, integration tests, bot testing, mock API, test environment, user simulation, chat simulation, callback query testing, inline button testing, API mocking, TelegramTestEnvironment"
---

# Testing

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/test?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/test)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/test?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/test)
[![JSR](https://jsr.io/badges/@gramio/test)](https://jsr.io/@gramio/test)
[![JSR Score](https://jsr.io/badges/@gramio/test/score)](https://jsr.io/@gramio/test)

</div>

An event-driven test framework for bots built with GramIO. Users are the primary actors — they send messages, join/leave chats, click inline buttons — and the framework manages in-memory state and emits the correct Telegram updates to the bot under test. No real HTTP requests are made.

## Installation

::: code-group

```bash [npm]
npm install -D @gramio/test
```

```bash [yarn]
yarn add -D @gramio/test
```

```bash [pnpm]
pnpm add -D @gramio/test
```

```bash [bun]
bun add -d @gramio/test
```

:::

## Quick Start

```ts
import { describe, expect, it } from "bun:test";
import { Bot } from "gramio";
import { TelegramTestEnvironment } from "@gramio/test";

describe("My bot", () => {
    it("should reply to /start", async () => {
        const bot = new Bot("test");
        bot.command("start", (ctx) => ctx.send("Welcome!"));

        const env = new TelegramTestEnvironment(bot);
        const user = env.createUser({ first_name: "Alice" });

        await user.sendMessage("/start");

        expect(env.apiCalls[0].method).toBe("sendMessage");
    });
});
```

## `TelegramTestEnvironment`

The central orchestrator. Wraps a GramIO `Bot`, intercepts all outgoing API calls, and provides factories for users and chats.

```ts
const bot = new Bot("test");
const env = new TelegramTestEnvironment(bot);
```

| Property / Method | Description |
|---|---|
| `env.createUser(payload?)` | Creates a `UserObject` linked to the environment |
| `env.createChat(payload?)` | Creates a `ChatObject` (group, supergroup, channel, etc.) |
| `env.emitUpdate(update)` | Sends a raw `TelegramUpdate` or `MessageObject` to the bot |
| `env.onApi(method, handler)` | Override the response for a specific API method |
| `env.offApi(method?)` | Remove a handler (or all handlers if no method given) |
| `env.apiCalls` | Array of `{ method, params, response }` recording every API call |
| `env.users` / `env.chats` | All created users and chats |

## `UserObject` — the primary actor

Users drive the test scenario. Create them via `env.createUser()`:

```ts
const user = env.createUser({ first_name: "Alice" });
```

### `user.sendMessage(text)` — send a PM to the bot

```ts
const msg = await user.sendMessage("Hello");
```

### `user.sendMessage(chat, text)` — send a message to a group

```ts
const group = env.createChat({ type: "group", title: "Test Group" });
await user.sendMessage(group, "/start");
```

### `user.join(chat)` / `user.leave(chat)`

Emits a `chat_member` update and a service message (`new_chat_members` / `left_chat_member`). Updates `chat.members` set.

```ts
await user.join(group);
expect(group.members.has(user)).toBe(true);

await user.leave(group);
expect(group.members.has(user)).toBe(false);
```

### `user.click(callbackData, message?)`

Emits a `callback_query` update. Perfect for testing inline keyboard interactions:

```ts
const msg = await user.sendMessage("Pick an option");
await user.click("option:1", msg);
```

## `ChatObject`

Wraps `TelegramChat` with in-memory state tracking:

- **`chat.members`** — `Set<UserObject>` of current members
- **`chat.messages`** — `MessageObject[]` history of all messages in the chat

## `MessageObject`

Wraps `TelegramMessage` with builder methods:

```ts
const message = new MessageObject({ text: "Hello" })
    .from(user)
    .chat(group);
```

## `CallbackQueryObject`

Wraps `TelegramCallbackQuery` with builder methods:

```ts
const cbQuery = new CallbackQueryObject()
    .from(user)
    .data("action:1")
    .message(msg);
```

## Inspecting Bot API Calls

The environment intercepts all outgoing API calls (no real HTTP requests) and records them:

```ts
const bot = new Bot("test");
bot.on("message", async (ctx) => {
    await ctx.send("Reply!");
});

const env = new TelegramTestEnvironment(bot);
const user = env.createUser();

await user.sendMessage("Hello");

expect(env.apiCalls).toHaveLength(1);
expect(env.apiCalls[0].method).toBe("sendMessage");
expect(env.apiCalls[0].params.text).toBe("Reply!");
```

## Mocking API Responses

Use `env.onApi()` to control what the bot receives from the Telegram API. Accepts a static value or a dynamic handler function:

```ts
// Static response
env.onApi("getMe", { id: 1, is_bot: true, first_name: "TestBot" });

// Dynamic response based on params
env.onApi("sendMessage", (params) => ({
    message_id: 1,
    date: Date.now(),
    chat: { id: params.chat_id, type: "private" },
    text: params.text,
}));
```

### Simulating Errors

Use `apiError()` to create a `TelegramError` that the bot will receive as a rejected promise — matching exactly how real Telegram API errors work in GramIO:

```ts
import { TelegramTestEnvironment, apiError } from "@gramio/test";

// Bot is blocked by user
env.onApi("sendMessage", apiError(403, "Forbidden: bot was blocked by the user"));

// Rate limiting
env.onApi("sendMessage", apiError(429, "Too Many Requests", { retry_after: 30 }));

// Conditional — error for some chats, success for others
env.onApi("sendMessage", (params) => {
    if (params.chat_id === blockedUserId) {
        return apiError(403, "Forbidden: bot was blocked by the user");
    }
    return {
        message_id: 1,
        date: Date.now(),
        chat: { id: params.chat_id, type: "private" },
        text: params.text,
    };
});
```

### Resetting

```ts
env.offApi("sendMessage"); // reset specific method
env.offApi();              // reset all overrides
```
