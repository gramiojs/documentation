---
title: reaction - handle changes in reactions on a message

head:
    - - meta
      - name: "description"
        content: "This method allows your bot to respond when a user reacts to a message with an emoji. By specifying the trigger (which emoji to listen for) and the corresponding handler, you can customize how your bot responds to these interactions."

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, api, reaction, thumb up"
---

# reaction

The `reaction` method is used to register a handler for changes in reactions on a message. This method allows your bot to respond when a user reacts to a message with an emoji. By specifying the trigger (which emoji to listen for) and the corresponding handler, you can customize how your bot responds to these interactions.

## Key Features

### Handling Reactions

To use the `reaction` method, you define a trigger (or multiple triggers) and a handler. The trigger is the emoji (or emojis) that, when reacted to a message, will cause the handler to execute.

```ts
bot.reaction("👍", async (context) => {
    await context.reply(`Thank you!`);
});
```

In this example:

-   The `reaction` method is called with the trigger `"👍"`, which is an emoji.
-   Whenever a user reacts to a message with a thumbs-up emoji (`👍`), the bot will execute the handler and reply with "Thank you!".

### Trigger Types

The `trigger` parameter can be a single emoji or an array of emojis. The handler will execute if any of the specified emojis are used.

```ts
bot.reaction(["👍", "❤️"], async (context) => {
    await context.reply(`Thanks for your reaction!`);
});
```

In this example:

-   The bot will respond if a user reacts with either a thumbs-up (`👍`) or a heart (`❤️`).
