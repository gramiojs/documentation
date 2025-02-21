---
title: chosenInlineResult - Handle updates when a user selects one of the results returned by an inline query

head:
    - - meta
      - name: "description"
        content: "This method is particularly useful when you need to perform additional actions after the user has chosen a specific result from the inline query suggestions.

You should enable collecting feedback in @BotFather."

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, api, chosen inline result, inline result, @pic"
---

# chosenInlineResult

The `chosenInlineResult` method in GramIO allows your bot to handle updates when a user selects one of the results returned by an [inline query](/triggers/inline-query). This method is particularly useful when you need to perform additional actions after the user has chosen a specific result from the inline query suggestions.

You should enable [collecting feedback](https://core.telegram.org/bots/inline#collecting-feedback) in [@BotFather](https://telegram.me/botfather).

> To know which of the provided results your users are sending to their chat partners, send [@Botfather](https://telegram.me/botfather) the `/setinlinefeedback` command. With this enabled, you will receive updates on the results chosen by your users.

> Please note that this can create load issues for popular bots – you may receive more results than actual requests due to caching (see the cache_time parameter in [answerInlineQuery](https://core.telegram.org/bots/api#answerinlinequery)). For these cases, we recommend adjusting the probability setting to receive 1/10, 1/100 or 1/1000 of the results.

We recommend you set it to `100%` (each click on the [inline query](/triggers/inline-query) result will produce this event).

## Basic Usage

> [!WARNING]
> You must specify the same matcher (String, Regex, Function) as [InlineQuery](/triggers/inline-query) to get the results of clicking on this one or use `onResult` option at [InlineQuery](/triggers/inline-query) trigger.

### Handling Chosen Inline Results

The `chosenInlineResult` method registers a handler that is triggered whenever a user selects a result from the inline query response. You can define a trigger that determines when the handler should be invoked, similar to how you define triggers in the `inlineQuery` method.

```ts
bot.chosenInlineResult(/search (.*)/i, async (context) => {
    const selectedResult = context.resultId;
    const queryParams = context.args;

    // You can edit messages only with InlineKeyboard
    if (queryParams && context.inlineMessageId) {
        await context.editText(
            `You selected a result with ID: ${selectedResult} for query: ${queryParams[1]}`
        );
    }
});
```

In this example:

-   The bot listens for any result selection that matches the regular expression `search (.*)`.
-   If a result is selected that matches the trigger, the bot extracts the result ID and query parameters.
-   The bot then edits the message to indicate which result was selected.

### Trigger Types

The `chosenInlineResult` method supports the same types of triggers as the `inlineQuery` method:

-   **String Trigger**: The handler is triggered if the `query` exactly matches the specified string.
-   **RegExp Trigger**: The handler is triggered if the `query` matches the regular expression.
-   **Function Trigger**: The handler is triggered based on a custom function that returns `true` or `false`.
