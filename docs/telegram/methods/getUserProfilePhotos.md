---
title: getUserProfilePhotos — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Get a list of profile photos for any Telegram user using GramIO and TypeScript. Paginate results with offset and limit. Complete parameter reference and examples.
  - - meta
    - name: keywords
      content: getUserProfilePhotos, telegram bot api, gramio getUserProfilePhotos, getUserProfilePhotos typescript, getUserProfilePhotos example, telegram profile photos, UserProfilePhotos, user_id, telegram bot get user photo, how to get user profile photo telegram, telegram avatar
---

# getUserProfilePhotos

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/UserProfilePhotos">UserProfilePhotos</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getuserprofilephotos" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get a list of profile pictures for a user. Returns a [UserProfilePhotos](https://core.telegram.org/bots/api#userprofilephotos) object.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="offset" type="Integer" description="Sequential number of the first photo to be returned. By default, all photos are returned." />

<ApiParam name="limit" type="Integer" description="Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100." :min="1" :max="100" :defaultValue="100" />

## Returns

On success, the [UserProfilePhotos](/telegram/types/UserProfilePhotos) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get all profile photos for a user:
const result = await bot.api.getUserProfilePhotos({
  user_id: 12345678,
});

console.log(`User has ${result.total_count} profile photo(s)`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Check if a user has a profile photo in a message handler:
bot.command("photo", async (ctx) => {
  if (!ctx.from) return;

  const result = await bot.api.getUserProfilePhotos({
    user_id: ctx.from.id,
    limit: 1,
  });

  if (result.total_count === 0) {
    return ctx.send("You don't have a profile photo set.");
  }

  // result.photos[0] is an array of PhotoSize objects (different sizes of the same photo)
  const largestSize = result.photos[0][result.photos[0].length - 1];
  await ctx.send(`Your latest profile photo file_id: ${largestSize.file_id}`);
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Paginate through profile photos in batches:
const page1 = await bot.api.getUserProfilePhotos({
  user_id: 12345678,
  offset: 0,
  limit: 10,
});

console.log(`Showing 1–${page1.photos.length} of ${page1.total_count} photos`);

// Fetch next batch if more exist:
if (page1.total_count > 10) {
  const page2 = await bot.api.getUserProfilePhotos({
    user_id: 12345678,
    offset: 10,
    limit: 10,
  });
  console.log("Next page count:", page2.photos.length);
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: user not found` | The `user_id` doesn't correspond to a known Telegram user — user must have started the bot or share a common chat |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after` and back off |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Each entry in `photos` is an array of `PhotoSize`.** A single profile photo is provided in multiple resolutions. The last element in each inner array is always the largest — use `result.photos[0][result.photos[0].length - 1]` to get the full-size version.
- **`total_count` reflects all available photos, not just the current page.** Use it alongside `offset` and `limit` to implement pagination: fetch the next page when `offset + limit < total_count`.
- **Photos are returned newest-first.** `offset: 0` gives the most recently set profile picture.
- **Requires the user to be accessible.** A "user not found" error is returned if the user has never interacted with the bot and shares no common group — this is common for bots that try to look up arbitrary user IDs.
- **Privacy settings may restrict results.** Telegram users can restrict who can see their profile photos. The method may return fewer photos than `total_count` suggests if privacy settings apply.
- **`file_id` from this method can be reused.** Once you have a `file_id`, you can use it with `sendPhoto` or other send methods without re-downloading the file.

## See Also

- [UserProfilePhotos](/telegram/types/UserProfilePhotos) — return type with `total_count` and `photos` array (array of `PhotoSize[]`)
- [getUserProfileAudios](/telegram/methods/getUserProfileAudios) — analogous method for profile audio files
- [getMe](/telegram/methods/getMe) — get the bot's own profile information
