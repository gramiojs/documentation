---
title: Message matching with hears() - Responding to text patterns in GramIO

head:
    - - meta
      - name: "description"
        content: "Learn how to use the hears() method in GramIO to match and respond to specific text patterns in Telegram messages using strings, regular expressions, or custom functions."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, hears method, text matching, message patterns, regex matching, string matching, text triggers, pattern recognition, message handling, natural language processing, text filtering, message middleware, conversation handling"
---

<!-- ChatGPT helps -->

# Hears

The `hears` method in GramIO allows you to set up responses to specific messages. You can define what messages your bot should listen for and how it should handle when those messages are detected. The method is flexible and can work with regular expressions, exact strings, or custom functions.

## Basic Usage

### Using a `Regular Expression` matcher

You can make your bot listen for messages that match a specific pattern using regular expressions. This is useful when you want your bot to respond to messages that follow a certain structure.

```ts
bot.hears(/hello (.*)/i, async (context) => {
    if (context.args) {
        await context.send(`Hello, ${context.args[1]}!`);
    }
});
```

In this example, the bot listens for messages that start with "hello" followed by any text. When such a message is received, the bot extracts the text after "hello" and sends a personalized greeting.

### Using a `String` matcher

If you want your bot to respond to a specific word or phrase, you can use a string trigger.

```ts
bot.hears("start", async (context) => {
    await context.send("Welcome! Type 'help' to see available commands.");
});
```

In this case, the bot listens for the exact word "start" and replies with a welcome message.

### Using a `Function` matcher

For more advanced scenarios, you can use a function to define the trigger. This function checks the message context and decides whether to trigger the response.

```ts
bot.hears(
    (context) => context.user.role === "admin",
    async (context) => {
        await context.send("Hello, Admin! How can I assist you?");
    }
);
```

Here, the bot checks if the user is an admin. If so, it sends a special message for admins.

<!-- ## How `hears` Works

1. **String Trigger:** The bot compares the incoming message with the given string. If they match exactly, the bot runs the handler function.
2. **Regular Expression Trigger:** The bot checks if the message matches the regular expression. If it does, the handler function runs, and the matching parts of the message are passed to `context.args`.
3. **Function Trigger:** The bot runs the custom function you provide. If this function returns `true`, the handler function runs.

## Conclusion

The `hears` method is essential for creating bots that can listen for and respond to specific user inputs. Whether you're handling simple commands or complex interactions, `hears` makes it easy to define how your bot should react to different types of messages.

This method gives you the tools you need to create interactive and user-friendly bots in GramIO. -->
