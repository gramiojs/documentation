---
title: removeMyProfilePhoto — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Remove the bot's profile photo using GramIO. TypeScript examples, error reference, and tips for managing bot profile photos in Telegram with setMyProfilePhoto.
  - - meta
    - name: keywords
      content: removeMyProfilePhoto, telegram bot api, telegram bot remove profile photo, gramio removeMyProfilePhoto, removeMyProfilePhoto typescript, removeMyProfilePhoto example, delete bot profile picture, bot avatar telegram, setMyProfilePhoto, how to remove bot profile photo
---

# removeMyProfilePhoto

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#removemyprofilephoto" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Removes the profile photo of the bot. Requires no parameters. Returns *True* on success.

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove the bot's profile photo (no parameters needed)
await bot.api.removeMyProfilePhoto();
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove the profile photo in a command handler
bot.command("resetphoto", async (ctx) => {
  await bot.api.removeMyProfilePhoto();
  await ctx.reply("Bot profile photo removed.");
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Pair with setMyProfilePhoto to rotate/update the bot avatar
bot.command("clearphoto", async (ctx) => {
  try {
    await bot.api.removeMyProfilePhoto();
    await ctx.reply("Profile photo cleared successfully.");
  } catch {
    await ctx.reply("Failed to remove profile photo — it may already be unset.");
  }
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: PHOTO_INVALID` | The bot does not currently have a profile photo set — safe to ignore |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after` and use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **No parameters required.** `removeMyProfilePhoto()` takes no arguments — just call it directly.
- **Idempotent in practice but may throw.** If the bot has no profile photo, the API may return an error rather than silently succeeding. Wrap the call in a `try/catch` if the state is uncertain.
- **Pair with `setMyProfilePhoto`.** Use `setMyProfilePhoto` to upload a new photo, then `removeMyProfilePhoto` to reset it. Together they give you full lifecycle control over the bot's avatar.
- **Changes are visible immediately.** After a successful call, Telegram updates the bot's avatar everywhere without any delay.

## See Also

- [`setMyProfilePhoto`](/telegram/methods/setMyProfilePhoto) — upload a new profile photo for the bot
- [`getUserProfilePhotos`](/telegram/methods/getUserProfilePhotos) — retrieve a user's profile photos
