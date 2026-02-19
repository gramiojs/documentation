---
title: "Плагин Split для GramIO - Автоматическое разделение длинных сообщений"

head:
    - - meta
      - name: "description"
        content: "Автоматически разделяйте длинные сообщения, превышающие лимиты Telegram, с помощью плагина Split. Сохраняйте форматирование, работайте с подписями и поддерживайте целостность сообщений."

    - - meta
      - name: "keywords"
        content: "разделение длинных сообщений Telegram, обход лимитов Telegram API, сохранение форматирования сообщений, автоматическое разделение entities, обработка больших текстов, разделение подписей к медиа, плагин для разделения сообщений, функция splitMessage, решение проблемы лимита сообщений, инструменты для Telegram ботов, плагины GramIO"
---

# Split

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/split?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/split)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/split?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/split)
[![JSR](https://jsr.io/badges/@gramio/split)](https://jsr.io/@gramio/split)
[![JSR Score](https://jsr.io/badges/@gramio/split/score)](https://jsr.io/@gramio/split)

</div>

Этот пакет разделяет сообщения, превышающие лимит символов Telegram, на несколько частей. Он также **корректно разделяет entities** (жирный, курсив, ссылки и т.д.) по границам частей, сохраняя форматирование без ручного пересчёта смещений.

## Установка

::: code-group

```bash [npm]
npm install @gramio/split
```

```bash [yarn]
yarn add @gramio/split
```

```bash [pnpm]
pnpm add @gramio/split
```

```bash [bun]
bun add @gramio/split
```

:::

## Использование

```ts
import { Bot, format, bold } from "gramio";
import { splitMessage } from "@gramio/split";

const bot = new Bot(process.env.BOT_TOKEN!)
    .command("start", async (context) => {
        const messages = await splitMessage(
            format`${bold("a".repeat(4096 * 2))}`,
            (str) => context.send(str)
        );

        console.log(messages); // массив результатов отправки
    });

await bot.start();
```

> [!WARNING]
> При передаче `context.send` без обёртки используйте `context.send.bind(context)` — иначе потеряются данные контекста.

### Использование с другими фреймворками

`@gramio/split` можно использовать независимо от GramIO — колбэк `action` получает `FormattableString` со свойствами `.text` и `.entities`:

```ts
import { splitMessage } from "@gramio/split";
import { format, bold } from "@gramio/format";

const messages = await splitMessage(
    format`${bold("a".repeat(4096 * 2))}`,
    ({ text, entities }) => {
        return someOtherFramework.sendMessage(text, { entities });
    }
);
```

## API

### splitMessage

```ts
function splitMessage<ReturnData>(
    text: FormattableString | string,
    action: (formattableString: FormattableString) => MaybePromise<ReturnData>,
    limit?: number
): Promise<ReturnData[]>
```

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `text` | `FormattableString \| string` | — | Текст сообщения для разделения. Может быть строкой или `FormattableString` из `@gramio/format` (с entities). |
| `action` | `(formattableString: FormattableString) => MaybePromise<ReturnData>` | — | Колбэк, вызываемый **последовательно** для каждой части. Возвращаемое значение собирается в массив результатов. |
| `limit` | `number` | `4096` | Максимальная длина символов в каждой части. |

**Возвращает:** `Promise<ReturnData[]>` — массив результатов каждого вызова `action`, по порядку.

Колбэк `action` вызывается последовательно (не параллельно), что сохраняет правильный порядок сообщений в Telegram.

## Настройка лимита

Лимит по умолчанию — **4096** символов (`sendMessage`). Для подписей к фото/видео используйте **1024**:

```ts
import { splitMessage } from "@gramio/split";
import { format, bold } from "@gramio/format";

const messages = await splitMessage(
    format`${bold("a".repeat(4096))}`,
    ({ text, entities }) => {
        return context.sendPhoto(PHOTO, {
            caption: text,
            caption_entities: entities,
        });
    },
    1024
);
```

## Как работает разделение entities

При разделении сообщения entities обрабатываются следующим образом:

- Entities, **полностью входящие** в текущую часть, сохраняются как есть.
- Entities, **пересекающие границу** разделения, разбиваются: первая часть получает entity, обрезанную до границы, а оставшаяся часть — новую entity с пересчитанными `offset` и `length`.
- Entities, **полностью находящиеся** в оставшемся тексте, получают смещённый `offset`.

Это значит, что форматирование — **жирный**, _курсив_, [ссылки](https://example.com), `код` и другие Telegram entities — всегда корректно сохраняется во всех частях.
