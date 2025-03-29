---
title: onStop hook in GramIO - Handling bot shutdown event

head:
    - - meta
      - name: "description"
        content: "The onStop hook in GramIO is called when the bot is stopped. Learn how to properly terminate your bot and free up resources."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, onStop, bot shutdown, bot termination, graceful shutdown, proper termination, resource release, connection closing, bot lifecycle, shutdown event, resource cleanup, data saving on shutdown"
---

# onStop

This hook is called when the bot is stopped.

## Parameters

```ts
{
		plugins: string[];
		info: TelegramUser;
}
```

- plugins - list of plugins
- info - bot account info

## Example

```ts twoslash
// @noErrors
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string).onStop(
    ({ plugins, info }) => {
        console.log(`plugin list - ${plugins.join(", ")}`);
        console.log(`bot username @${info.username}`);
    }
);

bot.start();
bot.stop();
```
