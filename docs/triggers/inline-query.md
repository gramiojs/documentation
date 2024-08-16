---
title: inlineQuery - respond to inline queries sent by users

head:
    - - meta
      - name: "description"
        content: "An inline query is a special type of message where users can search for content from your bot by typing in the message input field without directly interacting with the bot."

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, api, inline_query, @pic"
---

# inlineQuery

The `inlineQuery` method in GramIO allows your bot to respond to inline queries sent by users. An inline query is a special type of message where users can search for content from your bot by typing in the message input field without directly interacting with the bot.

![feature preview](https://core.telegram.org/file/464001466/10e4a/r4FKyQ7gw5g.134366/f2606a53d683374703)

## Basic Usage

### Responding to an Inline Query with a Regular Expression

You can make your bot listen for specific inline queries that match a regular expression and respond with results. Here’s an example:

```ts
bot.inlineQuery(
    /find (.*)/i,
    async (context) => {
        if (context.args) {
            await context.answer([
                InlineQueryResult.article(
                    "id-1",
                    `Result for ${context.args.at(1)}`,
                    InputMessageContent.text(
                        `This is a message result for ${context.args.at(
                            1
                        )} query`
                    )
                ),
            ]);
        }
    }
);
```

In this example:

-   The bot listens for inline queries that match the pattern `search (.*)`.
-   If a match is found, the bot extracts the search term and returns a list of inline query results.

### Parameters

-   **`trigger`**: The condition that the inline query must meet. This can be a regular expression, a string, or a custom function.
    -   **Regular Expression**: Matches queries that fit a specific pattern.
    -   **String**: Matches an exact query string.
    -   **Function**: Evaluates the query based on custom logic. Should return true to match.
-   **`handler`**: The function that processes the inline query. It receives the `context` object, which includes details about the query and provides methods to respond.
-   **`options`**: Additional options for handling the result selection.
    -   **`onResult`**: A function that is triggered when the user selects an inline query result. It can be used to modify or update the message after selection. Use [ChosenInlineResult](/triggers/chosen-inline-result) under the hood.

> [!IMPORTANT]
> You can modify only messages which contains InlineKeyboard. More about [ChosenInlineResult](/triggers/chosen-inline-result).

### How `inlineQuery` Works

1. **Query Matching**: When a user types an inline query, the `inlineQuery` method checks if the query matches the provided `trigger`. This can be a direct match (string), a pattern match (regular expression), or a condition check (function).
2. **Handling the Query**: If the query matches, the `handler` function is called. Inside this function, you can access the query parameters, generate results, and send them back to the user using `context.answer()`.

3. **Responding to Result Selection**: If the `onResult` option is provided, the bot listens for when a user selects one of the inline query results. The provided function can then modify the message, for example, by editing the text.

### Example: Custom Inline Query Handler

Here’s a more detailed example that demonstrates using both the inline query trigger and handling result selection:

```ts
bot.inlineQuery(
    /find (.*)/i,
    async (context) => {
        if (context.args) {
            await context.answer(
                [
                    InlineQueryResult.article(
                        "result-1",
                        `Result for ${context.args[1]}`,
                        InputMessageContent.text(
                            `You searched for: ${context.args[1]}`,
                            {
                                reply_markup: new InlineKeyboard().text(
                                    "Get Details",
                                    "details-callback"
                                ),
                            }
                        )
                    ),
                ],
                {
                    cache_time: 0,
                }
            );
        }
    },
    {
        onResult: (context) => context.editText("You selected a result!"),
    }
);
```

In this example:

-   The bot listens for inline queries that start with `find` followed by a search term.
-   The bot responds with an inline query result that includes a button labeled "Get Details."
-   When the user selects this result, the bot edits the message to indicate that a selection was made.
