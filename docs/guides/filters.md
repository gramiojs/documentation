---
title: "Filters — Type-Safe Context Narrowing in GramIO"

head:
    - - meta
      - name: "description"
        content: "GramIO filters let you narrow context types inline — filter-only .on() without event names, standalone predicate functions like filters.reply, filters.isBot, filters.forwardOrigin(), and type-narrowing guards."

    - - meta
      - name: "keywords"
        content: "gramio, filters, type narrowing, context narrowing, filter-only on, predicate, guard, reply filter, isBot, isPremium, forwardOrigin, senderChat, typescript"
---

# Filters

:::warning UNRELEASED
The filters system is currently on the `main` branch and has not been included in a tagged release yet. The API may change before the stable release.
:::

GramIO's filter system lets you apply type-safe predicates to context — either as the third argument to `bot.on(event, filter, handler)` or as the only argument in a **filter-only** `.on(filter, handler)` call that auto-discovers compatible events.

## Filter-Only `.on()` — No Event Name Required

In the standard `.on(event, handler)`, you choose the event explicitly. With the filter-only overload you skip the event name entirely — GramIO infers which events are compatible from the shape of your predicate:

```ts
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN!);

// Boolean filter — runs on any update where ctx has `text`
bot.on((ctx) => "text" in ctx && ctx.text?.startsWith("!"), (ctx) => {
    // ctx is narrowed to the union of all events that have a `text` field
    ctx.send("Command received!");
});

// Type-narrowing predicate — narrows the handler's context type
bot.on(
    (ctx): ctx is { text: string } => typeof (ctx as any).text === "string",
    (ctx) => {
        ctx.text; // string — not string | undefined
    }
);
```

## Inline Filter on a Named Event

You can also pass a filter as the second argument to a named `.on()`:

```ts
bot.on("message", (ctx) => ctx.text?.startsWith("/"), (ctx) => {
    // only messages starting with "/"
});

// Type-narrowing inline filter
bot.on(
    "message",
    (ctx): ctx is typeof ctx & { text: string } => typeof ctx.text === "string",
    (ctx) => {
        ctx.text; // string
    }
);
```

## Standalone Predicate Functions

Import from `gramio` and pass as filters to `.on()` or `.guard()`:

```ts
import { filters } from "gramio";
```

### Message Content Filters

| Filter | Narrows to / Guards for |
|---|---|
| `filters.reply` | Message has `reply_to_message` |
| `filters.entities` | Message has `entities` |
| `filters.captionEntities` | Message has `caption_entities` |
| `filters.quote` | Message has a quoted reply (`quote`) |
| `filters.viaBot` | Message was sent via a bot (`via_bot`) |
| `filters.linkPreview` | Message has `link_preview_options` |
| `filters.startPayload` | `/start` with a deep-link payload |
| `filters.authorSignature` | Message has `author_signature` |
| `filters.mediaGroup` | Message belongs to a media group |
| `filters.venue` | Message is a venue |

```ts
bot.on("message", filters.reply, (ctx) => {
    ctx.replyToMessage; // guaranteed present
});

bot.on("message", filters.startPayload, (ctx) => {
    // message is a /start with payload
});
```

### Sender & Chat Filters

| Filter | Description |
|---|---|
| `filters.hasFrom` | Update has a `from` field (user sender) |
| `filters.isBot` | `from.is_bot === true` |
| `filters.isPremium` | `from.is_premium === true` |
| `filters.isForum` | Chat has `is_forum === true` |
| `filters.service` | Message is a service message |
| `filters.topicMessage` | Message is in a forum topic |
| `filters.mediaSpoiler` | Media has spoiler effect |
| `filters.giveaway` | Message contains a giveaway |
| `filters.game` | Message contains a game |
| `filters.story` | Message is a story |
| `filters.effectId` | Message has a message effect |

### `filters.forwardOrigin(type?)` — Forward Origin Narrowing

Without an argument, matches any forwarded message. With a type argument, narrows the `forwardOrigin` type:

```ts
// Any forwarded message
bot.on("message", filters.forwardOrigin(), (ctx) => {
    ctx.forwardOrigin; // MessageOrigin (union of all origin types)
});

// Narrowed to a specific origin type
bot.on("message", filters.forwardOrigin("user"), (ctx) => {
    ctx.forwardOrigin; // MessageOriginUser
    ctx.forwardOrigin.sender_user; // TelegramUser
});

bot.on("message", filters.forwardOrigin("channel"), (ctx) => {
    ctx.forwardOrigin; // MessageOriginChannel
    ctx.forwardOrigin.chat;         // TelegramChat
    ctx.forwardOrigin.message_id;   // number
});
```

Available types: `"user"` | `"hidden_user"` | `"chat"` | `"channel"`

### `filters.senderChat(type?)` — Sender Chat Narrowing

```ts
// Any message sent on behalf of a chat (anonymous admin, channel)
bot.on("message", filters.senderChat(), (ctx) => {
    ctx.senderChat; // TelegramChat
});

// Narrowed to a specific chat type
bot.on("message", filters.senderChat("channel"), (ctx) => {
    ctx.senderChat; // TelegramChat & { type: "channel" }
});
```

## Composing Filters

Filters are plain functions — compose them with boolean logic:

```ts
const isPremiumAdmin = (ctx: any) =>
    filters.isPremium(ctx) && filters.hasFrom(ctx) && ctx.from.status === "administrator";

bot.on("message", isPremiumAdmin, handler);
```

## Type-Narrowing `guard()`

`guard()` with a type predicate narrows `TOut` for all **downstream** middleware in the chain:

```ts
const bot = new Bot(process.env.BOT_TOKEN!);

bot
    .guard((ctx): ctx is typeof ctx & { text: string } => typeof ctx.text === "string")
    .on("message", (ctx) => {
        ctx.text; // string — narrowed for all handlers after the guard
    });
```

Without a type predicate (boolean guard), it acts as a gate that blocks the chain on `false` but doesn't narrow types.

## See Also

- [Middleware guide](/guides/middleware) — how middleware chains work
- [`.on()` reference](/bot-class#on) — full method signature
- [`guard()` reference](/bot-class#guard) — gate vs side-effect modes
