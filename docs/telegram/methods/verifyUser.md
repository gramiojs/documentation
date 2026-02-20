---
title: verifyUser — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: verifyUser Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: verifyUser, telegram bot api, gramio verifyUser, verifyUser typescript, verifyUser example
---

# verifyUser

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#verifyuser" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Verifies a user [on behalf of the organization](https://telegram.org/verify#third-party-verification) which is represented by the bot. Returns *True* on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="custom_description" type="String" description="Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description." :minLen="0" :maxLen="70" />

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
