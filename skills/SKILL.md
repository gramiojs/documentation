---
name: gramio
description: GramIO — type-safe TypeScript Telegram Bot API framework for Node.js, Bun, and Deno. Use when building Telegram bots, handling commands/callbacks/inline queries, creating keyboards, formatting messages, uploading files, managing sessions/scenes, writing plugins, setting up webhooks, or integrating Telegram payments.
metadata:
  author: GramIO
  version: "2026.2.14"
  source: https://github.com/gramiojs/documentation
---

# GramIO

GramIO is a modern, type-safe Telegram Bot API framework for TypeScript. It runs on **Node.js**, **Bun**, and **Deno** with full Bot API coverage, a composable plugin system, and first-class TypeScript support.

## When to Use This Skill

- Creating or modifying Telegram bots
- Setting up bot commands, callbacks, inline queries, or reactions
- Building keyboards (reply, inline, remove, force reply)
- Formatting messages with entities (bold, italic, code, links, mentions)
- Uploading/downloading files and media
- Managing user sessions or multi-step conversation flows (scenes)
- Writing custom plugins
- Configuring webhooks or long polling
- Handling payments with Telegram Stars
- Broadcasting messages with rate limit handling
- Building Telegram Mini Apps (TMA) with backend auth
- Containerizing bots with Docker
- Using standalone `@gramio/types` for custom Bot API wrappers
- Writing and publishing custom plugins

## Quick Start

```bash
npm create gramio bot-name
cd bot-name
npm run dev
```

## Basic Pattern

```typescript
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (context) => context.send("Hello!"))
    .onStart(({ info }) => console.log(`@${info.username} started`))
    .onError(({ context, kind, error }) => console.error(`[${kind}]`, error));

bot.start();
```

## Critical Concepts

1. **Method chaining** — handlers, hooks, and plugins chain via `.command()`, `.on()`, `.extend()`, etc. Order matters.
2. **Type-safe context** — context is automatically typed based on the update type. Use `context.is("message")` for type narrowing in generic handlers.
3. **Plugin system** — `new Plugin("name").derive(() => ({ ... }))` adds typed properties to context. Register via `bot.extend(plugin)`.
4. **Hooks lifecycle** — onStart → (updates with onError) → onStop. API calls: preRequest → call → onResponse/onResponseError.
5. **Error suppression** — `bot.api.method({ suppress: true })` returns error instead of throwing.
6. **Lazy plugins** — async plugins (without `await`) load at `bot.start()`. Use `await` for immediate loading.
7. **Derive vs Decorate** — `.derive()` runs per-update (computed), `.decorate()` injects static values once.

## Official Plugins

| Plugin | Package | Purpose |
|--------|---------|---------|
| Session | `@gramio/session` | Persistent per-user data storage |
| Scenes | `@gramio/scenes` | Multi-step conversation flows |
| I18n | `@gramio/i18n` | Internationalization (TS-native or Fluent) |
| Autoload | `@gramio/autoload` | File-based handler loading |
| Prompt | `@gramio/prompt` | Interactive single-question prompts |
| Views | `@gramio/views` | Reusable message templates (programmatic + JSON) |
| Auto Retry | `@gramio/auto-retry` | Retry on 429 rate limits |
| Media Cache | `@gramio/media-cache` | Cache file_ids |
| Media Group | `@gramio/media-group` | Handle album messages |
| Split | `@gramio/split` | Split long messages |
| Auto Answer CB | `@gramio/auto-answer-callback-query` | Auto-answer callbacks |
| PostHog | `@gramio/posthog` | Analytics + feature flags |
| OpenTelemetry | `@gramio/opentelemetry` | Distributed tracing and spans |
| Sentry | `@gramio/sentry` | Error tracking + performance monitoring |

## Telegram Bot API Reference Pages

GramIO docs include a dedicated reference page for **every** Telegram Bot API method and type:

- **Methods**: `https://gramio.dev/telegram/methods/{methodName}` — e.g. `sendMessage`, `createChatInviteLink`, `answerCallbackQuery`
- **Types**: `https://gramio.dev/telegram/types/{typeName}` — e.g. `Message`, `ChatInviteLink`, `InlineKeyboard`

Each page contains: GramIO TypeScript examples, parameter details, error table with causes and fixes, tips & gotchas, and related links. When a user asks about a specific Telegram API method or type, you can fetch or reference the corresponding page for accurate GramIO-specific usage.

> **Tip for LLMs:** Any GramIO docs page can be fetched as clean Markdown by appending `.md` to the URL:
> `https://gramio.dev/telegram/methods/sendMessage.md` — clean Markdown instead of HTML.
> This works for **all** sections of the docs, not just API pages.

> These pages are **not** included in this skill by default — fetch them on demand when the user asks about a specific method/type.

**To quickly find which methods exist** — use the pre-built index: [telegram-api-index](references/telegram-api-index.md). It lists all 165+ Bot API methods with short descriptions in one file. Load it when you need to discover a method name or confirm one exists before fetching a full page.

## References

### Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Bot Configuration | Constructor, API options, proxy, test DC, debugging | [bot-configuration](references/bot-configuration.md) |
| Bot API | Calling methods, suppress, withRetries, type helpers | [bot-api](references/bot-api.md) |
| Context & Updates | derive, decorate, middleware, start/stop, type narrowing | [context](references/context.md) |
| Triggers | command, hears, callbackQuery, inlineQuery, reaction | [triggers](references/triggers.md) |
| Hooks | onStart, onStop, onError, preRequest, onResponse | [hooks](references/hooks.md) |
| Updates & Lifecycle | start/stop options, graceful shutdown (SIGINT/SIGTERM) | [updates](references/updates.md) |

### Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| Keyboards | Keyboard, InlineKeyboard, layout helpers, styling | [keyboards](references/keyboards.md) |
| Formatting | bold, italic, code, pre, link, mention, join | [formatting](references/formatting.md) |
| Files | MediaUpload, MediaInput, download, Bun.file() | [files](references/files.md) |
| CallbackData | Type-safe callback data schemas | [callback-data](references/callback-data.md) |
| Storage | In-memory, Redis, Cloudflare adapters | [storage](references/storage.md) |
| Telegram Stars | Payments, invoices, subscriptions, inline invoices, refunds, test mode | [telegram-stars](references/telegram-stars.md) |
| Types | @gramio/types, type helpers, Proxy wrapper, declaration merging | [types](references/types.md) |

### Infrastructure

| Topic | Description | Reference |
|-------|-------------|-----------|
| Webhook | Framework integration, tunneling, custom handlers | [webhook](references/webhook.md) |
| Rate Limits | withRetries, broadcasting, queues | [rate-limits](references/rate-limits.md) |
| Docker | Dockerfile, multi-stage build, Docker Compose | [docker](references/docker.md) |
| TMA | Mini Apps, mkcert HTTPS, @gramio/init-data auth | [tma](references/tma.md) |
| Testing | Event-driven bot testing, user actors, API mocking | [testing](references/testing.md) |

### Plugins

| Plugin | Description | Reference |
|--------|-------------|-----------|
| Session | Per-user data, Redis support | [session](plugins/session.md) |
| Scenes | Multi-step flows, state, navigation | [scenes](plugins/scenes.md) |
| I18n | TS-native and Fluent internationalization | [i18n](plugins/i18n.md) |
| Autoload | File-based handler discovery | [autoload](plugins/autoload.md) |
| Prompt | Send + wait for response | [prompt](plugins/prompt.md) |
| Views | Reusable message templates, JSON adapter, i18n | [views](plugins/views.md) |
| OpenTelemetry | Distributed tracing, spans, instrumentation | [opentelemetry](plugins/opentelemetry.md) |
| Sentry | Error tracking, performance monitoring | [sentry](plugins/sentry.md) |
| Others | auto-retry, media-cache, media-group, split, posthog | [other](plugins/other.md) |
| Plugin Development | Writing custom plugins, derive/decorate/error, lazy loading | [plugin-development](references/plugin-development.md) |

### Examples

| Example | Description | File |
|---------|-------------|------|
| Basic bot | Commands, hooks, error handling | [basic.ts](examples/basic.ts) |
| Keyboards | Reply, inline, columns, conditional | [keyboards.ts](examples/keyboards.ts) |
| CallbackData | Type-safe callback schemas | [callback-data.ts](examples/callback-data.ts) |
| Formatting | All entity types, join helper | [formatting.ts](examples/formatting.ts) |
| File upload | Path, URL, buffer, media groups | [file-upload.ts](examples/file-upload.ts) |
| Error handling | Custom errors, suppress, scoped | [error-handling.ts](examples/error-handling.ts) |
| Webhook | Framework integration | [webhook.ts](examples/webhook.ts) |
| Session | Counters, settings, Redis | [session.ts](examples/session.ts) |
| Scenes | Registration flow with steps | [scenes.ts](examples/scenes.ts) |
| Telegram Stars | Payments, invoices, refunds | [telegram-stars.ts](examples/telegram-stars.ts) |
| TMA | Elysia server, init-data auth, webhook | [tma.ts](examples/tma.ts) |
| Docker | Graceful shutdown, webhook/polling toggle | [docker.ts](examples/docker.ts) |
| Testing | User simulation, API mocking, error testing | [testing.ts](examples/testing.ts) |
