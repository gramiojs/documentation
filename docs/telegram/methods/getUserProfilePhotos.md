---
title: getUserProfilePhotos — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: getUserProfilePhotos Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: getUserProfilePhotos, telegram bot api, gramio getUserProfilePhotos, getUserProfilePhotos typescript, getUserProfilePhotos example
---

# getUserProfilePhotos

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/UserProfilePhotos">UserProfilePhotos</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getuserprofilephotos" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get a list of profile pictures for a user. Returns a [UserProfilePhotos](https://core.telegram.org/bots/api#userprofilephotos) object.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="offset" type="Integer" required description="Sequential number of the first photo to be returned. By default, all photos are returned." />

<ApiParam name="limit" type="Integer" required description="Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100." />

## Returns

On success, the [UserProfilePhotos](/telegram/types/UserProfilePhotos) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
