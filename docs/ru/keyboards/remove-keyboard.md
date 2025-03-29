---
title: Удаление клавиатуры - Скрытие кастомных клавиатур

head:
    - - meta
      - name: "description"
        content: "Узнайте, как удалять кастомные клавиатуры в Telegram ботах с помощью функции RemoveKeyboard в GramIO. Возвращайтесь к стандартной клавиатуре, когда кастомная больше не нужна."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, remove keyboard, удаление клавиатуры, скрыть клавиатуру, ReplyKeyboardRemove, selective, убрать кнопки, сброс клавиатуры, отмена клавиатуры, стандартная клавиатура, одноразовые клавиатуры, очистка интерфейса"
---

# Remove Keyboard

При получении сообщения с этим объектом, клиенты Telegram удалят текущую кастомную клавиатуру и отобразят стандартную буквенную клавиатуру. По умолчанию кастомные клавиатуры отображаются до тех пор, пока бот не отправит новую клавиатуру. Исключение составляют одноразовые клавиатуры, которые скрываются сразу после нажатия пользователем на кнопку (см. [ReplyKeyboardMarkup](https://core.telegram.org/bots/api/#replykeyboardmarkup)).

Смотрите также [API Reference](https://jsr.io/@gramio/keyboards/doc/~/RemoveKeyboard).

## Импорт

### С GramIO

```ts twoslash
import { RemoveKeyboard } from "gramio";
```

### Без GramIO

```ts twoslash
import { RemoveKeyboard } from "@gramio/keyboards";
```

## Параметры ([Документация](https://core.telegram.org/bots/api/#replykeyboardremove))

Эти параметры отвечают за настройки удаления кнопок

### selective

Используйте этот параметр, если вы хотите удалить клавиатуру только для определенных пользователей.

Цели:

1. пользователи, которые упоминаются в _тексте_ объекта [Message](https://core.telegram.org/bots/api/#message).
2. если сообщение бота является ответом на сообщение в том же чате и теме форума, отправитель исходного сообщения.

Пример: Пользователь голосует в опросе, бот возвращает сообщение с подтверждением в ответ на голос и удаляет клавиатуру для этого пользователя, при этом продолжая показывать клавиатуру с вариантами опроса пользователям, которые еще не голосовали.

```ts twoslash
import { RemoveKeyboard } from "@gramio/keyboards";
// ---cut---
new RemoveKeyboard().selective(); // для включения
new RemoveKeyboard().selective(false); // для отключения
```
