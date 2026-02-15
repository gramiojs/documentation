---
name: testing
description: Event-driven test framework with @gramio/test — user actors, chat simulation, API mocking, callback clicks, error simulation, all without real HTTP requests.
---

# Testing

Package: `@gramio/test`

Event-driven test framework for GramIO bots. Users are the primary actors — they send messages, join/leave chats, click inline buttons — and the framework manages in-memory state and emits correct Telegram updates. No real HTTP requests are made.

## Quick Start

```typescript
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

## TelegramTestEnvironment

Central orchestrator — wraps a GramIO `Bot`, intercepts all outgoing API calls:

```typescript
const bot = new Bot("test");
const env = new TelegramTestEnvironment(bot);
```

| Method / Property | Description |
|---|---|
| `env.createUser(payload?)` | Create a `UserObject` linked to the environment |
| `env.createChat(payload?)` | Create a `ChatObject` (group, supergroup, channel) |
| `env.emitUpdate(update)` | Send raw `TelegramUpdate` to the bot |
| `env.onApi(method, handler)` | Override response for a specific API method |
| `env.offApi(method?)` | Remove handler (or all handlers) |
| `env.apiCalls` | Array of `{ method, params, response }` — every API call |
| `env.users` / `env.chats` | All created users and chats |

## UserObject — Primary Actor

```typescript
const user = env.createUser({ first_name: "Alice" });
```

### sendMessage

```typescript
// PM to bot
const msg = await user.sendMessage("Hello");

// To a group
const group = env.createChat({ type: "group", title: "Test Group" });
await user.sendMessage(group, "/start");
```

### join / leave

Emits `chat_member` update and service message. Updates `chat.members`:

```typescript
await user.join(group);
expect(group.members.has(user)).toBe(true);

await user.leave(group);
expect(group.members.has(user)).toBe(false);
```

### click (callback query)

```typescript
const msg = await user.sendMessage("Pick an option");
await user.click("option:1", msg);
```

## ChatObject

- `chat.members` — `Set<UserObject>` of current members
- `chat.messages` — `MessageObject[]` history

## Inspecting API Calls

```typescript
await user.sendMessage("Hello");

expect(env.apiCalls).toHaveLength(1);
expect(env.apiCalls[0].method).toBe("sendMessage");
expect(env.apiCalls[0].params.text).toBe("Reply!");
```

## Mocking API Responses

```typescript
// Static response
env.onApi("getMe", { id: 1, is_bot: true, first_name: "TestBot" });

// Dynamic response
env.onApi("sendMessage", (params) => ({
    message_id: 1,
    date: Date.now(),
    chat: { id: params.chat_id, type: "private" },
    text: params.text,
}));
```

## Simulating Errors

```typescript
import { apiError } from "@gramio/test";

// Bot blocked by user
env.onApi("sendMessage", apiError(403, "Forbidden: bot was blocked by the user"));

// Rate limiting
env.onApi("sendMessage", apiError(429, "Too Many Requests", { retry_after: 30 }));

// Conditional errors
env.onApi("sendMessage", (params) => {
    if (params.chat_id === blockedUserId) {
        return apiError(403, "Forbidden: bot was blocked by the user");
    }
    return { message_id: 1, date: Date.now(), chat: { id: params.chat_id, type: "private" }, text: params.text };
});
```

## Resetting

```typescript
env.offApi("sendMessage"); // reset specific method
env.offApi();              // reset all overrides
```

<!--
Source: https://gramio.dev/testing
-->
