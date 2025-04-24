---
title: Telegram Bot API - Как вызывать методы API в GramIO

head:
    - - meta
      - name: "description"
        content: Bot API - это высокоуровневый HTTP-интерфейс к Telegram API, который упрощает разработку ботов.

    - - meta
      - name: "keywords"
        content: телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, методы API, вызов методов, обертка API, телеграм методы, HTTP-интерфейс, TDLib, MTProto, отправка запросов, параметры методов, request limit, подавление исключений, типизация, вызов API, send, apiCall
---

# Bot API

> [Документация Telegram Bot API](https://core.telegram.org/bots/api)

[Bot API](https://core.telegram.org/bots/api) - это высокоуровневый HTTP-интерфейс к Telegram API, который упрощает разработку ботов.
Под капотом [Bot API](https://core.telegram.org/bots/api) использует TDLib (который, в свою очередь, использует MTProto API).

В то время как [Bot API](https://core.telegram.org/bots/api) может использоваться только для работы с аккаунтами ботов, MTProto API может использоваться для работы как с ботами, так и с аккаунтами пользователей.
Если вам необходимо работать с MTProto, мы рекомендуем библиотеку <a href="https://mtcute.dev/" target="_blank" rel="noopener noreferrer"  class="text-mtcute">
<img src="https://mtcute.dev/mtcute-logo.svg" alt="MtCute Logo" width="32" height="32" style="vertical-align:middle;    display: inline-block;">mtcute</a>.

## Вызов Bot API

Вы можете вызывать методы Telegram Bot API через `bot.api` или через сокращенные методы контекстов (например, `context.send` - это сокращение для `sendMessage`)

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
const response = await bot.api.sendMessage({
    // ^?
    //
    //
    chat_id: "@gramio_forum",
    text: "текст сообщения",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.on("message", (context) =>
    context.send("Это сообщение будет отправлено в текущий чат")
);
```

### Подавление ошибок

Бывает удобно обрабатывать ошибку на месте без использования блоков **try/catch**. Для этого был создан аргумент `suppress`, который можно использовать в **любом** методе API.

```ts twoslash
import { Bot, TelegramError } from "gramio";

const bot = new Bot("");
// ---cut---
const response = await bot.api.sendMessage({
    // ^?
    //
    //
    suppress: true,
    chat_id: "@not_found",
    text: "Метод с подавлением ошибок",
});

if (response instanceof TelegramError)
    console.error("sendMessage вернул ошибку...");
else console.log("Сообщение успешно отправлено");
```

### Обработка Rate-Limit

По умолчанию, GramIO не обрабатывает 429 (rate limit) ошибки, но предоставляет утилиту для их обработки.

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
import { withRetries } from "gramio/utils";

const response = await withRetries(() =>
    bot.api.sendMessage({
        chat_id: "@gramio_forum",
        text: "текст сообщения",
    })
);
response;
// ^?
```

`withRetries` будет ждать необходимое время указанное в `retryDelay` у ошибки `TelegramError` и только после успешного выполнения запроса, вернет результат.

Этот метод ловит **выброшенную** или **возвращенную** ошибку `TelegramError` так что вы можете использовать и с `context.*` или своими обёртками.

Подробнее о [rate limits](/ru/rate-limits)

### Типы

GramIO реэкспортирует [@gramio/types](https://www.npmjs.com/package/@gramio/types) (кодо-генерируемые и автоматически публикуемые типы Telegram Bot API).

[Подробнее](/ru/types/index.html)

```ts twoslash
import type { APIMethodParams, APIMethodReturn } from "gramio";

type SendMessageParams = APIMethodParams<"sendMessage">;
//   ^? type SendMessageParams = SendMessageParams
//

type GetMeReturn = APIMethodReturn<"getMe">;
//   ^? type GetMeReturn = TelegramUser
//
```

Например, вы можете использовать их в вашей собственной функции.

```ts twoslash
import type { APIMethodParams } from "gramio";

// ---cut---
function myCustomSend(params: APIMethodParams<"sendMessage">) {
    params;
    // ^?
}
```

#### Типы для методов с подавлением ошибок

```ts twoslash
import type {
    SuppressedAPIMethodParams,
    SuppressedAPIMethodReturn,
} from "gramio";

type SendMessageParams = SuppressedAPIMethodParams<"sendMessage">;
//   ^? type SendMessageParams = SendMessageParams
//

type GetMeReturn = SuppressedAPIMethodReturn<"getMe">;
//   ^? type GetMeReturn = TelegramUser
//
```

### Отладка

Для отладки запросов, которые отправляет GramIO, вы можете установить переменную окружения `DEBUG=gramio:api:*`

```bash
npx cross-env DEBUG=gramio:api:* node index.js
```

И вы увидите что-то подобное в консоли:

```bash
gramio:api:getUpdates options: {"method":"POST","headers":{"Content-Type":"application/json"},"body":"{\"offset\":0,\"suppress\":true}"} +0ms
gramio:api:getUpdates response: {"ok":true,"result":[]} +49ms
```

Также, если вы используете [Bun](https://bun.sh), вы можете использовать переменную окружения `BUN_CONFIG_VERBOSE_FETCH` для логирования сетевых запросов. [Подробнее](https://bun.sh/docs/runtime/debugger#debugging-network-requests).

```sh
BUN_CONFIG_VERBOSE_FETCH=curl bun src/index.ts
```

И логи будут выглядеть так:

```curl
[fetch] > HTTP/1.1 POST https://example.com/
[fetch] > content-type: application/json
[fetch] > Connection: keep-alive
[fetch] > User-Agent: Bun/1.1.14
[fetch] > Accept: */*
[fetch] > Host: example.com
[fetch] > Accept-Encoding: gzip, deflate, br
[fetch] > Content-Length: 13

[fetch] < 200 OK
[fetch] < Accept-Ranges: bytes
[fetch] < Cache-Control: max-age=604800
[fetch] < Content-Type: text/html; charset=UTF-8
[fetch] < Date: Tue, 18 Jun 2024 05:12:07 GMT
[fetch] < Etag: "3147526947"
[fetch] < Expires: Tue, 25 Jun 2024 05:12:07 GMT
[fetch] < Last-Modified: Thu, 17 Oct 2019 07:18:26 GMT
[fetch] < Server: EOS (vny/044F)
[fetch] < Content-Length: 1256
```

### Оптимизация старта вместе с Bun: --fetch-preconnect

Если вы запускаете своего бота с помощью Bun, вы можете использовать CLI-флаг `--fetch-preconnect=<url>`, чтобы ускорить первый сетевой запрос к серверам Telegram. Этот флаг сообщает Bun начать устанавливать соединение (DNS, TCP, TLS) с указанным хостом до запуска вашего кода, чтобы первый API-запрос был быстрее.

Пример:

```bash
bun --fetch-preconnect=https://api.telegram.org:443/ ./src/bot.ts
```

Это особенно полезно для ботов, где первое действие — обращение к Telegram API. С этим флагом Bun "разогреет" соединение на этапе старта, и ваш бот будет готов отправлять запросы с меньшей задержкой. Общее время старта может немного увеличиться, но время до первого успешного API-запроса уменьшится. В основном это не мешает, но меньше ощущается когда первый запрос отправляется сразу после запуска процесса.

Подробнее в [документации Bun](https://bun.sh/docs/api/fetch#preconnect-to-a-host).
