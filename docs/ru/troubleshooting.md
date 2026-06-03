---
title: "Решение проблем GramIO — частые ошибки и их исправления"
head:
    - - meta
      - name: "description"
        content: "Решение проблем Telegram-ботов на GramIO по симптомам — конфликт поллинга 409, сломанное форматирование (parse_mode с format, нативный .join, .toString), prompt теряется при рестарте, висит индикатор у callback, не приходят opt-in обновления, сцены без session, доступ к контексту через snake_case, не await-нутый MediaUpload, не срабатывает webhook."
    - - meta
      - name: "keywords"
        content: "gramio решение проблем, telegram бот 409 conflict, terminated by other getUpdates, parse_mode не работает, потеря сущностей format, индикатор callback query, сцена не работает, webhook не срабатывает, бот не получает обновления"
---

# Решение проблем

Сгруппировано по **симптому**: что вы видите → почему так → как починить.

## Бот запускается, но не получает обновлений

- **`409 Conflict: terminated by other getUpdates request`** — два процесса делают long-polling одного токена (второй `bot.start()`, старый контейнер ещё работает, или поллинг при установленном webhook). Запускайте ровно один экземпляр. Если ранее устанавливали webhook, вызовите `bot.api.deleteWebhook()` перед поллингом.
- **Установлен webhook, поэтому поллинг ничего не получает.** Webhook и long-polling взаимоисключающи. Вызовите `deleteWebhook`, чтобы вернуться к поллингу, либо оставьте webhook и не вызывайте обычный `bot.start()`.
- **Не приходят opt-in обновления** (`chat_member`, `message_reaction`, `chat_join_request`, business-обновления). Telegram исключает их из `allowed_updates` по умолчанию. Передайте их явно:
  ```ts
  bot.start({ allowedUpdates: ["message", "chat_member", "message_reaction"] });
  ```
  См. [Обновления](/ru/updates/overview).
- **В группах бот видит только команды и @упоминания.** Privacy mode включён по умолчанию. Отключите его через `/setprivacy` в [@BotFather](https://t.me/BotFather) — только если бот должен читать все сообщения группы.

## 401 / 404 от API

- **`401 Unauthorized`** — неверный или пустой токен. `new Bot(process.env.BOT_TOKEN as string)` молча станет `undefined`, если переменная окружения отсутствует. Убедитесь, что токен загружен (например, `node --env-file=.env`, dotenv или секреты вашего хостинга) до создания бота.
- **`404 Not Found` на каждом методе** — обычно неверный базовый URL API (опечатка в кастомном / [локальном Bot API](/ru/bot-api/local)) или токен с лишним пробелом/переводом строки.

## Сломано форматирование (литеральные теги, нет жирного, двойное экранирование)

Это самые частые ошибки в GramIO — полные правила в [Форматировании](/ru/formatting).

- **Вы видите литеральные `<b>` / `*` / обратные слэши в сообщении.** Вы передали `parse_mode` вместе с шаблоном `format`. **Никогда** не сочетайте их — `format` уже создаёт настоящие сущности. Уберите `parse_mode` полностью.
- **Сущности пропадают при объединении массива formattable.** Нативный `Array.prototype.join()` превращает в строку и срезает сущности. Используйте хелпер `join` из `gramio`.
- **Сущности пропадают при переиспользовании `FormattableString`.** Обычная интерполяция шаблона (`` `${myFormattable}` ``) срезает сущности; не вызывайте на нём `.toString()`. Всегда оборачивайте переиспользуемые formattable во внешний ``format`...` ``.
- **Форматирование подписи игнорируется на медиа.** Передавайте значение `format` как `caption` — и снова, без `parse_mode`.

## Callback-кнопки «сломаны» / висит индикатор

- **Инлайн-кнопка показывает индикатор загрузки ~15с.** Обработчик не вызвал `answerCallbackQuery`. Сделайте `await ctx.answer()` **первой строкой** каждого `callbackQuery`-обработчика (пустой ответ — это нормально) или установите [`@gramio/auto-answer-callback-query`](/ru/plugins/official/auto-answer-callback-query). См. [UX-паттерны §7](/ru/guides/ux-patterns).
- **`callbackQuery`-обработчик не срабатывает.** `callback_data` кнопки не совпадает с матчером обработчика. Предпочтите типизированную схему `CallbackData` и передавайте один и тот же экземпляр в `.pack()` и в `bot.callbackQuery(schema, …)`. См. [Инлайн-клавиатуру](/ru/keyboards/inline-keyboard).
- **`BUTTON_DATA_INVALID`.** `callback_data` превышает 64 байта. Сократите схему / упаковывайте меньше полей.

## Сцены / многошаговые потоки

- **`ctx.scene` undefined / сцены ничего не делают.** `scenes()` требует, чтобы `session()` был установлен **первым**: `.extend(session()).extend(scenes([...]))`. См. [Сцены](/ru/plugins/official/scenes).
- **Поток молча сбрасывается после деплоя или рестарта.** Вы использовали [`@gramio/prompt`](/ru/plugins/official/prompt) (в памяти) для многошагового потока. Ожидаемый промис умирает вместе с процессом. Используйте `.ask()` у Сцен (сохраняет шаг + ответы через storage) для всего, что должно пережить рестарт.

## Доступ к контексту

- **`ctx.payload` / snake_case-поля `undefined` или без типов.** Не читайте сырой payload. Каждое поле Telegram — это camelCase-геттер на контексте: `ctx.from.firstName`, `ctx.chatId`, `ctx.messageId`.
- **Ожидаемый геттер `undefined`.** Он есть только на соответствующем типе обновления — сначала сузьте через `ctx.is("message")` или [фильтр](/ru/guides/filters), затем обращайтесь.

## Загрузка файлов

- **`sendPhoto` падает или отправляет литеральную строку пути.** `MediaUpload.path` / `url` / `buffer` — **асинхронный**, его нужно `await`:
  ```ts
  await ctx.sendPhoto(await MediaUpload.path("./p.jpg"));
  ```
  Уже загруженный `file_id` передаётся напрямую (без `MediaUpload`). См. [Файлы](/ru/files/overview).

## Webhook не срабатывает

- **Telegram не обращается к вашему эндпоинту.** `bot.start({ webhook: { url } })` вызывает `setWebhook`, но **не** запускает HTTP-сервер — вы должны сами смонтировать `webhookHandler(bot, "<framework>")` и выставить его по HTTPS. Проверьте через `bot.api.getWebhookInfo()` (смотрите `last_error_message`). См. [Webhook](/ru/updates/webhook).
- **Локальная разработка: Telegram не достучится до `localhost`.** Используйте туннель (cloudflared / ngrok) и установите webhook на публичный HTTPS-URL.

## Не проходит авторизация Mini App (TMA)

- **Не проходит валидация `initData`.** Расхождение часов, неверный токен бота в валидаторе или вы валидируете уже распарсенный объект вместо сырой строки `initData`. Валидируйте сырую строку правильным токеном. См. [Mini Apps](/ru/tma/overview).

## Типы / сборка

- **Кастомный `ctx.foo` — `any` или ошибка.** Не дополняйте через `declare module`. Добавляйте через `.derive(ctx => ({ foo }))` (на обновление) или `.decorate({ foo })` (статически), чтобы тип проходил автоматически.

## Всё ещё не получается?

- Найдите нужный метод и его таблицу ошибок в [справочнике методов Telegram Bot API](/ru/telegram/).
- Спросите в [чате GramIO](https://t.me/gramio_forum).
