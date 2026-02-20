---
title: deleteChatStickerSet — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Delete a group sticker set from a Telegram supergroup using GramIO. TypeScript examples for bot admins. Check can_set_sticker_set before calling. Supergroups only.
  - - meta
    - name: keywords
      content: deleteChatStickerSet, telegram bot api, delete group sticker set, remove supergroup sticker set, gramio deleteChatStickerSet, telegram sticker set management, can_set_sticker_set, setChatStickerSet, supergroup stickers typescript, telegram bot sticker admin
---

# deleteChatStickerSet

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#deletechatstickerset" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field _can\_set\_sticker\_set_ optionally returned in [getChat](https://core.telegram.org/bots/api#getchat) requests to check if the bot can use this method. Returns _True_ on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove the sticker set from a supergroup by numeric ID
await bot.api.deleteChatStickerSet({
  chat_id: -1001234567890,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove the sticker set from a supergroup by username
await bot.api.deleteChatStickerSet({
  chat_id: "@mysupergroup",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Admin command to remove the group sticker set
bot.command("removestickers", async (ctx) => {
  await bot.api.deleteChatStickerSet({ chat_id: ctx.chatId });
  await ctx.send("Group sticker set has been removed.");
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or inaccessible |
| 400 | `Bad Request: CHAT_NOT_MODIFIED` | The supergroup has no sticker set to remove |
| 400 | `Bad Request: method is available for supergroup chats only` | This method only works for supergroups — not regular groups or channels |
| 403 | `Forbidden: not enough rights` | Bot is not an admin or lacks the right to manage sticker sets |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Supergroups only — not regular groups or channels.** This method is restricted to supergroups. Calling it on a basic group or channel will fail.
- **Check `can_set_sticker_set` from `getChat` first.** The `Chat` object returned by `getChat` has an optional `can_set_sticker_set` boolean. If it's `false` or absent, the bot cannot manage the sticker set in that chat.
- **No need to delete before setting a new sticker set.** Calling `setChatStickerSet` directly replaces the current sticker set — you don't need to call `deleteChatStickerSet` beforehand.
- **Bot must be admin with `can_change_info`.** The appropriate administrator right for managing sticker sets falls under `can_change_info`.

## See Also

- [setChatStickerSet](/telegram/methods/setChatStickerSet) — assign a sticker set to a supergroup
- [getChat](/telegram/methods/getChat) — check `can_set_sticker_set` before calling
