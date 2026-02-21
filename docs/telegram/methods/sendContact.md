---
title: sendContact — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send phone contacts with GramIO in TypeScript. sendContact reference with phone_number, first_name, vCard support, and TypeScript usage examples for Telegram bots.
  - - meta
    - name: keywords
      content: sendContact, telegram bot api, gramio sendContact, sendContact typescript, sendContact example, send phone contact telegram bot, vcard telegram, phone_number format, contact message, first_name last_name, contact typescript
---

# sendContact

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Message">Message</a></span>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendcontact" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send phone contacts. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="direct_messages_topic_id" type="Integer" description="Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat" />

<ApiParam name="phone_number" type="String" required description="Contact's phone number" />

<ApiParam name="first_name" type="String" required description="Contact's first name" />

<ApiParam name="last_name" type="String" description="Contact's last name" />

<ApiParam name="vcard" type="String" description="Additional data about the contact in the form of a [vCard](https://en.wikipedia.org/wiki/VCard), 0-2048 bytes" />

<ApiParam name="disable_notification" type="Boolean" description="Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" description="Protects the contents of the sent message from forwarding and saving" />

<ApiParam name="allow_paid_broadcast" type="Boolean" description="Pass *True* to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance" />

<ApiParam name="message_effect_id" type="String" description="Unique identifier of the message effect to be added to the message; for private chats only" />

<ApiParam name="suggested_post_parameters" type="SuggestedPostParameters" description="A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined." />

<ApiParam name="reply_parameters" type="ReplyParameters" description="Description of the message to reply to" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply" description="Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user" docsLink="/keyboards/overview" />

## Returns

On success, the [Message](/telegram/types/Message) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

Send a basic contact with a phone number and name using the context shorthand:

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  await ctx.sendContact({
    phone_number: "+15551234567",
    first_name: "Alice",
    last_name: "Smith",
  });
});
```

Reply to the user's message while sending a contact:

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  await ctx.replyWithContact({
    phone_number: "+15551234567",
    first_name: "Support Team",
  });
});
```

Send a contact with full vCard data for rich client-side import:

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:Alice Smith",
    "TEL;TYPE=CELL:+15551234567",
    "EMAIL:alice@example.com",
    "ORG:Example Inc.",
    "END:VCARD",
  ].join("\n");

  await ctx.sendContact({
    phone_number: "+15551234567",
    first_name: "Alice",
    last_name: "Smith",
    vcard,
  });
});
```

Direct API call with `bot.api.sendContact` (useful outside message handlers):

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
const msg = await bot.api.sendContact({
  chat_id: 123456789,
  phone_number: "+15551234567",
  first_name: "Alice",
  last_name: "Smith",
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | The `chat_id` is invalid, the bot has never interacted with the user, or the chat does not exist. |
| 400 | `Bad Request: phone number is invalid` | The `phone_number` string is empty or contains invalid characters. Include the country code (e.g. `+1555...`). |
| 400 | `Bad Request: CONTACT_NAME_EMPTY` | The `first_name` field is empty or missing. A non-empty first name is required. |
| 403 | `Forbidden: bot was blocked by the user` | The user blocked the bot. Remove them from your active user list. |
| 429 | `Too Many Requests: retry after N` | Flood control triggered. Back off for the specified number of seconds. |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **`phone_number` is a free-form string.** Telegram does not validate the phone number format server-side in detail, but clients display it as-is. Use standard international format (e.g. `+15551234567`) to ensure correct display and click-to-call behavior.
- **The contact is not linked to a Telegram account.** Even if the phone number belongs to a Telegram user, the contact message just shows the raw number. Users can choose to add it to their contacts manually.
- **`vcard` enriches the contact card.** Clients that support vCard can import additional fields (email, organization, address). Keep the vCard under 2048 bytes.
- **`last_name` is optional but recommended.** Many clients display the full name in the contact bubble. Providing both first and last names creates a cleaner contact entry.
- **Note: `sendContact` takes a params object, not positional arguments.** Unlike `sendAnimation(animation, params?)`, you must pass all fields including `phone_number` inside a single object.

## See Also

- [Keyboards overview](/keyboards/overview) — attaching inline or reply keyboards
- [Contact type](/telegram/types/Contact) — structure of the received contact object
- [Message type](/telegram/types/Message) — full structure of the returned message
- [sendMessage](/telegram/methods/sendMessage) — send plain text
- [auto-retry plugin](/plugins/official/auto-retry) — handle rate limits automatically
