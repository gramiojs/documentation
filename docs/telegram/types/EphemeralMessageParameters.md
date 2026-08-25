---
title: EphemeralMessageParameters — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: EphemeralMessageParameters Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: EphemeralMessageParameters, telegram bot api types, gramio EphemeralMessageParameters, EphemeralMessageParameters object, EphemeralMessageParameters typescript
---

# EphemeralMessageParameters

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#ephemeralmessageparameters" target="_blank" rel="noopener">Official docs ↗</a>
</div>



## Fields

<ApiParam name="receiver_user_id" type="Integer" required description="Identifier of the user who will receive the message. It is not guaranteed that the user will receive the message, especially if they are offline. See [here](https://core.telegram.org/bots/api#ephemeral-messages-and-commands) for more details." />

<ApiParam name="callback_query_id" type="String" description="*Optional*. Identifier of the callback query which triggered the message, if any" />

<ApiParam name="replace_callback_query_message" type="Boolean" description="*Optional*. Pass *True* if the ephemeral message must be shown in place of the original message. Must be *False* for callback queries from ephemeral messages, which must be edited using regular *editEphemeralMessage…* methods." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
