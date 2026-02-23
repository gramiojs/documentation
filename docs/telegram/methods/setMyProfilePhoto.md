---
title: setMyProfilePhoto — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Set your Telegram bot's profile photo using GramIO. Upload static JPG images or animated MPEG4 videos as bot avatars. TypeScript examples and parameter reference.
  - - meta
    - name: keywords
      content: setMyProfilePhoto, telegram bot api, telegram bot profile photo, gramio setMyProfilePhoto, set bot avatar, upload bot photo, setMyProfilePhoto typescript, setMyProfilePhoto example, InputProfilePhoto, InputProfilePhotoStatic, InputProfilePhotoAnimated, how to set telegram bot profile picture
---

# setMyProfilePhoto

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge multipart" href="/files/media-upload">📎 Accepts files</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setmyprofilephoto" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Changes the profile photo of the bot. Returns *True* on success.

## Parameters

<ApiParam name="photo" type="InputProfilePhoto" required description="The new profile photo to set" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Set a static profile photo from a local file
await bot.api.setMyProfilePhoto({
  photo: {
    type: "static",
    photo: await MediaUpload.path("./avatar.jpg"),
  },
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Set an animated profile photo (MPEG4, up to 5s, 640×640)
await bot.api.setMyProfilePhoto({
  photo: {
    type: "animated",
    animation: await MediaUpload.path("./avatar.mp4"),
    main_frame_timestamp: 0,
  },
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Set a static photo from a URL
await bot.api.setMyProfilePhoto({
  photo: {
    type: "static",
    photo: await MediaUpload.url("https://example.com/avatar.jpg"),
  },
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: PHOTO_INVALID_DIMENSIONS` | Image dimensions are too large or the aspect ratio is not supported |
| 400 | `Bad Request: wrong file identifier/HTTP URL specified` | The URL is not accessible by Telegram's servers, or the file_id is invalid |
| 400 | `Bad Request: failed to get HTTP URL content` | Telegram could not download the file from the provided URL — check the URL is publicly accessible |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Profile photos cannot be reused by file_id.** Unlike regular media, profile photos must always be uploaded as new files — you cannot pass an existing `file_id`. Use `MediaUpload.path()` or `MediaUpload.url()`.
- **Two types: `static` and `animated`.** `static` accepts a `.jpg` image; `animated` accepts an MPEG4 video (up to 5 seconds, 640×640 pixels, 30fps recommended). Set the `type` field accordingly.
- **`main_frame_timestamp` for animated photos.** When uploading an animated photo, set `main_frame_timestamp` to the second (as a float) that should be used as the static thumbnail. Defaults to `0`.
- **Use `removeMyProfilePhoto` to delete the current photo.** To revert to the default Telegram avatar, call [removeMyProfilePhoto](/telegram/methods/removeMyProfilePhoto) instead.
- **File uploads are async.** `MediaUpload.path()` and `MediaUpload.url()` return Promises — always `await` them before passing to the API call.

## See Also

- [removeMyProfilePhoto](/telegram/methods/removeMyProfilePhoto) — remove the bot's profile photo
- [InputProfilePhoto](/telegram/types/InputProfilePhoto) — union type for static and animated profile photos
- [InputProfilePhotoStatic](/telegram/types/InputProfilePhotoStatic) — static JPG photo type
- [InputProfilePhotoAnimated](/telegram/types/InputProfilePhotoAnimated) — animated MPEG4 photo type
- [Media Upload guide](/files/media-upload) — how to upload files with GramIO
