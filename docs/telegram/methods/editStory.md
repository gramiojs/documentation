---
title: editStory — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Edit Telegram stories posted by a managed business account using GramIO. Complete editStory reference with content replacement, caption formatting, StoryArea zones, and can_manage_stories rights.
  - - meta
    - name: keywords
      content: editStory, telegram bot api, edit story telegram bot, gramio editStory, editStory typescript, editStory example, business_connection_id, story_id, InputStoryContent, StoryArea, can_manage_stories, telegram story bot, how to edit story telegram bot, edit business story, telegram business story
---

# editStory

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Story">Story</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editstory" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Edits a story previously posted by the bot on behalf of a managed business account. Requires the _can\_manage\_stories_ business bot right. Returns [Story](https://core.telegram.org/bots/api#story) on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="story_id" type="Integer" required description="Unique identifier of the story to edit" />

<ApiParam name="content" type="InputStoryContent" required description="Content of the story" />

<ApiParam name="caption" type="String" required description="Caption of the story, 0-2048 characters after entities parsing" />

<ApiParam name="parse_mode" type="String" required description="Mode for parsing entities in the story caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" required description="A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse\_mode_" />

<ApiParam name="areas" type="StoryArea[]" required description="A JSON-serialized list of clickable areas to be shown on the story" />

## Returns

On success, the [Story](/telegram/types/Story) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Replace story content with a new photo
const story = await bot.api.editStory({
  business_connection_id: "conn_abc123",
  story_id: 42,
  content: {
    type: "photo",
    photo: await MediaUpload.path("./updated-photo.jpg"),
  },
});
console.log(story.id); // story ID in the business account
```

```ts twoslash
import { Bot, format, bold, italic } from "gramio";

const bot = new Bot("");
// ---cut---
// Edit only the caption with rich formatting — entities are built automatically
await bot.api.editStory({
  business_connection_id: "conn_abc123",
  story_id: 42,
  content: {
    type: "photo",
    photo: "AgACAgIAAxkBAAIBzWQ...", // reuse existing file_id
  },
  caption: format`${bold("New caption")} — ${italic("updated today")}`,
});
```

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
// Replace story with a video
await bot.api.editStory({
  business_connection_id: "conn_abc123",
  story_id: 7,
  content: {
    type: "video",
    video: await MediaUpload.path("./promo.mp4"),
    duration: 15,
    cover_frame_timestamp: 0,
  },
  caption: "Check out our latest promo!",
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: story not found` | `story_id` doesn't exist for this business connection — verify the story is still active |
| 400 | `Bad Request: STORY_NOT_MODIFIED` | New content and caption are identical to the current story — skip the call to avoid noise |
| 400 | `Bad Request: CAPTION_TOO_LONG` | `caption` exceeds 2048 characters — stories have twice the caption limit of media messages |
| 400 | `Bad Request: can't parse entities` | Malformed HTML/Markdown — use GramIO's `format` helper to build `caption_entities` safely |
| 400 | `Bad Request: business connection not found` | Invalid or expired `business_connection_id` — check your BusinessConnection update handler |
| 403 | `Forbidden: not enough rights` | Business bot lacks the `can_manage_stories` right — verify the right is granted in business settings |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Requires `can_manage_stories` business bot right.** This must be explicitly granted in the business account settings — no other right implies it.
- **Story caption limit is 2048 characters** — double the 1024-character limit for regular media message captions. Still, keep captions concise for engagement.
- **`parse_mode` and `caption_entities` are mutually exclusive.** GramIO's `format` helper always produces `caption_entities`, so never pass `parse_mode` alongside it.
- **`content` is required — you always replace the media.** There is no way to edit just the caption without re-supplying the content. Reuse the existing `file_id` if you only need to update the caption.
- **`story_id` is scoped to the business account**, not a global Telegram ID. You'll get this ID from the `Story` object returned by `postStory` or from story-related updates.
- **Editing areas replaces all of them.** To remove all clickable zones, pass an empty `areas` array.

## See Also

- [postStory](/telegram/methods/postStory) — create a new story on behalf of a business account
- [deleteStory](/telegram/methods/deleteStory) — delete a business story
- [repostStory](/telegram/methods/repostStory) — repost another user's story
- [Story](/telegram/types/Story) — the object returned on success
- [InputStoryContent](/telegram/types/InputStoryContent) — the content union type (photo or video)
- [StoryArea](/telegram/types/StoryArea) — clickable interactive area on a story
- [Formatting guide](/formatting) — using `format`, `bold`, `italic`, and other entity helpers
- [Files & media upload](/files/media-upload) — uploading photos and videos with `MediaUpload`
