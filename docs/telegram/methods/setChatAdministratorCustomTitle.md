---
title: setChatAdministratorCustomTitle — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: setChatAdministratorCustomTitle Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: setChatAdministratorCustomTitle, telegram bot api, gramio setChatAdministratorCustomTitle, setChatAdministratorCustomTitle typescript, setChatAdministratorCustomTitle example
---

# setChatAdministratorCustomTitle

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setchatadministratorcustomtitle" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="custom_title" type="String" required description="New custom title for the administrator; 0-16 characters, emoji are not allowed" :minLen="0" :maxLen="16" />

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
