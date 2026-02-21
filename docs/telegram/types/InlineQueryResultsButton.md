---
title: InlineQueryResultsButton — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InlineQueryResultsButton Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InlineQueryResultsButton, telegram bot api types, gramio InlineQueryResultsButton, InlineQueryResultsButton object, InlineQueryResultsButton typescript
---

# InlineQueryResultsButton

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inlinequeryresultsbutton" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a button to be shown above inline query results. You **must** use exactly one of the optional fields.

## Fields

<ApiParam name="text" type="String" required description="Label text on the button" />

<ApiParam name="web_app" type="WebAppInfo" description="*Optional*. Description of the [Web App](https://core.telegram.org/bots/webapps) that will be launched when the user presses the button. The Web App will be able to switch back to the inline mode using the method [switchInlineQuery](https://core.telegram.org/bots/webapps#initializing-mini-apps) inside the Web App." />

<ApiParam name="start_parameter" type="String" description="*Optional*. [Deep-linking](https://core.telegram.org/bots/features#deep-linking) parameter for the /start message sent to the bot when a user presses the button. 1-64 characters, only `A-Z`, `a-z`, `0-9`, `_` and `-` are allowed.      *Example:* An inline bot that sends YouTube videos can ask the user to connect the bot to their YouTube account to adapt search results accordingly. To do this, it displays a 'Connect your YouTube account' button above the results, or even before showing any. The user presses the button, switches to a private chat with the bot and, in doing so, passes a start parameter that instructs the bot to return an OAuth link. Once done, the bot can offer a [*switch\_inline*](https://core.telegram.org/bots/api#inlinekeyboardmarkup) button so that the user can easily return to the chat where they wanted to use the bot's inline capabilities." :minLen="1" :maxLen="64" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
