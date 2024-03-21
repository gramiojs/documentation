# Bot API

[Bot API](https://core.telegram.org/bots/api) is a high-level HTTP interface to the Telegram API that makes it easy to develop bots.
Under the hood, [Bot API](https://core.telegram.org/bots/api) uses TDLib (which in turn uses MTProto API).

While the [Bot API](https://core.telegram.org/bots/api) can only be used to work with bot accounts, the MTProto API can be used to work with both bot and user accounts.
If you need to work with MTProto, we recommend you the <a href="https://mtcute.dev/" target="_blank" rel="noopener noreferrer">
<img src="https://mtcute.dev/mtcute-logo.svg" alt="MtCute Logo" width="32" height="32" style="vertical-align:middle;    display: inline-block;">mtcute</a> library.

[Telegram Bot API documentation](https://core.telegram.org/bots/api)

## Calling the Bot API

You can call Telegram Bot API methods via `bot.api` or via the shorthand methods of contexts (for example, `context.send` is `sendMessage` shorthand)

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
const response = await bot.api.sendMessage({
    // ^?
    //
    //
    chat_id: "@gramio_forum",
    text: "some text",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.on("message", (context) =>
    context.send("This message will be sent to the current chat")
);
```

### Types

GramIO re-exports [@gramio/types](https://www.npmjs.com/package/@gramio/types) (Code-generated and Auto-published Telegram Bot API types).

[Read more](/types/index.html)

```ts twoslash
import type { APIMethodParams, APIMethodReturn } from "gramio";

type SendMessageParams = APIMethodParams<"sendMessage">;
//   ^? type SendMessageParams = SendMessageParams
//

type GetMeReturn = APIMethodReturn<"getMe">;
//   ^? type GetMeReturn = TelegramUser
//
```

For example you can use it in your custom function.

```ts twoslash
import type { APIMethodParams } from "gramio";

// ---cut---
function myCustomSend(params: APIMethodParams<"sendMessage">) {
    params;
    // ^?
}
```
