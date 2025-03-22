---
title: Lazy-loading plugins in GramIO - Optimizing bot initialization

head:
    - - meta
      - name: "description"
        content: "Learn how to use lazy-loading for asynchronous plugins in GramIO Telegram bots. Understand the loading sequence and when to use await for proper plugin initialization."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, lazy loading, async plugins, plugin loading, bot initialization, optimize bot startup, await plugins, asynchronous plugin loading, plugin load sequence, delayed plugin initialization, performance optimization"
---

# Lazy-Loading Plugins

Plugins can be **lazy-loaded** if they are in an **asynchronous** function. Such plugins are always connected at the very **last** moment (during the **.start** call). If you want to call it **earlier**, put **await** in front of it.

## Example

```ts
const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(autoload()) // autoload is async
    .command("start", () => {
        // this command registered BEFORE than autoload
    });

bot.start(); // autoload is loaded here
```

You can fix that with **await**.

```ts
const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(await autoload()) // autoload is async but we await it
    .command("start", () => {
        // this command registered AFTER than autoload
    });

bot.start();
```

for now it works as expected!
