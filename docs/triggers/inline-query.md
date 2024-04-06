# Inline Query

```ts
new Bot().inlineQuery(
    /regular expression with (.*)/i,
    async (context) => {
        if (context.args) {
            await context.answer(
                [
                    InlineQueryResult.article(
                        "id-1",
                        context.args[1],
                        InputMessageContent.text("some"),
                        {
                            reply_markup: new InlineKeyboard().text(
                                "some",
                                "callback-data"
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
        onResult: (context) => context.editText("Message edited!"),
    }
);
```
