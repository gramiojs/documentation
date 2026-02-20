---
title: deleteChatPhoto — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Delete a chat photo in groups, supergroups, and channels using GramIO. TypeScript examples for bot admins. Requires can_change_info right. Private chats not supported.
  - - meta
    - name: keywords
      content: deleteChatPhoto, telegram bot api, delete chat photo telegram, remove group photo telegram bot, gramio deleteChatPhoto, telegram channel photo remove, can_change_info, chat_id, delete telegram group avatar, how to remove telegram chat photo bot
---

# deleteChatPhoto

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#deletechatphoto" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete a chat photo by numeric ID
await bot.api.deleteChatPhoto({
  chat_id: -1001234567890,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete a channel photo by username
await bot.api.deleteChatPhoto({
  chat_id: "@mychannel",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Admin command to remove the current chat photo
bot.command("removephoto", async (ctx) => {
  await bot.api.deleteChatPhoto({ chat_id: ctx.chatId });
  await ctx.send("Chat photo has been removed.");
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot cannot access this chat |
| 400 | `Bad Request: CHAT_NOT_MODIFIED` | The chat already has no photo — nothing to delete |
| 400 | `Bad Request: can't change chat photo for private chats` | This method only works in groups, supergroups, and channels |
| 403 | `Forbidden: not enough rights` | Bot is not an admin or lacks the `can_change_info` administrator right |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot has no access to the specified channel |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Private chats are not supported.** This method only applies to groups, supergroups, and channels. There is no API method to remove a photo from a private (DM) chat.
- **Bot must be admin with `can_change_info`.** The bot needs to be a chat administrator and have the `can_change_info` right specifically — general admin status alone is not enough if this right is absent.
- **Accepts `@username` for public chats.** For public channels and supergroups you can pass `@channelusername` instead of the numeric ID — useful for bots that manage well-known channels.
- **No need to delete before updating.** If you want to replace the photo, just call `setChatPhoto` directly — it overwrites the current photo without requiring a deletion first.

## See Also

- [setChatPhoto](/telegram/methods/setChatPhoto) — upload a new chat photo
- [getChat](/telegram/methods/getChat) — get chat details including current photo
