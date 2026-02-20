---
title: MenuButtonWebApp — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: MenuButtonWebApp Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: MenuButtonWebApp, telegram bot api types, gramio MenuButtonWebApp, MenuButtonWebApp object, MenuButtonWebApp typescript
---

# MenuButtonWebApp

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#menubuttonwebapp" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a menu button, which launches a [Web App](https://core.telegram.org/bots/webapps).

## Fields

<ApiParam name="type" type="String" description="Type of the button, must be *web\_app*" defaultValue="web_app" />

<ApiParam name="text" type="String" required description="Text on the button" />

<ApiParam name="web_app" type="WebAppInfo" required description="Description of the Web App that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery). Alternatively, a `t.me` link to a Web App of the bot can be specified in the object instead of the Web App's URL, in which case the Web App will be opened as if the user pressed the link." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
