---
title: Force Reply клавиатура - Стимулирование пользователей к ответу

head:
    - - meta
      - name: "description"
        content: "Научитесь использовать Force Reply Keyboard в GramIO, чтобы заставить клиенты Telegram автоматически отображать интерфейс ответа, создавая естественные диалоговые потоки с сохранением режима приватности."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, force reply keyboard, принудительный ответ, интерфейс ответа, пошаговый интерфейс, режим приватности бота, ForceReply, selective, input_field_placeholder, ожидание ответа, диалоговый ввод, обработка ответов пользователя, форма ввода"
---

# Force Reply Keyboard

При получении сообщения с этим объектом, клиенты Telegram отобразят интерфейс ответа пользователю (действуют так, как если бы пользователь выбрал сообщение бота и нажал 'Ответить'). Это может быть чрезвычайно полезно, если вы хотите создать удобные пошаговые интерфейсы без необходимости отказываться от [режима приватности](https://core.telegram.org/bots/features#privacy-mode).

Смотрите также [API Reference](https://jsr.io/@gramio/keyboards/doc/~/ForceReplyKeyboard).

## Импорт

### С GramIO

```ts twoslash
import { ForceReplyKeyboard } from "gramio";
```

### Без GramIO

```ts twoslash
import { ForceReplyKeyboard } from "@gramio/keyboards";
```

## Параметры ([Документация](https://core.telegram.org/bots/api/#forcereply))

Эти параметры отвечают за настройки клавиатуры force reply

### selective

Используйте этот параметр, если вы хотите принудительно получить ответ только от определенных пользователей.

Цели:

1. пользователи, которые упоминаются в _тексте_ объекта [Message](https://core.telegram.org/bots/api/#message).
2. если сообщение бота является ответом на сообщение в том же чате и теме форума, отправитель исходного сообщения.

```ts twoslash
import { ForceReplyKeyboard } from "@gramio/keyboards";
// ---cut---
new ForceReplyKeyboard().selective(); // для включения
new ForceReplyKeyboard().selective(false); // для отключения
```

### placeholder

Заполнитель, отображаемый в поле ввода, когда ответ активен, 1-64 символа.

```ts twoslash
import { ForceReplyKeyboard } from "@gramio/keyboards";
// ---cut---
new ForceReplyKeyboard().placeholder("какой-то текст"); // для включения
new ForceReplyKeyboard().placeholder(); // для отключения
```
