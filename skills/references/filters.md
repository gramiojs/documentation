---
name: filters
description: Type-safe context narrowing — filter-only `.on(filter, handler)` without an event name, inline filters on named events, the standalone `filters.*` predicate library (reply, isBot, isPremium, forwardOrigin, senderChat, …), composing predicates, and `guard()` for downstream narrowing. For trigger registration (command/hears/callbackQuery) see triggers.md; for middleware order see middleware-routing.md.
---

# Filters

A **filter** is a type-safe predicate over context. It either gates a handler and/or **narrows** the context type for that handler. Three usage shapes — pick whichever reads best.

## 1. Filter-only `.on(filter, handler)` — no event name

Skip the event name; GramIO infers which events are compatible from the predicate's shape.

```ts
// boolean filter — runs on any update whose ctx has `text`
bot.on(
    (ctx) => "text" in ctx && ctx.text?.startsWith("!"),
    (ctx) => ctx.send("Command!"),
);

// type-narrowing predicate — narrows the handler's ctx
bot.on(
    (ctx): ctx is { text: string } => typeof (ctx as any).text === "string",
    (ctx) => ctx.text, // string, not string | undefined
);
```

## 2. Inline filter on a named event `.on(event, filter, handler)`

```ts
bot.on("message", (ctx) => ctx.text?.startsWith("/"), (ctx) => { /* only "/" */ });

// narrowing form
bot.on(
    "message",
    (ctx): ctx is typeof ctx & { text: string } => typeof ctx.text === "string",
    (ctx) => ctx.text, // string
);
```

## 3. Standalone `filters.*` predicates

```ts
import { filters } from "gramio";

bot.on("message", filters.reply, (ctx) => ctx.replyMessage /* guaranteed */);
bot.on("message", filters.startPayload, (ctx) => { /* /start with payload */ });
```

### Message-content filters
`filters.reply`, `filters.entities`, `filters.captionEntities`, `filters.quote`, `filters.viaBot`, `filters.linkPreview`, `filters.startPayload`, `filters.authorSignature`, `filters.mediaGroup`, `filters.venue`.

### Sender & chat filters
`filters.hasFrom`, `filters.isBot`, `filters.isPremium`, `filters.isForum`, `filters.service`, `filters.topicMessage`, `filters.mediaSpoiler`, `filters.giveaway`, `filters.game`, `filters.story`, `filters.effectId`.

### Parameterized narrowing

```ts
filters.forwardOrigin();          // any forward → ctx.forwardOrigin: MessageOrigin
filters.forwardOrigin("user");    // → MessageOriginUser  (ctx.forwardOrigin.sender_user)
filters.forwardOrigin("channel"); // → MessageOriginChannel (ctx.forwardOrigin.chat / .message_id)
// types: "user" | "hidden_user" | "chat" | "channel"

filters.senderChat();             // any → ctx.senderChat: TelegramChat
filters.senderChat("channel");    // → TelegramChat & { type: "channel" }
```

## Composing filters

Filters are plain functions — combine with boolean logic:

```ts
const isPremiumAdmin = (ctx: any) =>
    filters.isPremium(ctx) && filters.hasFrom(ctx) && ctx.from.status === "administrator";

bot.on("message", isPremiumAdmin, handler);
```

## `guard()` — narrow for all downstream middleware

```ts
bot.guard(
    (ctx): ctx is typeof ctx & { text: string } => typeof ctx.text === "string",
).on("message", (ctx) => ctx.text /* string, narrowed for everything after the guard */);
```

A **type-predicate** guard narrows `TOut` for the rest of the chain. A **boolean** guard just gates (blocks on `false`) without narrowing.

## See also
- triggers.md — command / hears / callbackQuery / inlineQuery / reaction registration
- middleware-routing.md — handler priority, `next()`, overlapping CallbackData
- context.md — derive/decorate, `ctx.is(...)` narrowing
