---
title: unhideGeneralForumTopic — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Unhide the General topic in a Telegram forum supergroup using GramIO. TypeScript examples, required can_manage_topics admin right, and forum topic management tips.
  - - meta
    - name: keywords
      content: unhideGeneralForumTopic, telegram bot api, gramio unhideGeneralForumTopic, unhide general topic telegram, forum supergroup general topic, can_manage_topics, show general topic, typescript unhideGeneralForumTopic example, how to unhide general forum topic telegram
---

# unhideGeneralForumTopic

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#unhidegeneralforumtopic" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to unhide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the *can\_manage\_topics* administrator rights. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

Unhide the General topic in a forum supergroup:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
await bot.api.unhideGeneralForumTopic({
  chat_id: -1001234567890,
});
```

Toggle the General topic visibility from a command:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("showgeneral", async (ctx) => {
  await bot.api.unhideGeneralForumTopic({
    chat_id: ctx.chat.id,
  });

  await ctx.send("The General topic is now visible.");
});
```

Unhide the General topic in a supergroup by username:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
async function showGeneralTopic(supergroupUsername: string) {
  await bot.api.unhideGeneralForumTopic({
    chat_id: `@${supergroupUsername}`,
  });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot is not a member of the chat |
| 400 | `Bad Request: method is available only for supergroups` | The target chat is not a forum supergroup — only forum-enabled supergroups have the General topic |
| 400 | `Bad Request: TOPIC_NOT_MODIFIED` | The General topic is already visible — no state change needed |
| 403 | `Forbidden: bot is not an administrator` | The bot has no admin status in the chat |
| 403 | `Forbidden: not enough rights to manage topics` | The bot is an admin but lacks `can_manage_topics` — grant it in admin settings |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Forum mode must be enabled.** The General topic only exists in supergroups where the "Topics" feature is turned on. This method fails in regular supergroups and all other chat types.
- **Requires `can_manage_topics`.** Unlike pinning messages, managing topic visibility needs this specific right rather than `can_pin_messages`.
- **The General topic is permanent.** Unlike custom topics, the General topic cannot be deleted — it can only be hidden or shown, and optionally closed/reopened. Use `hideGeneralForumTopic` to reverse this action.
- **Hidden General topic still receives messages.** When hidden, new messages cannot be sent to it, but existing messages remain accessible to admins. Unhiding makes it accessible to all members again.
- **Check current state first.** `ChatFullInfo.is_general_forum_topic_hidden` indicates whether the General topic is currently hidden — use `getChat` to read this before calling unhide.

## See Also

- [`hideGeneralForumTopic`](/telegram/methods/hideGeneralForumTopic) — Hide the General topic (counterpart to this method)
- [`editGeneralForumTopic`](/telegram/methods/editGeneralForumTopic) — Rename the General topic
- [`closeGeneralForumTopic`](/telegram/methods/closeGeneralForumTopic) — Prevent new messages in the General topic
- [`reopenGeneralForumTopic`](/telegram/methods/reopenGeneralForumTopic) — Allow new messages in the General topic again
- [`unpinAllGeneralForumTopicMessages`](/telegram/methods/unpinAllGeneralForumTopicMessages) — Clear all pinned messages in the General topic
- [`createForumTopic`](/telegram/methods/createForumTopic) — Create a new custom forum topic
