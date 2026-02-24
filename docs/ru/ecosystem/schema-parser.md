---
title: "@gramio/schema-parser — Парсер схемы Telegram Bot API"

head:
    - - meta
      - name: "description"
        content: "@gramio/schema-parser парсит HTML-документацию Telegram Bot API в структурированную TypeScript-схему с семантическими маркерами типов, InputFile-юнионами, enum валют и поддержкой oneOf. Используется внутри @gramio/types."

    - - meta
      - name: "keywords"
        content: "gramio, schema-parser, telegram bot api, схема, typescript, генерация типов, InputFile, валюты, семантические типы, formattable, генерация кода"
---

# @gramio/schema-parser

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/schema-parser?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/schema-parser)
[![JSR](https://jsr.io/badges/@gramio/schema-parser)](https://jsr.io/@gramio/schema-parser)

</div>

TypeScript-библиотека, которая парсит HTML-документацию [Telegram Bot API](https://core.telegram.org/bots/api) в структурированную, типизированную схему. Используется внутри [`@gramio/types`](/ru/types) для генерации всех TypeScript-деклараций — заменяя прежнюю зависимость от Rust-крейта `tg-bot-api`.

> Это **advanced / инфраструктурный пакет**. Обычным разработчикам ботов он не нужен. Полезен при создании генераторов типов, линтеров, инструментов для документации или всего, что требует машиночитаемого представления Telegram Bot API.

## Установка

::: code-group

```bash [npm]
npm install @gramio/schema-parser
```

```bash [yarn]
yarn add @gramio/schema-parser
```

```bash [pnpm]
pnpm add @gramio/schema-parser
```

```bash [bun]
bun add @gramio/schema-parser
```

:::

## Базовое использование

```ts
import { parseSchema } from "@gramio/schema-parser";

const schema = await parseSchema(); // загружает https://core.telegram.org/bots/api

console.log(schema.methods.sendMessage);
// {
//   name: "sendMessage",
//   description: "...",
//   fields: [ ... ],
//   returns: { type: "reference", name: "Message" }
// }

console.log(schema.objects.Message);
// {
//   name: "Message",
//   description: "...",
//   fields: [ ... ]
// }
```

## Структура схемы

Разобранная схема содержит два словаря верхнего уровня:

```ts
interface BotAPISchema {
    methods: Record<string, Method>;
    objects: Record<string, TelegramObject | ObjectWithEnum>;
}
```

### Поля и типы

Каждое поле метода или объекта имеет дискриминированный union `type`:

| Значение `type` | Смысл |
|---|---|
| `"string"` | Строка |
| `"number"` | Целое или дробное число |
| `"boolean"` | Булево значение |
| `"reference"` | Ссылка на другой объект (например, `Message`) |
| `"array"` | Массив другого типа |
| `"one_of"` | Union нескольких типов |
| `"file"` | `InputFile` — поле загрузки файла |

### Семантические маркеры типов

Поля имеют опциональный `semanticType`, несущий смысл сверх сырого типа:

| `semanticType` | Смысл | Как определяется |
|---|---|---|
| `"formattable"` | Текст, поддерживающий entities/parse_mode | Есть соседнее поле `_entities` или `_parse_mode` |
| `"markup"` | Объект клавиатуры/reply markup | Имя объекта соответствует типам клавиатур |
| `"updateType"` | Дискриминатор события | Поле используется в роутинге событий |

Пример: `sendMessage.text` получает `semanticType: "formattable"`, потому что у метода также есть параметры `parse_mode` и `entities`.

### Определение InputFile

String-поля, принимающие загрузку файлов (определяется по ссылке "More information on Sending Files" в описании), автоматически преобразуются в `one_of`-юнионы:

```ts
// Вместо: { type: "string" }
// Получаем:
{
    type: "one_of",
    variants: [
        { type: "file" },     // InputFile — локальный файл
        { type: "string" },   // file_id или URL
    ]
}
```

### Enum валют

Парсер загружает `currencies.json` Telegram и синтезирует объект enum `Currencies`, включая `XTR` (Telegram Stars), которого нет в файле валют:

```ts
schema.objects.Currencies;
// {
//   name: "Currencies",
//   type: "enum",
//   values: ["AED", "AFN", ..., "XTR", "ZMW"]
// }
```

Поля с типом ISO 4217 (например, `currency` в `sendInvoice`) автоматически ссылаются на этот enum.

## Экспортируемые типы

```ts
import type {
    BotAPISchema,
    Method,
    TelegramObject,
    ObjectWithEnum,
    Field,
    FieldType,
    FieldFile,
    SemanticType,
} from "@gramio/schema-parser";
```

## Пример: кастомный генератор типов

```ts
import { parseSchema } from "@gramio/schema-parser";

const schema = await parseSchema();

for (const [name, method] of Object.entries(schema.methods)) {
    const returnType = method.returns;
    console.log(`${name} → ${JSON.stringify(returnType)}`);
}
```

## Смотри также

- [`@gramio/types`](/ru/types) — сгенерированные TypeScript-типы на основе этого пакета
- [Telegram Bot API](https://core.telegram.org/bots/api) — исходная документация
