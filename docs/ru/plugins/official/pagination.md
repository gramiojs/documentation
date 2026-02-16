---
title: Плагин пагинации для GramIO - Постраничные inline-клавиатуры для Telegram ботов

head:
    - - meta
      - name: "description"
        content: "Создавайте постраничные inline-клавиатуры в Telegram ботах с плагином Pagination для GramIO. Fluent API для пагинации данных, кнопок навигации и выбора элементов."

    - - meta
      - name: "keywords"
        content: "Telegram бот пагинация, inline клавиатура пагинация, постраничное меню GramIO, Telegram бот навигация по списку, callback query пагинация, кнопки навигации страниц, просмотр данных telegram бот, GramIO плагины, плагин пагинации, inline клавиатура страницы"
---

# Pagination

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/pagination?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/pagination)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/pagination?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/pagination)
[![JSR](https://jsr.io/badges/@gramio/pagination)](https://jsr.io/@gramio/pagination)
[![JSR Score](https://jsr.io/badges/@gramio/pagination/score)](https://jsr.io/@gramio/pagination)

</div>

Fluent API с цепочками вызовов для создания **постраничных inline-клавиатур** в Telegram ботах. Обрабатывает загрузку данных, генерацию клавиатуры, кнопки навигации, информацию о странице и колбэки выбора элементов.

> [!WARNING]
> Этот пакет находится в стадии разработки — API может измениться.

## Установка

::: code-group

```bash [npm]
npm install @gramio/pagination
```

```bash [yarn]
yarn add @gramio/pagination
```

```bash [pnpm]
pnpm add @gramio/pagination
```

```bash [bun]
bun install @gramio/pagination
```

:::

> [!IMPORTANT]
> Необходимо переопределить версию `@gramio/callback-data` в `package.json`:
>
> ```json
> {
>     "overrides": {
>         "@gramio/callback-data": "^0.0.11"
>     }
> }
> ```

## Использование

```ts
import { Bot } from "gramio";
import { Pagination } from "@gramio/pagination";
import { paginationFor } from "@gramio/pagination/plugin";

const data = [
    { id: 1, title: "test" },
    { id: 2, title: "test2" },
    { id: 3, title: "test3" },
    { id: 4, title: "test4" },
    { id: 5, title: "test5" },
];

const paginationTest = new Pagination("test", async ({ offset, limit }) => {
    return data.slice(offset, offset + limit);
})
    .count(() => Promise.resolve(data.length))
    .item((x) => ({
        title: x.title,
        id: x.id,
    }))
    .onSelect(({ id, context }) => {
        return context.editText(`Selected ${id}`, {
            reply_markup: context.message?.replyMarkup?.payload,
        });
    })
    .limit(2)
    .columns(2)
    .withFirstLastPage()
    .withPageInfo(
        ({ totalPages, currentPage }) => `${currentPage} / ${totalPages}`
    );

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(paginationFor([paginationTest]))
    .command("start", async (ctx) =>
        ctx.reply("Hello", {
            reply_markup: await paginationTest.getKeyboard(0),
        })
    )
    .onStart(console.log);

await bot.start();
```

## API

### `new Pagination(name, dataFunction)`

Создание экземпляра пагинации.

- `name` — уникальный идентификатор (используется как префикс callback data)
- `dataFunction` — `async ({ offset, limit }) => Data[]` — загружает одну страницу элементов

### Цепочечные методы

| Метод | Описание |
|---|---|
| `.limit(count)` | Элементов на странице (по умолчанию: `10`) |
| `.columns(count)` | Столбцов кнопок в сетке клавиатуры |
| `.count(func)` | `async () => number` — общее количество элементов для полной информации о страницах |
| `.item(func)` | `(data) => { title, id }` — маппинг элемента в кнопку |
| `.onSelect(callback)` | `({ id, context }) => void` — обработчик нажатия на кнопку элемента |
| `.withPageInfo(format)` | `({ totalPages, currentPage }) => string` — текст кнопки с информацией о странице |
| `.withFirstLastPage()` | Добавить кнопки ⏮️/⏭️ первой/последней страницы |
| `.wrapKeyboard(func)` | Постобработка клавиатуры для добавления дополнительных кнопок |
| `.selectCallbackData(func)` | Переопределить callback data для кнопок выбора |

### Получение клавиатуры

```ts
// Только клавиатура
const keyboard = await pagination.getKeyboard(offset);

// Клавиатура + загруженные данные + информация о пагинации
const { keyboard, data, pagination: info } = await pagination.getKeyboardWithData(offset);

// Данные + информация о пагинации без клавиатуры
const { data, pagination: info } = await pagination.getDataWithPaginationInfo(offset);
```

### `paginationFor(paginationList)`

GramIO-плагин, который маршрутизирует события `callback_query` к нужному экземпляру `Pagination`.

```ts
import { paginationFor } from "@gramio/pagination/plugin";

const bot = new Bot("")
    .extend(paginationFor([pagination1, pagination2]));
```

## Стратегии пагинации

### Без `.count()` (limit+1)

Загружает `limit + 1` элементов для определения наличия следующей страницы. Без информации об общем количестве страниц и текущей странице.

### С `.count()`

Запускает запросы количества и данных **параллельно**. Включает функции `.withPageInfo()` и `.withFirstLastPage()`.

## Кнопки навигации

| Кнопка | Условие |
|---|---|
| ⏮️ Первая страница | `.withFirstLastPage()` + есть предыдущая |
| ⬅️ Назад | есть предыдущая страница |
| Инфо о странице | `.withPageInfo()` + `.count()` установлен |
| ➡️ Вперёд | есть следующая страница |
| ⏭️ Последняя страница | `.withFirstLastPage()` + есть следующая |
