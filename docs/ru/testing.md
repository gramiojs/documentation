---
title: Тестирование Telegram-ботов — Event-driven фреймворк для тестирования GramIO

head:
    - - meta
      - name: "description"
        content: "Узнайте, как тестировать Telegram-бота на GramIO. Event-driven фреймворк для тестирования с пользователями-акторами, симуляцией чатов, моками API и кликами по инлайн-кнопкам — без реальных HTTP-запросов."

    - - meta
      - name: "keywords"
        content: "telegram бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, тестирование, юнит-тесты, интеграционные тесты, тестирование ботов, мок API, тестовое окружение, симуляция пользователей, симуляция чатов, тестирование callback query, тестирование инлайн-кнопок, мокирование API, TelegramTestEnvironment"
---

# Тестирование

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/test?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/test)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/test?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/test)
[![JSR](https://jsr.io/badges/@gramio/test)](https://jsr.io/@gramio/test)
[![JSR Score](https://jsr.io/badges/@gramio/test/score)](https://jsr.io/@gramio/test)

</div>

Event-driven фреймворк для тестирования ботов, написанных на GramIO. Пользователи — это главное действующее лицо: они отправляют сообщения, входят/выходят из чатов, нажимают инлайн-кнопки, а фреймворк управляет состоянием в памяти и отправляет боту правильные Telegram-апдейты. Никаких реальных HTTP-запросов.

## Установка

::: code-group

```bash [npm]
npm install -D @gramio/test
```

```bash [yarn]
yarn add -D @gramio/test
```

```bash [pnpm]
pnpm add -D @gramio/test
```

```bash [bun]
bun add -d @gramio/test
```

:::

## Быстрый старт

```ts
import { describe, expect, it } from "bun:test";
import { Bot } from "gramio";
import { TelegramTestEnvironment } from "@gramio/test";

describe("My bot", () => {
    it("should reply to /start", async () => {
        const bot = new Bot("test");
        bot.command("start", (ctx) => ctx.send("Welcome!"));

        const env = new TelegramTestEnvironment(bot);
        const user = env.createUser({ first_name: "Alice" });

        await user.sendMessage("/start");

        expect(env.apiCalls[0].method).toBe("sendMessage");
    });
});
```

## `TelegramTestEnvironment`

Центральный оркестратор. Оборачивает GramIO `Bot`, перехватывает все исходящие API-вызовы и предоставляет фабрики для создания пользователей и чатов.

```ts
const bot = new Bot("test");
const env = new TelegramTestEnvironment(bot);
```

| Свойство / Метод | Описание |
|---|---|
| `env.createUser(payload?)` | Создаёт `UserObject`, привязанный к окружению |
| `env.createChat(payload?)` | Создаёт `ChatObject` (группа, супергруппа, канал и т.д.) |
| `env.emitUpdate(update)` | Отправляет сырой `TelegramUpdate` или `MessageObject` боту |
| `env.onApi(method, handler)` | Переопределяет ответ для конкретного API-метода |
| `env.offApi(method?)` | Удаляет обработчик (или все обработчики, если метод не указан) |
| `env.apiCalls` | Массив `{ method, params, response }` — лог всех API-вызовов |
| `env.clearApiCalls()` | Очищает массив `apiCalls` (полезно между фазами теста) |
| `env.lastApiCall(method)` | Последний записанный вызов для `method`, или `undefined` |
| `env.users` / `env.chats` | Все созданные пользователи и чаты |

## `UserObject` — главное действующее лицо

Пользователи управляют тестовым сценарием. Создавайте их через `env.createUser()`:

```ts
const user = env.createUser({ first_name: "Alice" });
```

### `user.sendMessage(text)` — отправка ЛС боту

```ts
const msg = await user.sendMessage("Hello");
```

### `user.sendMessage(chat, text)` — отправка сообщения в группу

```ts
const group = env.createChat({ type: "group", title: "Test Group" });
await user.sendMessage(group, "/start");
```

### `user.join(chat)` / `user.leave(chat)`

Генерирует апдейт `chat_member` и сервисное сообщение (`new_chat_members` / `left_chat_member`). Обновляет `chat.members`.

```ts
await user.join(group);
expect(group.members.has(user)).toBe(true);

await user.leave(group);
expect(group.members.has(user)).toBe(false);
```

### `user.click(callbackData, message?)`

Генерирует апдейт `callback_query`. Идеально подходит для тестирования инлайн-клавиатур:

```ts
const msg = await user.sendMessage("Pick an option");
await user.click("option:1", msg);
```

### `user.editMessage(msg, text)` — эмуляция редактирования сообщения

Генерирует апдейт `edited_message`. Тестируйте обработчики `bot.on("edited_message", ...)`:

```ts
const msg = await user.sendMessage("Привет");
await user.editMessage(msg, "Привет, мир!");
```

### `user.forwardMessage(msg, toChat?)` — пересылка сообщения

Генерирует апдейт `message` с заполненным `forward_origin`. Для тестирования логики определения пересылок:

```ts
const msg = await user.sendMessage("Оригинал");
await user.forwardMessage(msg, group);
```

### `user.sendMediaGroup(chat, payloads[])` — отправка альбома

Генерирует несколько апдейтов `message` с одним `media_group_id`:

```ts
await user.sendMediaGroup(group, [
    { photo: {} },
    { video: {} },
]);
```

### `user.pinMessage(msg, inChat?)` — закрепление сообщения

Генерирует служебное сообщение с `pinned_message`. GramIO направляет их в событие `"pinned_message"`:

```ts
const msg = await user.sendMessage("Важное объявление");
await user.pinMessage(msg);
```

### Медиа-методы

Помимо существующих методов, доступны три новых — с автогенерацией `file_id`:

```ts
await user.sendAudio({ caption: "Название трека" });
await user.sendAnimation(group, { caption: "Гифка" });
await user.sendVideoNote(); // кружочек
```

### `user.react(emojiOrObject, message?, options?)` — реагировать на сообщение

Генерирует апдейт `message_reaction`. Работает с обработчиками `bot.reaction()`:

```ts
const msg = await user.sendMessage("Хороший бот!");

// Один эмодзи
await user.react("👍", msg);

// Несколько эмодзи
await user.react(["👍", "❤"], msg);

// Объявить предыдущие реакции (old_reaction)
await user.react("❤", msg, { oldReactions: ["👍"] });
```

Используйте `ReactObject` для тонкого контроля:

```ts
import { ReactObject } from "@gramio/test";

await user.react(
    new ReactObject()
        .on(msg)          // привязка к сообщению (чат выводится автоматически)
        .add("👍", "🔥") // new_reaction
        .remove("😢")    // old_reaction
);
```

**Автоматическое отслеживание реакций**: `MessageObject` ведёт реакции в памяти. `old_reaction` вычисляется автоматически при вызове `user.react()`.

### `user.sendInlineQuery(query, chatOrOptions?, options?)` — запустить inline-режим

```ts
const q = await user.sendInlineQuery("поиск кошек");
const group = env.createChat({ type: "group" });
const q2 = await user.sendInlineQuery("поиск кошек", group); // chat_type: "group"
```

### `user.chooseInlineResult(resultId, query, options?)` — выбрать inline-результат

```ts
await user.chooseInlineResult("result-1", "поиск кошек");
```

### `user.in(chat)` / `user.on(msg)` — fluent-скоупы

```ts
// Скоуп к чату
await user.in(group).sendMessage("Привет!");
await user.in(group).join();
await user.in(group).on(msg).react("🔥");

// Скоуп к сообщению
await user.on(msg).react("👍");
await user.on(msg).click("action:1");

// clickByText — найти кнопку по тексту и нажать
await user.on(botReply).clickByText("Подтвердить");
```

`clickByText(buttonText)` ищет в `inline_keyboard` кнопку с нужным текстом и кликает на её `callback_data`. Выбрасывает исключение, если клавиатуры нет или кнопка не найдена.

## `ChatObject`

Обёртка над `TelegramChat` с отслеживанием состояния в памяти:

- **`chat.members`** — `Set<UserObject>` текущих участников
- **`chat.messages`** — `MessageObject[]` — история всех сообщений в чате

### `chat.post(text)` — симуляция поста в канале

Генерирует апдейт `channel_post` (без поля `from`). Для тестирования ботов в каналах:

```ts
const channel = env.createChat({ type: "channel", title: "Мой канал" });
await channel.post("Новый пост");
```

## `MessageObject`

Обёртка над `TelegramMessage` с билдер-методами:

```ts
const message = new MessageObject({ text: "Hello" })
    .from(user)
    .chat(group);
```

## `CallbackQueryObject`

Обёртка над `TelegramCallbackQuery` с билдер-методами:

```ts
const cbQuery = new CallbackQueryObject()
    .from(user)
    .data("action:1")
    .message(msg);
```

## Проверка API-вызовов бота

Окружение перехватывает все исходящие API-вызовы (никаких реальных HTTP-запросов) и записывает их:

```ts
const bot = new Bot("test");
bot.on("message", async (ctx) => {
    await ctx.send("Reply!");
});

const env = new TelegramTestEnvironment(bot);
const user = env.createUser();

await user.sendMessage("Hello");

expect(env.apiCalls).toHaveLength(1);
expect(env.apiCalls[0].method).toBe("sendMessage");
expect(env.apiCalls[0].params.text).toBe("Reply!");
```

## Подмена ответов API

Используйте `env.onApi()`, чтобы управлять тем, что бот получает от Telegram API. Принимает статическое значение или функцию-обработчик:

```ts
// Static response
env.onApi("getMe", { id: 1, is_bot: true, first_name: "TestBot" });

// Dynamic response based on params
env.onApi("sendMessage", (params) => ({
    message_id: 1,
    date: Date.now(),
    chat: { id: params.chat_id, type: "private" },
    text: params.text,
}));
```

### Симуляция ошибок

Используйте `apiError()` для создания `TelegramError`, который бот получит как rejected промис — в точности как настоящие ошибки Telegram API работают в GramIO:

```ts
import { TelegramTestEnvironment, apiError } from "@gramio/test";

// Bot is blocked by user
env.onApi("sendMessage", apiError(403, "Forbidden: bot was blocked by the user"));

// Rate limiting
env.onApi("sendMessage", apiError(429, "Too Many Requests", { retry_after: 30 }));

// Conditional — error for some chats, success for others
env.onApi("sendMessage", (params) => {
    if (params.chat_id === blockedUserId) {
        return apiError(403, "Forbidden: bot was blocked by the user");
    }
    return {
        message_id: 1,
        date: Date.now(),
        chat: { id: params.chat_id, type: "private" },
        text: params.text,
    };
});
```

### Сброс

```ts
env.offApi("sendMessage"); // reset specific method
env.offApi();              // reset all overrides
```
