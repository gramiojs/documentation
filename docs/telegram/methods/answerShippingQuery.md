---
title: answerShippingQuery — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: answerShippingQuery Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: answerShippingQuery, telegram bot api, gramio answerShippingQuery, answerShippingQuery typescript, answerShippingQuery example
---

# answerShippingQuery

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#answershippingquery" target="_blank" rel="noopener">Official docs ↗</a>
</div>

If you sent an invoice requesting a shipping address and the parameter _is\_flexible_ was specified, the Bot API will send an [Update](https://core.telegram.org/bots/api#update) with a _shipping\_query_ field to the bot. Use this method to reply to shipping queries. On success, _True_ is returned.

## Parameters

<ApiParam name="shipping_query_id" type="String" required description="Unique identifier for the query to be answered" />

<ApiParam name="ok" type="Boolean" required description="Pass _True_ if delivery to the specified address is possible and _False_ if there are any problems (for example, if delivery to the specified address is not possible)" />

<ApiParam name="shipping_options" type="ShippingOption[]" required description="Required if _ok_ is _True_. A JSON-serialized array of available shipping options." />

<ApiParam name="error_message" type="String" required description="Required if _ok_ is _False_. Error message in human readable form that explains why it is impossible to complete the order (e.g. “Sorry, delivery to your desired address is unavailable”). Telegram will display this message to the user." />

## Returns

On success, String is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
