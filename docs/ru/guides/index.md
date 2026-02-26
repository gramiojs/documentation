---
title: Гайды GramIO — Путь обучения разработке Telegram-ботов
head:
    - - meta
      - name: "description"
        content: "Гайды GramIO для любого уровня — от первого бота до продакшен-архитектуры. Туториалы для начинающих, тематические deep-dive'ы и продвинутые паттерны."
    - - meta
      - name: "keywords"
        content: "гайды GramIO, туториал telegram бот, гайд TypeScript бот, путь обучения разработке ботов, telegram бот для начинающих, примеры GramIO"
---

# Гайды

Практические гайды по созданию Telegram-ботов с GramIO — от первой команды `/start` до масштабируемой продакшен-архитектуры.

---

## Путь для начинающих

Новичок в GramIO или Telegram-ботах вообще? Начните здесь. Эта серия проведёт вас через создание настоящего бота с нуля, объясняя концепции по ходу.

| Шаг | Что вы узнаете |
|-----|----------------|
| [1. Введение](/ru/guides/for-beginners/1) | Что такое GramIO, как работают Telegram-боты, получение токена |
| [2. Первые шаги](/ru/guides/for-beginners/2) | Настройка проекта, обработка первой команды |
| [3. TypeScript и клавиатуры](/ru/guides/for-beginners/3) | Типобезопасность на практике, инлайн и обычные клавиатуры |

---

## Тематические гайды

Сфокусированные deep-dive'ы по конкретным функциям и интеграциям.

### Настройка и деплой бота

- [Начало работы](/ru/get-started) — Скаффолдинг, запуск и понимание структуры проекта
- [Webhook](/ru/updates/webhook) — Запуск бота на веб-сервере вместо long polling
- [Docker](/ru/guides/docker) — Контейнеризация бота для удобного деплоя

### Платежи и монетизация

- [Telegram Stars](/ru/guides/telegram-stars) — Приём платежей с помощью нативной платёжной системы Telegram

### Фильтрация и маршрутизация

- [Фильтры](/ru/guides/filters) — Маршрутизация обновлений в нужный обработчик с помощью компонуемых функций фильтрации

### Архитектура

- [Composer (модули)](/ru/guides/composer) — Разбивка крупного бота на feature-модули, общий контекст через `derive()`, типизация обработчиков в отдельных файлах

### AI и инструменты

- [AI Skills](/ru/guides/ai-skills) — Дайте вашему AI-ассистенту глубокие знания о GramIO с помощью устанавливаемых скиллов

### Миграция с другого фреймворка

- [Миграция с grammY](/ru/guides/migration-from-grammy) — Сравнение кода для пользователей grammY
- [Миграция с puregram](/ru/guides/migration-from-puregram) — Сравнение кода для пользователей puregram
- [Миграция с Telegraf](/ru/guides/migration-from-telegraf) — Сравнение кода для пользователей Telegraf
- [Миграция с node-telegram-bot-api](/ru/guides/migration-from-ntba) — Сравнение кода для пользователей NTBA

---

## Быстрый доступ

Уже знаете основы? Переходите прямо к нужному:

- [Шпаргалка](/ru/cheat-sheet) — Самые частые паттерны на одной странице
- [Bot API](/ru/bot-api) — Как GramIO работает с Telegram Bot API
- [Форматирование](/ru/formatting) — Bold, italic, code, spoiler без `parse_mode`
- [Клавиатуры](/ru/keyboards/overview) — Инлайн, обычные, удаление, force-reply клавиатуры
- [Триггеры](/ru/triggers/hears) — Команды, hears, callback query, inline query
- [Хуки](/ru/hooks/overview) — onStart, onStop, onError, preRequest, onResponse
- [Файлы](/ru/files/overview) — Загрузка, скачивание, переиспользование медиа
- [Плагины](/ru/plugins/overview) — Сессии, сцены, i18n и многое другое
- [Тестирование](/ru/testing) — Тестирование бота с `@gramio/test`

---

## Нужна помощь?

- Изучите [Telegram API Reference](/telegram/) — каждый метод с примерами GramIO
- Создайте issue на [GitHub](https://github.com/gramiojs/gramio/issues)
- Пообщайтесь в [сообществе GramIO в Telegram](https://t.me/gramio_forum)
