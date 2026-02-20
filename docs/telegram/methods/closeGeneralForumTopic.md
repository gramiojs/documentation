---
title: closeGeneralForumTopic — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Close the General topic in a Telegram forum supergroup using GramIO. Requires can_manage_topics admin right. TypeScript examples and error reference included.
  - - meta
    - name: keywords
      content: closeGeneralForumTopic, telegram bot api, close general forum topic, gramio closeGeneralForumTopic, telegram general topic, forum supergroup, can_manage_topics, closeGeneralForumTopic typescript, closeGeneralForumTopic example
---

# closeGeneralForumTopic

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#closegeneralforumtopic" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to close an open 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the *can\_manage\_topics* administrator rights. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Close the General topic in a supergroup by username
await bot.api.closeGeneralForumTopic({
  chat_id: "@mysupergroup",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Admin command to close the General topic in the current chat
bot.command("closegeneral", async (ctx) => {
  await bot.api.closeGeneralForumTopic({
    chat_id: ctx.chatId,
  });

  await ctx.reply("The General topic has been closed.");
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Toggle: close General topic during off-hours, reopen in the morning
async function setGeneralTopicStatus(chatId: number, open: boolean) {
  if (open) {
    await bot.api.reopenGeneralForumTopic({ chat_id: chatId });
  } else {
    await bot.api.closeGeneralForumTopic({ chat_id: chatId });
  }
}

// Close for the night
await setGeneralTopicStatus(-1001234567890, false);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot cannot access the chat |
| 400 | `Bad Request: TOPIC_NOT_MODIFIED` | The General topic is already closed |
| 403 | `Forbidden: not enough rights` | Bot is not an admin or lacks `can_manage_topics` permission |
| 400 | `Bad Request: supergroup required` | Forum topics only exist in supergroups with forum mode enabled |

## Tips & Gotchas

- **Only works in forum supergroups.** The chat must be a supergroup with the forum mode feature enabled — not a regular group or channel.
- **No topic creator exemption.** Unlike [`closeForumTopic`](/telegram/methods/closeForumTopic), the General topic can only be closed by an admin with explicit `can_manage_topics` rights. Topic creator exemption does not apply here.
- **Hiding vs. closing.** Closing prevents new messages. [`hideGeneralForumTopic`](/telegram/methods/hideGeneralForumTopic) hides the General topic from the topic list entirely, which is a separate operation.
- **Reopen with a dedicated method.** Use [`reopenGeneralForumTopic`](/telegram/methods/reopenGeneralForumTopic) to allow messages again. A regular `reopenForumTopic` won't work for the General topic.

## See Also

- [`reopenGeneralForumTopic`](/telegram/methods/reopenGeneralForumTopic) — reopen the General topic
- [`hideGeneralForumTopic`](/telegram/methods/hideGeneralForumTopic) — hide the General topic from the topic list
- [`closeForumTopic`](/telegram/methods/closeForumTopic) — close any non-General topic
- [`createForumTopic`](/telegram/methods/createForumTopic) — create new forum topics
- [`deleteForumTopic`](/telegram/methods/deleteForumTopic) — permanently delete a forum topic
- [`ForumTopic`](/telegram/types/ForumTopic) — the ForumTopic type
