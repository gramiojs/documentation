---
title: verifyChat — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: verifyChat Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: verifyChat, telegram bot api, gramio verifyChat, verifyChat typescript, verifyChat example
---

# verifyChat

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#verifychat" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Verifies a chat [on behalf of the organization](https://telegram.org/verify#third-party-verification) which is represented by the bot. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). Channel direct messages chats can't be verified." />

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
