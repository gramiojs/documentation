---
title: removeBusinessAccountProfilePhoto — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: removeBusinessAccountProfilePhoto Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: removeBusinessAccountProfilePhoto, telegram bot api, gramio removeBusinessAccountProfilePhoto, removeBusinessAccountProfilePhoto typescript, removeBusinessAccountProfilePhoto example
---

# removeBusinessAccountProfilePhoto

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#removebusinessaccountprofilephoto" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Removes the current profile photo of a managed business account. Requires the *can\_edit\_profile\_photo* business bot right. Returns *True* on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="is_public" type="Boolean" description="Pass *True* to remove the public photo, which is visible even if the main photo is hidden by the business account's privacy settings. After the main photo is removed, the previous profile photo (if present) becomes the main photo." />

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
