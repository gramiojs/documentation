---
title: unpinAllForumTopicMessages — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: unpinAllForumTopicMessages Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: unpinAllForumTopicMessages, telegram bot api, gramio unpinAllForumTopicMessages, unpinAllForumTopicMessages typescript, unpinAllForumTopicMessages example
---

# unpinAllForumTopicMessages

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#unpinallforumtopicmessages" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to clear the list of pinned messages in a forum topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the _can\_pin\_messages_ administrator right in the supergroup. Returns _True_ on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

<ApiParam name="message_thread_id" type="Integer" required description="Unique identifier for the target message thread of the forum topic" />

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
