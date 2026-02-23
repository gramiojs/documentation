---
title: unpinAllGeneralForumTopicMessages — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Clear all pinned messages in the General forum topic of a Telegram supergroup using GramIO. TypeScript examples, required can_pin_messages admin right, and tips.
  - - meta
    - name: keywords
      content: unpinAllGeneralForumTopicMessages, telegram bot api, gramio unpinAllGeneralForumTopicMessages, unpin general forum topic messages, general topic pinned messages, can_pin_messages, forum supergroup, typescript unpinAllGeneralForumTopicMessages example
---

# unpinAllGeneralForumTopicMessages

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the *can\_pin\_messages* administrator right in the supergroup. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

Clear all pinned messages from the General forum topic:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
await bot.api.unpinAllGeneralForumTopicMessages({
  chat_id: -1001234567890,
});
```

Handle a `/cleargeneral` command to clear pins from the General topic:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("cleargeneral", async (ctx) => {
  await bot.api.unpinAllGeneralForumTopicMessages({
    chat_id: ctx.chat.id,
  });

  await ctx.send("All pinned messages in the General topic have been cleared.");
});
```

Clear General topic pins in a supergroup by username:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
async function clearGeneralTopicPins(supergroupUsername: string) {
  await bot.api.unpinAllGeneralForumTopicMessages({
    chat_id: `@${supergroupUsername}`,
  });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot is not a member of the chat |
| 400 | `Bad Request: method is available only for supergroups` | The target chat is not a forum supergroup with topics enabled |
| 403 | `Forbidden: bot is not an administrator` | The bot has no admin status in the chat |
| 403 | `Forbidden: not enough rights to pin messages` | The bot is an admin but lacks `can_pin_messages` in the supergroup |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **The General topic is always thread ID `1`.** This method targets it specifically without you needing to specify the thread ID. For all other custom topics use `unpinAllForumTopicMessages` with the appropriate `message_thread_id`.
- **Requires `can_pin_messages` — not `can_manage_topics`.** Pinning/unpinning needs the pin right even in the General topic.
- **Forum mode must be enabled.** This method only works in supergroups where the Topics feature is active. Regular supergroups and other chat types return an error.
- **Messages are not deleted.** Unpinning removes messages from the pinned list but leaves them in the General topic history.
- **Works even when the General topic is hidden.** Admins can manage pins regardless of whether the General topic is currently visible to members.

## See Also

- [`unpinAllForumTopicMessages`](/telegram/methods/unpinAllForumTopicMessages) — Clear pins in any custom forum topic
- [`unpinAllChatMessages`](/telegram/methods/unpinAllChatMessages) — Clear all pinned messages across an entire chat
- [`unpinChatMessage`](/telegram/methods/unpinChatMessage) — Unpin a single specific message
- [`pinChatMessage`](/telegram/methods/pinChatMessage) — Pin a message in a chat or topic
- [`hideGeneralForumTopic`](/telegram/methods/hideGeneralForumTopic) — Hide the General topic from members
- [`unhideGeneralForumTopic`](/telegram/methods/unhideGeneralForumTopic) — Make the General topic visible again
