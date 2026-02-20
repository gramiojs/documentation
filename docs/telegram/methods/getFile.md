---
title: getFile — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Download files from Telegram using GramIO. TypeScript reference for getFile — build download URLs, handle the 20 MB cloud limit, and integrate with GramIO's file download helpers.
  - - meta
    - name: keywords
      content: getFile, telegram bot api, gramio getFile, telegram download file bot, getFile typescript, telegram file download, file_id, file_path, download file telegram bot, how to download file telegram bot, getFile example, TelegramFile, file size limit telegram
---

# getFile

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getfile" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a [File](https://core.telegram.org/bots/api#file) object is returned. The file can then be downloaded via the link `https://api.telegram.org/file/bot<token>/<file_path>`, where `<file_path>` is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling [getFile](https://core.telegram.org/bots/api#getfile) again.

## Parameters

<ApiParam name="file_id" type="String" required description="File identifier to get information about" />

## Returns

On success, String is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get file info and build the download URL
const file = await bot.api.getFile({ file_id: "AgACAgIAAxk..." });

if (file.file_path) {
  const token = process.env.BOT_TOKEN ?? "";
  const downloadUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
  console.log("Download URL:", downloadUrl);
  // URL is valid for at least 1 hour
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Retrieve file info inside a message handler
bot.on("message", async (ctx) => {
  const document = ctx.payload.document;
  if (!document) return;

  const file = await bot.api.getFile({ file_id: document.file_id });
  await ctx.reply(
    `File ready — ${file.file_size ?? 0} bytes\nPath: ${file.file_path}`
  );
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Renew an expired download link by calling getFile again with the same file_id
async function refreshDownloadUrl(fileId: string, token: string) {
  const file = await bot.api.getFile({ file_id: fileId });
  if (!file.file_path) throw new Error("File not available");
  return `https://api.telegram.org/file/bot${token}/${file.file_path}`;
}
```

See also [GramIO file download helpers](/files/download) for a higher-level API.

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: wrong file identifier/HTTP URL specified` | `file_id` is invalid, malformed, or belongs to a different bot — double-check the source |
| 400 | `Bad Request: file is too big` | File exceeds the 20 MB cloud API limit — use a [local Bot API server](https://core.telegram.org/bots/api#using-a-local-bot-api-server) for larger files |
| 400 | `Bad Request: file_id not found` | The file no longer exists on Telegram servers (some files expire) |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **20 MB cloud limit.** The Telegram cloud API only serves files up to 20 MB. For larger files (up to 2 GB), run a [local Bot API server](https://core.telegram.org/bots/api#using-a-local-bot-api-server) — the local server returns the absolute path on disk instead of a download URL.
- **`file_id` vs `file_unique_id`.** Always pass `file_id` to `getFile`. The `file_unique_id` field cannot be used to download or reuse files — it only identifies the underlying file across different bots.
- **Download URL expires after ~1 hour.** Cache the URL only for short-lived tasks. For persistent access, store the `file_id` and call `getFile` again to refresh the URL.
- **`file_path` can be absent.** The field is optional — check before building the URL. It is absent if the file is too large or currently unavailable.
- **Token in URL is sensitive.** The download URL contains your bot token. Never expose it to end users directly — proxy downloads through your server if needed.

## See Also

- [File](/telegram/types/File) — return type of `getFile`
- [GramIO file download guide](/files/download) — higher-level download helpers
- [GramIO file upload guide](/files/media-upload) — `MediaUpload` for sending files
