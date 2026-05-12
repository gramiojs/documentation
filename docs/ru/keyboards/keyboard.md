---
title: Построитель Reply клавиатур - Кастомные кнопки под полем ввода сообщения

head:
    - - meta
      - name: "description"
        content: "Научитесь создавать и настраивать reply клавиатуры (кастомные клавиатуры), которые появляются под полем ввода сообщения в Telegram ботах с GramIO. Изучите шаблоны, макеты и параметры конфигурации."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, reply keyboard, кастомная клавиатура, кнопки под полем ввода, custom keyboard, кнопки быстрого ответа, запрос геолокации, запрос контакта, запрос опроса, resize_keyboard, one_time_keyboard, persistent, selective, input_field_placeholder, is_persistent, клавиатура с текстом, ReplyKeyboardMarkup, KeyboardButton"
---

# Keyboard

Эта клавиатура отображается под полем ввода и также известна как Reply/Custom Keyboard.
Представляет собой [кастомную клавиатуру](https://core.telegram.org/bots/features#keyboards) с вариантами ответа (смотрите [Введение в ботов](https://core.telegram.org/bots/features#keyboards) для деталей и примеров).

См. также [API Reference](https://jsr.io/@gramio/keyboards/doc/~/Keyboard)

## Импорт

### С GramIO

```ts twoslash
import { Keyboard } from "gramio";
```

### Без GramIO

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
```

## Кнопки ([Документация](https://core.telegram.org/bots/api/#keyboardbutton))

Кнопки - это методы, которые собирают клавиатуру для вас.

### text

Текстовая кнопка. Будет отправлена как сообщение при нажатии на кнопку.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard().text("текст кнопки");
```

### requestUsers

Кнопка запроса пользователей. Нажатие на кнопку откроет список подходящих пользователей. Идентификаторы выбранных пользователей будут отправлены боту в служебном сообщении `users_shared`. Доступно только в приватных чатах. `Второй параметр` - это 32-битный идентификатор запроса, который будет получен обратно в объекте [UsersShared](https://core.telegram.org/bots/api/#usersshared). Должен быть уникальным в пределах сообщения.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard().requestUsers("текст кнопки", 228, {
    user_is_premium: true,
});
```

Подробнее о параметрах в [документации](https://core.telegram.org/bots/api/#keyboardbuttonrequestusers)

### requestChats

Кнопка запроса чатов. Нажатие на кнопку откроет список подходящих чатов. Нажатие на чат отправит его идентификатор боту в служебном сообщении `chat_shared`. Доступно только в приватных чатах. `Второй параметр` - это 32-битный идентификатор запроса, который будет получен обратно в объекте [ChatShared](https://core.telegram.org/bots/api/#chatshared). Должен быть уникальным в пределах сообщения.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard().requestChat("gramio", 255, {
    chat_is_forum: true,
});
```

> [!WARNING]
> По умолчанию параметр `chat_is_channel` установлен в false!

Подробнее о параметрах в [документации](https://core.telegram.org/bots/api/#keyboardbuttonrequestchat)

### requestPoll

Кнопка запроса опроса. Нажатие на кнопку откроет список подходящих пользователей. Идентификаторы выбранных пользователей будут отправлены боту в служебном сообщении `users_shared`. Доступно только в приватных чатах.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard().requestPoll("текст кнопки", "quiz");
```

Подробнее о параметрах в [документации](https://core.telegram.org/bots/api/#keyboardbuttonpolltype)

### requestLocation

Кнопка запроса местоположения пользователя. Текущее местоположение пользователя будет отправлено при нажатии на кнопку. Доступно только в приватных чатах.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard().requestLocation("текст кнопки");
```

### requestContact

Кнопка запроса контакта. Номер телефона пользователя будет отправлен как контакт при нажатии на кнопку. Доступно только в приватных чатах.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard().requestContact("текст кнопки");
```

### webApp

Кнопка webApp. Описанное [Веб-приложение](https://core.telegram.org/bots/webapps) будет запущено при нажатии на кнопку. Веб-приложение сможет отправить служебное сообщение `web_app_data`. Доступно только в приватных чатах.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard().webApp("текст кнопки", "https://...");
```

### requestManagedBot

Кнопка запроса managed-бота (Bot API 9.6, с `@gramio/keyboards` v1.4). Нажатие открывает список ботов, которыми пользователь владеет и может управлять; идентификатор выбранного бота прилетает обратно в служебном сообщении `managed_bot_created`. Доступно только в приватных чатах. Второй параметр — знаковый 32-битный `request_id`, который возвращается в ответе, чтобы можно было сопоставить нажатие с конкретной кнопкой.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard().requestManagedBot("Выбрать managed-бота", 123, {
    suggested_name: "Support Bot",
});
```

Третий аргумент несёт опции `KeyboardButtonRequestManagedBot` (`suggested_name`, `suggested_username`) — полный список см. в [референсе Bot API](https://core.telegram.org/bots/api#keyboardbuttonrequestmanagedbot).

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
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard().text("Удалить", { style: "danger" }).text("Подтвердить", {
    style: "success",
    icon_custom_emoji_id: "5368324170671202286",
});
```

Также работает со статическими методами:

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
Keyboard.text("Отмена", { style: "danger" });
Keyboard.requestContact("Поделиться контактом", { style: "primary" });
```

![пример стилизованных кнопок](/ru/keyboards/styling.png)

## Параметры ([Документация](https://core.telegram.org/bots/api/#replykeyboardmarkup))

Эти параметры отвечают за настройки кнопок.

### resized

Запрашивает у клиентов изменение размера клавиатуры по вертикали для оптимального размещения (например, уменьшить клавиатуру, если есть всего две строки кнопок). Если `false`, то кастомная клавиатура всегда имеет такую же высоту, как и стандартная клавиатура приложения. По умолчанию `true`.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard().text("какой-то текст").resized(); // для включения
new Keyboard().text("какой-то текст").resized(false); // для отключения
```

> [!WARNING]
> Размер кнопок по умолчанию изменяется! Чтобы отменить это, используйте `.resized(false)`

### oneTime

Запрашивает у клиентов скрытие клавиатуры, как только она была использована. Клавиатура все еще будет доступна, но клиенты автоматически отобразят обычную буквенную клавиатуру в чате - пользователь может нажать специальную кнопку в поле ввода, чтобы снова увидеть кастомную клавиатуру. По умолчанию `false`.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard().text("какой-то текст").oneTime(); // для включения
new Keyboard().text("какой-то текст").oneTime(false); // для отключения
```

### persistent

Запрашивает у клиентов всегда показывать клавиатуру, когда обычная клавиатура скрыта. По умолчанию `false`, в этом случае кастомная клавиатура может быть скрыта и открыта с помощью значка клавиатуры. По умолчанию `false`.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard().text("какой-то текст").persistent(); // для включения
new Keyboard().text("какой-то текст").persistent(false); // для отключения
```

### selective

Используйте этот параметр, если вы хотите показать клавиатуру только определенным пользователям.

Цели:

1. пользователи, которые упоминаются в _тексте_ объекта [Message](https://core.telegram.org/bots/api/#message).

2. если сообщение бота является ответом на сообщение в том же чате и теме форума, отправитель исходного сообщения.

_Пример:_ Пользователь запрашивает изменение языка бота, бот отвечает на запрос клавиатурой для выбора нового языка. Другие пользователи в группе не видят клавиатуру. По умолчанию `false`.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard().text("какой-то текст").selective(); // для включения
new Keyboard().text("какой-то текст").selective(false); // для отключения
```

### placeholder

Заполнитель, отображаемый в поле ввода, когда клавиатура активна. 1-64 символа. По умолчанию `не отображается`.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard().text("какой-то текст").placeholder("какой-то текст"); // для включения
new Keyboard().text("какой-то текст").placeholder(); // для отключения
```

## Помощники

Методы, которые помогают вам создать клавиатуру.

### row

Добавляет `разрыв строки`. Вызовите этот метод, чтобы следующие добавленные кнопки были на новой строке.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard().text("первая строка").row().text("вторая строка");
```

### columns

Позволяет ограничить количество столбцов в клавиатуре.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard()
    .columns(1)
    .text("первая строка")
    .text("вторая строка")
    .text("третья строка");
```

### wrap

Кастомный обработчик, который управляет переносом строк.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard()
    .wrap(({ button }) => button.text === "вторая строка")
    .text("первая строка")
    .text("первая строка")
    .text("вторая строка");
```

обработчик имеет вид

```ts
(options: { button: T; index: number; row: T[]; rowIndex: number }) => boolean;
```

### pattern

Массив с количеством столбцов в каждой строке. Позволяет установить «шаблон».

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard()
    .pattern([1, 3, 2])
    .text("1")
    .text("2")
    .text("2")
    .text("2")
    .text("3")
    .text("3");
```

### filter

Обработчик, который помогает фильтровать кнопки клавиатуры.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard()
    .filter(({ button }) => button.text !== "скрытая")
    .text("проходит")
    .text("скрытая")
    .text("проходит");
```

### add

Позволяет добавить несколько кнопок в _сыром_ формате.

```ts twoslash
import { Keyboard } from "@gramio/keyboards";
// ---cut---
const labels = ["какие-то", "кнопки"];

new Keyboard()
    .add({ text: "сырая кнопка" })
    .add(Keyboard.text("сырая кнопка через Keyboard.text"))
    .add(...labels.map((x) => Keyboard.text(x)));
```

### addIf

Позволяет динамически подставлять кнопки в зависимости от чего-либо.

```ts twoslash
// @noErrors
import { Keyboard } from "@gramio/keyboards";
// ---cut---
const labels = ["какие-то", "кнопки"];
const isAdmin = true;

new Keyboard()
    .addIf(1 === 2, { text: "сырая кнопка" })
    .addIf(isAdmin, Keyboard.text("сырая кнопка через Keyboard.text"))
    .addIf(
        ({ index, rowIndex }) => rowIndex === index,
        ...labels.map((x) => Keyboard.text(x)),
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
import { Keyboard } from "@gramio/keyboards";
// TODO: remove no errors
// ---cut---
import { randomInt } from "node:crypto";

const bomb = [randomInt(0, 9), randomInt(0, 9)] as const;

new Keyboard().matrix(10, 10, ({ rowIndex, index }) =>
    Keyboard.text(rowIndex === bomb[0] && index === bomb[1] ? "💣" : "ㅤ"),
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
import { Keyboard } from "@gramio/keyboards";
// ---cut---
new Keyboard()
    .combine(new Keyboard().text("первая"))
    .row()
    .combine(new Keyboard().text("вторая").row().text("третья"));
```
