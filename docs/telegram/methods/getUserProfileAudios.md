---
title: getUserProfileAudios — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: getUserProfileAudios Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: getUserProfileAudios, telegram bot api, gramio getUserProfileAudios, getUserProfileAudios typescript, getUserProfileAudios example
---

# getUserProfileAudios

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/UserProfileAudios">UserProfileAudios</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getuserprofileaudios" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get a list of profile audios for a user. Returns a [UserProfileAudios](https://core.telegram.org/bots/api#userprofileaudios) object.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="offset" type="Integer" description="Sequential number of the first audio to be returned. By default, all audios are returned." />

<ApiParam name="limit" type="Integer" description="Limits the number of audios to be retrieved. Values between 1-100 are accepted. Defaults to 100." :min="1" :max="100" :defaultValue="100" />

## Returns

On success, the [UserProfileAudios](/telegram/types/UserProfileAudios) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
