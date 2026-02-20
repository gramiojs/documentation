---
title: savePreparedInlineMessage — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Store a prepared inline message for Mini App users using GramIO and TypeScript. Create shareable InlineQueryResult messages with chat type targeting and expiration handling.
  - - meta
    - name: keywords
      content: savePreparedInlineMessage, telegram bot api, prepared inline message mini app, gramio savePreparedInlineMessage, savePreparedInlineMessage typescript, savePreparedInlineMessage example, PreparedInlineMessage, InlineQueryResult, Mini App inline, user_id, allow_user_chats, allow_group_chats, telegram bot mini app share, how to share message mini app telegram
---

# savePreparedInlineMessage

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/PreparedInlineMessage">PreparedInlineMessage</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#savepreparedinlinemessage" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Stores a message that can be sent by a user of a Mini App. Returns a [PreparedInlineMessage](https://core.telegram.org/bots/api#preparedinlinemessage) object.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user that can use the prepared message" />

<ApiParam name="result" type="InlineQueryResult" required description="A JSON-serialized object describing the message to be sent" />

<ApiParam name="allow_user_chats" type="Boolean" description="Pass *True* if the message can be sent to private chats with users" />

<ApiParam name="allow_bot_chats" type="Boolean" description="Pass *True* if the message can be sent to private chats with bots" />

<ApiParam name="allow_group_chats" type="Boolean" description="Pass *True* if the message can be sent to group and supergroup chats" />

<ApiParam name="allow_channel_chats" type="Boolean" description="Pass *True* if the message can be sent to channel chats" />

## Returns

On success, the [PreparedInlineMessage](/telegram/types/PreparedInlineMessage) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

Prepare an article message for a Mini App user to share in any private chat:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
const prepared = await bot.api.savePreparedInlineMessage({
  user_id: 123456789,
  result: {
    type: "article",
    id: "share-result-1",
    title: "Check out this article",
    input_message_content: {
      message_text: "Here's an interesting article I found!",
    },
  },
  allow_user_chats: true,
  allow_group_chats: true,
});

// Pass prepared.id to the Mini App frontend
console.log("Prepared message ID:", prepared.id);
console.log("Expires at:", new Date(prepared.expiration_date * 1000));
```

Prepare a photo message restricted to private chats only:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
const prepared = await bot.api.savePreparedInlineMessage({
  user_id: 123456789,
  result: {
    type: "photo",
    id: "photo-result-1",
    photo_url: "https://example.com/promo.jpg",
    thumbnail_url: "https://example.com/promo_thumb.jpg",
    caption: "Our latest promotion!",
  },
  allow_user_chats: true,
  // allow_group_chats and allow_channel_chats omitted = not allowed
});
```

Prepare a message in a Mini App endpoint and handle expiration:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// In an HTTP endpoint called from the Mini App
async function prepareMiniAppMessage(userId: number, content: string) {
  const prepared = await bot.api.savePreparedInlineMessage({
    user_id: userId,
    result: {
      type: "article",
      id: `msg-${Date.now()}`,
      title: "Share this",
      input_message_content: {
        message_text: content,
      },
    },
    allow_user_chats: true,
    allow_group_chats: true,
    allow_channel_chats: true,
  });

  return {
    id: prepared.id,
    expiresAt: prepared.expiration_date, // Unix timestamp — valid for ~10 minutes
  };
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: user not found` | `user_id` doesn't correspond to a known Telegram user or has never interacted with the bot |
| 400 | `Bad Request: RESULT_TYPE_INVALID` | `result.type` is not a valid `InlineQueryResult` type |
| 400 | `Bad Request: inline message is too long` | Message content in `input_message_content` exceeds length limits |
| 400 | `Bad Request: no chat type allowed` | At least one of `allow_user_chats`, `allow_bot_chats`, `allow_group_chats`, `allow_channel_chats` must be `true` |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — they cannot use prepared messages from this bot |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **At least one chat type must be allowed.** If all four `allow_*` flags are omitted or `false`, the API returns an error. Always set at least one target chat type.
- **Prepared messages expire in ~10 minutes.** The `expiration_date` field is a Unix timestamp. Pass the prepared message `id` to your Mini App frontend immediately and use it before expiry.
- **The `id` is passed to the Mini App, not `invite_link`.** Your Mini App frontend calls `Telegram.WebApp.switchInlineQuery` or uses the prepared message `id` directly to trigger the share dialog.
- **`result` must be a valid `InlineQueryResult`.** Use the same result types as in [`answerInlineQuery`](/telegram/methods/answerInlineQuery) — `article`, `photo`, `video`, `audio`, `document`, `sticker`, etc.
- **Only the specified `user_id` can use the prepared message.** Another user trying to send the same prepared `id` will fail — the message is tied to one user.
- **`allow_channel_chats` requires the user to be an admin.** If the user is not a channel admin, the channel won't appear in their share dialog even with this flag set.

## See Also

- [`answerInlineQuery`](/telegram/methods/answerInlineQuery) — Answer inline queries with the same `InlineQueryResult` types
- [`PreparedInlineMessage`](/telegram/types/PreparedInlineMessage) — The returned object with `id` and `expiration_date`
- [`InlineQueryResult`](/telegram/types/InlineQueryResult) — Union type for all inline result variants
- [`InlineQueryResultArticle`](/telegram/types/InlineQueryResultArticle) — Most common result type for text content
