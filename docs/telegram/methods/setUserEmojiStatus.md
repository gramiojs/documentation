---
title: setUserEmojiStatus — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: setUserEmojiStatus Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: setUserEmojiStatus, telegram bot api, gramio setUserEmojiStatus, setUserEmojiStatus typescript, setUserEmojiStatus example
---

# setUserEmojiStatus

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setuseremojistatus" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method [requestEmojiStatusAccess](https://core.telegram.org/bots/webapps#initializing-mini-apps). Returns *True* on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="emoji_status_custom_emoji_id" type="String" description="Custom emoji identifier of the emoji status to set. Pass an empty string to remove the status." />

<ApiParam name="emoji_status_expiration_date" type="Integer" description="Expiration date of the emoji status, if any" />

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
