---
title: getFile — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: getFile Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: getFile, telegram bot api, gramio getFile, getFile typescript, getFile example
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

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
