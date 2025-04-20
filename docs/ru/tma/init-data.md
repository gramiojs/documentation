---
title: Проверка WebAppInitData в Telegram Mini Apps - Валидация данных инициализации

head:
    - - meta
      - name: "description"
        content: "Узнайте, как проверять и валидировать данные инициализации (init-data) в Telegram Mini Apps с помощью библиотеки @gramio/init-data. Обеспечьте безопасность взаимодействия между вашим ботом и веб-приложением."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, WebAppInitData, init-data, проверка подписи, валидация данных, query_id, user, auth_date, hash, проверка хэша, безопасность TMA, шифрование, HMAC, проверка целостности, передача данных, веб-приложения, Telegram Mini Apps, WebAppData, безопасный обмен данными"
---

# Валидация WebAppInitData

`@gramio/init-data` — это библиотека на TypeScript для безопасной проверки, разбора и генерации строк инициализации (init data) Telegram Web App. Она предоставляет набор утилит для работы с init data Telegram Mini App, обеспечивая целостность и подлинность пользовательских данных, передаваемых из Telegram-клиента на ваш сервер. Библиотека не зависит от фреймворка.

Основные возможности:

-   Проверка подлинности init data Telegram Web App с помощью токена бота
-   Разбор и получение структурированных данных пользователя и чата из строки init data
-   Генерация валидных строк init data для тестирования и документации
-   Строгие типы TypeScript для всех структур и методов

[Документация и справочник](https://jsr.io/@gramio/init-data@latest/doc)

## Установка

::: code-group

```bash [npm]
npm install @gramio/init-data
```

```bash [yarn]
yarn add @gramio/init-data
```

```bash [pnpm]
pnpm add @gramio/init-data
```

```bash [bun]
bun install @gramio/init-data
```

:::

# getBotTokenSecretKey

Получает секретный ключ из токена вашего Telegram-бота. Этот ключ необходим для проверки хэша строки init data, отправленной из Telegram Web App. Всегда используйте этот метод для генерации ключа перед валидацией или подписью init data, если хотите максимальную производительность. Если не передавать ключ в методы проверки, он будет вычисляться **при каждом вызове**.

```ts
import { getBotTokenSecretKey } from "@gramio/init-data";

const botToken = process.env.BOT_TOKEN as string;
const secretKey = getBotTokenSecretKey(botToken);
// используйте secretKey далее
```

# validateAndParseInitData

Проверяет подлинность строки init data Telegram Web App с помощью секретного ключа или токена бота. Если данные валидны, возвращает объект [WebAppInitData](https://core.telegram.org/bots/webapps#webappinitdata). Если данные некорректны — возвращает `false`.

```ts
import {
    validateAndParseInitData,
    getBotTokenSecretKey,
} from "@gramio/init-data";

const botToken = process.env.BOT_TOKEN as string;
const secretKey = getBotTokenSecretKey(botToken);

const initData = req.headers["x-init-data"] as string;
const result = validateAndParseInitData(initData, secretKey);

if (!result) {
    // Данные невалидны или подделаны
}

// Доступ к данным пользователя и чата
const userId = result.user?.id;
const chatId = result.chat?.id;
```

# validateInitData

Проверяет подлинность строки init data Telegram Web App с помощью секретного ключа или токена бота. Возвращает `true`, если данные валидны, иначе — `false`. Этот метод только проверяет данные и **не разбирает** их. Используйте, если нужно только проверить подлинность без извлечения информации о пользователе или чате.

```ts
import { validateInitData, getBotTokenSecretKey } from "@gramio/init-data";

const botToken = process.env.BOT_TOKEN as string;
const secretKey = getBotTokenSecretKey(botToken);

const initData = req.headers["x-init-data"] as string;
const isValid = validateInitData(initData, secretKey);

if (!isValid) {
    // Данные невалидны или подделаны
}
// Если true — строке init data можно доверять
```

# parseInitData

Разбирает строку init data Telegram Web App и возвращает объект [WebAppInitData](https://core.telegram.org/bots/webapps#webappinitdata). Этот метод **не выполняет проверку** подлинности или целостности — используйте его только после проверки через `validateInitData` или `validateAndParseInitData`.

```ts
import { parseInitData } from "@gramio/init-data";

const initData = req.headers["x-init-data"] as string;
const parsed = parseInitData(initData);

// Доступ к данным пользователя и чата
const userId = parsed.user?.id;
const chatId = parsed.chat?.id;
```

# signInitData

Генерирует валидную строку init data из объекта данных и секретного ключа или токена бота. Полезно для тестирования, документации или генерации примеров для клиентов API.

```ts
import {
    signInitData,
    getBotTokenSecretKey,
    type WebAppUser,
} from "@gramio/init-data";

const botToken = process.env.BOT_TOKEN as string;
const secretKey = getBotTokenSecretKey(botToken);

const data = {
    user: {
        id: 1,
        first_name: "durov",
        username: "durov",
    },
} satisfies WebAppUser;

const signedInitData = signInitData(data, secretKey);
// Используйте signedInitData как валидную строку init data для тестов
```

# Пример: интеграция с Elysia

Вы можете использовать `@gramio/init-data` с любым backend-фреймворком. Ниже — бонус: пример интеграции с Elysia для типобезопасной аутентификации.

```ts
twoslash;
import {
    validateAndParseInitData,
    signInitData,
    getBotTokenSecretKey,
} from "@gramio/init-data";
import { Elysia, t } from "elysia";

const secretKey = getBotTokenSecretKey(process.env.BOT_TOKEN as string);

export const authElysia = new Elysia({
    name: "auth",
})
    .guard({
        headers: t.Object({
            "x-init-data": t.String({
                examples: [
                    signInitData(
                        {
                            user: {
                                id: 1,
                                first_name: "durov",
                                username: "durov",
                            },
                        },
                        secretKey
                    ),
                ],
            }),
        }),
        response: {
            401: t.Literal("UNAUTHORIZED"),
        },
    })
    .resolve(({ headers, error }) => {
        const result = validateAndParseInitData(
            headers["x-init-data"],
            secretKey
        );
        if (!result || !result.user)
            return error("Unauthorized", "UNAUTHORIZED");

        return {
            tgId: result.user.id,
            user: result.user,
        };
    })
    .as("plugin");

const app = new Elysia()
    .get("hello", "world")
    .use(authElysia)
    .get("/user", ({ user }) => {
        user;
        // ^?
    });
```
