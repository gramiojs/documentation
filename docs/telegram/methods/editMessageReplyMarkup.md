---
title: editMessageReplyMarkup — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Edit inline keyboard markup on Telegram messages using GramIO with TypeScript. Update or remove inline keyboards on existing messages with editMessageReplyMarkup.
  - - meta
    - name: keywords
      content: editMessageReplyMarkup, telegram bot api, edit keyboard telegram, gramio editMessageReplyMarkup, editMessageReplyMarkup typescript, editMessageReplyMarkup example, update inline keyboard telegram bot, ctx.editReplyMarkup, InlineKeyboard, reply_markup, remove keyboard telegram, how to update keyboard telegram bot, edit buttons telegram
---

# editMessageReplyMarkup

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Message">Message</a> | True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editmessagereplymarkup" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise *True* is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message to be edited was sent" />

<ApiParam name="chat_id" type="Integer | String" description="Required if *inline\_message\_id* is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" description="Required if *inline\_message\_id* is not specified. Identifier of the message to edit" />

<ApiParam name="inline_message_id" type="String" description="Required if *chat\_id* and *message\_id* are not specified. Identifier of the inline message" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards)." />

## Returns

On success, Message | True is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot, InlineKeyboard } from "gramio";

const bot = new Bot("");
// ---cut---
// Replace the keyboard on a message after a button press
bot.on("callback_query", async (ctx) => {
    const updatedKeyboard = new InlineKeyboard()
        .text("Option A ✓", "opt_a_done")
        .row()
        .text("Back", "go_back");

    await ctx.editReplyMarkup(updatedKeyboard);
    await ctx.answer();
});
```

```ts twoslash
import { Bot, InlineKeyboard } from "gramio";

const bot = new Bot("");
// ---cut---
// Build a multi-step wizard — swap keyboards between steps
bot.on("callback_query", async (ctx) => {
    if (ctx.queryPayload === "step_1") {
        const step2Keyboard = new InlineKeyboard()
            .text("Continue →", "step_2")
            .text("Cancel", "cancel");

        await ctx.editReplyMarkup(step2Keyboard);
    }
    await ctx.answer();
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Direct API call — remove the inline keyboard from a message
await bot.api.editMessageReplyMarkup({
    chat_id: 123456789,
    message_id: 42,
    // omit reply_markup to remove the existing keyboard
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: message is not modified` | New keyboard is identical to the current one — check before calling |
| 400 | `Bad Request: message can't be edited` | Message too old, sent by another bot, or the message has no inline keyboard to edit |
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` |
| 400 | `Bad Request: message not found` | `message_id` doesn't exist in the chat |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — catch and mark user as inactive |
| 403 | `Forbidden: not enough rights` | Bot lacks edit permissions in a channel |
| 429 | `Too Many Requests: retry after N` | Flood control — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Only `InlineKeyboardMarkup` is supported** — you cannot switch to `ReplyKeyboardMarkup` or `ForceReply` using this method. Inline keyboards are the only type that can be attached to non-private bot messages.
- **Omit `reply_markup` to remove the keyboard.** Sending the request without the `reply_markup` parameter removes the existing inline keyboard from the message.
- **This is the lightest edit method** — it changes only the keyboard, leaving the message text, caption, and media untouched. Prefer this over `editMessageText` when only the button state needs to change.
- **Business messages have a 48-hour edit window.** Messages sent via a business connection by another user without an inline keyboard can only be edited within 48 hours of sending.
- **Inline messages return `true`, not `Message`.** When editing via `inline_message_id`, the method returns `true` on success instead of the updated `Message` object.
- **Ideal for wizard-style UIs.** Swapping keyboards between steps is a common pattern for multi-step bots — this method handles it with minimal overhead.

## See Also

- [editMessageText](/telegram/methods/editMessageText) — edit text and keyboard together
- [editMessageCaption](/telegram/methods/editMessageCaption) — edit media caption and keyboard together
- [editMessageMedia](/telegram/methods/editMessageMedia) — replace the media file
- [Keyboards overview](/keyboards/overview) — building inline keyboards with `InlineKeyboard`
- [InlineKeyboardMarkup](/telegram/types/InlineKeyboardMarkup) — the type used for `reply_markup`
- [Message](/telegram/types/Message) — the type returned on success for non-inline messages
- [auto-retry plugin](/plugins/official/auto-retry) — automatic `429` retry handling
