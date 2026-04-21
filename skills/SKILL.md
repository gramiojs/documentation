---
name: gramio
description: "GramIO — type-safe TypeScript Telegram Bot API framework for Node.js, Bun, and Deno. **Invoke proactively for ANY Telegram-bot work**: building or modifying bots, adding commands/callbacks/inline queries/reactions, inline or reply keyboards, message formatting with entities, file/media uploads, sessions, scenes or multi-step wizards/FSM/conversations, custom plugins, webhooks vs long-polling, Telegram Stars/payments, Mini Apps (TMA), broadcasting, Docker, migrations from Telegraf/puregram/grammY/node-telegram-bot-api. Activate on sight of `gramio` or `@gramio/*` imports, `new Bot()`, `bot.command`/`bot.callbackQuery`/`bot.on`, or any mention of Telegram bots. When delegating to a subagent, pass the relevant reference files (callback-data, scenes, formatting, context, middleware-routing) inline — this skill does not auto-load in subagent sessions."
metadata:
  author: GramIO
  version: "2026.4.19"
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
- Migrating bots from puregram, grammY, Telegraf, or node-telegram-bot-api to GramIO

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

1. **Callback routing — NEVER parse callback data manually.** `CallbackData.pack()` produces a **6-character hash prefix** (sha1-base64url of the schema name) + serialized payload — NOT a literal prefix like `"nav:"`. Checks like `ctx.data.startsWith("nav:")` always fail at runtime. Use one of these four patterns, picked by shape of data:

   ```typescript
   // Fixed string → exact string match
   bot.callbackQuery("refresh", (ctx) => ctx.answer("Refreshed"));

   // Pattern / variable slug → RegExp with capture groups
   bot.callbackQuery(/^user_(\d+)$/, (ctx) => {
       const [, id] = ctx.match!;
       ctx.answer(`User ${id}`);
   });

   // Structured data → CallbackData schema (preferred for multi-field payloads)
   import { CallbackData } from "gramio";
   const nav = new CallbackData("nav").enum("to", ["home", "history", "admin"]);
   bot.callbackQuery(nav, (ctx) => {
       ctx.queryData.to; // "home" | "history" | "admin" — fully typed
   });

   // Stale-safe unpack (when inline keyboard may outlive a schema change)
   const result = nav.safeUnpack(ctx.data!);
   if (!result.success) return ctx.answer("Button expired");
   result.data.to; // typed
   ```

   ```typescript
   // ❌ NEVER — hashed prefix means string compare won't match,
   //    and you lose full type safety.
   if (ctx.data?.startsWith("nav:")) {
       const [, to] = ctx.data.slice(4).split(":");
       // ...
   }
   ```

   See [callback-data](references/callback-data.md) and [middleware-routing](references/middleware-routing.md) for overlapping-handler behavior across plugins.

2. **Method chaining** — handlers, hooks, and plugins chain via `.command()`, `.on()`, `.extend()`, etc. Order matters: when two handlers match the same update, the **first-registered** one wins unless it calls `next()`. See [middleware-routing](references/middleware-routing.md).

3. **Type-safe context** — context is automatically typed based on the update type. Use `context.is("message")` for type narrowing in generic handlers. After `.derive()`/`.decorate()`/`.extend(plugin)`, new fields appear on the inferred context type automatically — **never** cast with `ctx as unknown as { myField }`. Export the bot's context type and reuse it (see [context](references/context.md) → "Context typing after derive").

4. **Context getters — always camelCase; never touch `ctx.payload` or `ctx.update.*`** — every Telegram field is exposed as a camelCase getter (`ctx.from`, `ctx.firstName`, `ctx.chatId`, `ctx.messageId`, `ctx.text`, `ctx.data`, `ctx.queryData`). Both `ctx.payload` AND `ctx.update` are raw snake_case internal objects — treat them as off-limits in handler code.

5. **Plugin system** — `new Plugin("name").derive(() => ({ ... }))` adds typed properties to context. Register via `bot.extend(plugin)`.

6. **Hooks lifecycle** — onStart → (updates with onError) → onStop. API calls: preRequest → call → onResponse/onResponseError.

7. **Error suppression** — `bot.api.method({ suppress: true })` returns error instead of throwing.

8. **Lazy plugins** — async plugins (without `await`) load at `bot.start()`. Use `await` for immediate loading.

9. **Derive vs Decorate** — `.derive()` runs per-update (computed), `.decorate()` injects static values once.

10. **Formatting — four critical rules** (read [formatting](references/formatting.md) before writing any message text):
    - **Never use `parse_mode`** — `format` produces `MessageEntity` arrays, not HTML/Markdown strings. Adding `parse_mode: "HTML"` or `"MarkdownV2"` will break the message. GramIO passes entities automatically.
    - **Never use native `.join()`** on arrays of formatted values — it calls `.toString()` on each `Formattable`, silently destroying all styling. Always use the `join` helper: `join(items, (x) => bold(x), "\n")`.
    - **Always wrap styled content in `format\`\``** when composing or reusing — embedding a `Formattable` in a plain template literal (`` `${bold`x`}` ``) strips all entities. Use `format\`${bold\`x\`}\`` instead.
    - **Never call `.toString()` on a `FormattableString`** — pass it directly as the `text:`/`caption:` param to `send`, `editMessageText`, `editMessageCaption`, etc. Calling `.toString()` strips all entities. This is the #1 reason magic-links and formatted entities "stop working" after an edit.

11. **Scenes — step semantics and update-type filtering** — `context.scene.step.go(N)` and `context.scene.step.next()` run the scene's middleware chain **immediately**, but each `.step(updateName, handler)` filters by `context.is(updateName)`. If your current context is `callback_query` and the next step is `.step("message", …)`, it will not fire — you must either send the UI directly before `return step.next()`, use `.step(["message", "callback_query"], …)`, or render the prompt in `onEnter` / the current step's callback handler. Prefer `.ask("field", zodSchema, "prompt")` for single-value validated input. See [scenes](plugins/scenes.md).

12. **InlineQueryResult builders** — use `InlineQueryResult.article(id, title, InputMessageContent.text(...))` and similar builder methods for inline results. `bot.inlineQuery(/regex/, handler)` routes inline queries. See [triggers](references/triggers.md).

13. **Subagent delegation** — skills do not auto-activate inside subagent sessions. When spawning a subagent that will write bot code, explicitly pass the relevant reference-file paths (e.g. `skills/references/callback-data.md`, `skills/plugins/scenes.md`, `skills/references/formatting.md`, `skills/references/middleware-routing.md`) in the agent prompt, or include the key rules inline.

14. **No `any` anywhere in examples** — never write `ctx: any`, `as any`, `<any>`, or implicit-any parameters in any file under `skills/` (examples, markdown code blocks, plugin docs). Skill examples are templates that AI copies verbatim into user bots; every `any` here multiplies into every downstream bot. Derive the proper type from `ContextType<typeof bot, "update_name">`, `CallbackQueryShorthandContext<typeof bot, typeof schema>`, or export a `BotContext = typeof bot['_']['context']` alias. If a value is genuinely unknown at a system boundary, use `unknown` + narrowing. No exceptions, even in "what-not-to-do" snippets — use `@ts-expect-error` on the specific line with a comment instead of a broad `any`.

15. **Run `bun run check:skills` before finishing any skill edit** — any change to `skills/**/*.ts` or TypeScript code blocks in `skills/**/*.md` must typecheck cleanly against the currently installed gramio versions. The `check:skills` script runs `tsc --noEmit` over `skills/examples/*.ts` with strict mode. If it reports errors, fix them — don't ship. If a pre-existing example breaks because gramio's API evolved, update the example to match the current API (check `node_modules/gramio/dist/index.d.ts` and `node_modules/@gramio/*/dist/index.d.ts` for current signatures).

## Official Plugins

| Plugin | Package | Purpose |
|--------|---------|---------|
| Session | `@gramio/session` | Persistent per-user data storage |
| Scenes | `@gramio/scenes` | Multi-step conversation flows |
| I18n | `@gramio/i18n` | Internationalization (TS-native or Fluent) |
| Autoload | `@gramio/autoload` | File-based handler loading |
| Prompt | `@gramio/prompt` | Interactive single-question prompts |
| Views | `@gramio/views` | Reusable message templates (programmatic + JSON) |
| JSX | `@gramio/jsx` | JSX syntax for formatting + keyboards (no React) |
| Pagination | `@gramio/pagination` | Paginated inline-keyboard menus with fluent builder |
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
| Middleware Routing | handler priority, `next()`, overlapping CallbackData, centralized routing | [middleware-routing](references/middleware-routing.md) |
| Scene ↔ Composer inheritance | share named `.as("scoped")` composer derives between bot-level handlers and Scene steps; file split to avoid circular imports | [scene-composer-inheritance](references/scene-composer-inheritance.md) |
| Hooks | onStart, onStop, onError, preRequest, onResponse | [hooks](references/hooks.md) |
| Updates & Lifecycle | start/stop options, graceful shutdown (SIGINT/SIGTERM) | [updates](references/updates.md) |

### Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| Keyboards | Keyboard, InlineKeyboard, layout helpers, styling | [keyboards](references/keyboards.md) |
| Formatting | entity helpers, `join` (never native `.join()`!), variable composition, no `parse_mode` | [formatting](references/formatting.md) |
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

### Migrations

Load when the user wants to migrate an existing bot to GramIO.

| From | Description | Reference |
|------|-------------|-----------|
| puregram | Symbol mapping, API comparisons, checklist for puregram → GramIO refactor | [migration-from-puregram](references/migration-from-puregram.md) |
| Telegraf | Symbol mapping, context typing, Scenes/WizardScene, webhook differences, checklist | [migration-from-telegraf](references/migration-from-telegraf.md) |
| node-telegram-bot-api | Symbol mapping, middleware concepts, keyboard builders, session, checklist | [migration-from-ntba](references/migration-from-ntba.md) |

### Plugins

| Plugin | Description | Reference |
|--------|-------------|-----------|
| Session | Per-user data, Redis support | [session](plugins/session.md) |
| Scenes | Multi-step flows, state, navigation | [scenes](plugins/scenes.md) |
| I18n | TS-native and Fluent internationalization | [i18n](plugins/i18n.md) |
| Autoload | File-based handler discovery | [autoload](plugins/autoload.md) |
| Prompt | Send + wait for response | [prompt](plugins/prompt.md) |
| Views | Render-function pattern + `@gramio/views` plugin (templates, JSON, i18n) | [views](plugins/views.md) |
| JSX | JSX syntax for formatting + keyboards (no React runtime) | [jsx](plugins/jsx.md) |
| Pagination | Fluent paginated inline keyboards (prev/next/first/last, page info) | [pagination](plugins/pagination.md) |
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
| Formatting | Entity types, join helper, variable composition, parse_mode anti-pattern | [formatting.ts](examples/formatting.ts) |
| File upload | Path, URL, buffer, media groups | [file-upload.ts](examples/file-upload.ts) |
| Error handling | Custom errors, suppress, scoped | [error-handling.ts](examples/error-handling.ts) |
| Webhook | Framework integration | [webhook.ts](examples/webhook.ts) |
| Session | Counters, settings, Redis | [session.ts](examples/session.ts) |
| Scenes | Registration flow with steps | [scenes.ts](examples/scenes.ts) |
| Wizard scene | Callback-driven scene, mixed callback+message steps, global exit | [wizard-scene.ts](examples/wizard-scene.ts) |
| Scene composer inheritance | 3-file package: named scoped composer + Scene.extend + file split for circular-import-safe layout | [scene-composer-inheritance/](examples/scene-composer-inheritance/index.ts) |
| Callback routing | Centralized router, shared nav CallbackData across features | [callback-routing.ts](examples/callback-routing.ts) |
| Telegram Stars | Payments, invoices, refunds | [telegram-stars.ts](examples/telegram-stars.ts) |
| TMA | Elysia server, init-data auth, webhook | [tma.ts](examples/tma.ts) |
| Docker | Graceful shutdown, webhook/polling toggle | [docker.ts](examples/docker.ts) |
| Testing | User simulation, API mocking, error testing | [testing.ts](examples/testing.ts) |
