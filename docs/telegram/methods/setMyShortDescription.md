---
title: setMyShortDescription — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: setMyShortDescription Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: setMyShortDescription, telegram bot api, gramio setMyShortDescription, setMyShortDescription typescript, setMyShortDescription example
---

# setMyShortDescription

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setmyshortdescription" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to change the bot's short description, which is shown on the bot's profile page and is sent together with the link when users share the bot. Returns *True* on success.

## Parameters

<ApiParam name="short_description" type="String" description="New short description for the bot; 0-120 characters. Pass an empty string to remove the dedicated short description for the given language." :minLen="0" :maxLen="120" />

<ApiParam name="language_code" type="String" description="A two-letter ISO 639-1 language code. If empty, the short description will be applied to all users for whose language there is no dedicated short description." />

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
