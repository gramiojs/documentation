---
title: editStory — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: editStory Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: editStory, telegram bot api, gramio editStory, editStory typescript, editStory example
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

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
