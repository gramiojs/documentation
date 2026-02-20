---
title: sendGift — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: sendGift Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: sendGift, telegram bot api, gramio sendGift, sendGift typescript, sendGift example
---

# sendGift

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendgift" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Sends a gift to the given user or channel chat. The gift can't be converted to Telegram Stars by the receiver. Returns *True* on success.

## Parameters

<ApiParam name="user_id" type="Integer" description="Required if *chat\_id* is not specified. Unique identifier of the target user who will receive the gift." />

<ApiParam name="chat_id" type="Integer | String" description="Required if *user\_id* is not specified. Unique identifier for the chat or username of the channel (in the format `@channelusername`) that will receive the gift." />

<ApiParam name="gift_id" type="String" required description="Identifier of the gift; limited gifts can't be sent to channel chats" />

<ApiParam name="pay_for_upgrade" type="Boolean" description="Pass *True* to pay for the gift upgrade from the bot's balance, thereby making the upgrade free for the receiver" />

<ApiParam name="text" type="String" description="Text that will be shown along with the gift; 0-128 characters" :minLen="0" :maxLen="128" />

<ApiParam name="text_parse_mode" type="String" description="Mode for parsing entities in the text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, and “custom\_emoji” are ignored." />

<ApiParam name="text_entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of *text\_parse\_mode*. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, and “custom\_emoji” are ignored." />

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
