---
title: Сопоставление сообщений с hears() - Реагирование на текстовые шаблоны в GramIO

head:
    - - meta
      - name: "description"
        content: "Научитесь использовать метод hears() в GramIO для сопоставления и реагирования на определенные текстовые шаблоны в сообщениях Telegram, используя строки, регулярные выражения или пользовательские функции."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, метод hears, сопоставление текста, шаблоны сообщений, сопоставление regex, сопоставление строк, текстовые триггеры, распознавание шаблонов, обработка сообщений, обработка естественного языка, фильтрация текста, middleware сообщений, обработка диалога"
---

<!-- ChatGPT helps -->

# Метод Hears

Метод `hears` в GramIO позволяет настроить ответы на определенные сообщения. Вы можете определить, какие сообщения должен прослушивать ваш бот и как он должен обрабатывать эти сообщения при их обнаружении. Метод гибкий и может работать с регулярными выражениями, точными строками или пользовательскими функциями.

## Основное использование

### Использование сопоставителя `Regular Expression` (Регулярное выражение)

Вы можете настроить бота на прослушивание сообщений, соответствующих определенному шаблону, используя регулярные выражения. Это полезно, когда вы хотите, чтобы ваш бот отвечал на сообщения, соответствующие определенной структуре.

```ts
bot.hears(/hello (.*)/i, async (context) => {
    if (context.args) {
        await context.send(`Привет, ${context.args[1]}!`);
    }
});
```

В этом примере бот прослушивает сообщения, начинающиеся со слова "привет", за которым следует любой текст. Когда такое сообщение получено, бот извлекает текст после "привет" и отправляет персонализированное приветствие.

### Использование сопоставителя `String` (Строка)

Если вы хотите, чтобы ваш бот отвечал на конкретное слово или фразу, вы можете использовать строковый триггер.

```ts
bot.hears("hello", async (context) => {
    await context.send("Добро пожаловать! Введите 'помощь', чтобы увидеть доступные команды.");
});
```

В этом случае бот прослушивает точное слово "старт" и отвечает приветственным сообщением.

### Использование сопоставителя `Function` (Функция)

Для более сложных сценариев вы можете использовать функцию для определения триггера. Эта функция проверяет контекст сообщения и решает, запускать ли ответ.

```ts
bot.hears(
    (context) => context.user.role === "admin",
    async (context) => {
        await context.send("Здравствуйте, Администратор! Чем я могу вам помочь?");
    }
);
```

Здесь бот проверяет, является ли пользователь администратором. Если да, он отправляет специальное сообщение для администраторов.

<!-- ## Как работает `hears`

1. **Строковый триггер:** Бот сравнивает входящее сообщение с заданной строкой. Если они точно совпадают, бот запускает функцию-обработчик.
2. **Триггер регулярного выражения:** Бот проверяет, соответствует ли сообщение регулярному выражению. Если да, запускается функция-обработчик, и совпадающие части сообщения передаются в `context.args`.
3. **Функциональный триггер:** Бот запускает предоставленную вами пользовательскую функцию. Если эта функция возвращает `true`, запускается функция-обработчик.

## Заключение

Метод `hears` необходим для создания ботов, которые могут прослушивать и отвечать на определенные пользовательские вводы. Независимо от того, обрабатываете ли вы простые команды или сложные взаимодействия, `hears` упрощает определение того, как ваш бот должен реагировать на различные типы сообщений.

Этот метод предоставляет вам инструменты, необходимые для создания интерактивных и удобных для пользователя ботов в GramIO. --> 