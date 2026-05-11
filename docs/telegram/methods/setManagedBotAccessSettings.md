---
title: setManagedBotAccessSettings — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: setManagedBotAccessSettings Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: setManagedBotAccessSettings, telegram bot api, gramio setManagedBotAccessSettings, setManagedBotAccessSettings typescript, setManagedBotAccessSettings example
---

# setManagedBotAccessSettings

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setmanagedbotaccesssettings" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to change the access settings of a managed bot. Returns *True* on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="User identifier of the managed bot whose access settings will be changed" />

<ApiParam name="is_access_restricted" type="Boolean" required description="Pass *True*, if only selected users can access the bot. The bot's owner can always access it." />

<ApiParam name="added_user_ids" type="Integer[]" description="A JSON-serialized list of up to 10 identifiers of users who will have access to the bot in addition to its owner. Ignored if *is\_access\_restricted* is false." />

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
