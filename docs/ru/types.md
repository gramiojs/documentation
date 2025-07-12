---
title: Типы данных Telegram Bot API - Полное определение TypeScript типов

head:
    - - meta
      - name: "description"
        content: "Изучите автоматически сгенерированные TypeScript типы для Telegram Bot API, используемые в GramIO. Полная типизация всех методов, объектов и параметров API для улучшения разработки с автодополнением и проверкой типов."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, определения типов, типы TypeScript, Update типы, Message типы, InlineKeyboardMarkup, ReplyKeyboardMarkup, типы методов API, интерфейсы Telegram, строгая типизация, автодополнение кода, версионирование типов, APIResponseType, API6.9, Updates, автогенерация типов, справочник типов, хуки типов, middleware типы, WebhookInfo, версии API, обновления типов"
---

# Типы Telegram Bot API

> Автоматически сгенерированные и опубликованные типы Telegram Bot API

[Справочник по типам API](https://jsr.io/@gramio/types/doc)

### Версионирование

Типы 7.7.x соответствуют Telegram Bot API 7.7

## Использование в качестве [пакета NPM](https://www.npmjs.com/package/@gramio/types)

```ts twoslash
import type { APIMethods, APIMethodReturn } from "@gramio/types";

type SendMessageReturn = Awaited<ReturnType<APIMethods["sendMessage"]>>;
//   ^? type SendMessageReturn = TelegramMessage

type GetMeReturn = APIMethodReturn<"getMe">;
//   ^? type GetMeReturn = TelegramUser
```

### Автоматическое обновление пакета

Эта библиотека автоматически обновляется до последней версии Telegram Bot API в случае изменений благодаря CI/CD!
Если GitHub Action завершается с ошибкой, это означает, что в Bot API нет изменений.

## Импорты

-   `index` - экспортирует всё в разделе
-   `methods` - экспортирует `APIMethods`, который описывает функции API
-   `objects` - экспортирует объекты с префиксом `Telegram` (например, [Update](https://core.telegram.org/bots/api/#update))
-   `params` - экспортирует параметры, которые используются в `methods`

### Создайте свою собственную обертку Telegram Bot API с проверкой типов

```ts twoslash
import type {
    APIMethods,
    APIMethodParams,
    TelegramAPIResponse,
} from "@gramio/types";

const TBA_BASE_URL = "https://api.telegram.org/bot";
const TOKEN = "";

const api = new Proxy({} as APIMethods, {
    get:
        <T extends keyof APIMethods>(_target: APIMethods, method: T) =>
        async (params: APIMethodParams<T>) => {
            const response = await fetch(`${TBA_BASE_URL}${TOKEN}/${method}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
            });

            const data = (await response.json()) as TelegramAPIResponse;
            if (!data.ok) throw new Error(`Some error occurred in ${method}`);

            return data.result;
        },
});

api.sendMessage({
    chat_id: 1,
    text: "message",
});
```

#### Использование с [`@gramio/keyboards`](https://github.com/gramiojs/keyboards)

```typescript twoslash
import type {
    APIMethods,
    APIMethodParams,
    TelegramAPIResponse,
} from "@gramio/types";

const TBA_BASE_URL = "https://api.telegram.org/bot";
const TOKEN = "";

const api = new Proxy({} as APIMethods, {
    get:
        <T extends keyof APIMethods>(_target: APIMethods, method: T) =>
        async (params: APIMethodParams<T>) => {
            const response = await fetch(`${TBA_BASE_URL}${TOKEN}/${method}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
            });

            const data = (await response.json()) as TelegramAPIResponse;
            if (!data.ok) throw new Error(`Some error occurred in ${method}`);

            return data.result;
        },
});
// ---cut---
import { Keyboard } from "@gramio/keyboards";

// код из примера выше

api.sendMessage({
    chat_id: 1,
    text: "message with keyboard",
    reply_markup: new Keyboard().text("button text"),
});
```

### С поддержкой загрузки файлов

См. [files/usage-without-gramio](/ru/files/usage-without-gramio)

## Генерация типов вручную

Требуется - [`rust`](https://www.rust-lang.org/)

1. Клонируйте [этот репозиторий](https://github.com/gramiojs/types) и откройте его

```bash
git clone https://github.com/gramiojs/types.git
```

2. Клонируйте [репозиторий](https://github.com/ark0f/tg-bot-api) с генератором схемы Telegram Bot API

```bash
git clone https://github.com/ark0f/tg-bot-api.git
```

3. Запустите генератор схемы JSON в папке `cloned`

```bash
cd tg-bot-api && cargo run --package gh-pages-generator --bin gh-pages-generator -- dev && cd ..
```

4. Запустите генерацию кода типов из `корня` проекта

```bash
bun generate
```

или, если вы не используете `bun`, используйте `tsx`

```bash
npx tsx src/index.ts
```

5. Готово! Проверьте типы Telegram Bot API в папке `out`! 