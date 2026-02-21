---
title: getUserProfileAudios — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Retrieve profile audios for a Telegram user using GramIO and TypeScript. Paginate results with offset and limit. Complete parameter reference and usage examples.
  - - meta
    - name: keywords
      content: getUserProfileAudios, telegram bot api, gramio getUserProfileAudios, getUserProfileAudios typescript, getUserProfileAudios example, telegram profile audio, UserProfileAudios, user_id, telegram bot get audio, how to get user profile audio telegram
---

# getUserProfileAudios

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/UserProfileAudios">UserProfileAudios</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getuserprofileaudios" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get a list of profile audios for a user. Returns a [UserProfileAudios](https://core.telegram.org/bots/api#userprofileaudios) object.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="offset" type="Integer" description="Sequential number of the first audio to be returned. By default, all audios are returned." />

<ApiParam name="limit" type="Integer" description="Limits the number of audios to be retrieved. Values between 1-100 are accepted. Defaults to 100." :min="1" :max="100" :defaultValue="100" />

## Returns

On success, the [UserProfileAudios](/telegram/types/UserProfileAudios) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get all profile audios for a user:
const result = await bot.api.getUserProfileAudios({
  user_id: 12345678,
});

console.log(`User has ${result.total_count} profile audio(s)`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Check if a user has set a profile audio in a message handler:
bot.command("audio", async (ctx) => {
  if (!ctx.from) return;

  const result = await bot.api.getUserProfileAudios({
    user_id: ctx.from.id,
    limit: 1,
  });

  if (result.total_count === 0) {
    return ctx.send("You haven't set a profile audio yet.");
  }

  await ctx.send(`You have ${result.total_count} profile audio(s).`);
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Paginate through profile audios in batches of 10:
const page1 = await bot.api.getUserProfileAudios({
  user_id: 12345678,
  offset: 0,
  limit: 10,
});

// Fetch next page if more audios exist:
if (page1.total_count > 10) {
  const page2 = await bot.api.getUserProfileAudios({
    user_id: 12345678,
    offset: 10,
    limit: 10,
  });
  console.log("Second page audio count:", page2.audios.length);
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: user not found` | The `user_id` doesn't correspond to a known Telegram user |
| 400 | `Bad Request: chat not found` | User is inaccessible (never interacted with the bot and no shared chat) |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after` and back off |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Not all users have profile audios.** Profile audio is a Telegram Premium feature — `total_count` will be `0` for users who haven't set one. Always check before processing.
- **`offset` is an integer (sequential position).** Unlike `getUserGifts`, pagination here uses a numeric offset — pass `0` for the first audio, `10` for the eleventh, etc.
- **`total_count` reflects all available audios, not just the current page.** Use it to calculate whether more pages exist (`total_count > offset + limit`).
- **Requires the user to have interacted with the bot** or share a mutual chat — otherwise Telegram may return a "user not found" error.
- **Added as part of the profile audio feature.** This method mirrors `getUserProfilePhotos` in structure but for audio files set as profile backgrounds.

## See Also

- [UserProfileAudios](/telegram/types/UserProfileAudios) — return type with `total_count` and `audios` array
- [getUserProfilePhotos](/telegram/methods/getUserProfilePhotos) — analogous method for profile photos
