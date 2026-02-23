---
title: Testing Telegram Bots — Event-driven test framework for GramIO

head:
    - - meta
      - name: "description"
        content: "Learn how to test your Telegram bot built with GramIO. Event-driven test framework with user actors, chat simulation, reactions, inline queries, API mocking, and fluent scope API — all without real HTTP requests."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, testing, unit tests, integration tests, bot testing, mock API, test environment, user simulation, chat simulation, callback query testing, inline button testing, API mocking, TelegramTestEnvironment, reactions, inline queries, ReactObject"
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
| `env.clearApiCalls()` | Empties the `apiCalls` array (useful between logical test phases) |
| `env.lastApiCall(method)` | Returns the most recent recorded call for `method`, or `undefined` |
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

### `user.editMessage(msg, text)` — simulate message editing

Emits an `edited_message` update. Test `bot.on("edited_message", ...)` handlers:

```ts
const msg = await user.sendMessage("Hello");
await user.editMessage(msg, "Hello, world!");
```

### `user.forwardMessage(msg, toChat?)` — forward a message

Emits a `message` update with `forward_origin` set. Tests forward-detection logic:

```ts
const msg = await user.sendMessage("Original");
await user.forwardMessage(msg, group);
```

### `user.sendMediaGroup(chat, payloads[])` — send an album

Emits multiple `message` updates sharing the same `media_group_id`:

```ts
await user.sendMediaGroup(group, [
    { photo: {} },
    { video: {} },
]);
```

### `user.pinMessage(msg, inChat?)` — pin a message

Emits a service message with `pinned_message`. GramIO routes these to the `"pinned_message"` event:

```ts
const msg = await user.sendMessage("Important!");
await user.pinMessage(msg);
```

### Media send methods

In addition to existing methods (`sendPhoto`, `sendVideo`, `sendDocument`, `sendVoice`, `sendSticker`), three new ones are available — all with auto-generated file IDs:

```ts
await user.sendAudio({ caption: "Track title" });
await user.sendAnimation(group, { caption: "Funny gif" });
await user.sendVideoNote(); // circle video
```

### `user.react(emojiOrObject, message?, options?)` — react to a message

Emits a `message_reaction` update. Works with `bot.reaction()` handlers:

```ts
const msg = await user.sendMessage("Nice bot!");

// Single emoji
await user.react("👍", msg);

// Multiple emojis
await user.react(["👍", "❤"], msg);

// Declare previous reactions (old_reaction)
await user.react("❤", msg, { oldReactions: ["👍"] });
```

Use the `ReactObject` builder for fine-grained control:

```ts
import { ReactObject } from "@gramio/test";

await user.react(
    new ReactObject()
        .on(msg)          // attach to message (infers chat)
        .add("👍", "🔥") // new_reaction
        .remove("😢")    // old_reaction
);

// Attribute the reaction to a different user:
await alice.react(new ReactObject().from(bob).on(msg).add("👍"));
```

**Automatic reaction state tracking**: `MessageObject` tracks per-user reactions in memory. When `user.react()` is called, `old_reaction` is computed automatically from the in-memory state — you only need `oldReactions` when you want to override:

```ts
await user.react("👍", msg);  // old_reaction = [] (auto)
await user.react("❤", msg);  // old_reaction = ["👍"] — auto-computed!
```

### `user.sendInlineQuery(query, chatOrOptions?, options?)` — trigger inline mode

Emits an `inline_query` update. Works with `bot.inlineQuery()` handlers:

```ts
// No chat context
const q = await user.sendInlineQuery("search cats");

// With chat — chat_type derived automatically
const group = env.createChat({ type: "group" });
const q2 = await user.sendInlineQuery("search cats", group);

// With pagination offset
const q3 = await user.sendInlineQuery("search dogs", { offset: "10" });

// With chat + offset
const q4 = await user.sendInlineQuery("search dogs", group, { offset: "10" });
```

### `user.chooseInlineResult(resultId, query, options?)` — simulate result selection

Emits a `chosen_inline_result` update:

```ts
await user.chooseInlineResult("result-1", "search cats");
await user.chooseInlineResult("result-1", "search cats", { inline_message_id: "abc" });
```

### `user.in(chat)` — scope to a chat

Returns a `UserInChatScope` with the chat pre-bound. Makes chained operations more readable:

```ts
const group = env.createChat({ type: "group" });

await user.in(group).sendMessage("Hello group!");
await user.in(group).sendInlineQuery("cats");
await user.in(group).join();
await user.in(group).leave();

// Chain further to a message:
const msg = await user.sendMessage(group, "Pick one");
await user.in(group).on(msg).react("👍");
await user.in(group).on(msg).click("choice:A");
```

### `user.on(msg)` — scope to a message

Returns a `UserOnMessageScope` for message-level actions:

```ts
const msg = await user.sendMessage("Hello");

await user.on(msg).react("👍");
await user.on(msg).react("❤", { oldReactions: ["👍"] });
await user.on(msg).click("action:1");

// clickByText — find button by label and click it
await user.on(botReply).clickByText("Confirm");
```

`clickByText(buttonText)` scans the message's `inline_keyboard` for a button whose `text` matches, then clicks its `callback_data`. Throws if no inline keyboard is present or no button matches.

## `ChatObject`

Wraps `TelegramChat` with in-memory state tracking:

- **`chat.members`** — `Set<UserObject>` of current members
- **`chat.messages`** — `MessageObject[]` history of all messages in the chat

### `chat.post(text)` — simulate a channel post

Emits a `channel_post` update (no `from` field). For testing channel bots:

```ts
const channel = env.createChat({ type: "channel", title: "My Channel" });
await channel.post("New post from channel");
```

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

## `ReactObject`

Chainable builder for `message_reaction` updates:

| Method | Description |
|--------|-------------|
| `.from(user)` | Set the user who reacted (auto-filled by `user.react()`) |
| `.on(message)` | Attach to a message and infer the chat |
| `.inChat(chat)` | Override the chat explicitly |
| `.add(...emojis)` | Emojis being added (`new_reaction`) |
| `.remove(...emojis)` | Emojis being removed (`old_reaction`) |

```ts
const reaction = new ReactObject()
    .on(msg)
    .add("👍", "🔥")
    .remove("😢");

await user.react(reaction);
```

## `InlineQueryObject`

Wraps `TelegramInlineQuery` with builder methods:

```ts
const inlineQuery = new InlineQueryObject()
    .from(user)
    .query("search cats")
    .offset("0");
```

## `ChosenInlineResultObject`

Wraps `TelegramChosenInlineResult` with builder methods:

```ts
const result = new ChosenInlineResultObject()
    .from(user)
    .resultId("result-1")
    .query("search cats");
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
