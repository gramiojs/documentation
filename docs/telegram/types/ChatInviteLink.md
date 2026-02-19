---
title: ChatInviteLink — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ChatInviteLink Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ChatInviteLink, telegram bot api types, gramio ChatInviteLink, ChatInviteLink object, ChatInviteLink typescript
---

# ChatInviteLink

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#chatinvitelink" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents an invite link for a chat.

## Fields

<ApiParam name="invite_link" type="String" required description="The invite link. If the link was created by another chat administrator, then the second part of the link will be replaced with “…”." />

<ApiParam name="creator" type="User" required description="Creator of the link" />

<ApiParam name="creates_join_request" type="Boolean" required description="_True_, if users joining the chat via the link need to be approved by chat administrators" />

<ApiParam name="is_primary" type="Boolean" required description="_True_, if the link is primary" />

<ApiParam name="is_revoked" type="Boolean" required description="_True_, if the link is revoked" />

<ApiParam name="name" type="String" description="_Optional_. Invite link name" />

<ApiParam name="expire_date" type="Integer" description="_Optional_. Point in time (Unix timestamp) when the link will expire or has been expired" />

<ApiParam name="member_limit" type="Integer" description="_Optional_. The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999" :min="1" :max="1" />

<ApiParam name="pending_join_request_count" type="Integer" description="_Optional_. Number of pending join requests created using this link" />

<ApiParam name="subscription_period" type="Integer" description="_Optional_. The number of seconds the subscription will be active for before the next payment" />

<ApiParam name="subscription_price" type="Integer" description="_Optional_. The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat using the link" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
