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

Библиотека `@gramio/init-data` позволяет проверять подлинность данных, передаваемых из Telegram Mini Apps на ваш сервер, обеспечивая безопасное взаимодействие между веб-приложением и ботом.

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
bun add @gramio/init-data
```

:::

### validateAndParseInitData

```ts
import { validateAndParseInitData } from "@gramio/init-data";

const initData = validateAndParseInitData(initDataString, "BOT_TOKEN");

if (!initData) {
    throw new Error("Invalid init data");
}

console.log(initData.user);
```

## Проверка init-data

```ts
import { validateInitData } from "@gramio/init-data";

// Получаем init-data из запроса
const initDataString = req.query.initData;

// Валидируем с использованием токена бота
const isValid = validateInitData(initDataString, "BOT_TOKEN");

if (isValid) {
    // Данные действительно пришли из Telegram
    console.log("Данные прошли проверку");
} else {
    // Данные не прошли проверку или были подделаны
    console.log("Внимание: Данные не прошли проверку!");
}
```

## Получение данных пользователя

```ts
import { parseInitData } from "@gramio/init-data";

// Разбор строки init-data
const initData = parseInitData(initDataString);

// Теперь можно получить доступ к данным
console.log(initData.user); // Информация о пользователе
console.log(initData.auth_date); // Дата аутентификации
console.log(initData.hash); // Хэш для проверки
```

## Безопасность

Всегда проверяйте данные init-data перед использованием, чтобы гарантировать, что запрос действительно поступил из Telegram и данные не были подделаны.

## Пример интеграции с Elysia

Этот пример демонстрирует, как интегрировать `@gramio/init-data` с Elysia с помощью удобного плагина с типо-безопасностью.

`examples` в `x-init-data` заголовке являются валидными сгенерированными `init-data`, которые позволяют легче тестировать ваш API в OpenAPI клиентах.

```ts twoslash
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
