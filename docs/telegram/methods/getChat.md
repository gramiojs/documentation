---
title: getChat — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Get full information about any Telegram chat using GramIO. Returns ChatFullInfo with description, permissions, pinned message, linked chat, business hours, and all metadata.
  - - meta
    - name: keywords
      content: getChat, telegram bot api, get chat info, gramio getChat, getChat typescript, getChat example, ChatFullInfo, chat_id, telegram chat details, telegram group info, get channel info, telegram supergroup info, chat permissions, linked chat, pinned message, how to get chat info telegram bot
---

# getChat

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/ChatFullInfo">ChatFullInfo</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getchat" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get up-to-date information about the chat. Returns a [ChatFullInfo](https://core.telegram.org/bots/api#chatfullinfo) object on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)" />

## Returns

On success, the [ChatFullInfo](/telegram/types/ChatFullInfo) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get full chat info by @username or numeric ID
const chat = await bot.api.getChat({ chat_id: "@gramio" });

console.log(`Title: ${chat.title}`);
console.log(`Type: ${chat.type}`);
console.log(`Description: ${chat.description ?? "(none)"}`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Inspect group settings in a message handler
bot.on("message", async (ctx) => {
  if (ctx.chat.type === "private") return;

  const chat = await bot.api.getChat({ chat_id: ctx.chat.id });

  if (chat.slow_mode_delay) {
    console.log(`Slow mode: ${chat.slow_mode_delay}s between messages`);
  }

  if (chat.linked_chat_id) {
    console.log(`Linked chat: ${chat.linked_chat_id}`);
  }

  if (chat.permissions) {
    const canSend = chat.permissions.can_send_messages !== false;
    console.log(`Members can send messages: ${canSend}`);
  }
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Check forum topics and content protection settings
bot.command("info", async (ctx) => {
  const chat = await bot.api.getChat({ chat_id: ctx.chat.id });

  const lines = [
    `Type: ${chat.type}`,
    `Forum topics: ${chat.is_forum ? "enabled" : "disabled"}`,
    `Protected content: ${chat.has_protected_content ? "yes" : "no"}`,
    `Auto-delete: ${chat.message_auto_delete_time ? `${chat.message_auto_delete_time}s` : "off"}`,
  ];

  await ctx.send(lines.join("\n"));
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Read pinned message and business account fields (private chats)
const chat = await bot.api.getChat({ chat_id: 123456789 });

if (chat.pinned_message) {
  console.log(`Pinned message ID: ${chat.pinned_message.message_id}`);
}

if (chat.business_intro) {
  console.log(`Business intro title: ${chat.business_intro.title}`);
}

if (chat.bio) {
  console.log(`Bio: ${chat.bio}`);
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | The `chat_id` is invalid, the chat doesn't exist, or was deleted |
| 400 | `Bad Request: group chat was upgraded to a supergroup chat` | The numeric group ID is stale — the group was converted; use the new supergroup ID from the migration update |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot was never added to, or was kicked from, the channel — it must be a member |
| 403 | `Forbidden: bot was blocked by the user` | The user blocked the bot (private chats only) |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **`chat_id` accepts `@username` strings** for public supergroups and channels. Private chats always require the numeric ID — there's no username for them.
- **Most `ChatFullInfo` fields are optional and chat-type specific.** `bio` and `birthdate` only appear in private chats. `description`, `linked_chat_id`, `slow_mode_delay`, and `location` apply to groups/channels. Always guard with `chat.field ?? fallback` rather than assuming presence.
- **The bot must be a member to query non-public chats.** For private chats the user must not have blocked the bot. For channels and closed groups the bot must be a member.
- **Don't use `getChat` as a membership check.** A successful call doesn't guarantee the bot has write permissions — use [`getChatMember`](/telegram/methods/getChatMember) with the bot's own ID to verify rights.
- **Group → supergroup migration changes the chat ID.** If you get `group chat was upgraded to a supergroup`, listen for the `migrate_to_chat_id` field in updates to get the new ID.
- **`linked_chat_id` works both ways.** For a channel it points to its linked discussion supergroup; for a supergroup it points to the linked broadcast channel.
- **`ctx.chat` in handlers is a lightweight `Chat` object.** It lacks description, permissions, and other extended fields — call `getChat` when you need the full `ChatFullInfo`.

## See Also

- [`getChatMember`](/telegram/methods/getChatMember) — get a member's status and permissions in a chat
- [`getChatAdministrators`](/telegram/methods/getChatAdministrators) — list all chat admins and their rights
- [`getChatMemberCount`](/telegram/methods/getChatMemberCount) — get the number of members in a chat
- [`ChatFullInfo`](/telegram/types/ChatFullInfo) — the full return type with all fields documented
- [`Chat`](/telegram/types/Chat) — the lightweight chat object used in message updates
- [`ChatPermissions`](/telegram/types/ChatPermissions) — the permissions object in `chat.permissions`
