---
title: createForumTopic — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: createForumTopic Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: createForumTopic, telegram bot api, gramio createForumTopic, createForumTopic typescript, createForumTopic example
---

# createForumTopic

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/ForumTopic">ForumTopic</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#createforumtopic" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to create a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the _can\_manage\_topics_ administrator right. Returns information about the created topic as a [ForumTopic](https://core.telegram.org/bots/api#forumtopic) object.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

<ApiParam name="name" type="String" required description="Topic name, 1-128 characters" />

<ApiParam name="icon_color" type="Integer" required description="Color of the topic icon in RGB format. Currently, must be one of 7322096 (0x6FB9F0), 16766590 (0xFFD67E), 13338331 (0xCB86DB), 9367192 (0x8EEE98), 16749490 (0xFF93B2), or 16478047 (0xFB6F5F)" />

<ApiParam name="icon_custom_emoji_id" type="String" required description="Unique identifier of the custom emoji shown as the topic icon. Use [getForumTopicIconStickers](https://core.telegram.org/bots/api#getforumtopiciconstickers) to get all allowed custom emoji identifiers." />

## Returns

On success, the [ForumTopic](/telegram/types/ForumTopic) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
