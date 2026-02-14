---
title: Разработка с AI — навыки GramIO для Claude Code и других AI-ассистентов

head:
    - - meta
      - name: "description"
        content: "Создавайте Telegram-ботов быстрее с AI. GramIO предоставляет навыки для Claude Code и других AI-ассистентов, а также llms.txt — давая AI глубокое знание фреймворка."

    - - meta
      - name: "keywords"
        content: "gramio, telegram бот, ai навыки, claude code, llms.txt, ai-разработка, бот фреймворк, typescript, опыт разработчика, ai инструменты, skills"
---

# Разработка с AI

GramIO предоставляет AI навыки, которые дают вашему AI-ассистенту глубокие знания фреймворка — каждый API, плагин, паттерн и лучшие практики. Создавайте Telegram-ботов быстрее с точным и актуальным контекстом вместо того, чтобы AI угадывал.

## Установка навыков

Самый быстрый способ добавить навыки GramIO в ваш проект:

::: code-group

```bash [npx]
npx skills add gramiojs/documentation/skills
```

```bash [bunx]
bunx skills add gramiojs/documentation/skills
```

:::

Это устанавливает навыки для всех обнаруженных AI-агентов (Claude Code, Cursor, Cline и др.) в вашем проекте.

### Параметры установки

```bash
# Установить все навыки для всех агентов без запросов
npx skills add gramiojs/documentation/skills --all

# Установить только для Claude Code
npx skills add gramiojs/documentation/skills --agent claude-code

# Установить глобально (доступно во всех проектах)
npx skills add gramiojs/documentation/skills --global

# Установить конкретный навык (сокращение через @)
npx skills add gramiojs/documentation/skills@gramio

# Или с флагом --skill
npx skills add gramiojs/documentation/skills --skill gramio

# Пропустить подтверждения (полезно для CI/CD)
npx skills add gramiojs/documentation/skills --yes

# Показать список доступных навыков без установки
npx skills add gramiojs/documentation/skills --list
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

- **12 запускаемых примеров** — базовый бот, клавиатуры, callback, форматирование, файлы, ошибки, вебхуки, сессии, сцены, Telegram Stars, TMA, Docker
- **18 справочных документов** — конфигурация бота, API, контекст, триггеры, хуки, жизненный цикл, клавиатуры, форматирование, файлы, CallbackData, хранилища, Telegram Stars, типы, вебхуки, лимиты, Docker, TMA, разработка плагинов
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
| Разработка плагинов | Класс `Plugin`, `derive`/`decorate`/`error`/`group`, скаффолдинг, ленивая загрузка, порядок middleware |
| Telegram Stars | Инвойсы, пре-чекаут, платежи, подписки, inline-инвойсы, возвраты, тестовый режим |
| TMA | Скаффолд монорепо, mkcert HTTPS, `@gramio/init-data`, Elysia auth guard |
| Docker | Dockerfile (Node.js/Bun), multi-stage сборки, Docker Compose, graceful shutdown |
| Типы | Пакет `@gramio/types`, хелперы типов, Proxy-обёртка, слияние деклараций |
| Жизненный цикл | Опции `start()`/`stop()`, graceful shutdown (SIGINT/SIGTERM), порядок остановки вебхука |

## llms.txt

GramIO генерирует LLM-дружественную документацию при сборке:

- **[/llms.txt](/llms.txt)** — Оглавление со ссылками на все страницы
- **[/llms-full.txt](/llms-full.txt)** — Полная документация в одном текстовом файле

Любой AI-инструмент может загрузить эти URL для полного контекста GramIO. Кроме того, к любому URL страницы документации можно добавить `.md` для получения исходного markdown — например, `https://gramio.dev/bot-api.md` вернёт markdown-исходник страницы Bot API.
