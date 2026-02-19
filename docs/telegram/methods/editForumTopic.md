---
title: editForumTopic — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: editForumTopic Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: editForumTopic, telegram bot api, gramio editForumTopic, editForumTopic typescript, editForumTopic example
---

# editForumTopic

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editforumtopic" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit name and icon of a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the _can\_manage\_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

<ApiParam name="message_thread_id" type="Integer" required description="Unique identifier for the target message thread of the forum topic" />

<ApiParam name="name" type="String" required description="New topic name, 0-128 characters. If not specified or empty, the current name of the topic will be kept" />

<ApiParam name="icon_custom_emoji_id" type="String" required description="New unique identifier of the custom emoji shown as the topic icon. Use [getForumTopicIconStickers](https://core.telegram.org/bots/api#getforumtopiciconstickers) to get all allowed custom emoji identifiers. Pass an empty string to remove the icon. If not specified, the current icon will be kept" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
