---
title: postStory — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Post a story on behalf of a managed business account using GramIO and TypeScript. Learn active_period, InputStoryContent, StoryArea, captions, and business bot rights.
  - - meta
    - name: keywords
      content: postStory, telegram bot api, gramio postStory, postStory typescript, postStory example, post story business, InputStoryContent, StoryArea, active_period, can_manage_stories, business connection story
---

# postStory

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Story">Story</a></span>
  <a class="api-badge multipart" href="/files/media-upload">📎 Accepts files</a>
  <a class="api-badge formattable" href="/formatting">✏️ Formattable text</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#poststory" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Posts a story on behalf of a managed business account. Requires the *can\_manage\_stories* business bot right. Returns [Story](https://core.telegram.org/bots/api#story) on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="content" type="InputStoryContent" required description="Content of the story" />

<ApiParam name="active_period" type="Integer" required description="Period after which the story is moved to the archive, in seconds; must be one of `6 * 3600`, `12 * 3600`, `86400`, or `2 * 86400`" :enumValues='[21600,43200,86400,172800]' />

<ApiParam name="caption" type="String" description="Caption of the story, 0-2048 characters after entities parsing" :minLen="0" :maxLen="2048" semanticType="formattable" docsLink="/formatting" />

<ApiParam name="parse_mode" type="String" description="Mode for parsing entities in the story caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="areas" type="StoryArea[]" description="A JSON-serialized list of clickable areas to be shown on the story" />

<ApiParam name="post_to_chat_page" type="Boolean" description="Pass *True* to keep the story accessible after it expires" />

<ApiParam name="protect_content" type="Boolean" description="Pass *True* if the content of the story must be protected from forwarding and screenshotting" />

## Returns

On success, the [Story](/telegram/types/Story) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

Post a photo story from a URL on behalf of a business account:

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
bot.on("business_message", async (ctx) => {
  const story = await bot.api.postStory({
    business_connection_id: ctx.businessConnectionId,
    content: {
      type: "photo",
      photo: await MediaUpload.url("https://example.com/photo.jpg"),
    },
    active_period: 86400, // 24 hours
    caption: "Check out our latest offer!",
  });

  console.log("Story posted:", story.id);
});
```

Post a video story with a caption using rich text formatting:

```ts twoslash
import { Bot, format, bold, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
async function postVideoStory(businessConnectionId: string, videoPath: string) {
  const story = await bot.api.postStory({
    business_connection_id: businessConnectionId,
    content: {
      type: "video",
      video: await MediaUpload.path(videoPath),
    },
    active_period: 21600, // 6 hours
    caption: format`${bold("Flash Sale")} — 20% off everything today!`,
    post_to_chat_page: true, // Keep accessible after expiry
  });

  return story;
}
```

Post a photo story that is permanent and protected from forwarding:

```ts twoslash
import { Bot, MediaUpload } from "gramio";

const bot = new Bot("");
// ---cut---
async function postProtectedStory(businessConnectionId: string) {
  return bot.api.postStory({
    business_connection_id: businessConnectionId,
    content: {
      type: "photo",
      photo: await MediaUpload.url("https://example.com/banner.jpg"),
    },
    active_period: 172800, // 48 hours
    protect_content: true,
    post_to_chat_page: true,
  });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: business connection not found` | The `business_connection_id` is invalid or the connection no longer exists. |
| 400 | `Bad Request: not enough rights` | The business bot connection does not have the `can_manage_stories` right. Grant this right in BotFather's business bot settings. |
| 400 | `Bad Request: STORY_PERIOD_INVALID` | The `active_period` value is not one of the four allowed values: 21600, 43200, 86400, or 172800. |
| 400 | `Bad Request: story content invalid` | The `content` object is malformed or the file could not be uploaded/processed. |
| 400 | `Bad Request: caption too long` | The `caption` exceeds 2048 characters. |
| 403 | `Forbidden: not enough rights` | The bot is not authorized to manage stories for this business account. |
| 429 | `Too Many Requests: retry after N` | Flood control triggered. Wait `N` seconds before retrying. |

## Tips & Gotchas

- **`active_period` has only four allowed values.** You must pass exactly `21600` (6 h), `43200` (12 h), `86400` (24 h), or `172800` (48 h). Any other integer will result in a 400 error. Use the literal numbers or named constants to avoid mistakes.
- **`can_manage_stories` right is mandatory.** This business bot right must be enabled in the business connection settings; it is separate from general message rights. Check with `getBusinessConnection` first if you are unsure.
- **File uploads require `await`.** Both `MediaUpload.url()` and `MediaUpload.path()` are async — always `await` them before embedding in the `content` object. `MediaUpload.buffer()` is synchronous if you already have the binary data.
- **`post_to_chat_page` vs. `protect_content`.** `post_to_chat_page: true` makes the story persist on the account's chat page even after the `active_period` expires. `protect_content: true` prevents viewers from forwarding or saving the media — they are independent flags and can be combined.
- **Do not use `parse_mode` together with `caption_entities`.** These are mutually exclusive. Pass one or the other: `format` tagged template (which returns entities) or a `parse_mode` string — never both.
- **Stories are tied to a business connection.** Unlike regular bot messages, stories posted via `postStory` appear on the business account's profile, not the bot's own profile.

## See Also

- [editStory](/telegram/methods/editStory) — Edit the caption or content of a posted story
- [deleteStory](/telegram/methods/deleteStory) — Remove a story from the business account
- [repostStory](/telegram/methods/repostStory) — Repost a story to another managed business account
- [getBusinessConnection](/telegram/methods/getBusinessConnection) — Inspect business connection rights before posting
- [Story](/telegram/types/Story) — The Story object returned on success
- [InputStoryContent](/telegram/types/InputStoryContent) — Describes the photo or video content of a story
- [StoryArea](/telegram/types/StoryArea) — Clickable interactive areas overlaid on the story
- [formatting](/formatting) — Rich text formatting with the `format` tag
