---
title: giftPremiumSubscription — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: giftPremiumSubscription Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: giftPremiumSubscription, telegram bot api, gramio giftPremiumSubscription, giftPremiumSubscription typescript, giftPremiumSubscription example
---

# giftPremiumSubscription

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#giftpremiumsubscription" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Gifts a Telegram Premium subscription to the given user. Returns *True* on success.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user who will receive a Telegram Premium subscription" />

<ApiParam name="month_count" type="Integer" required description="Number of months the Telegram Premium subscription will be active for the user; must be one of 3, 6, or 12" :enumValues='[3,6,12]' />

<ApiParam name="star_count" type="Integer" required description="Number of Telegram Stars to pay for the Telegram Premium subscription; must be 1000 for 3 months, 1500 for 6 months, and 2500 for 12 months" />

<ApiParam name="text" type="String" description="Text that will be shown along with the service message about the subscription; 0-128 characters" :minLen="0" :maxLen="128" />

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
