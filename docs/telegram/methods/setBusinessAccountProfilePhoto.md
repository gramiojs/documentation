---
title: setBusinessAccountProfilePhoto — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: setBusinessAccountProfilePhoto Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: setBusinessAccountProfilePhoto, telegram bot api, gramio setBusinessAccountProfilePhoto, setBusinessAccountProfilePhoto typescript, setBusinessAccountProfilePhoto example
---

# setBusinessAccountProfilePhoto

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setbusinessaccountprofilephoto" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Changes the profile photo of a managed business account. Requires the _can\_edit\_profile\_photo_ business bot right. Returns _True_ on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="photo" type="InputProfilePhoto" required description="The new profile photo to set" />

<ApiParam name="is_public" type="Boolean" required description="Pass _True_ to set the public photo, which will be visible even if the main photo is hidden by the business account's privacy settings. An account can have only one public photo." />

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
