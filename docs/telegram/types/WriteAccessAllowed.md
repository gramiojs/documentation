---
title: WriteAccessAllowed — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: WriteAccessAllowed Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: WriteAccessAllowed, telegram bot api types, gramio WriteAccessAllowed, WriteAccessAllowed object, WriteAccessAllowed typescript
---

# WriteAccessAllowed

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#writeaccessallowed" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a service message about a user allowing a bot to write messages after adding it to the attachment menu, launching a Web App from a link, or accepting an explicit request from a Web App sent by the method [requestWriteAccess](https://core.telegram.org/bots/webapps#initializing-mini-apps).

## Fields

<ApiParam name="from_request" type="Boolean" description="*Optional*. *True*, if the access was granted after the user accepted an explicit request from a Web App sent by the method [requestWriteAccess](https://core.telegram.org/bots/webapps#initializing-mini-apps)" />

<ApiParam name="web_app_name" type="String" description="*Optional*. Name of the Web App, if the access was granted when the Web App was launched from a link" />

<ApiParam name="from_attachment_menu" type="Boolean" description="*Optional*. *True*, if the access was granted when the bot was added to the attachment or side menu" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
