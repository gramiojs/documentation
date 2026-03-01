---
title: setChatMemberTag — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: setChatMemberTag Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: setChatMemberTag, telegram bot api, gramio setChatMemberTag, setChatMemberTag typescript, setChatMemberTag example
---

# setChatMemberTag

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setchatmembertag" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to set a tag for a regular member in a group or a supergroup. The bot must be an administrator in the chat for this to work and must have the *can\_manage\_tags* administrator right. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="tag" type="String" description="New tag for the member; 0-16 characters, emoji are not allowed" :minLen="0" :maxLen="16" />

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
