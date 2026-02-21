---
title: setChatPhoto — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Set a new profile photo for a group, supergroup, or channel using GramIO. TypeScript examples for file upload, error table, and tips on supported formats and permissions.
  - - meta
    - name: keywords
      content: setChatPhoto, telegram bot api, set chat photo telegram, change group photo, upload chat photo telegram bot, gramio setChatPhoto, setChatPhoto typescript, setChatPhoto example, InputFile, MediaUpload, telegram group avatar, how to set chat photo telegram bot
---

# setChatPhoto

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <span class="api-badge multipart">📎 Accepts files</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setchatphoto" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="photo" type="InputFile" required description="New chat photo, uploaded using multipart/form-data" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Upload a new chat photo from the local filesystem
await bot.api.setChatPhoto({
  chat_id: -1001234567890,
  photo: await MediaUpload.path("./new-chat-photo.jpg"),
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Upload a chat photo from a URL
await bot.api.setChatPhoto({
  chat_id: "@mychannel",
  photo: await MediaUpload.url("https://example.com/logo.png"),
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Upload a chat photo from a Buffer
async function setPhotoFromBuffer(chatId: number, imageBuffer: Buffer) {
  await bot.api.setChatPhoto({
    chat_id: chatId,
    photo: MediaUpload.buffer(imageBuffer, "chat-photo.jpg"),
  });
}
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// From a message context — set the current chat's photo
bot.command("setphoto", async (ctx) => {
  await ctx.setChatPhoto(await MediaUpload.path("./branding/logo.jpg"));
  await ctx.send("Chat photo updated!");
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` |
| 400 | `Bad Request: PHOTO_INVALID_DIMENSIONS` | Image dimensions are too large or unsupported |
| 400 | `Bad Request: can't change chat photo of private chats` | `chat_id` is a private user chat — photos can only be set on groups, supergroups, and channels |
| 400 | `Bad Request: wrong file identifier/HTTP URL specified` | Tried to pass a `file_id` or non-downloadable URL — only direct file uploads are accepted |
| 403 | `Forbidden: not enough rights to change chat photo` | Bot lacks the `can_change_info` admin right |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot was removed from the channel |

## Tips & Gotchas

- **Only fresh file uploads are accepted.** Unlike `sendPhoto`, you cannot reuse a `file_id` — the `photo` parameter must always be an uploaded file (`MediaUpload.path`, `MediaUpload.url`, or `MediaUpload.buffer`). Using a `file_id` string will return `wrong file identifier`.
- **Private chats are not supported.** The method explicitly fails on private (user-to-bot) chats. It works on groups, supergroups, and channels only.
- **`can_change_info` right is required.** Ensure the bot's admin role grants this right, otherwise you'll receive `403 not enough rights`.
- **`MediaUpload.path` and `MediaUpload.url` are async — always `await` them.** `MediaUpload.buffer(buf, filename)` is synchronous.
- **Use `deleteChatPhoto` to remove the photo.** There's no "clear" option in `setChatPhoto`; use the dedicated `deleteChatPhoto` method to revert to no photo.
- **JPEG/PNG formats work best.** Telegram recommends a square image; very wide or tall images may be cropped automatically.

## See Also

- [`deleteChatPhoto`](/telegram/methods/deleteChatPhoto) — remove the current chat photo
- [`setChatTitle`](/telegram/methods/setChatTitle) — change the chat name
- [`setChatDescription`](/telegram/methods/setChatDescription) — update the chat description
- [`InputFile`](/telegram/types/InputFile) — file input type for uploads
- [Media Upload guide](/files/media-upload) — how to use `MediaUpload.path`, `MediaUpload.url`, and `MediaUpload.buffer`
