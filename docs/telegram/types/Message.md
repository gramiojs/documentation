---
title: Message — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: Complete reference for the Telegram Bot API Message object. All fields explained with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: telegram Message type, telegram message object, message fields, telegram bot api types, gramio Message, ctx.message
---

# Message

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#message" target="_blank" rel="noopener">Official docs ↗</a>
</div>

This object represents a message.

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `message_id` | `Integer` | Unique message identifier inside this chat. In specific instances (e.g., message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent |
| `message_thread_id` | `Integer` | *Optional.* Unique identifier of a message thread to which the message belongs; for supergroups only |
| `from` | [`User`](/telegram/types/User) | *Optional.* Sender of the message; may be empty for messages sent to channels. For backward compatibility, if the message was sent on behalf of a chat, the field contains a fake sender user in non-channel chats |
| `sender_chat` | [`Chat`](/telegram/types/Chat) | *Optional.* Sender of the message when sent on behalf of a chat |
| `sender_boost_count` | `Integer` | *Optional.* If the sender of the message boosted the chat, the number of boosts added by the user |
| `sender_business_bot` | [`User`](/telegram/types/User) | *Optional.* The bot that actually sent the message on behalf of the business account |
| `date` | `Integer` | Date the message was sent in Unix time. It is always a positive number, representing a valid date |
| `business_connection_id` | `String` | *Optional.* Unique identifier of the business connection from which the message was received |
| `chat` | [`Chat`](/telegram/types/Chat) | Chat the message belongs to |
| `forward_origin` | [`MessageOrigin`](/telegram/types/MessageOrigin) | *Optional.* Information about the original message for forwarded messages |
| `is_topic_message` | `Boolean` | *Optional.* `true` if the message is sent to a forum topic |
| `is_automatic_forward` | `Boolean` | *Optional.* `true` if the message is a channel post that was automatically forwarded to the connected discussion group |
| `reply_to_message` | [`Message`](/telegram/types/Message) | *Optional.* For replies in the same chat and message thread, the original message |
| `external_reply` | [`ExternalReplyInfo`](/telegram/types/ExternalReplyInfo) | *Optional.* Information about the message that is being replied to, which may come from another chat or forum topic |
| `quote` | [`TextQuote`](/telegram/types/TextQuote) | *Optional.* For replies that quote part of the original message, the quoted part of the message |
| `text` | `String` | *Optional.* For text messages, the actual UTF-8 text of the message |
| `entities` | [`MessageEntity[]`](/telegram/types/MessageEntity) | *Optional.* Special entities like usernames, URLs, bot commands, etc. that appear in the text |
| `caption` | `String` | *Optional.* Caption for the animation, audio, document, paid media, photo, video or voice |
| `caption_entities` | [`MessageEntity[]`](/telegram/types/MessageEntity) | *Optional.* Special entities that appear in the caption |
| `photo` | [`PhotoSize[]`](/telegram/types/PhotoSize) | *Optional.* Message is a photo, available sizes of the photo |
| `video` | [`Video`](/telegram/types/Video) | *Optional.* Message is a video, information about the video |
| `audio` | [`Audio`](/telegram/types/Audio) | *Optional.* Message is an audio file, information about the file |
| `document` | [`Document`](/telegram/types/Document) | *Optional.* Message is a general file, information about the file |
| `animation` | [`Animation`](/telegram/types/Animation) | *Optional.* Message is an animation, information about the animation |
| `voice` | [`Voice`](/telegram/types/Voice) | *Optional.* Message is a voice message, information about the file |
| `video_note` | [`VideoNote`](/telegram/types/VideoNote) | *Optional.* Message is a video note |
| `sticker` | [`Sticker`](/telegram/types/Sticker) | *Optional.* Message is a sticker, information about the sticker |
| `contact` | [`Contact`](/telegram/types/Contact) | *Optional.* Message is a shared contact, information about the contact |
| `location` | [`Location`](/telegram/types/Location) | *Optional.* Message is a shared location, information about the location |
| `poll` | [`Poll`](/telegram/types/Poll) | *Optional.* Message is a native poll, information about the poll |
| `venue` | [`Venue`](/telegram/types/Venue) | *Optional.* Message is a venue, information about the venue |
| `new_chat_members` | [`User[]`](/telegram/types/User) | *Optional.* New members that were added to the group or supergroup |
| `left_chat_member` | [`User`](/telegram/types/User) | *Optional.* A member was removed from the group |
| `pinned_message` | [`MaybeInaccessibleMessage`](/telegram/types/MaybeInaccessibleMessage) | *Optional.* Specified message was pinned |
| `reply_markup` | [`InlineKeyboardMarkup`](/telegram/types/InlineKeyboardMarkup) | *Optional.* Inline keyboard attached to the message |

<!-- GENERATED:END -->

## GramIO Usage

In GramIO, `Message` is accessible through context objects in update handlers:

```typescript
// message context has the message directly
bot.on("message", (ctx) => {
  const msg = ctx.message; // Message object

  console.log(msg.message_id);
  console.log(msg.text);       // undefined for non-text messages
  console.log(msg.from?.id);   // sender user ID
  console.log(msg.chat.id);    // chat ID
  console.log(msg.date);       // Unix timestamp
});

// Check message type by checking which field is present
bot.on("message", (ctx) => {
  if (ctx.message.photo) {
    console.log("Got a photo!");
  } else if (ctx.message.text) {
    console.log("Got text:", ctx.message.text);
  }
});

// Access reply
bot.on("message", (ctx) => {
  if (ctx.message.reply_to_message) {
    const originalText = ctx.message.reply_to_message.text;
    ctx.send(`You replied to: "${originalText}"`);
  }
});

// sendMessage returns a Message
const sentMsg = await bot.api.sendMessage({
  chat_id: 123,
  text: "Hello!",
});
console.log(sentMsg.message_id); // now you can edit/delete it
```

## Tips & Gotchas

- **Most fields are optional** — a `Message` represents _any_ type of message. Check for the specific field (`text`, `photo`, `video`, etc.) to determine the message type.
- **`from` can be absent** in channel posts where messages are sent on behalf of the channel.
- **`date` is a Unix timestamp** (seconds since epoch). Convert with `new Date(msg.date * 1000)`.
- **Forwarded messages** have `forward_origin` — the `from` field still reflects the forwarder (the user who forwarded it to your bot).
- **GramIO context** provides convenience getters — e.g. `ctx.from` is shorthand for `ctx.message.from`.

## Used By

Methods that return a `Message`:

- [sendMessage](/telegram/methods/sendMessage) — Send text
- [sendPhoto](/telegram/methods/sendPhoto) — Send photo
- [sendDocument](/telegram/methods/sendDocument) — Send file
- [sendVideo](/telegram/methods/sendVideo) — Send video
- [editMessageText](/telegram/methods/editMessageText) — Edit message text
- [copyMessage](/telegram/methods/copyMessage) — Copy a message

## See Also

- [Update](/telegram/types/Update) — The wrapper object that contains `Message` in polling/webhook updates
- [User](/telegram/types/User) — Represents `msg.from`
- [Chat](/telegram/types/Chat) — Represents `msg.chat`
- [MessageEntity](/telegram/types/MessageEntity) — Represents formatting entities in `msg.entities`
