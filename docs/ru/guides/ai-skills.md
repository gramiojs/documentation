---
title: Разработка с AI — навыки GramIO для Claude Code, Cursor и Copilot

head:
    - - meta
      - name: "description"
        content: "Создавайте Telegram-ботов быстрее с AI. GramIO предоставляет навыки для Claude Code, правила Cursor и инструкции GitHub Copilot — давая AI глубокое знание фреймворка."

    - - meta
      - name: "keywords"
        content: "gramio, telegram бот, ai навыки, claude code, cursor rules, github copilot, llms.txt, ai-разработка, бот фреймворк, typescript, опыт разработчика, ai инструменты, skills"
---

# Разработка с AI

GramIO предоставляет AI навыки, которые дают вашему AI-ассистенту глубокие знания фреймворка — каждый API, плагин, паттерн и лучшие практики. Создавайте Telegram-ботов быстрее с точным и актуальным контекстом вместо того, чтобы AI угадывал.

## Установка навыков

Самый быстрый способ добавить навыки GramIO в ваш проект:

::: code-group

```bash [npx]
npx skills add gramiojs/documentation
```

```bash [bunx]
bunx skills add gramiojs/documentation
```

:::

Это устанавливает навыки для всех обнаруженных AI-агентов (Claude Code, Cursor, Cline и др.) в вашем проекте.

### Параметры установки

```bash
# Установить все навыки без запросов
npx skills add gramiojs/documentation --all

# Установить только для Claude Code
npx skills add gramiojs/documentation --agent claude-code

# Установить глобально (доступно во всех проектах)
npx skills add gramiojs/documentation --global

# Установить конкретный навык
npx skills add gramiojs/documentation --skill gramio

# Показать список доступных навыков без установки
npx skills add gramiojs/documentation --list
```

### Ручная установка

Если предпочитаете копировать вручную:

```bash
# Клонировать и скопировать директорию навыков
git clone https://github.com/gramiojs/documentation.git /tmp/gramio-docs
cp -r /tmp/gramio-docs/skills/* .claude/skills/
```

## Доступные навыки

### `gramio` — Знания фреймворка (Авто)

Основной навык. Активируется автоматически при вопросах о GramIO. Содержит:

- **10 запускаемых примеров** — базовый бот, клавиатуры, callback, форматирование, файлы, ошибки, вебхуки, сессии, сцены, Telegram Stars
- **12 справочных документов** — конфигурация бота, API, контекст, триггеры, хуки, клавиатуры, форматирование, файлы, CallbackData, хранилища, вебхуки, лимиты
- **6 руководств по плагинам** — session, scenes, i18n, autoload, prompt и другие

Этот навык не нужно вызывать — ваш AI-ассистент читает его автоматически.

### `/gramio-new-bot` — Создание нового бота

```bash
/gramio-new-bot my-awesome-bot
```

Создаёт новый проект GramIO с правильной структурой, TypeScript конфигурацией, `.env` и начальными обработчиками. Рекомендует `create-gramio` или создаёт вручную.

### `/gramio-add-handler` — Добавление обработчика

```bash
/gramio-add-handler command /settings
/gramio-add-handler callback approve_*
/gramio-add-handler hears "hello"
```

Добавляет новый обработчик команд, callback query, inline query, hears или реакций с правильной типизацией и использованием контекста.

### `/gramio-add-plugin` — Создание плагина

```bash
/gramio-add-plugin rate-limiter
```

Создаёт пользовательский плагин GramIO с `derive()`, кастомными типами ошибок и TypeScript типизацией. Может создать как inline-плагин, так и отдельный пакет.

## Что покрывают навыки

Навык `gramio` даёт вашему AI-ассистенту знания о:

| Область | Покрытие |
|---------|----------|
| Конструктор бота | Все опции, прокси (Node/Bun/Deno), кастомный API URL, тестовый DC, пропуск `info` |
| API вызовы | `bot.api.*`, `suppress: true`, `withRetries()`, хелперы типов, отладка |
| Триггеры | `command`, `hears`, `callbackQuery`, `inlineQuery`, `chosenInlineResult`, `reaction` |
| Контекст | `derive` (скоупы), `decorate`, middleware, сужение типов `context.is()` |
| Хуки | `onStart`, `onStop`, `onError` (скоупы, кастомные виды), `preRequest`, `onResponse`, `onResponseError` |
| Клавиатуры | Все типы кнопок, хелперы раскладки (`.columns()`, `.pattern()`, `.wrap()`), стили, `RemoveKeyboard`, `ForceReply` |
| Форматирование | Все сущности (`bold`, `italic`, `code`, `pre`, `link`, `mention`, `spoiler`...), `join()`, ограничения |
| Файлы | `MediaUpload` (path/url/buffer/stream/text), `MediaInput`, скачивание, `Bun.file()` |
| CallbackData | Типобезопасные схемы с `.number()`, `.string()`, `.pack()`, `queryData` |
| Хранилища | In-memory, Redis, Cloudflare KV адаптеры, кастомные адаптеры |
| Вебхуки | Elysia, Fastify, Hono, Express, Koa, Bun.serve, Deno.serve, туннелирование |
| Лимиты | `withRetries()`, рассылка, `@gramio/broadcast`, очереди BullMQ |
| Все 11 плагинов | Session, Scenes, I18n, Autoload, Prompt, Auto Retry, Media Cache, Media Group, Split, Auto Answer CB, PostHog |
| Telegram Stars | Инвойсы, пре-чекаут, платежи, возвраты, кнопки оплаты, ссылки на оплату |

## Другие AI-конфигурации

### llms.txt

GramIO генерирует LLM-дружественную документацию при сборке:

- **[/llms.txt](/llms.txt)** — Оглавление со ссылками на все страницы
- **[/llms-full.txt](/llms-full.txt)** — Полная документация в одном текстовом файле

Любой AI-инструмент может загрузить эти URL для полного контекста GramIO.

### Правила Cursor

Репозиторий включает правила [Cursor](https://cursor.com/) в `.cursor/rules/`:

- **`gramio-docs.mdc`** — Основные соглашения документации
- **`gramio-code-examples.mdc`** — Паттерны примеров кода GramIO

### GitHub Copilot

Инструкции на уровне проекта в `.github/copilot-instructions.md` для пользователей Copilot.

### AGENTS.md

Файл [`AGENTS.md`](https://github.com/gramiojs/documentation/blob/main/AGENTS.md) содержит правила для любого AI-агента — соглашения, паттерны кода и структура проекта.
