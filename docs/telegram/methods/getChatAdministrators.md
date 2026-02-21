---
title: getChatAdministrators — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Get a list of administrators in a Telegram chat using GramIO. TypeScript examples for listing admins, checking admin status, and verifying bot rights. Returns ChatMember[].
  - - meta
    - name: keywords
      content: getChatAdministrators, telegram bot api, get chat administrators, gramio getChatAdministrators, telegram list admins, getChatAdministrators typescript, getChatAdministrators example, telegram check admin, chat admin list, chat_id, ChatMember, telegram administrator rights, how to get chat admins telegram bot, list administrators supergroup channel
---

# getChatAdministrators

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/ChatMember">ChatMember[]</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getchatadministrators" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get a list of administrators in a chat, which aren't bots. Returns an Array of [ChatMember](https://core.telegram.org/bots/api#chatmember) objects.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)" />

## Returns

On success, an array of [ChatMember](/telegram/types/ChatMember) objects is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// List all human administrators in the current chat
bot.command("admins", async (ctx) => {
    const admins = await bot.api.getChatAdministrators({
        chat_id: ctx.chat.id,
    });
    const names = admins.map((a) => a.user.first_name).join(", ");
    await ctx.send(`Administrators: ${names}`);
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Check if a specific user is an admin
async function isAdmin(chatId: number | string, userId: number) {
    const admins = await bot.api.getChatAdministrators({ chat_id: chatId });
    return admins.some((a) => a.user.id === userId);
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Verify whether the bot itself has admin rights
bot.command("amiadmin", async (ctx) => {
    const me = await bot.api.getMe();
    const admins = await bot.api.getChatAdministrators({
        chat_id: ctx.chat.id,
    });
    const isBotAdmin = admins.some((a) => a.user.id === me.id);
    await ctx.send(isBotAdmin ? "I am an admin!" : "I am not an admin.");
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Direct API call for a public channel by username
const admins = await bot.api.getChatAdministrators({
    chat_id: "@durov",
});
console.log(`${admins.length} admin(s) found`);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — verify the chat ID and ensure the bot is a member |
| 400 | `Bad Request: method is available for supergroup and channel chats only` | Called on a private chat or basic group — only works on supergroups and channels |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot was removed from the chat or never joined |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Bots are excluded from the results.** The method returns only human administrators. To check if the bot itself has admin rights, call `getMe()` and compare the bot's ID against the returned list.
- **Works on supergroups and channels only.** Calling this on a private chat or a basic group raises an error. Always check the chat type first.
- **Results may be cached briefly.** Telegram may serve a slightly stale admin list; don't rely on it for instant permission checks after a promotion.
- **The creator has `status: "creator"`.** Other admins have `status: "administrator"`. Filter by status to distinguish the owner from regular admins.
- **`@username` strings work for public chats.** Pass `"@channelusername"` for public supergroups and channels — no need to look up the numeric ID.
- **Custom titles are available.** For `ChatMemberAdministrator`, the `custom_title` field shows the admin's display title if one was set.

## See Also

- [getChatMember](/telegram/methods/getChatMember) — get info about a specific member
- [promoteChatMember](/telegram/methods/promoteChatMember) — grant or revoke admin rights
- [getChatMemberCount](/telegram/methods/getChatMemberCount) — total member count
- [getChat](/telegram/methods/getChat) — get general chat info
- [ChatMember](/telegram/types/ChatMember) — the returned union type
