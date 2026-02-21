---
title: setMessageReaction — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: setMessageReaction Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: setMessageReaction, telegram bot api, gramio setMessageReaction, setMessageReaction typescript, setMessageReaction example
---

# setMessageReaction

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setmessagereaction" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_id" type="Integer" required description="Identifier of the target message. If the message belongs to a media group, the reaction is set to the first non-deleted message in the group instead." />

<ApiParam name="reaction" type="ReactionType[]" description="A JSON-serialized list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators. Paid reactions can't be used by bots." />

<ApiParam name="is_big" type="Boolean" description="Pass *True* to set the reaction with a big animation" />

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
