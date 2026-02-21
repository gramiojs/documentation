---
title: editChatSubscriptionInviteLink — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Edit Telegram subscription invite links using GramIO with TypeScript. Rename bot-created subscription links for paid channel access management.
  - - meta
    - name: keywords
      content: editChatSubscriptionInviteLink, telegram bot api, telegram subscription invite link, edit subscription link telegram bot, gramio editChatSubscriptionInviteLink, editChatSubscriptionInviteLink typescript, editChatSubscriptionInviteLink example, chat_id, invite_link, subscription link name, paid channel invite link, can_invite_users, ChatInviteLink
---

# editChatSubscriptionInviteLink

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/ChatInviteLink">ChatInviteLink</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editchatsubscriptioninvitelink" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit a subscription invite link created by the bot. The bot must have the *can\_invite\_users* administrator rights. Returns the edited invite link as a [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="invite_link" type="String" required description="The invite link to edit" />

<ApiParam name="name" type="String" description="Invite link name; 0-32 characters" :minLen="0" :maxLen="32" />

## Returns

On success, the [ChatInviteLink](/telegram/types/ChatInviteLink) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Rename a subscription invite link
const updated = await bot.api.editChatSubscriptionInviteLink({
  chat_id: "@mypaidchannel",
  invite_link: "https://t.me/+abc123",
  name: "Q2 Subscribers",
});
console.log(updated.name); // "Q2 Subscribers"
console.log(updated.invite_link); // same URL, just renamed
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Clear the name by passing an empty string
const updated = await bot.api.editChatSubscriptionInviteLink({
  chat_id: -1001234567890,
  invite_link: "https://t.me/+abc123",
  name: "",
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — verify the bot is a member of the target chat |
| 400 | `Bad Request: INVITE_HASH_EXPIRED` | The subscription link is revoked or expired — create a new one with [`createChatSubscriptionInviteLink`](/telegram/methods/createChatSubscriptionInviteLink) |
| 400 | `Bad Request: INVITE_LINK_NAME_INVALID` | `name` exceeds 32 characters |
| 400 | `Bad Request: method not available for this chat type` | Target chat doesn't support subscription invite links (only supergroups/channels do) |
| 403 | `Forbidden: not enough rights` | Bot lacks the `can_invite_users` administrator right |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot was removed from the chat |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Only the name can be edited on subscription links.** The subscription price and period are fixed at creation time and cannot be changed via this method.
- **Only bot-created subscription links can be edited.** The link must have been created by the same bot calling this method.
- **`name` accepts 0–32 characters.** Passing an empty string clears the label entirely.
- **Bot must have `can_invite_users` admin right.** Other administrator permissions don't imply this right — it must be explicitly granted.
- **`chat_id` accepts `@username` strings** for public channels. Private chats require the numeric ID.

## See Also

- [`createChatSubscriptionInviteLink`](/telegram/methods/createChatSubscriptionInviteLink) — Create a new subscription invite link
- [`editChatInviteLink`](/telegram/methods/editChatInviteLink) — Edit a regular (non-subscription) invite link
- [`revokeChatInviteLink`](/telegram/methods/revokeChatInviteLink) — Revoke a bot-created invite link
- [`createChatInviteLink`](/telegram/methods/createChatInviteLink) — Create a regular additional invite link
- [`ChatInviteLink`](/telegram/types/ChatInviteLink) — The return type of this method
