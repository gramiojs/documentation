---
title: onStart hook in GramIO - Handling bot startup event

head:
    - - meta
      - name: "description"
        content: "The onStart hook in GramIO is called when the bot is started. Get information about the bot, connected plugins, and the update method on startup."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, onStart, bot startup, bot initialization, bot start, bot lifecycle, startup handling, start events, webhook setup, long polling setup, plugins on startup, bot information, initial configuration, getMe data"
---

# onStart

This hook is called when the bot `starts`.

## Parameters

```ts
{
		plugins: string[];
		info: TelegramUser;
		updatesFrom: "webhook" | "long-polling";
}
```

- plugins - list of plugins
- info - bot account info
- updatesFrom - webhook/polling

## Example

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string).onStart(
    ({ plugins, info, updatesFrom }) => {
        console.log(`plugin list - ${plugins.join(", ")}`);
        console.log(`bot username @${info.username}`);
        console.log(`updates from ${updatesFrom}`);
    }
);

bot.start();
```
