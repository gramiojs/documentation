---
title: Command - Handle specific bot commands

head:
    - - meta
      - name: "description"
        content: "Commands are specific words or phrases that usually begin with a `/` and are used to trigger actions or responses from the bot."

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, api, command, /start"
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
new Bot(process.env.BOT_TOKEN as string).command("start", (context) => {
    return context.send(`Hi!`);
});
```

> [!IMPORTANT]
> You don't need to include a `/` when specifying the command name. If you turn it on, you will get an `error`.

In this example, the bot listens for the `/start` command. When the command is received, the bot responds with a simple "Hi!" message.

### Example with Command Arguments

Here’s an example that demonstrates how to use arguments with commands:

```ts
new Bot(process.env.BOT_TOKEN as string).command("start", async (context) => {
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

<!-- ### Command Options

You can also pass additional options to customize how the command is handled. This could include setting parameters like `description`, `scope`, or `language_code`, although these options are omitted in this basic example. -->

<!-- ## Conclusion

The `command` method is a straightforward way to define how your bot should react to specific commands. Whether you’re handling basic commands like `/start` or more complex commands with arguments, `command` simplifies the process, ensuring your bot behaves as expected in response to user input.

This method is essential for creating interactive and command-driven bots in GramIO. -->
