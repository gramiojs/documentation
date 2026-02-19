---
title: answerPreCheckoutQuery — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: answerPreCheckoutQuery Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: answerPreCheckoutQuery, telegram bot api, gramio answerPreCheckoutQuery, answerPreCheckoutQuery typescript, answerPreCheckoutQuery example
---

# answerPreCheckoutQuery

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: String</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#answerprecheckoutquery" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an [Update](https://core.telegram.org/bots/api#update) with the field _pre\_checkout\_query_. Use this method to respond to such pre-checkout queries. On success, _True_ is returned. **Note:** The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.

## Parameters

<ApiParam name="pre_checkout_query_id" type="String" required description="Unique identifier for the query to be answered" />

<ApiParam name="ok" type="Boolean" required description="Specify _True_ if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use _False_ if there are any problems." />

<ApiParam name="error_message" type="String" required description="Required if _ok_ is _False_. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. &quot;Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!&quot;). Telegram will display this message to the user." />

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
