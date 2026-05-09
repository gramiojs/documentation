---
title: Command handling in Telegram bots - Processing /commands with GramIO

head:
    - - meta
      - name: "description"
        content: "Learn how to handle Telegram bot commands like /start and /help with GramIO. Create command handlers, use middleware, and implement prefix customization."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, command handler, /start command, /help command, bot commands, command prefix, BotFather commands, setMyCommands, command arguments, command parameters, command middleware, command filtering, bot command menu"
---

# Command

The command method in GramIO allows you to create handlers for specific [bot commands](https://core.telegram.org/bots/features#commands). Commands are specific words or phrases that usually begin with a `/` and are used to trigger actions or responses from the bot.

Telegram apps will:

-   **Highlight** commands in messages. When the user taps a highlighted command, that command is immediately sent again.
-   Suggest a **list of supported commands** with descriptions when the user enters a `/` (for this to work, you need to have provided a list of commands to [@BotFather](https://t.me/botfather) or via the [appropriate API method](https://core.telegram.org/bots/api#setmycommands)). Selecting a command from the list immediately sends it.
-   Show a [menu button](https://core.telegram.org/bots/features#menu-button) containing all or some of a bot’s commands (which you set via [@BotFather](https://t.me/botfather)).

Commands must always start with the `/` symbol and contain **up to 32 characters**. They can use **Latin letters**, **numbers** and **underscores**, though simple lowercase text is recommended for a cleaner look.

> [!IMPORTANT]
> The command can also be triggered using the full command with the bot's username, such as `/start@name_bot`.

![](https://core.telegram.org/file/464001775/10227/HCr0XgSUHrg.119089/c17ff5d34fe528361e)

## Basic Usage

### Registering a Simple Command

You can use the `command` method to make your bot respond to specific commands. Here’s a basic example:

```ts
bot.command("start", (context) => {
    return context.send(`Hi!`);
});
```

> [!IMPORTANT]
> You don't need to include a `/` when specifying the command name. If you turn it on, you will get an `error`.

In this example, the bot listens for the `/start` command. When the command is received, the bot responds with a simple "Hi!" message.

### Example with Command Arguments

Here’s an example that demonstrates how to use arguments with commands:

```ts
bot.command("start", async (context) => {
    return context.send(
        `You entered the command /start with arguments: ${context.args}`
    );
});
```

In this scenario, if a user sends `/start arg1 arg2`, the bot will respond with `You entered the command /start with arguments: arg1 arg2`.

### How `command` Works

1. **Command Recognition:** The bot checks the message for a command (e.g., `/start`). Commands are typically indicated by the [`bot_command` entity](https://core.telegram.org/bots/api#messageentity) in Telegram messages.

2. **Command Matching:** The bot compares the detected command against the command you specified in the `command` method.

3. **Handling Commands with Bot Username:** The command is also recognized if it includes the bot's username, such as `/start@name_bot`.

4. **Command Arguments:** If there are additional arguments following the command (e.g., `/start arg1 arg2`), these are passed to `context.args` for further processing.

## Command metadata & `bot.syncCommands()`

Since gramio v0.9, `bot.command()` accepts an optional `CommandMeta` object **between** the command name and the handler. The metadata is collected at registration time and flushed to Telegram with a single `bot.syncCommands()` call — no need to hand-craft `setMyCommands` invocations or pre-build the menu in BotFather.

```ts
const bot = new Bot(process.env.BOT_TOKEN!)
    .command("start", { description: "Start the bot" }, (ctx) => ctx.send("Hi!"))
    .command(
        "help",
        {
            description: "Show help",
            locales: { ru: "Помощь", uk: "Допомога" },
        },
        (ctx) => ctx.send("Help!"),
    )
    .command(
        "admin",
        {
            description: "Admin panel",
            scopes: [{ type: "chat_administrators" }],
        },
        adminHandler,
    )
    .command("debug", { hide: true }, debugHandler);

bot.onStart(() => bot.syncCommands());
await bot.start();
```

### `CommandMeta` fields

| Field | Type | Description |
|---|---|---|
| `description` | `string` | Shown in Telegram's command menu. Required to register the command in the menu. |
| `locales` | `Record<string, string>` | Per-language descriptions. Keys are Telegram `language_code` values. Use [`@gramio/i18n`'s `localesFor()`](/plugins/official/i18n) to drive these from translation files. |
| `scopes` | `BotCommandScope[]` | Limit the command to specific contexts — `default`, `all_private_chats`, `all_group_chats`, `all_chat_administrators`, `chat`, `chat_administrators`, `chat_member`. |
| `hide` | `boolean` | Skip this command from the menu. Useful for debug/internal commands that you still want as `/`-typed handlers. |

### How `syncCommands()` works

`bot.syncCommands()` groups commands by scope, computes a hash per scope, and only calls Telegram's [`setMyCommands`](/telegram/methods/setMyCommands) for scopes whose hash has changed since the last run. So calling it on every `onStart` is cheap — unchanged metadata doesn't burn rate-limit budget. Pass `{ exclude: ["debug"] }` to skip individual commands at sync time.

The plain two-argument form `bot.command(name, handler)` still works for commands you don't want listed in the menu.
