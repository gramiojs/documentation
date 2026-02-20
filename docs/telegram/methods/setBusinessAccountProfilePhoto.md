---
title: setBusinessAccountProfilePhoto — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Change the profile photo of a managed Telegram business account using GramIO. TypeScript examples for static and animated photos, parameter reference, and error handling.
  - - meta
    - name: keywords
      content: setBusinessAccountProfilePhoto, telegram bot api, telegram business account profile photo, gramio setBusinessAccountProfilePhoto, set business profile photo typescript, business_connection_id, InputProfilePhoto, InputProfilePhotoStatic, InputProfilePhotoAnimated, is_public, can_edit_profile_photo, MediaUpload, how to set business profile photo telegram bot
---

# setBusinessAccountProfilePhoto

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <span class="api-badge multipart">📎 Accepts files</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setbusinessaccountprofilephoto" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Changes the profile photo of a managed business account. Requires the *can\_edit\_profile\_photo* business bot right. Returns *True* on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="photo" type="InputProfilePhoto" required description="The new profile photo to set" />

<ApiParam name="is_public" type="Boolean" description="Pass *True* to set the public photo, which will be visible even if the main photo is hidden by the business account's privacy settings. An account can have only one public photo." />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Set a static JPEG profile photo when a business connection is established
bot.on("business_connection", async (ctx) => {
  if (ctx.canEditProfilePhoto && ctx.isEnabled) {
    await bot.api.setBusinessAccountProfilePhoto({
      business_connection_id: ctx.id,
      photo: {
        type: "static",
        photo: await MediaUpload.path("./assets/business-avatar.jpg"),
      },
    });
  }
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Set an animated MPEG4 profile photo
bot.on("business_connection", async (ctx) => {
  if (ctx.canEditProfilePhoto && ctx.isEnabled) {
    await bot.api.setBusinessAccountProfilePhoto({
      business_connection_id: ctx.id,
      photo: {
        type: "animated",
        animation: await MediaUpload.path("./assets/business-avatar.mp4"),
        main_frame_timestamp: 0.5, // frame used as static preview (seconds)
      },
    });
  }
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Set the public photo (visible even when main photo is hidden by privacy settings)
await bot.api.setBusinessAccountProfilePhoto({
  business_connection_id: "your_business_connection_id",
  photo: {
    type: "static",
    photo: await MediaUpload.url("https://example.com/logo.jpg"),
  },
  is_public: true,
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: PHOTO_INVALID_DIMENSIONS` | Image dimensions are too large or too small — use a square image, ideally 640×640 px |
| 400 | `Bad Request: wrong file identifier/HTTP URL specified` | Photo must be uploaded as a new file; `file_id` reuse is not supported for profile photos |
| 400 | `Bad Request: BUSINESS_CONNECTION_INVALID` | The `business_connection_id` is invalid or revoked — re-fetch from the `business_connection` event |
| 403 | `Forbidden: not enough rights` | Bot lacks `can_edit_profile_photo` right — check `ctx.canEditProfilePhoto` before calling |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Profile photos cannot be reused via `file_id`.** Unlike other media, profile photos must always be uploaded as new files. Use `MediaUpload.path()`, `MediaUpload.url()`, or `MediaUpload.buffer()` — never a cached `file_id` string.
- **Static photos must be JPEG.** Telegram only accepts `.jpg`/`.jpeg` format for `InputProfilePhotoStatic`. PNG or WebP will be rejected.
- **Animated photos must be MPEG4.** Use `.mp4` files for `InputProfilePhotoAnimated`. The `main_frame_timestamp` (in seconds) determines which frame is shown as the still preview; defaults to `0.0`.
- **Only one public photo at a time.** Passing `is_public: true` replaces any existing public photo. The public photo is visible regardless of the account's privacy settings.
- **Check `canEditProfilePhoto` before calling.** The bot must have `can_edit_profile_photo` right. Verify with `ctx.canEditProfilePhoto` in `business_connection` handlers.
- **Use `removeBusinessAccountProfilePhoto` to delete.** There is no way to "unset" the photo via this method — use the dedicated remove method instead.

## See Also

- [removeBusinessAccountProfilePhoto](/telegram/methods/removeBusinessAccountProfilePhoto) — remove the current profile photo
- [setBusinessAccountName](/telegram/methods/setBusinessAccountName) — change the display name
- [setBusinessAccountBio](/telegram/methods/setBusinessAccountBio) — change the bio
- [InputProfilePhoto](/telegram/types/InputProfilePhoto) — union type for static/animated profile photos
- [InputProfilePhotoStatic](/telegram/types/InputProfilePhotoStatic) — JPEG photo type
- [InputProfilePhotoAnimated](/telegram/types/InputProfilePhotoAnimated) — MPEG4 animated photo type
- [BusinessConnection](/telegram/types/BusinessConnection) — business connection object with rights
- [File uploads guide](/files/media-upload) — how to use `MediaUpload` for file uploads
