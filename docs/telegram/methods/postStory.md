---
title: postStory — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: postStory Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: postStory, telegram bot api, gramio postStory, postStory typescript, postStory example
---

# postStory

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Story">Story</a></span>
  <span class="api-badge multipart">📎 Accepts files</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#poststory" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Posts a story on behalf of a managed business account. Requires the *can\_manage\_stories* business bot right. Returns [Story](https://core.telegram.org/bots/api#story) on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="content" type="InputStoryContent" required description="Content of the story" />

<ApiParam name="active_period" type="Integer" required description="Period after which the story is moved to the archive, in seconds; must be one of `6 * 3600`, `12 * 3600`, `86400`, or `2 * 86400`" :enumValues='[21600,43200,86400,172800]' />

<ApiParam name="caption" type="String" description="Caption of the story, 0-2048 characters after entities parsing" :minLen="0" :maxLen="2048" />

<ApiParam name="parse_mode" type="String" description="Mode for parsing entities in the story caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="caption_entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in the caption, which can be specified instead of *parse\_mode*" />

<ApiParam name="areas" type="StoryArea[]" description="A JSON-serialized list of clickable areas to be shown on the story" />

<ApiParam name="post_to_chat_page" type="Boolean" description="Pass *True* to keep the story accessible after it expires" />

<ApiParam name="protect_content" type="Boolean" description="Pass *True* if the content of the story must be protected from forwarding and screenshotting" />

## Returns

On success, the [Story](/telegram/types/Story) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
