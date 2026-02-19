---
title: "Плагин JSX для GramIO - Форматирование сообщений Telegram с помощью JSX"

head:
    - - meta
      - name: "description"
        content: "Используйте JSX для форматирования сообщений Telegram ботов и создания клавиатур в GramIO. Поддержка bold, italic, code, ссылок, спойлеров, inline и reply клавиатур."

    - - meta
      - name: "keywords"
        content: "Telegram бот JSX, GramIO JSX, JSX форматирование Telegram, форматирование сообщений Telegram, JSX клавиатуры, inline клавиатура JSX, reply клавиатура JSX, TypeScript JSX Telegram, инструменты для Telegram ботов, плагины GramIO, Deno, Bun, Node.js"
---

# JSX

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/jsx?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/jsx)
[![JSR](https://jsr.io/badges/@gramio/jsx)](https://jsr.io/@gramio/jsx)
[![JSR Score](https://jsr.io/badges/@gramio/jsx/score)](https://jsr.io/@gramio/jsx)

</div>

Используйте **JSX** для форматирования сообщений Telegram ботов и создания клавиатур. Вместо цепочки функций `format`, `bold`, `italic` пишите привычный HTML-подобный синтаксис, который компилируется в `FormattableString` и `InlineKeyboard`/`Keyboard` объекты GramIO.

Зависимость от React не требуется — пакет предоставляет собственный JSX-рантайм.

## Установка

::: code-group

```bash [npm]
npm install @gramio/jsx
```

```bash [yarn]
yarn add @gramio/jsx
```

```bash [pnpm]
pnpm add @gramio/jsx
```

```bash [bun]
bun add @gramio/jsx
```

:::

## Настройка

Добавьте JSX-рантайм в `tsconfig.json`:

```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "@gramio/jsx"
    }
}
```

Файлы должны использовать расширение `.tsx`.

## Использование

### Форматирование текста

```tsx
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN!)
    .command("start", (context) =>
        context.send(<b>Привет!</b>)
    );

bot.start();
```

Все Telegram entities форматирования поддерживаются как JSX-элементы:

```tsx
await context.send(
    <>
        <b>Жирный текст</b><br />
        <i>Курсив</i><br />
        <u>Подчёркнутый</u><br />
        <s>Зачёркнутый</s><br />
        <spoiler>Скрытый текст</spoiler><br />
        <code>инлайн код</code><br />
        <pre>{`блок кода
с несколькими строками`}</pre><br />
        <blockquote>Простая цитата</blockquote><br />
        <blockquote expandable>Раскрываемая цитата</blockquote><br />
        <a href="https://gramio.dev">GramIO</a><br />
        <mention id={123456789}>Пользователь</mention><br />
        <custom-emoji emojiId="5222106016283378623">эмодзи</custom-emoji>
    </>
);
```

### Справочник элементов форматирования

| Элемент | Описание | Пример |
|---------|----------|--------|
| `<b>` | **Жирный** текст | `<b>жирный</b>` |
| `<i>` | _Курсив_ | `<i>курсив</i>` |
| `<u>` | Подчёркнутый текст | `<u>подчёркнутый</u>` |
| `<s>` | ~~Зачёркнутый~~ текст | `<s>зачёркнутый</s>` |
| `<spoiler>` | Спойлер (скрытый) текст | `<spoiler>скрытый</spoiler>` |
| `<code>` | Инлайн-код | `<code>код</code>` |
| `<pre>` | Блок кода | `<pre>блок кода</pre>` |
| `<blockquote>` | Цитата | `<blockquote>цитата</blockquote>` |
| `<a href="...">` | Гиперссылка | `<a href="https://gramio.dev">ссылка</a>` |
| `<mention id={...}>` | Упоминание пользователя по ID | `<mention id={123}>имя</mention>` |
| `<custom-emoji emojiId="...">` | Кастомный эмодзи | `<custom-emoji emojiId="123">эмодзи</custom-emoji>` |
| `<br />` | Перенос строки | `текст<br />следующая строка` |

Элемент `<blockquote>` поддерживает опциональный проп `expandable` для раскрываемых цитат.

Поддерживается вложенность — например, `<b><i>жирный курсив</i></b>`.

### Inline-клавиатура

Передайте элемент `<keyboard inline>` в `reply_markup`:

```tsx
await context.send(
    <b>Выберите действие:</b>,
    {
        reply_markup: (
            <keyboard inline>
                <row>
                    <button callbackData="action1">Нажми</button>
                    <button url="https://gramio.dev">Открыть ссылку</button>
                </row>
                <row>
                    <button switchToCurrentChat="query">Инлайн-поиск</button>
                </row>
            </keyboard>
        ),
    }
);
```

#### Пропсы inline-кнопок

| Проп | Тип | Описание |
|------|-----|----------|
| `callbackData` | `string` | Данные для обработки нажатия |
| `url` | `string` | URL для открытия |
| `webApp` | `{ url: string }` | WebApp для открытия |
| `loginUrl` | `TelegramLoginUrl` | URL для авторизации |
| `switchToChat` | `string` | Переключить инлайн-запрос в другой чат |
| `switchToCurrentChat` | `string` | Инлайн-запрос в текущем чате |
| `switchToChosenChat` | `string \| TelegramSwitchInlineQueryChosenChat` | Переключить в выбранный чат |
| `copyText` | `string` | Скопировать текст в буфер |
| `game` | `TelegramCallbackGame` | Callback-игра |

### Reply-клавиатура

Уберите проп `inline` у `<keyboard>`:

```tsx
await context.send("Выберите вариант:", {
    reply_markup: (
        <keyboard oneTime placeholder="Выберите...">
            <row>
                <button requestContact>Отправить контакт</button>
                <button requestLocation>Отправить геолокацию</button>
            </row>
            <row>
                <button>Простая кнопка</button>
            </row>
        </keyboard>
    ),
});
```

#### Пропсы reply-клавиатуры

| Проп | Тип | Описание |
|------|-----|----------|
| `persistent` | `boolean` | Всегда показывать клавиатуру |
| `selective` | `boolean` | Показать только определённым пользователям |
| `resized` | `boolean` | Подогнать размер клавиатуры |
| `oneTime` | `boolean` | Скрыть после нажатия кнопки |
| `placeholder` | `string` | Плейсхолдер поля ввода |

#### Пропсы reply-кнопок

| Проп | Тип | Описание |
|------|-----|----------|
| `requestContact` | `boolean` | Запросить телефон пользователя |
| `requestLocation` | `boolean` | Запросить геолокацию пользователя |
| `requestChat` | `TelegramKeyboardButtonRequestChat` | Запросить выбор чата |
| `requestPoll` | `{ type: "quiz" \| "regular" }` | Запросить создание опроса |
| `webApp` | `{ url: string }` | Открыть WebApp |

## Полный пример

```tsx
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN!)
    .command("start", (context) =>
        context.send(<b>Привет!</b>)
    )
    .command("demo", async (context) => {
        await context.reply(
            <>
                <b>Жирный текст</b><br />
                <i>Курсив</i><br />
                <u>Подчёркнутый</u><br />
                <s>Зачёркнутый</s><br />
                <spoiler><b>Жирный спойлер</b></spoiler><br />
                <a href="https://gramio.dev">GramIO</a><br />
                <mention id={context.from!.id}>Вы</mention><br />
                <code>print("Привет")</code><br />
                <pre>{`function greet() {
    console.log("Привет!");
}`}</pre>
            </>,
            {
                reply_markup: (
                    <keyboard inline>
                        <row>
                            <button callbackData="test">Нажми</button>
                            <button url="https://gramio.dev">Документация</button>
                        </row>
                    </keyboard>
                ),
            }
        );
    })
    .onStart(console.log);

bot.start();
```
