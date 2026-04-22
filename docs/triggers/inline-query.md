---
title: Inline Query handling in Telegram bots - Search-as-you-type with GramIO

head:
    - - meta
      - name: "description"
        content: "Learn how to implement inline queries in your Telegram bot with GramIO. Create search-as-you-type functionality that works directly in any chat using @YourBot queries."

    - - meta
      - name: "keywords"
        content: "telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, inline query, inline mode, @bot search, inline results, answerInlineQuery, InlineQueryResult, inline articles, inline media, inline buttons, search functionality, query matching, inline thumbnails, inline caching, InlineQuery, search-as-you-type"
---

# inlineQuery

The `inlineQuery` method in GramIO allows your bot to respond to inline queries sent by users. An inline query is a special type of message where users can search for content from your bot by typing in the message input field without directly interacting with the bot.

![feature preview](https://core.telegram.org/file/464001466/10e4a/r4FKyQ7gw5g.134366/f2606a53d683374703)

[Telegram documentation](https://core.telegram.org/bots/inline)

> [!WARNING]
> You should enable this options via [@BotFather](https://telegram.me/botfather). Send the `/setinline` command, select the bot and provide the placeholder text that the user will see in the input field after typing your bot's name.

## Basic Usage

### Responding to an Inline Query with a Regular Expression

You can make your bot listen for specific inline queries that match a regular expression and respond with results. Here's an example:

```ts
bot.inlineQuery(/find (.*)/i, async (context) => {
    if (context.args) {
        await context.answer([
            InlineQueryResult.article(
                "id-1",
                `Result for ${context.args.at(1)}`,
                InputMessageContent.text(
                    `This is a message result for ${context.args.at(1)} query`
                )
            ),
        ]);
    }
});
```

In this example:

-   The bot listens for inline queries that match the pattern `search (.*)`.
-   If a match is found, the bot extracts the search term and returns a list of inline query results.

> [!TIP]
> `context.answer()` accepts [`answerInlineQuery`](/telegram/methods/answerInlineQuery) parameters as a second argument. The most notable is **`cache_time`** — how long Telegram caches results on its servers (default **300 s**). Pass `cache_time: 0` for dynamic results that change with every keystroke — and especially during development. See [`context.answer()` options](#context-answer-options) below for all the useful ones.

> [!WARNING] Thumbnail constraints
> `thumbnail_url` on any `InlineQueryResult*` variant (`article`, `photo`, `video`, `document`, `gif`, etc.) must be a **JPEG** URL — PNG or WebP silently fails in some Telegram clients and the preview simply disappears instead of falling back to a default. Keep the image **≤320×320 px** and **≤200 KB**; oversized JPEGs fail the same way. If previews don't render and the URL is otherwise reachable, check the format and dimensions first.

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

Here's a more detailed example that demonstrates using both the inline query trigger and handling result selection:

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
                            `You searched for: ${context.args[1]}`
                        ),
                        {
                            reply_markup: new InlineKeyboard().text(
                                "Get Details",
                                "details-callback"
                            ),
                        }
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

## `context.answer()` options

The second argument to `context.answer()` accepts all the regular [`answerInlineQuery`](/telegram/methods/answerInlineQuery) params. The four you will reach for most often:

### `button` — prompt the user to log in, onboard, or open a Mini App

Inline mode runs inside any chat — it can't show your bot's private UI, accept file uploads, or do multi-step flows. When serving results requires something inline mode can't do (authentication, connecting a third-party account, accepting terms, configuring settings), return an **empty** `results` array plus a top `button` that sends the user somewhere your bot can run those flows.

`InlineQueryResultsButton` is a discriminated union — provide **exactly one** of:

- **`start_parameter`** — opens a private chat and fires `/start <parameter>`, which reaches your `bot.command("start")` handler as `ctx.args`. 1-64 characters, only `A-Z`, `a-z`, `0-9`, `_`, `-`.
- **`web_app`** — launches a Mini App. See [TMA guide](/tma/overview).

```ts
bot.inlineQuery(async (ctx) => {
    if (!(await isAuthenticated(ctx.from.id))) {
        return ctx.answer([], {
            cache_time: 0, // don't cache the login prompt
            is_personal: true, // it's per-user
            button: {
                text: "Log in to continue",
                start_parameter: "login-inline",
            },
        });
    }

    // ...normal results once authenticated
});

// In your /start command — receive the deep-link payload
bot.command("start", (ctx) => {
    if (ctx.args === "login-inline") {
        return ctx.send("Let's get you logged in…");
    }
});
```

This is the canonical "user is not authorized → redirect to PM" pattern for inline bots — there is no way for the bot to push the user to a private chat from inline mode on its own. The `button` is the escape hatch.

### `is_personal` — per-user results (disables shared cache)

Pass `is_personal: true` whenever results depend on the current user (their subscriptions, favorites, permissions). Without it, one user's personalized results can leak to another user running the same query, because Telegram shares the cache across users by default.

### `next_offset` — pagination

Pass a short token (max **64 bytes**) to signal "more results available". When the user scrolls to the end of your response, Telegram reissues the query and the token arrives as `ctx.inlineQuery.offset`. Pass an empty string to signal "no more".

```ts
bot.inlineQuery(async (ctx) => {
    const page = Number(ctx.inlineQuery.offset) || 0;
    const { items, hasMore } = await fetchPage(page);

    return ctx.answer(
        items.map((i) =>
            InlineQueryResult.article(
                i.id,
                i.title,
                InputMessageContent.text(i.body)
            )
        ),
        { next_offset: hasMore ? String(page + 1) : "" }
    );
});
```

### `cache_time` — shared-cache duration

Telegram caches your response for identical queries across all users for this many seconds (default **300**). Set **`0`** during development and for dynamic content. Combine with `is_personal: true` when per-user results should still be briefly cached for the same user.
