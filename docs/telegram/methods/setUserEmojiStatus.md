---
title: setUserEmojiStatus — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Set or clear a Telegram user's emoji status using GramIO. Requires prior Mini App consent via requestEmojiStatusAccess. TypeScript examples included.
  - - meta
    - name: keywords
      content: setUserEmojiStatus, telegram bot api, telegram emoji status, gramio setUserEmojiStatus, set user emoji status, custom emoji status telegram, setUserEmojiStatus typescript, setUserEmojiStatus example, emoji_status_custom_emoji_id, emoji_status_expiration_date, user_id, telegram mini app emoji status, how to set emoji status telegram bot
---

# setUserEmojiStatus

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setuseremojistatus" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method [requestEmojiStatusAccess](https://core.telegram.org/bots/webapps#initializing-mini-apps). Returns *True* on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="emoji_status_custom_emoji_id" type="String" description="Custom emoji identifier of the emoji status to set. Pass an empty string to remove the status." />

<ApiParam name="emoji_status_expiration_date" type="Integer" description="Expiration date of the emoji status, if any" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set a custom emoji status for a user (no expiry)
await bot.api.setUserEmojiStatus({
  user_id: 123456789,
  emoji_status_custom_emoji_id: "5368324170671202286",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set a temporary emoji status that expires after 24 hours
const expiresAt = Math.floor(Date.now() / 1000) + 86400; // now + 24h in Unix seconds

await bot.api.setUserEmojiStatus({
  user_id: 123456789,
  emoji_status_custom_emoji_id: "5368324170671202286",
  emoji_status_expiration_date: expiresAt,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove the emoji status entirely (pass empty string)
await bot.api.setUserEmojiStatus({
  user_id: 123456789,
  emoji_status_custom_emoji_id: "",
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: user not found` | The `user_id` doesn't correspond to a known user — they must have started the bot or interacted with your Mini App |
| 400 | `Bad Request: EMOJI_STATUS_NOT_ALLOWED` | The user hasn't granted emoji status access to the bot via `requestEmojiStatusAccess` — you must request permission first |
| 400 | `Bad Request: CUSTOM_EMOJI_INVALID` | The `emoji_status_custom_emoji_id` is not a valid custom emoji ID |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **User must grant permission first.** Before calling this method, the user must have explicitly allowed emoji status management via the `requestEmojiStatusAccess` Mini App method. Calling without permission returns an error.
- **This is a Mini App feature.** `setUserEmojiStatus` is designed for Telegram Mini Apps (Web Apps) — the typical flow is: user opens your Mini App → Mini App calls `requestEmojiStatusAccess` → user consents → your bot can now set their status.
- **Empty string removes the status.** Passing `emoji_status_custom_emoji_id: ""` clears the user's current emoji status entirely rather than leaving it unchanged.
- **`emoji_status_expiration_date` is a Unix timestamp.** Use `Math.floor(Date.now() / 1000) + seconds` to compute future expiry times. If omitted, the status persists until manually changed.
- **Custom emoji IDs come from sticker sets.** The `emoji_status_custom_emoji_id` is the ID of a custom emoji from a custom emoji sticker set. You can find these IDs via `getCustomEmojiStickers`.

## See Also

- [getMe](/telegram/methods/getMe) — check the bot's own capabilities
- [getCustomEmojiStickers](/telegram/methods/getCustomEmojiStickers) — look up custom emoji details by ID
