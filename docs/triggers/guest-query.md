---
title: guestQuery - Handle Telegram Bot API 10.0 guest messages with GramIO

head:
    - - meta
      - name: "description"
        content: "Learn how to handle guest messages in your Telegram bot with GramIO. The guestQuery trigger responds to the Bot API 10.0 guest_message update and replies with ctx.answerGuestQuery()."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, Bot API 10.0, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, guest message, guest query, guestQuery, answerGuestQuery, guest_message update, guestQueryId, supportsGuestQueries"
---

# guestQuery

The `guestQuery` method handles **guest messages** — a feature introduced in [Telegram Bot API 10.0](https://core.telegram.org/bots/api-changelog). A guest message lets a user reach your bot without a regular chat, arriving as the new `guest_message` update. GramIO maps that update to a `MessageContext` and gives you a dedicated `ctx.answerGuestQuery()` reply method.

> [!NOTE]
> `bot.guestQuery(...)` requires **gramio v0.10.0+** (Bot API 10.0). It is the guest-message counterpart to [`inlineQuery`](/triggers/inline-query) — same trigger shape, different reply semantics.

## Basic Usage

The shape mirrors [`inlineQuery`](/triggers/inline-query): a trigger (string, RegExp, predicate, or none) followed by a handler. Pass **no trigger** to match any guest message. Reply with `context.answerGuestQuery(result)` — `result` is a single [`InlineQueryResult`](/telegram/types/InlineQueryResult), exactly like a value you'd put in an `answerInlineQuery` results array:

```ts
import { InlineQueryResult, InputMessageContent } from "gramio";

// Match any guest message
bot.guestQuery(async (context) => {
    await context.answerGuestQuery(
        InlineQueryResult.article(
            "1",
            "Hi there!",
            InputMessageContent.text("Hello, guest!"),
        ),
    );
});
```

Filter on the guest query text with a string, RegExp, or function — captures land on `context.args` (a `RegExpMatchArray | null`), exactly like other text triggers:

```ts
// RegExp — captures via context.args
bot.guestQuery(/^order (.+)/i, async (context) => {
    const orderId = context.args![1];
    await context.answerGuestQuery(
        InlineQueryResult.article(
            orderId,
            `Order ${orderId}`,
            InputMessageContent.text(`Opening order ${orderId}…`),
        ),
    );
});

// Function matcher — return boolean
bot.guestQuery(
    (context) => context.from?.is_premium === true,
    (context) =>
        context.answerGuestQuery(
            InlineQueryResult.article(
                "premium",
                "Premium",
                InputMessageContent.text("Premium options"),
            ),
        ),
);
```

## Why it's separate from `command` / `hears`

Guest messages have **different reply semantics** than ordinary messages: you respond with `ctx.answerGuestQuery(result)`, not `ctx.send()` / `ctx.reply()`. Keeping `guestQuery` as its own trigger (rather than folding guest messages into `command` / `hears` / `startParameter`) makes that distinction explicit and keeps your guest-flow handlers in one place.

## Context helpers

On a guest-message context you get the new Bot API 10.0 getters:

| Getter / method | Description |
|---|---|
| `context.guestQueryId` | The id of the guest query to answer |
| `context.guestBotCallerUser` | The user who triggered the guest message |
| `context.guestBotCallerChat` | The chat the guest message originated from |
| `context.answerGuestQuery(result, params?)` | Reply to the guest query. `result` is a single `InlineQueryResult` (e.g. `InlineQueryResult.article(…)`) |

`User.supportsGuestQueries()` lets you check whether a given user can receive guest queries before initiating a flow.

## Enabling guest queries

`guest_message` is one of the update types Telegram only delivers when it's listed in `allowed_updates`. GramIO's [`AllowedUpdatesFilter`](/api/gramio/classes/AllowedUpdatesFilter) auto-derives it when you register a `guestQuery` handler, so the default `bot.start()` opts in automatically.

## See also

- [`inlineQuery`](/triggers/inline-query) — the inline-mode counterpart with the same trigger shape.
- [`chosenInlineResult`](/triggers/chosen-inline-result) — handle which inline result a user picked.
