---
title: "Фильтры — типобезопасное сужение контекста в GramIO"

head:
    - - meta
      - name: "description"
        content: "Фильтры GramIO позволяют сужать тип контекста — filter-only .on() без имени события, standalone-предикаты filters.reply/isBot/forwardOrigin() и type-narrowing guard."

    - - meta
      - name: "keywords"
        content: "gramio, фильтры, сужение типов, filter-only on, предикат, guard, reply filter, isBot, isPremium, forwardOrigin, senderChat, typescript"
---

# Фильтры

:::warning UNRELEASED
Система фильтров находится в ветке `main` и ещё не включена в релизную версию. API может измениться до стабильного релиза.
:::

Система фильтров GramIO позволяет применять типобезопасные предикаты к контексту — как третий аргумент в `bot.on(event, filter, handler)`, так и в виде **filter-only** вызова `.on(filter, handler)` без указания имени события — GramIO сам определяет совместимые события по форме предиката.

## Filter-Only `.on()` — без имени события

При стандартном `.on(event, handler)` вы явно указываете событие. С filter-only перегрузкой имя пропускается — GramIO выводит совместимые события из формы предиката:

```ts
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN!);

// Булев фильтр — срабатывает на любом апдейте, где ctx содержит text
bot.on((ctx) => "text" in ctx && ctx.text?.startsWith("!"), (ctx) => {
    ctx.send("Команда получена!");
});

// Type-narrowing предикат — сужает тип контекста в обработчике
bot.on(
    (ctx): ctx is { text: string } => typeof (ctx as any).text === "string",
    (ctx) => {
        ctx.text; // string — не string | undefined
    }
);
```

## Инлайн-фильтр на именованном событии

Фильтр можно передать вторым аргументом в `.on()` с именем события:

```ts
bot.on("message", (ctx) => ctx.text?.startsWith("/"), (ctx) => {
    // только сообщения, начинающиеся с "/"
});

// Type-narrowing инлайн-фильтр
bot.on(
    "message",
    (ctx): ctx is typeof ctx & { text: string } => typeof ctx.text === "string",
    (ctx) => {
        ctx.text; // string
    }
);
```

## Standalone предикаты

Импортируйте из `gramio` и передавайте в `.on()` или `.guard()`:

```ts
import { filters } from "gramio";
```

### Фильтры содержимого сообщения

| Фильтр | Сужает до / Проверяет |
|---|---|
| `filters.reply` | Сообщение с `reply_to_message` |
| `filters.entities` | Сообщение с `entities` |
| `filters.captionEntities` | Сообщение с `caption_entities` |
| `filters.quote` | Сообщение с цитатой (`quote`) |
| `filters.viaBot` | Отправлено через бота (`via_bot`) |
| `filters.linkPreview` | Есть `link_preview_options` |
| `filters.startPayload` | `/start` с deep-link payload |
| `filters.authorSignature` | Есть `author_signature` |
| `filters.mediaGroup` | Сообщение в медиагруппе |
| `filters.venue` | Сообщение — место |

```ts
bot.on("message", filters.reply, (ctx) => {
    ctx.replyToMessage; // гарантированно присутствует
});

bot.on("message", filters.startPayload, (ctx) => {
    // /start с deep-link payload
});
```

### Фильтры отправителя и чата

| Фильтр | Описание |
|---|---|
| `filters.hasFrom` | Апдейт содержит поле `from` |
| `filters.isBot` | `from.is_bot === true` |
| `filters.isPremium` | `from.is_premium === true` |
| `filters.isForum` | Чат является форумом |
| `filters.service` | Служебное сообщение |
| `filters.topicMessage` | Сообщение в топике форума |
| `filters.mediaSpoiler` | Медиа со спойлером |
| `filters.giveaway` | Сообщение с розыгрышем |
| `filters.game` | Сообщение с игрой |
| `filters.story` | Сообщение — история |
| `filters.effectId` | Есть эффект сообщения |

### `filters.forwardOrigin(type?)` — сужение по источнику пересылки

Без аргумента матчит любое пересланное сообщение. С аргументом сужает тип `forwardOrigin`:

```ts
// Любое пересланное сообщение
bot.on("message", filters.forwardOrigin(), (ctx) => {
    ctx.forwardOrigin; // MessageOrigin (union всех типов)
});

// Сужение до конкретного типа
bot.on("message", filters.forwardOrigin("user"), (ctx) => {
    ctx.forwardOrigin; // MessageOriginUser
    ctx.forwardOrigin.sender_user; // TelegramUser
});

bot.on("message", filters.forwardOrigin("channel"), (ctx) => {
    ctx.forwardOrigin; // MessageOriginChannel
    ctx.forwardOrigin.chat;         // TelegramChat
    ctx.forwardOrigin.message_id;   // number
});
```

Доступные типы: `"user"` | `"hidden_user"` | `"chat"` | `"channel"`

### `filters.senderChat(type?)` — сужение по чату-отправителю

```ts
// Любое сообщение от анонимного администратора или канала
bot.on("message", filters.senderChat(), (ctx) => {
    ctx.senderChat; // TelegramChat
});

// Сужение до конкретного типа чата
bot.on("message", filters.senderChat("channel"), (ctx) => {
    ctx.senderChat; // TelegramChat & { type: "channel" }
});
```

## Композиция фильтров

Фильтры — это обычные функции. Компонуйте их логическими операторами:

```ts
const isPremiumAdmin = (ctx: any) =>
    filters.isPremium(ctx) && filters.hasFrom(ctx) && ctx.from.status === "administrator";

bot.on("message", isPremiumAdmin, handler);
```

## Type-Narrowing `guard()`

`guard()` с type predicate сужает `TOut` для всех **downstream** обработчиков в цепочке:

```ts
const bot = new Bot(process.env.BOT_TOKEN!);

bot
    .guard((ctx): ctx is typeof ctx & { text: string } => typeof ctx.text === "string")
    .on("message", (ctx) => {
        ctx.text; // string — сужено для всех обработчиков после guard
    });
```

Без type predicate (булев guard) работает как шлюз, блокирующий цепочку при `false`, но не сужающий типы.

## Смотри также

- [Руководство по middleware](/ru/extend/middleware) — как работают цепочки middleware
- [Справочник `.on()`](/ru/bot-class#on) — полная сигнатура метода
- [Справочник `guard()`](/ru/bot-class#guard) — режимы шлюза и побочных эффектов
