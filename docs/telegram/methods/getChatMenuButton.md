---
title: getChatMenuButton — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Get the current menu button for a Telegram bot's private chat using GramIO. TypeScript examples for reading per-chat and default menu button configurations. Returns MenuButton.
  - - meta
    - name: keywords
      content: getChatMenuButton, telegram bot api, get chat menu button, gramio getChatMenuButton, telegram menu button, getChatMenuButton typescript, getChatMenuButton example, MenuButton, telegram bot menu, MenuButtonWebApp, MenuButtonCommands, MenuButtonDefault, how to get telegram bot menu button, chat_id
---

# getChatMenuButton

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/MenuButton">MenuButton</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getchatmenubutton" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. Returns [MenuButton](https://core.telegram.org/bots/api#menubutton) on success.

## Parameters

<ApiParam name="chat_id" type="Integer" required description="Unique identifier for the target private chat. If not specified, default bot's menu button will be returned" />

## Returns

On success, the [MenuButton](/telegram/types/MenuButton) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get the default menu button (no chat_id = global default)
const defaultButton = await bot.api.getChatMenuButton({});
console.log(`Default menu button type: ${defaultButton.type}`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Read the menu button configured for a specific private chat
bot.command("menuinfo", async (ctx) => {
    const button = await bot.api.getChatMenuButton({
        chat_id: ctx.chat.id,
    });
    if (button.type === "web_app") {
        await ctx.send(`Menu opens Web App: ${button.web_app.url}`);
    } else if (button.type === "commands") {
        await ctx.send("Menu shows the bot command list.");
    } else {
        await ctx.send("Using Telegram's default menu button.");
    }
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Audit whether a private chat has a custom menu button vs the global default
async function hasCustomMenuButton(chatId: number) {
    const [chatButton, defaultButton] = await Promise.all([
        bot.api.getChatMenuButton({ chat_id: chatId }),
        bot.api.getChatMenuButton({}),
    ]);
    return chatButton.type !== defaultButton.type;
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid `chat_id` — must be an existing private chat the bot has had contact with |
| 400 | `Bad Request: method is available for private chats only` | `chat_id` points to a group or channel — only private chats are supported |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Only works for private chats.** Passing a group or channel `chat_id` returns an error. The menu button concept applies only to the bot's 1-on-1 chats with users.
- **Omit `chat_id` entirely to read the global default.** When no `chat_id` is provided, the method returns the default menu button shown to all private-chat users who don't have a per-chat override.
- **Three possible button types.** The result will be `MenuButtonCommands` (shows the `/commands` list), `MenuButtonWebApp` (opens a Web App URL), or `MenuButtonDefault` (Telegram's own default behaviour).
- **Pair with `setChatMenuButton` for read-modify-write flows.** Read the current button with `getChatMenuButton`, modify as needed, then write back with `setChatMenuButton`.
- **Per-chat overrides take precedence over the global default.** A chat-specific button is shown instead of the default; if no override exists, the default is used.

## See Also

- [setChatMenuButton](/telegram/methods/setChatMenuButton) — set the menu button for a chat or the default
- [MenuButton](/telegram/types/MenuButton) — the returned union type (`MenuButtonCommands`, `MenuButtonWebApp`, `MenuButtonDefault`)
