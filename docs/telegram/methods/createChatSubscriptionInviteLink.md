---
title: createChatSubscriptionInviteLink — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: createChatSubscriptionInviteLink Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: createChatSubscriptionInviteLink, telegram bot api, gramio createChatSubscriptionInviteLink, createChatSubscriptionInviteLink typescript, createChatSubscriptionInviteLink example
---

# createChatSubscriptionInviteLink

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/ChatInviteLink">ChatInviteLink</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#createchatsubscriptioninvitelink" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to create a [subscription invite link](https://telegram.org/blog/superchannels-star-reactions-subscriptions#star-subscriptions) for a channel chat. The bot must have the _can\_invite\_users_ administrator rights. The link can be edited using the method [editChatSubscriptionInviteLink](https://core.telegram.org/bots/api#editchatsubscriptioninvitelink) or revoked using the method [revokeChatInviteLink](https://core.telegram.org/bots/api#revokechatinvitelink). Returns the new invite link as a [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target channel chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="name" type="String" required description="Invite link name; 0-32 characters" />

<ApiParam name="subscription_period" type="Integer" required description="The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days)." />

<ApiParam name="subscription_price" type="Integer" required description="The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-10000" :min="1" :max="10000" />

## Returns

On success, the [ChatInviteLink](/telegram/types/ChatInviteLink) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
