---
title: Обновление GramIO
head:
    - - meta
      - name: "description"
        content: "Обновление существующего проекта GramIO между версиями gramio и @gramio/*. Ломающие изменения, устаревания и новые возможности между вашей версией и последней, в порядке зависимостей, с кодом Было/Стало."
    - - meta
      - name: "keywords"
        content: "обновление gramio, update gramio, ломающие изменения, миграция, бамп версии, гайд по обновлению @gramio, что сломается, порядок зависимостей"
---

# Обновление GramIO

Это гайд по обновлению **между версиями** — что меняется, когда вы бампаете `gramio` и `@gramio/*` до более свежего релиза. (Переходите **с другого фреймворка**? Тогда вам в [гайды по миграции](/ru/guides/migration-from-grammy).)

## Как устроено обновление

GramIO — это семейство пакетов, которые двигаются вместе. Несколько правил делают обновление безболезненным:

1. **Узнайте, на чём вы сейчас.** Из корня проекта:

   ```bash
   npx gramio-detect-versions --latest
   # или, если установлены AI-навыки:
   node skills/gramio-upgrade/detect-versions.mjs --latest
   ```

   Скрипт перечислит все зависимости `gramio` / `@gramio/*` с установленной версией, последней в npm и прямой ссылкой на нужный раздел этой страницы для каждого пакета, где есть обновление.

2. **Бампайте в порядке зависимостей.** Сначала низкоуровневые пакеты, потом те, что от них зависят:

   `@gramio/types` · `@gramio/composer` → `@gramio/contexts` · `@gramio/files` · `@gramio/format` → `gramio` → плагины (`scenes`, `session`, `views`, …) → тулинг (`@gramio/test`).

   Линейку Bot API (`@gramio/types`, `contexts`, `files`, `format`, `gramio`) двигайте **одним блоком** — их peer-диапазоны зависят друг от друга.

3. **Не пропускайте промежуточные шаги.** Ломающие изменения накапливаются. Переход `0.5 → 0.10` означает чтение каждой записи между ними, а не только концов.

4. **Пиньтесь вокруг проблемных релизов.** Там, где в записи сказано *«обновляйтесь сразу до X»* — делайте именно так.

::: tip Пусть это сделает ваш AI-ассистент
Если вы используете [AI-навыки GramIO](/ru/guides/ai-skills), навык **`gramio-upgrade`** автоматизирует всё это — определяет ваши версии, строит упорядоченный план по данным ниже, применяет правки в коде и проверяет типы. Просто попросите его «обнови gramio».
:::

## Найдите своё обновление

Выберите пакет и текущую/целевую версии — или вставьте JSON из `gramio-detect-versions --latest --json`, чтобы получить полный план для всего проекта сразу.

<UpgradePicker />

## Все миграции

Всё ниже сгенерировано из тех же данных, что использует пикер и CLI, в порядке слоёв зависимостей. Каждая запись ссылается на полный changelog соответствующего цикла.

<!-- BEGIN GENERATED:migrations -->

## `@gramio/composer` {#pkg-gramio-composer}

### 0.3.3 → 0.4.1 · [changelog](/changelogs/2026-05-08) {#gramio-composer-0-3-3-0-4-1}

**🗑 Устаревшее**

- **commandsMeta теперь со значением unknown** — Telegram-специфичная форма переехала в ядро gramio. Важно, только если вы читаете commandsMeta напрямую.

**✨ Новое**

- **registeredEvents() и EventContextOf&lt;T, E&gt;** — registeredEvents() возвращает зарегистрированные имена событий (питает авто allowed_updates в gramio 0.9); EventContextOf извлекает глобальные + per-event derive для кастомных методов.

**🐛 Исправления**

- **ctx в guard() больше не схлопывается в any** — ctx предиката сохраняет тип после derive().

### 0.2.0 → 0.3.3 · [changelog](/changelogs/2026-03-02) {#gramio-composer-0-2-0-0-3-3}

**✨ Новое**

- **EventContextOf / ContextOf / defineComposerMethods + макросы** — Типобезопасные кастомные методы, видящие накопленные derive, плюс система макросов в духе Elysia для декларативных опций хэндлеров.
  ```ts
  bot.macro("adminOnly", {
      preHandler: async (ctx, next) =>
          ctx.from?.id !== ADMIN_ID ? ctx.reply("Admins only") : next(),
  });
  bot.command("ban", banHandler, { adminOnly: true });
  ```

**🐛 Исправления**

- **WeakMap-геттеры в группах изоляции** — Изоляция group()/extend() перешла с Object.create(ctx) на snapshot/restore, починив ленивые геттеры (ctx.text, ctx.from) внутри групп изоляции.

### 0.1.x → 0.2.0 · [changelog](/changelogs/2026-02-17) {#gramio-composer-0-1-x-0-2-0}

**✨ Новое**

- **decorate() / when() / inspect() / trace()** — decorate() (статический контекст без оверхеда), when() (условное middleware на этапе сборки — свойства типа Partial), inspect() (метаданные только для чтения), trace() (опциональная инструментация). createComposer({ methods }) внедряет типизированные шорткаты. MaybeArray&lt;T&gt; расширен до T | readonly T[].

## `@gramio/schema-parser` {#pkg-gramio-schema-parser}

### 1.0.1 → 1.1.0 · [changelog](/changelogs/2026-05-08) {#gramio-schema-parser-1-0-1-1-1-0}

**✨ Новое**

- **Детекция FormattableString по общим соседям** — Повышает единственное непомеченное строковое поле до semanticType: "formattable", когда у объекта есть голые parse_mode + entities (например, InputTextMessageContent).

### → 1.0.1 · [changelog](/changelogs/2026-02-23) {#gramio-schema-parser-init-1-0-1}

**✨ Новое**

- **Новый внутренний движок схем** — Нативный TypeScript-парсер документации Telegram Bot API, питающий @gramio/types (заменяет Rust-крейт tg-bot-api). Семантические маркеры типов, детекция InputFile | string, синтезированный enum Currencies с XTR, юнионы oneOf.

## `@gramio/types` {#pkg-gramio-types}

### 10.2.2 → 10.3.1 · [changelog](/changelogs/2026-08-25) {#gramio-types-10-2-2-10-3-1}

**⚠️ Ломающее**

- **Параметры эфемерной отправки стали вложенными** — Перенесите receiver_user_id, callback_query_id и replace_callback_query_message в ephemeral_message_parameters. Устаревшие алиасы верхнего уровня не поддерживаются.
  ```ts
  // Before
  await bot.api.sendMessage({
      chat_id,
      text: "Private reply",
      receiver_user_id: userId,
      callback_query_id: callbackQueryId,
  });
  // After
  await bot.api.sendMessage({
      chat_id,
      text: "Private reply",
      ephemeral_message_parameters: {
          receiver_user_id: userId,
          callback_query_id: callbackQueryId,
          replace_callback_query_message: true,
      },
  });
  ```
- **Фикстурам прав администратора нужно право welcome-сообщений** — Создаваемые вручную значения ChatAdministratorRights и ChatMemberAdministrator должны содержать can_send_welcome_messages.

**✨ Новое**

- **Полный набор деклараций Bot API 10.3** — Добавлены остановка генерации сообщений, вход community-чата, отключённые кнопки, force-reply разметка, расширенные rich-message объекты и новые параметры эфемерных сообщений.

**🐛 Исправления**

- **Поля остановки draft восстановлены** — SendMessageDraftParams и SendRichMessageDraftParams содержат can_stop и keep_on_stop; генерационные проверки защищают их от повторной потери.

### 10.1.0 → 10.2.0 · [changelog](https://core.telegram.org/bots/api-changelog#july-14-2026) {#gramio-types-10-1-0-10-2-0}

**✨ Новое**

- **Перегенерировано под Bot API 10.2** — Аддитивно, без ломающих изменений. Эфемерные сообщения: editEphemeralMessageText/Media/Caption/ReplyMarkup + deleteEphemeralMessage, параметры receiverUserId и callbackQueryId у 13 методов отправки, Message.receiverUser / ephemeralMessageId, BotCommand.isEphemeral, ReplyParameters.ephemeralMessageId.
- **Сообщества и обновления подписок** — Объект Community, ChatFullInfo.community, сервисные сообщения community_chat_added / community_chat_removed. Новое обновление subscription: Update.subscription + BotSubscriptionUpdated (state: canceled | active | failed) — добавьте "subscription" в allowed_updates, чтобы получать его.
- **Rich Messages — структурированный ввод** — Блоки записи InputRichBlock* (paragraph, list, table, collage, slideshow, details, thinking, math, медиа-блоки, …), InputRichMessage.blocks / media, InputRichMessageMedia и InputMediaVoiceNote — сборка rich-сообщений поблочно, а не только через markdown/html.

### 10.0.0 → 10.1.0 · [changelog](https://core.telegram.org/bots/api-changelog#june-11-2026) {#gramio-types-10-0-0-10-1-0}

**✨ Новое**

- **Перегенерировано под Bot API 10.1** — Аддитивно, без ломающих изменений. Rich Messages (чтение): структуры RichText* / RichBlock*, Message.richMessage, InputRichMessage + InputRichMessageContent (можно как InputMessageContent в ответах inline / guest / Web App), sendRichMessage, sendRichMessageDraft (эфемерный стриминговый предпросмотр), editMessageText.richMessage.
- **Запросы на вступление и опросы** — User.supportsJoinRequestQueries, ChatFullInfo.guardBot, ChatJoinRequest.queryId, answerChatJoinRequestQuery, sendChatJoinRequestWebApp. Опросы: Link + PollMedia.link, InputMediaLink как InputPollOptionMedia.

### 9.6.x → 10.0.0 · [changelog](/changelogs/2026-05-31) {#gramio-types-9-6-x-10-0-0}

**⚠️ Ломающее**

- **Перегенерировано под Bot API 10.0** — Живые фото, гостевые сообщения, медиа в опросах/вариантах, права на реакции, настройки доступа бота. correctOptionId теперь correctOptionIds (массив) — поправьте код, читавший одиночное поле.

**✨ Новое**

- **Новые структуры** — LivePhotoAttachment, BotAccessSettings, SentGuestMessage, медиа опросов / explanationMedia / membersOnly / countryCodes, sendLivePhoto + per-option медиа в sendPoll.

### 9.5.0 → 9.6.1 · [changelog](/changelogs/2026-05-08) {#gramio-types-9-5-0-9-6-1}

**⚠️ Ломающее**

- **Bot API 9.6** — correctOptionId → correctOptionIds (массив) впервые появляется здесь; добавлены структуры managed-ботов и опросов.

**🐛 Исправления**

- **Мохибейк SendDiceEmoji исправлен в 9.6.1** — 9.6.0 ненадолго выпустили с битыми значениями эмодзи; 9.6.1 кидает на битой последовательности и содержит чистый юникод. Пиньте ^9.6.1, а не 9.6.0.

### 9.4.2 → 9.5.0 · [changelog](/changelogs/2026-03-02) {#gramio-types-9-4-2-9-5-0}

**✨ Новое**

- **Типы Bot API 9.5** — Теги участников, сущность date_time, can_manage_tags.

### 9.4.1 → 9.4.2 · [changelog](/changelogs/2026-02-23) {#gramio-types-9-4-1-9-4-2}

**✨ Новое**

- **Переезд на @gramio/schema-parser** — Генератор ушёл с Rust-крейта tg-bot-api. Точные юнионы InputFile | string, семантически типизированные formattable-поля, enum Currencies (вкл. XTR) и ранее отсутствовавшие типы APIResponse / APIResponseOk / APIResponseError.

### 9.3.0 → 9.4.0 · [changelog](/changelogs/2026-02-15) {#gramio-types-9-3-0-9-4-0}

**✨ Новое**

- **Типы Bot API 9.2–9.4** — VideoQuality, UserProfileAudios, ChatOwnerLeft, ChatOwnerChanged, UniqueGiftModelRarity, типы стилизации кнопок и методы getUserProfileAudios / setMyProfilePhoto / removeMyProfilePhoto.

## `wrappergram` {#pkg-wrappergram}

### 1.3.0 → 2.0.0 · [changelog](/changelogs/2026-08-25) {#wrappergram-1-3-0-2-0-0}

> Касается вас, только если вы используете wrappergram напрямую — пользователи gramio получают bot.api и не затронуты.

**⚠️ Ломающее**

- **Прямые результаты, исключения и opt-in middleware** — Класс Telegram остаётся, но API-вызовы теперь возвращают результат Telegram напрямую и по умолчанию бросают TelegramError. @gramio/files больше не встроен — подключайте @gramio/files/middleware (и @gramio/format/middleware). requestOptions переименован в fetchOptions.
  ```ts
  // Before
  const response = await telegram.api.sendMessage({ chat_id, text });
  if (!response.ok) console.error(response.description);
  else console.log(response.result.message_id);
  // After
  import { Telegram, TelegramError } from "wrappergram";
  import { filesMiddleware } from "@gramio/files/middleware";
  
  const telegram = new Telegram(token, { middlewares: [filesMiddleware] });
  const result = await telegram.api.sendMessage({ chat_id, text, suppress: true });
  if (result instanceof TelegramError) console.error(result.code, result.payload);
  else console.log(result.message_id);
  ```

**✨ Новое**

- **Исправленная raw-линейка Bot API 10.3** — Wrappergram предоставляет поверхность методов @gramio/types 10.3.1, включая исправленные поля draft и строгие вложенные ephemeral_message_parameters.
- **Единый тип Middleware, TelegramError, suppress** — Middleware (ctx, next) =&gt; unknown, первоклассный TelegramError (method/code/payload + настоящий стек), suppress: true (возврат TelegramError | Result вместо throw), per-request опции fetch.

## `@gramio/callback-data` {#pkg-gramio-callback-data}

### 0.1.1 → 0.2.0 · [changelog](/changelogs/2026-08-25) {#gramio-callback-data-0-1-1-0-2-0}

**✨ Новое**

- **Zero-width codec для payload reply-клавиатур** — encode/decode преобразуют строки в невидимый UTF-8 суффикс и обратно; embed/extract добавляют типизированные callback payload к видимым label reply-кнопок и извлекают их из текста сообщения.
  ```ts
  import { embed, extract } from "@gramio/callback-data";
  const label = embed("⚙️ Settings", navigation.pack({ to: "settings" }));
  const embedded = extract(ctx.text ?? "");
  if (embedded) navigation.safeUnpack(embedded.data);
  ```

### 0.0.11 → 0.1.0 · [changelog](/changelogs/2026-02-23) {#gramio-callback-data-0-0-11-0-1-0}

**✨ Новое**

- **safeUnpack()** — Никогда не падает на устаревших кнопках; возвращает типизированный дискриминированный union (SafeUnpackResult&lt;T&gt;). Используйте только вне bot.callbackQuery(schema, …) (там уже есть распаковка в ctx.queryData).
  ```ts
  const result = data.safeUnpack(ctx.data ?? "");
  if (!result.success) return ctx.answerCallbackQuery({ text: "This button is outdated!" });
  ```
- **Optional-поля обратно совместимы** — Добавление optional-полей в конец схемы теперь безопасная миграция — старые упакованные строки распаковываются с новыми полями как undefined. Добавление required-полей, перестановка и переименование nameId по-прежнему ломают.

## `@gramio/contexts` {#pkg-gramio-contexts}

### 0.10.0 → 0.11.0 · [changelog](/changelogs/2026-08-25) {#gramio-contexts-0-10-0-0-11-0}

**✨ Новое**

- **Контексты Bot API 10.3** — MessageGenerationStoppedContext предоставляет draftId, threadId, chat, chatId, chatType и методы отправки; CommunityChatJoinedContext зарегистрирован как сервисное событие.
- **Новые геттеры 10.3** — Права администратора получили canSendWelcomeMessages(); UniqueGiftInfo — text, обёрнутые entities и isPrivate; обёртки клавиатур — forceReply и isDisabled.
- **Преобразование rich messages в простой текст** — Извлечение plain text теперь учитывает rich-кнопки, раскрываемые цитаты, подписи документов, ряды кнопок и авторство.

**🔧 Бамп peer/зависимостей (двигать вместе)**

- @gramio/types ^10.3.1

### 0.6.1 → 0.7.0 · [changelog](/changelogs/2026-05-31) {#gramio-contexts-0-6-1-0-7-0}

**✨ Новое**

- **Геттеры и миксины Bot API 10** — Message.livePhoto + sendLivePhoto; гостевые сообщения (Message.guestQueryId / guestBotCallerUser / guestBotCallerChat, MessageContext.answerGuestQuery(), User.supportsGuestQueries()); deleteReaction / deleteAllReactions, canReactToMessages; настройки доступа managed-бота.

### 0.5.x → 0.6.1 · [changelog](/changelogs/2026-05-08) {#gramio-contexts-0-5-x-0-6-1}

**✨ Новое**

- **Bot API 9.6 — managed-боты и опросы** — контексты managed_bot / managed_bot_created, ManagedBotCreated/Updated, User.canManageBots(), getManagedBotToken()/replaceManagedBotToken(); геттеры опросов (Poll.allowsRevoting/description, PollOption.persistentId/addedByUser, PollAnswer.optionPersistentIds).

**🐛 Исправления**

- **0.5.1: сужение через AnyBot** — ctx.isPM()/isGroup()/isChannel() больше не схлопываются в never через AnyBot (контрибьютор @ttempaa).

### 0.4.0 → 0.5.0 · [changelog](/changelogs/2026-03-02) {#gramio-contexts-0-4-0-0-5-0}

**✨ Новое**

- **Геттеры Bot API 9.5** — геттеры сущности date_time на MessageEntity (unixTime, dateTimeFormat); шорткат ctx.setMemberTag(); поля тегов участников.

### 0.3.1 → 0.4.0 · [changelog](/changelogs/2026-02-15) {#gramio-contexts-0-3-1-0-4-0}

**✨ Новое**

- **ctx.streamMessage(chunks)** — Драфты с живым набором через sendMessageDraft, авто-финализация на 4096 символах, отмена через AbortSignal. Принимает Iterable/AsyncIterable&lt;MessageDraftPiece&gt;.
  ```ts
  bot.command("stream", async (ctx) => {
      await ctx.streamMessage(generateTextChunks());
  });
  ```
- **8 новых контекстов (Bot API 9.2–9.4)** — SuggestedPost*Context, GiftUpgradeSentContext, ChatOwnerLeftContext, ChatOwnerChangedContext, VideoAttachment.qualities, User.allowsUsersToCreateTopics().

### → 0.3.1 · [changelog](/changelogs/2026-02-08) {#gramio-contexts-init-0-3-1}

**✨ Новое**

- **ctx.chatId в контексте callback-query** — Больше не нужно копать ctx.message?.chat?.id. Контрибьютор @n08i40k.
- **Поддержка TON в UniqueGiftInfo** — lastResaleCurrency ("XTR" | "TON") + lastResaleAmount; lastResaleStarCount возвращает значение только при валюте "XTR".

## `@gramio/files` {#pkg-gramio-files}

### 0.7.0 → 0.8.0 · [changelog](/changelogs/2026-08-25) {#gramio-files-0-7-0-0-8-0}

**✨ Новое**

- **Рекурсивные загрузки в rich messages** — Извлечение файлов проходит по ссылкам, union-типам, массивам и рекурсивным rich-блокам, включая rich_message.blocks и rich_message.media метода sendRichMessage.
- **Описатели путей без поломки Extractor** — Сгенерированные метаданные загрузок получили пути с wildcard при сохранении старой формы Extractor. Загрузки InputRichBlockDocument поддерживаются; sendRichMessageDraft по правилам Telegram остаётся без прямых загрузок.

**🔧 Бамп peer/зависимостей (двигать вместе)**

- @gramio/types ^10.3.1

## `@gramio/format` {#pkg-gramio-format}

### 0.10.0 → 0.11.0 · [changelog](/changelogs/2026-08-25) {#gramio-format-0-10-0-0-11-0}

**✨ Новое**

- **Конструкторы rich messages** — Добавлены quote(content, { expandable, credit }), document({ url, caption }), button(), buttonRow() и компактные таблицы.
- **Покрытие мутаций Bot API 10.3** — Сгенерированные форматирующие мутации покрывают rich-контент в эфемерных редактированиях и новые пути документов и подписей.

**🔧 Бамп peer/зависимостей (двигать вместе)**

- @gramio/types ^10.3.1

### 0.7.0 → 0.8.0 · [changelog](/changelogs/2026-05-31) {#gramio-format-0-7-0-0-8-0}

**✨ Новое**

- **Перегенерировано под Bot API 10** — Мутаторы для sendLivePhoto, answerGuestQuery, explanation_media и per-option медиа в опросах.

**🔧 Бамп peer/зависимостей (двигать вместе)**

- @gramio/types ^10

### 0.5.0 → 0.7.0 · [changelog](/changelogs/2026-05-08) {#gramio-format-0-5-0-0-7-0}

**✨ Новое**

- **formatMiddleware** — @gramio/format/middleware экспортирует formatMiddleware для цепочки wrappergram v2 (раскладывает FormattableString на text+entities перед каждым вызовом API).

**🐛 Исправления**

- **Разделители markdown-блоков сохраняются** — Соседние блоки (параграф+список, +цитата, +код, заголовок+что-угодно) больше не склеиваются. Важно для контента от LLM.

### 0.4.0 → 0.5.0 · [changelog](/changelogs/2026-03-02) {#gramio-format-0-4-0-0-5-0}

**✨ Новое**

- **htmlToFormattable()** — Из @gramio/format/html (peer node-html-parser) — конвертация HTML в Telegram-сущности без parse_mode, мягкая деградация в обычный текст.
  ```ts
  import { htmlToFormattable } from "@gramio/format/html";
  ctx.send(htmlToFormattable("<b>Bold</b> and <i>italic</i>"));
  ```
- **Перегрузка join() для массива** — join(items, "\n") вместо join(items, (x) =&gt; x, "\n"). По-прежнему никогда не используйте нативный Array.join() на Formattable (теряются offset'ы сущностей).

## `@gramio/keyboards` {#pkg-gramio-keyboards}

### 1.4.0 → 1.5.0 · [changelog](/changelogs/2026-08-25) {#gramio-keyboards-1-4-0-1-5-0}

**✨ Новое**

- **Отключённые inline-кнопки** — InlineKeyboard.disabled(text, options?) создаёт отключённые кнопки Bot API 10.3.
- **Force reply в конструкторах клавиатур** — InlineKeyboard и Keyboard получили forceReply(enabled = true), сериализуемый как force_reply.

**🔧 Бамп peer/зависимостей (двигать вместе)**

- @gramio/types ^10.3.1

### 1.3.x → 1.4.0 · [changelog](/changelogs/2026-05-08) {#gramio-keyboards-1-3-x-1-4-0}

**✨ Новое**

- **Кнопка requestManagedBot** — Кнопка Bot API 9.6 для выбора managed-бота из диалога Telegram.

### → 1.3.0 · [changelog](/changelogs/2026-02-15) {#gramio-keyboards-init-1-3-0}

**✨ Новое**

- **Стилизация кнопок** — Все методы кнопок принимают options: style ("danger" | "primary" | "success") и icon_custom_emoji_id. Работает на InlineKeyboard и Keyboard.
  ```ts
  new InlineKeyboard()
      .text("Delete", "delete", { style: "danger" })
      .text("Confirm", "confirm", { style: "success" });
  ```

## `@gramio/storage` {#pkg-gramio-storage}

### 1.x → 2.0.0 · [changelog](/changelogs/2026-02-08) {#gramio-storage-1-x-2-0-0}

**⚠️ Ломающее**

- **Storage&lt;Data&gt; теперь ограничивает ключи keyof Data** — Типы значений выводятся из ключа. storage.get&lt;SomeType&gt;("key") больше не переопределяет возвращаемый тип — задавайте карту ключ→значение через параметр Data конструктора.
  ```ts
  // Before
  const v = await storage.get<User>("user:1");
  // After
  type Data = Record<`user:${number}`, { name: string; age: number }>;
  const storage = inMemoryStorage<Data>();
  const user = await storage.get("user:1"); // ✅ { name; age } | undefined
  ```

**🐛 Исправления**

- **Дженерик inMemoryStorage&lt;Data&gt;() пробрасывается** — Больше нет неявного any из-за потерянного дженерика.

## `@gramio/storage-redis` {#pkg-gramio-storage-redis}

### → ioredis peer dependency · [changelog](/changelogs/2026-02-08) {#gramio-storage-redis-init-ioredis-peer-dependency}

**⚠️ Ломающее**

- **ioredis теперь peer-зависимость (шаг установки)** — ioredis больше не вшит — ставьте его сами. Позже нативный RedisClient из Bun выбирается автоматически, а peer ioredis стал опциональным; добавлены явные суб-пути /ioredis и /bun.
  ```ts
  npm install @gramio/storage-redis ioredis
  ```

## `@gramio/storage-sqlite` {#pkg-gramio-storage-sqlite}

### → 1.0.0 · [changelog](/changelogs/2026-02-15) {#gramio-storage-sqlite-init-1-0-0}

**✨ Новое**

- **Поддержка Node.js (два рантайма)** — 1.0.0 добавляет node:sqlite (DatabaseSync) рядом с bun:sqlite; нужная реализация выбирается автоматически — без изменений кода. (Адаптер сперва был только под Bun.)

## `gramio` {#pkg-gramio}

### 0.13.0 → 0.14.0 · [changelog](/changelogs/2026-08-25) {#gramio-0-13-0-0-14-0}

**✨ Новое**

- **Маршрутизация апдейтов Bot API 10.3** — stopped_message_generation включён в default, all и вычисляемые по хэндлерам фильтры allowed_updates; апдейты остановки генерации и входа community-чата маршрутизируются в типизированные контексты.
- **Строгий raw-интерфейс Bot API** — bot.api.* остаётся один-к-одному с методами Telegram и принимает только вложенную структуру ephemeral_message_parameters из Bot API 10.3.

**🔧 Бамп peer/зависимостей (двигать вместе)**

- @gramio/types ^10.3.1, @gramio/contexts ^0.11.0, @gramio/files ^0.8.0, @gramio/format ^0.11.0, @gramio/keyboards ^1.5.0, @gramio/test ^0.8.0

### 0.9.0 → 0.10.0 · [changelog](/changelogs/2026-05-31) {#gramio-0-9-0-0-10-0}

> На уровне вызовов ничего не ломается — меняется линейка зависимостей Bot API 10; бампайте peer-зависимости ниже вместе.

**✨ Новое**

- **bot.guestQuery(trigger?, handler)** — Обработка нового апдейта guest_message из Bot API 10. Отвечайте через ctx.answerGuestQuery(result) (один InlineQueryResult), а не ctx.send/reply.
  ```ts
  import { InlineQueryResult, InputMessageContent } from "gramio";
  
  bot.guestQuery(/^help/i, (ctx) =>
      ctx.answerGuestQuery(
          InlineQueryResult.article("help", "Help", InputMessageContent.text("How can I help?")),
      ),
  );
  ```
- **bot.chosenInlineResult(callbackData, handler)** — Передайте схему CallbackData, чтобы фильтровать по result_id и получить типизированный ctx.queryData (как у callbackQuery(schema, …)).
  ```ts
  import { CallbackData } from "gramio";
  
  const card = new CallbackData("card").number("id");
  bot.chosenInlineResult(card, (ctx) => {
      ctx.queryData.id; // ✅ typed as number
  });
  ```
- **Перегрузка bot.inlineQuery(handler) без триггера** — Матчит любой инлайн-запрос — удобно для паттерна auth-redirect 'пустой ответ + кнопка логина'.
- **Хелперы для авторов плагинов реэкспортированы из gramio** — WithDerives, WithEventDerive, WithDecorate, WithExtend, DeriveHandler теперь экспортируются прямо из gramio.

**🐛 Исправления**

- **Апдейты не теряются при остановке посреди батча** — bot.stop() посреди getUpdates больше не двигает offset на отброшенном батче — Telegram переотправит его.
- **Типизированные боты лезут в webhookHandler** — Ботам с derive/плагинами/макросами больше не нужен `as any`, чтобы передать их в webhookHandler.

**🔧 Бамп peer/зависимостей (двигать вместе)**

- @gramio/types ^10, @gramio/contexts ^0.7, @gramio/files ^0.5, @gramio/format ^0.8, @gramio/test ^0.7

### 0.7.0 → 0.9.0 · [changelog](/changelogs/2026-05-08) {#gramio-0-7-0-0-9-0}

> Ничего не обязательно — существующий bot.command(name, handler) и все хэндлеры работают как прежде. Ниже — опционально или обратно совместимо.

**✨ Новое**

- **bot.command(name, meta, handler) + bot.syncCommands()** — Опциональный CommandMeta (description, locales, scopes, hide) между именем и хэндлером; syncCommands() заливает меню Telegram (кэш по хэшу, пропускает неизменные scope).
  ```ts
  const bot = new Bot(process.env.BOT_TOKEN!)
      .command("help", { description: "Show help", locales: { ru: "Помощь" } }, helpHandler)
      .command("debug", { hide: true }, debugHandler);
  
  bot.onStart(() => bot.syncCommands());
  ```
- **Шорткат-методы на Plugin** — command, callbackQuery, hears, reaction, inlineQuery, chosenInlineResult, startParameter теперь работают прямо на Plugin; Plugin.extend(plugin) пробрасывает middleware/хуки/декораторы/ошибки.
- **AllowedUpdatesFilter — авто allowed_updates** — allowed_updates выводится из зарегистрированных хэндлеров, так что chat_member / message_reaction / message_reaction_count перестают молча теряться. Строгий режим — bot.start({ allowedUpdates: "strict" }).
  ```ts
  await bot.start({
      allowedUpdates: AllowedUpdatesFilter.default.add("chat_member").except("poll"),
  });
  ```
- **onStart / onStop получают инстанс бота** — bot.onStart(({ bot, info }) =&gt; …) — зовите bot.api.* на старте/остановке без замыкания.

**🐛 Исправления**

- **ctx.isPM()/isGroup()/isChannel() больше не сужаются к never** — Исправлено для хэндлеров на AnyBot (contexts 0.5.1, подтянуто с 0.8.3+).

**🔧 Бамп peer/зависимостей (двигать вместе)**

- @gramio/types 9.6.1, @gramio/contexts 0.6.1, @gramio/files 0.4.0, @gramio/format 0.7.0, @gramio/keyboards 1.4.0, @gramio/composer 0.4.1, @gramio/test 0.7.0

### 0.5.0 → 0.7.0 · [changelog](/changelogs/2026-03-02) {#gramio-0-5-0-0-7-0}

**✨ Новое**

- **Поддержка Bot API 9.5** — setChatMemberTag / ctx.setMemberTag(), поля тегов на ChatMember, право администратора can_manage_tags, сущности date_time.

**🔧 Бамп peer/зависимостей (двигать вместе)**

- @gramio/types 9.5.0, @gramio/contexts 0.5.0, @gramio/keyboards 1.3.1

### 0.4.x → 0.5.0 · [changelog](/changelogs/2026-02-17) {#gramio-0-4-x-0-5-0}

**⚠️ Ломающее**

- **Движок middleware-io удалён (в основном внутреннее)** — gramio теперь на @gramio/composer. Если вы импортировали внутренности (src/queue.ts / UpdateQueue) — их больше нет (UpdateQueue → EventQueue из @gramio/composer). Публичный Bot API не изменился.

**✨ Новое**

- **Шорткат-методы переехали в Composer** — reaction, callbackQuery, chosenInlineResult, inlineQuery, hears, command, startParameter доступны в плагинах и отдельных композерах.
- **Bot.extend(composer) / Plugin.extend(composer)** — Принимают инстансы EventComposer (повышаются до scoped — общий контекст без дублирования middleware), плюс новые decorate()/when()/inspect()/trace().

**🔧 Бамп peer/зависимостей (двигать вместе)**

- @gramio/types 9.4.1, @gramio/composer 0.2.0

## `@gramio/auto-answer-callback-query` {#pkg-gramio-auto-answer-callback-query}

### → 0.0.3 · [changelog](/changelogs/2026-05-08) {#gramio-auto-answer-callback-query-init-0-0-3}

**🐛 Исправления**

- **Отвечает даже если хэндлер кинул** — Middleware оборачивает хэндлер в try/finally, так что answerCallbackQuery всегда вызывается — спиннер больше не зависает.

## `@gramio/i18n` {#pkg-gramio-i18n}

### → 1.5 · [changelog](/changelogs/2026-05-08) {#gramio-i18n-init-1-5}

**✨ Новое**

- **localesFor()** — i18n.localesFor(key) возвращает Record&lt;string, string&gt; непервичных переводов — кладётся прямо в CommandMeta.locales для bot.syncCommands().
  ```ts
  bot.command("help", { description: i18n.t("en", "cmd.help"), locales: i18n.localesFor("cmd.help") }, helpHandler);
  ```

## `@gramio/jsx` {#pkg-gramio-jsx}

### 0.0.1 → 0.1.0 · [changelog](/changelogs/2026-08-25) {#gramio-jsx-0-0-1-0-1-0}

**✨ Новое**

- **JSX для rich messages** — Добавлены rich-элементы &lt;button&gt;, &lt;button-row&gt; и &lt;document&gt;, раскрываемый &lt;blockquote&gt; с авторством и компактный &lt;table&gt;.
- **JSX-клавиатуры Bot API 10.3** — Обычный keyboard JSX поддерживает отключённые inline-кнопки и forceReply для inline- и reply-клавиатур.

**🔧 Бамп peer/зависимостей (двигать вместе)**

- gramio ^0.14.0, @gramio/types ^10.3.1, @gramio/test ^0.8.0

### → date-time element · [changelog](/changelogs/2026-05-08) {#gramio-jsx-init-date-time-element}

**✨ Новое**

- **Элемент &lt;date-time&gt;** — &lt;date-time unixTime={…} format="D" /&gt; на базе сущности dateTime (@gramio/format 0.5+). Форматы: r w d D t T wDT Dt и др.

## `@gramio/onboarding` {#pkg-gramio-onboarding}

### 0.1.0 → 0.2.0 · [changelog](/changelogs/2026-05-31) {#gramio-onboarding-0-1-0-0-2-0}

**✨ Новое**

- **Типизированный build() (только типы)** — createOnboarding({ id }).….build() пробрасывает Id флоу, так что bot.extend(...) сам расширяет ctx.onboarding.&lt;id&gt; — без augmentation и каста. Рантайм не меняется.
  ```ts
  bot.command("start", (ctx) => {
      ctx.onboarding.welcome.start(); // ✅ typed, no augmentation
      return ctx.send("Let's go!");
  });
  ```

### → 0.1.0 · [changelog](/changelogs/2026-05-08) {#gramio-onboarding-init-0-1-0}

**✨ Новое**

- **Новый официальный плагин** — Декларативные туториалы с многопоточными флоу (queue/preempt/parallel), лесенкой отказа (next → skip → exit → dismiss → disableAll), scope-aware рендером (renderIn), fire-and-forget ctx.onboarding.*, подключаемым @gramio/storage и опциональной интеграцией с @gramio/views.

## `@gramio/opentelemetry` {#pkg-gramio-opentelemetry}

### → new plugin · [changelog](/changelogs/2026-02-15) {#gramio-opentelemetry-init-new-plugin}

**✨ Новое**

- **Плагин OpenTelemetry** — opentelemetryPlugin({ recordApiParams }); каждый апдейт — корневой спан, каждый вызов API — дочерний. Утилиты record(), getCurrentSpan(), setAttributes().

## `@gramio/rate-limit` {#pkg-gramio-rate-limit}

### → 0.0.1 · [changelog](/changelogs/2026-03-02) {#gramio-rate-limit-init-0-0-1}

**⚠️ Ломающее**

- **Переименованы экспорт и пакет** — Экспорт плагина — rateLimit (в том же релизе ненадолго был rateLimitPlugin — старого имени больше нет). npm-пакет переименован rate-limiter → rate-limit.

**✨ Новое**

- **Троттлинг на хэндлер через макросы** — Rate limiting со скользящим окном через систему макросов — без императивного if (!await ctx.rateLimit()) return. По умолчанию in-memory; подключайте Redis/SQLite/Cloudflare через storage.
  ```ts
  import { rateLimit } from "@gramio/rate-limit";
  const bot = new Bot(token).extend(rateLimit({ onLimitExceeded: (ctx) => ctx.is("message") && ctx.reply("Slow down!") }));
  bot.command("pay", payHandler, { rateLimit: { limit: 3, window: 60 } });
  ```

## `@gramio/scenes` {#pkg-gramio-scenes}

### 0.6.0 → 0.7.1 · [changelog](/changelogs/2026-05-31) {#gramio-scenes-0-6-0-0-7-1}

**⚠️ Ломающее**

- **Scene теперь наследует EventComposer** — Весь DSL уровня бота (.use/.on/.derive/.guard/.command/.callbackQuery/.hears/…) доступен на каждой сцене. Классическая форма шагов по фильтру события работает вместе с builder-шагами.

**✨ Новое**

- **Builder-шаги** — Каждый шаг — свой под-композер с .enter / .exit / .fallback / .message плюс весь набор событий. Состояние выводится из ctx.scene.update({...}) — .state&lt;T&gt;() не нужен.
  ```ts
  import { Scene } from "@gramio/scenes";
  
  const checkout = new Scene("checkout")
      .step("ask-name", (c) =>
          c.message("What's your name?").on("message", (ctx) => ctx.scene.update({ name: ctx.text })),
      )
      .step("confirm", (c) =>
          c.enter((ctx) => ctx.send(`${ctx.scene.state.name}, confirm? (yes/no)`)).hears("yes", (ctx) => ctx.scene.exit()),
      );
  ```
- **Переиспользуемые модули шагов + onExit** — scene.extend(otherScene) подключает безымянную Scene из шагов (коллизии кидают, числовые шаги перенумеровываются). Новый хук onExit срабатывает до сноса хранилища; .derive() уровня сцены виден в onEnter.

**🐛 Исправления**

- **Обновляйтесь сразу до 0.7.1** — 0.7.0 мог выполнить .derive(), читаемый в onEnter, дважды на входе. 0.7.1 возвращает ровно-один-раз-за-апдейт. Если у derive есть сайд-эффекты (счётчики, спаны, запись в БД) — не останавливайтесь на 0.7.0.

### 0.4.0 → 0.6.0 · [changelog](/changelogs/2026-05-08) {#gramio-scenes-0-4-0-0-6-0}

**⚠️ Ломающее**

- **Passthrough теперь по умолчанию (изменение поведения)** — Апдейты, не подошедшие текущему шагу, летят к внешним хэндлерам, так что глобальные /cancel или /help срабатывают в сцене; сцена сохраняет состояние firstTime. Вернуть жадное поведение — passthrough: false.
  ```ts
  // Before
  // before: non-matching updates were silently swallowed inside a scene
  // After
  const bot = new Bot(token)
      .extend(scenes([signupScene])) // passthrough: true by default
      .command("cancel", (ctx) => ctx.scene?.exit()); // now actually fires
  ```

**✨ Новое**

- **Под-сцены и типизированные параметры входа** — ctx.scene.enterSub(other, params) / exitSub(data) с персистентным стеком и типизированным .exitData&lt;T&gt;(); scene.reenter(params); scene.enter() проверяет кортеж параметров.

### → 0.4.x · [changelog](/changelogs/2026-03-02) {#gramio-scenes-init-0-4-x}

**✨ Новое**

- **extend с EventComposer + onInvalidInput** — scene.extend() принимает инстансы EventComposer; плагины уровня бота, расширенные до сцен, не применяются повторно в цепочках сцен; ask() получил опцию onInvalidInput.

**🔧 Бамп peer/зависимостей (двигать вместе)**

- gramio &gt;= 0.5.0, @gramio/storage ^2.0.0

### → onEnter · [changelog](/changelogs/2026-02-08) {#gramio-scenes-init-onenter}

**✨ Новое**

- **scene.onEnter(handler)** — Запуск логики один раз при входе в сцену (ожидается до продолжения сцены).

## `@gramio/sentry` {#pkg-gramio-sentry}

### → new plugin · [changelog](/changelogs/2026-02-15) {#gramio-sentry-init-new-plugin}

**✨ Новое**

- **Плагин Sentry** — sentryPlugin({ setUser, breadcrumbs, tracing }) с ctx.sentry.captureMessage()/setTag(). Использует @sentry/core (Bun + Node). Работает на хуке onApiCall из gramio.

## `@gramio/session` {#pkg-gramio-session}

### → 0.2.0 · [changelog](/changelogs/2026-02-17) {#gramio-session-init-0-2-0}

**✨ Новое**

- **Ленивые сессии** — session({ storage, lazy: true }) откладывает get из хранилища до первого чтения ctx.session — срезает чтения из БД на 50–90% для хэндлеров, не трогающих сессию. Запись не меняется.

## `@gramio/views` {#pkg-gramio-views}

### 0.2.0 → 0.2.1 · [changelog](/changelogs/2026-08-25) {#gramio-views-0-2-0-0-2-1}

**🐛 Исправления**

- **Совместимость media с Bot API 10.3** — ResponseView.media исключает двухфайловый InputMediaLivePhoto из однофайловой абстракции, а поддерживаемые медиа сохраняют все media-specific поля при отправке и редактировании.

**🔧 Бамп peer/зависимостей (двигать вместе)**

- gramio ^0.14.0

### 0.1.1 → 0.2.0 · [changelog](/changelogs/2026-05-08) {#gramio-views-0-1-1-0-2-0}

**✨ Новое**

- **Ленивые globals через thunk** — buildRender принимает Globals | (() =&gt; Globals); thunk вызывается на каждый рендер, чтобы view видел свежее состояние session/scene/locale/onboarding. Фабрика адаптера тоже перезапускается на рендер.

### 0.0.x → 0.1.1 · [changelog](/changelogs/2026-03-02) {#gramio-views-0-0-x-0-1-1}

**✨ Новое**

- **Медиа sticker / voice / video_note** — У каждого своё поведение при редактировании (sticker/video_note редактируются только по клавиатуре). Методы рендера возвращают типизированные результаты вместо void.

### → new package · [changelog](/changelogs/2026-02-15) {#gramio-views-init-new-package}

**✨ Новое**

- **Система переиспользуемых view сообщений** — Автоопределение send/edit: программные адаптеры (defineAdapter), JSON-view (createJsonAdapter, интерполяция {{key}}), загрузка с ФС (loadJsonViewsDir) и поддержка i18n.

## `@gramio/test` {#pkg-gramio-test}

### 0.7.0 → 0.8.0 · [changelog](/changelogs/2026-08-25) {#gramio-test-0-7-0-0-8-0}

**✨ Новое**

- **Тестовый актор остановки генерации** — user.stopMessageGeneration(draftId, { chat?, messageThreadId? }) доставляет синтетический апдейт stopped_message_generation.
- **Мок-ответы эфемерной отправки** — Моки отправки обрабатывают вложенные ephemeral_message_parameters и заполняют receiver_user вместе с ephemeral_message_id.

**🔧 Бамп peer/зависимостей (двигать вместе)**

- gramio ^0.14.0, @gramio/contexts ^0.11.0, @gramio/types ^10.3.1

### 0.3.0 → 0.7.0 · [changelog](/changelogs/2026-05-08) {#gramio-test-0-3-0-0-7-0}

**✨ Новое**

- **Bubble lastBotMessage(), платежи, типизированный ApiCall** — env.lastBotMessage() авто-трекает edit (опции { withReplyMarkup }, { where }); Telegram Payments (sendPreCheckoutQuery/sendShippingQuery/sendSuccessfulPayment); типобезопасный ApiCall&lt;Method&gt;, lastApiCall(m), filterApiCalls(m).

### 0.1.0 → 0.3.0 · [changelog](/changelogs/2026-02-23) {#gramio-test-0-1-0-0-3-0}

**✨ Новое**

- **9 новых методов** — user.editMessage(), forwardMessage(), sendMediaGroup(), pinMessage(), on(msg).clickByText(), sendAudio()/sendAnimation()/sendVideoNote(), ChatObject.post(), env.clearApiCalls()/lastApiCall().

### 0.0.x → 0.1.0 · [changelog](/changelogs/2026-02-17) {#gramio-test-0-0-x-0-1-0}

**✨ Новое**

- **Реакции, инлайн-режим, fluent-скоупы** — user.react()/ReactObject (авто old_reaction), sendInlineQuery()/chooseInlineResult() и user.in(chat).on(msg).react(). Также моки env.onApi()/offApi() + apiError().

## `create-gramio` {#pkg-create-gramio}

### 2.2.0 → 2.3.0 · [changelog](/changelogs/2026-08-25) {#create-gramio-2-2-0-2-3-0}

> Касается только новых сгенерированных проектов.

**✨ Новое**

- **Шаблон проекта Bot API 10.3** — Новые проекты используют gramio ^0.14.0 и @gramio/test ^0.8.0.

### → 2.x · [changelog](/changelogs/2026-03-02) {#create-gramio-init-2-x}

> Касается новых scaffold'ов, не существующих проектов.

**✨ Новое**

- **Возможности scaffold** — Генерирует CLAUDE.md; опциональная установка AI Skills GramIO; выбор плагина @gramio/broadcast; полные CLI-аргументы + пресеты (minimal/recommended/full); scoped-composer + наследование шагов сцен (2.2.0).

<!-- END GENERATED:migrations -->
