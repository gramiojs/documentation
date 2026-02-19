---
title: ForceReply — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ForceReply Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ForceReply, telegram bot api types, gramio ForceReply, ForceReply object, ForceReply typescript
---

# ForceReply

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#forcereply" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Upon receiving a message with this object, Telegram clients will display a reply interface to the user (act as if the user has selected the bot's message and tapped 'Reply'). This can be extremely useful if you want to create user-friendly step-by-step interfaces without having to sacrifice [privacy mode](https://core.telegram.org/bots/features#privacy-mode). Not supported in channels and for messages sent on behalf of a Telegram Business account.

## Fields

<ApiParam name="force_reply" type="Boolean" required description="Shows reply interface to the user, as if they manually selected the bot's message and tapped 'Reply'" />

<ApiParam name="input_field_placeholder" type="String" description="_Optional_. The placeholder to be shown in the input field when the reply is active; 1-64 characters" />

<ApiParam name="selective" type="Boolean" description="_Optional_. Use this parameter if you want to force reply from specific users only. Targets: 1) users that are @mentioned in the _text_ of the [Message](https://core.telegram.org/bots/api#message) object; 2) if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
