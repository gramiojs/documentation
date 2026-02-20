---
title: getChatMemberCount — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Get the total number of members in a Telegram chat using GramIO. TypeScript examples for displaying subscriber counts in groups, supergroups, and channels.
  - - meta
    - name: keywords
      content: getChatMemberCount, telegram bot api, get chat member count, gramio getChatMemberCount, telegram group member count, getChatMemberCount typescript, getChatMemberCount example, telegram subscriber count, chat members number, how to count telegram group members, chat_id, telegram group size
---

# getChatMemberCount

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: Integer</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getchatmembercount" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get the number of members in a chat. Returns *Int* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)" />

## Returns

On success, Integer is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Display the current member count on command
bot.command("members", async (ctx) => {
    const count = await bot.api.getChatMemberCount({
        chat_id: ctx.chat.id,
    });
    await ctx.send(`This chat has ${count} members.`);
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Announce when hitting subscriber milestones
bot.on("chat_member", async (ctx) => {
    const count = await bot.api.getChatMemberCount({
        chat_id: ctx.chat.id,
    });
    const milestones = [100, 500, 1000, 5000, 10000];
    if (milestones.includes(count)) {
        await bot.api.sendMessage({
            chat_id: ctx.chat.id,
            text: `We just hit ${count} members!`,
        });
    }
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Direct API call — get member count for a public channel by username
const count = await bot.api.getChatMemberCount({
    chat_id: "@durov",
});
console.log(`Channel subscribers: ${count}`);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — bot must be a member of the chat |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot was removed — re-add it or handle the error gracefully |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Works on groups, supergroups, and channels.** For a private chat, it always returns `2` (the user and the bot).
- **Count may be approximate for large groups.** Telegram returns an approximate value for very large supergroups — don't rely on exact counts for critical logic.
- **`@username` works for public chats.** Pass `"@channelusername"` for public groups/channels without needing the numeric ID.
- **Cache the value if polling frequently.** The member count changes slowly — polling it on every message is wasteful. Cache with a short TTL instead.
- **Does not include bots in the count by default.** Telegram's member count typically includes bots; the exact inclusion depends on the chat type.

## See Also

- [getChatMember](/telegram/methods/getChatMember) — info about a specific member
- [getChatAdministrators](/telegram/methods/getChatAdministrators) — list all admins
- [getChat](/telegram/methods/getChat) — get full chat info including description and type
