---
title: setChatMenuButton — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Change the bot's menu button in a private chat or set the global default using GramIO. TypeScript examples for commands, Web App, and default button types.
  - - meta
    - name: keywords
      content: setChatMenuButton, telegram bot api, set menu button telegram bot, telegram web app button, MenuButtonCommands, MenuButtonWebApp, MenuButtonDefault, gramio setChatMenuButton, setChatMenuButton typescript, setChatMenuButton example, chat_id, menu_button, how to set menu button telegram bot
---

# setChatMenuButton

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setchatmenubutton" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to change the bot's menu button in a private chat, or the default menu button. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer" description="Unique identifier for the target private chat. If not specified, default bot's menu button will be changed" />

<ApiParam name="menu_button" type="MenuButton" description="A JSON-serialized object for the bot's new menu button. Defaults to [MenuButtonDefault](https://core.telegram.org/bots/api#menubuttondefault)" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Show the "Menu" button that opens the commands list (default Telegram behavior)
await bot.api.setChatMenuButton({
  chat_id: 123456789,
  menu_button: { type: "commands" },
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Launch a Web App from the menu button for a specific private chat
await bot.api.setChatMenuButton({
  chat_id: 123456789,
  menu_button: {
    type: "web_app",
    text: "Open App",
    web_app: { url: "https://my-mini-app.example.com" },
  },
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Change the default menu button for ALL private chats (no chat_id)
await bot.api.setChatMenuButton({
  menu_button: {
    type: "web_app",
    text: "Launch",
    web_app: { url: "https://my-mini-app.example.com" },
  },
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Reset the menu button to Telegram's default for a specific user
await bot.api.setChatMenuButton({
  chat_id: 123456789,
  menu_button: { type: "default" },
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set Web App button when user starts the bot, then confirm
bot.command("start", async (ctx) => {
  await bot.api.setChatMenuButton({
    chat_id: ctx.from?.id,
    menu_button: {
      type: "web_app",
      text: "Open Dashboard",
      web_app: { url: "https://my-mini-app.example.com" },
    },
  });
  await ctx.send("Menu button configured! Tap the button below.");
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` — ensure it's a valid private chat ID |
| 400 | `Bad Request: BUTTON_USER_PRIVACY_RESTRICTED` | User has restricted who can show them Web App buttons |
| 400 | `Bad Request: chat type is not supported` | `chat_id` points to a group/channel — this method only works for private chats |

## Tips & Gotchas

- **Private chats only.** `chat_id` must be a private chat (individual user). Groups and channels are not supported — passing a group or channel ID returns an error.
- **Omit `chat_id` for the global default.** When `chat_id` is omitted, the button is set as the default for all users who don't have a per-chat override. Per-chat buttons always take priority over the default.
- **Three button types available.** `"commands"` shows the command menu, `"web_app"` opens a Mini App URL with custom button text, and `"default"` resets to Telegram's built-in behavior (usually shows `"Menu"`).
- **`"web_app"` requires `text` and `web_app.url`.** The `text` field is the label shown on the button (up to ~512 chars); the URL must be HTTPS and must be an allowed domain for the bot.
- **Use `getChatMenuButton` to read the current state** before overwriting, in case you want to restore it later.
- **Per-user customization pattern.** Call `setChatMenuButton` in a `bot.command("start", ...)` handler to personalize the button experience for each user based on their state or role.

## See Also

- [`getChatMenuButton`](/telegram/methods/getChatMenuButton) — read the current menu button for a chat or default
- [`MenuButton`](/telegram/types/MenuButton) — union type: `MenuButtonCommands | MenuButtonWebApp | MenuButtonDefault`
- [`MenuButtonCommands`](/telegram/types/MenuButtonCommands) — type for the commands list button
- [`MenuButtonWebApp`](/telegram/types/MenuButtonWebApp) — type for the Web App launch button
- [`MenuButtonDefault`](/telegram/types/MenuButtonDefault) — type for the default Telegram button
