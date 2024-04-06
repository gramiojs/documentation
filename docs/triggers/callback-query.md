# Callback Query

> [!WARNING]
> `CallbackData` is very **experimental**

```ts
const someData = new CallbackData("example").number("id");

new Bot()
    .command("start", (context) =>
        context.send("some", {
            reply_markup: new InlineKeyboard().text(
                "example",
                someData.pack({
                    id: 1,
                })
            ),
        })
    )
    .callbackQuery(someData, (context) => {
        context.queryData; // is type-safe
    });
```
