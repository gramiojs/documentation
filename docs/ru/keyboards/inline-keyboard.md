---
title: Построитель Inline клавиатур - Интерактивные кнопки в сообщениях

head:
    - - meta
      - name: "description"
        content: "Научитесь создавать интерактивные inline-клавиатуры, которые прикрепляются непосредственно к сообщениям в Telegram ботах, используя GramIO. Изучите различные типы кнопок, макеты и обработку взаимодействия пользователей."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, inline keyboard, встроенная клавиатура, кнопки в сообщении, callback кнопки, кнопки с callback_data, url кнопки, switch inline кнопки, login url кнопки, pay кнопки, webapp кнопки, callback_game кнопки, матрица кнопок, InlineKeyboardMarkup, InlineKeyboardButton, обработка callback query"
---

# Inline Keyboard

Inline Keyboard прикрепляется к сообщению. Представляет собой [встроенную клавиатуру](https://core.telegram.org/bots/features#inline-keyboards), которая появляется рядом с сообщением, к которому она принадлежит.

Смотрите также [API Reference](https://jsr.io/@gramio/keyboards/doc/~/InlineKeyboard) и [как отвечать на нажатия](/ru/triggers/callback-query).

## Импорт

### С GramIO

```ts twoslash
import { InlineKeyboard } from "gramio";
```

### Без GramIO

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
```

## Кнопки ([Документация](https://core.telegram.org/bots/api/#inlinekeyboardbutton))

Кнопки - это методы, которые собирают inline клавиатуру для вас.

### text

Текстовая кнопка с данными, которые будут отправлены в [callback query](https://core.telegram.org/bots/api/#callbackquery) боту при нажатии кнопки, 1-64 байта.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().text("какой-то текст", "payload");
// или
new InlineKeyboard().text("какой-то текст", {
    json: "payload",
}); // использует JSON.stringify
```

### url

HTTP или tg:// URL, который будет открыт при нажатии на кнопку. Ссылки `tg://user?id=<user_id>` можно использовать для упоминания пользователя по их идентификатору без использования имени пользователя, если это разрешено их настройками конфиденциальности.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().url("GitHub", "https://github.com/gramiojs/gramio");
```

### webApp

Описание [Веб-приложения](https://core.telegram.org/bots/webapps), которое будет запущено, когда пользователь нажмет на кнопку. Веб-приложение сможет отправить произвольное сообщение от имени пользователя, используя метод [answerWebAppQuery](https://core.telegram.org/bots/api/#answerwebappquery). Доступно только в приватных чатах между пользователем и ботом.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().webApp("какой-то текст", "https://...");
```

### copy

Тип кнопки, которая копирует указанный текст в буфер обмена.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().copy(
    "Скопируй меня",
    "Добро пожаловать в буфер обмена Gboard, любой скопированный вами текст будет сохранен здесь. Нажмите на клип для вставки его в текстовое поле. Используйте значок редактирования, чтобы закрепить, добавить или удалить клипы. Нажмите и удерживайте клип, чтобы закрепить его. Незакрепленные клипы будут удалены через 1 час.",
);
```

### login

Эта кнопка inline-клавиатуры используется для автоматической авторизации пользователя. Служит отличной заменой [Telegram Login Widget](https://core.telegram.org/widgets/login), когда пользователь приходит из Telegram. Все, что нужно пользователю, — это нажать на кнопку и подтвердить, что он хочет войти в систему:

Приложения Telegram поддерживают эти кнопки начиная с [версии 5.7](https://telegram.org/blog/privacy-discussions-web-bots#meet-seamless-web-bots).

Пример бота: [@discussbot](https://t.me/discussbot)

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().login("какой-то текст", "https://...");
// или
new InlineKeyboard().login("какой-то текст", {
    url: "https://...",
    request_write_access: true,
});
```

Подробнее о параметрах в [документации](https://core.telegram.org/bots/api/#loginurl)

### pay

Отправляет [Кнопку оплаты](https://core.telegram.org/bots/api/#payments).

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().pay("5 монет");
```

> [!WARNING]
> Этот тип кнопки **всегда** должен быть первой кнопкой в первом ряду и может использоваться только в сообщениях со счетом.

> [!TIP] Лучший UX-паттерн для инлайн-режима
> Три кнопки `switchTo*` ниже в связке с хендлером [`inlineQuery`](/ru/triggers/inline-query) дают один из самых приятных флоу во всём Bot API: пользователь тапает кнопку, Telegram открывает инлайн-режим с **предзаполненным запросом**, ваш хендлер отдаёт курированный пикер, пользователь выбирает результат, Telegram постит его. Ноль ввода, знакомый нативный UI, без диплинков и мини-аппов. Используйте для шаринга, пикеров GIF/карточек/цитат, голосований, выбора языка или таймзоны — для всего, что иначе превращалось бы в «введите команду, потом ответьте опцией». См. [гайд по связке](/ru/triggers/inline-query#svyazka-s-knopkami-switchto-luchshij-ux-dlya-inlajn-rezhima) с примером.

### switchToChat

Нажатие на кнопку предложит пользователю выбрать один из своих чатов, открыть этот чат и вставить имя пользователя бота и указанный inline-запрос в поле ввода.

По умолчанию пустой, в этом случае будет вставлено только имя пользователя бота.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().switchToChat("Выберите чат");
// или
new InlineKeyboard().switchToChat("Выберите чат", "InlineQuery");
```

### switchToChosenChat

Нажатие на кнопку предложит пользователю выбрать один из своих чатов указанного типа, открыть этот чат и вставить имя пользователя бота и указанный inline-запрос в поле ввода.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().switchToChosenChat("Выберите чат");
// или
new InlineKeyboard().switchToChosenChat("Выберите чат", "InlineQuery");
// или
new InlineKeyboard().switchToChosenChat("Выберите чат", {
    query: "InlineQuery",
    allow_channel_chats: true,
    allow_group_chats: true,
    allow_bot_chats: true,
    allow_user_chats: true,
});
```

Подробнее о параметрах в [документации](https://core.telegram.org/bots/api/#switchinlinequerychosenchat)

### switchToCurrentChat

Нажатие на кнопку вставит имя пользователя бота и указанный inline-запрос в поле ввода текущего чата. Может быть пустым, в этом случае будет вставлено только имя пользователя бота.

Это предлагает пользователю быстрый способ открыть вашего бота в режиме инлайн в том же чате - отлично подходит для выбора чего-либо из нескольких вариантов.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().switchToCurrentChat("Открыть инлайн режим");
// или
new InlineKeyboard().switchToCurrentChat("Открыть инлайн режим", "InlineQuery");
```

### game

Описание игры, которая будет запущена, когда пользователь нажмет на кнопку.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard().game("текст", {}); // ??? нет параметров...
```

> [!WARNING]
> Этот тип кнопки **всегда** должен быть первой кнопкой в первом ряду.

## Стилизация кнопок

Начиная с `@gramio/keyboards` **1.3.0**, каждый метод кнопки принимает необязательный параметр `options`, который позволяет настроить внешний вид кнопки.

```ts
interface ButtonOptions {
    style?: "danger" | "primary" | "success";
    icon_custom_emoji_id?: string;
}
```

> [!TIP]
> Эти свойства официально поддерживаются начиная с Bot API 9.4.

- **style** — визуальный цветовой стиль кнопки. Может быть `"danger"` (красный), `"primary"` (синий) или `"success"` (зелёный).
- **icon_custom_emoji_id** — идентификатор кастомного эмодзи, который будет отображаться рядом с текстом кнопки.

Параметр `options` всегда является **последним** аргументом любого метода кнопки:

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard()
    .text("Удалить", "delete_action", { style: "danger" })
    .text("Подтвердить", "confirm_action", {
        style: "success",
        icon_custom_emoji_id: "5368324170671202286",
    });
```

Также работает со статическими методами:

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
InlineKeyboard.text("Отмена", "cancel", { style: "danger" });
InlineKeyboard.url("Открыть", "https://gramio.dev", { style: "primary" });
```

![пример стилизованных кнопок](/ru/keyboards/styling.png)

## Помощники

Методы, которые помогают вам создать клавиатуру.

### row

Добавляет `разрыв строки`. Вызовите этот метод, чтобы следующие добавленные кнопки были на новой строке.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard()
    .text("первая строка", "payload")
    .row()
    .text("вторая строка", "payload");
```

### columns

Позволяет ограничить количество столбцов в клавиатуре.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard()
    .columns(1)
    .text("первая строка", "payload")
    .text("вторая строка", "payload")
    .text("третья строка", "payload");
```

### wrap

Кастомный обработчик, который управляет переносом строк.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard()
    .wrap(({ button }) => button.callback_data === "2")
    .text("первая строка", "1")
    .text("первая строка", "1")
    .text("вторая строка", "2");
```

обработчик имеет вид

```ts
(options: { button: T; index: number; row: T[]; rowIndex: number }) => boolean;
```

### pattern

Массив с количеством столбцов в каждой строке. Позволяет установить «шаблон».

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard()
    .pattern([1, 3, 2])
    .text("1", "payload")
    .text("2", "payload")
    .text("2", "payload")
    .text("2", "payload")
    .text("3", "payload")
    .text("3", "payload");
```

### filter

Обработчик, который помогает фильтровать кнопки клавиатуры.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard()
    .filter(({ button }) => button.callback_data !== "hidden")
    .text("кнопка", "pass")
    .text("кнопка", "hidden")
    .text("кнопка", "pass");
```

### add

Позволяет добавить несколько кнопок в _сыром_ формате.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
const labels = ["какие-то", "кнопки"];

new InlineKeyboard()
    .add({ text: "сырая кнопка", callback_data: "payload" })
    .add(
        InlineKeyboard.text(
            "сырая кнопка через InlineKeyboard.text",
            "payload",
        ),
    )
    .add(...labels.map((x) => InlineKeyboard.text(x, `${x}payload`)));
```

### addIf

Позволяет динамически подставлять кнопки в зависимости от чего-либо.

```ts twoslash
// @noErrors
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
const labels = ["какие-то", "кнопки"];
const isAdmin = true;

new InlineKeyboard()
    .addIf(1 === 2, { text: "сырая кнопка", callback_data: "payload" })
    .addIf(
        isAdmin,
        InlineKeyboard.text(
            "сырая кнопка через InlineKeyboard.text",
            "payload",
        ),
    )
    .addIf(
        ({ index, rowIndex }) => rowIndex === index,
        ...labels.map((x) => InlineKeyboard.text(x, `${x}payload`)),
    );
```

обработчик имеет вид

```ts
(options: { rowIndex: number; index: number }) => boolean;
```

### matrix

Позволяет создать матрицу кнопок.

```ts twoslash
// @noErrors
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
import { randomInt } from "node:crypto";

const bomb = [randomInt(0, 9), randomInt(0, 9)] as const;

new InlineKeyboard().matrix(10, 10, ({ rowIndex, index }) =>
    InlineKeyboard.text(
        rowIndex === bomb[0] && index === bomb[1] ? "💣" : "ㅤ",
        "payload",
    ),
);
```

Результатом является клавиатура с бомбой на случайной кнопке.

обработчик имеет вид

```ts
(options: { index: number; rowIndex: number }) => T;
```

### combine

Позволяет объединять клавиатуры. Объединяются только клавиатуры. Вам нужно вызвать метод `.row()` для переноса строки после объединения.

```ts twoslash
import { InlineKeyboard } from "@gramio/keyboards";
// ---cut---
new InlineKeyboard()
    .combine(new InlineKeyboard().text("первая строка", "payload"))
    .row()
    .combine(
        new InlineKeyboard()
            .text("вторая строка", "payload")
            .row()
            .text("третья строка", "payload"),
    );
```
