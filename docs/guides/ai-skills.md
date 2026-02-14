---
title: Building with AI — GramIO Skills for Claude Code, Cursor, and Copilot

head:
    - - meta
      - name: "description"
        content: "Build Telegram bots faster with AI. GramIO provides skills for Claude Code, Cursor rules, and GitHub Copilot instructions — giving AI deep framework knowledge."

    - - meta
      - name: "keywords"
        content: "gramio, telegram bot, ai skills, claude code, cursor rules, github copilot, llms.txt, ai-assisted development, bot framework, typescript, developer experience, ai tools, skills"
---

# Building with AI

GramIO provides AI skills that give your AI assistant deep knowledge of the framework — every API, plugin, pattern, and best practice. Build Telegram bots faster with accurate, up-to-date context instead of the AI guessing.

## Install Skills

The quickest way to add GramIO skills to your project:

::: code-group

```bash [npx]
npx skills add gramiojs/documentation/skills
```

```bash [bunx]
bunx skills add gramiojs/documentation/skills
```

:::

This installs skills for all detected AI agents (Claude Code, Cursor, Cline, etc.) in your project.

### Install Options

```bash
# Install all skills to all agents without prompts
npx skills add gramiojs/documentation/skills --all

# Install only for Claude Code
npx skills add gramiojs/documentation/skills --agent claude-code

# Install globally (available in all projects)
npx skills add gramiojs/documentation/skills --global

# Install a specific skill (@ shorthand)
npx skills add gramiojs/documentation/skills@gramio

# Or with --skill flag
npx skills add gramiojs/documentation/skills --skill gramio

# Skip confirmation prompts (useful for CI/CD)
npx skills add gramiojs/documentation/skills --yes

# List available skills without installing
npx skills add gramiojs/documentation/skills --list
```

### Manual Install

If you prefer to copy manually:

```bash
# Clone and copy the skills directory
git clone https://github.com/gramiojs/documentation.git /tmp/gramio-docs
cp -r /tmp/gramio-docs/skills/* .claude/skills/
```

## Available Skills

### `gramio` — Framework Knowledge (Auto)

The core skill. Activates automatically when you ask about GramIO. Contains:

- **12 runnable examples** — basic bot, keyboards, callbacks, formatting, files, errors, webhooks, sessions, scenes, Telegram Stars, TMA, Docker
- **18 reference docs** — bot configuration, API, context, triggers, hooks, updates & lifecycle, keyboards, formatting, files, CallbackData, storage, Telegram Stars, types, webhooks, rate limits, Docker, TMA, plugin development
- **6 plugin guides** — session, scenes, i18n, autoload, prompt, and others

You don't invoke this skill — your AI assistant reads it automatically when relevant.

### `/gramio-new-bot` — Create New Bot

```bash
/gramio-new-bot my-awesome-bot
```

Scaffolds a new GramIO project with proper structure, TypeScript config, `.env`, and initial handlers. Recommends `create-gramio` or creates manually.

### `/gramio-add-handler` — Add Handler

```bash
/gramio-add-handler command /settings
/gramio-add-handler callback approve_*
/gramio-add-handler hears "hello"
```

Adds a new command, callback query, inline query, hears, or reaction handler with proper typing and context usage.

### `/gramio-add-plugin` — Create Plugin

```bash
/gramio-add-plugin rate-limiter
```

Creates a custom GramIO plugin with `derive()`, custom error types, and TypeScript typing. Can scaffold as inline plugin or standalone package.

## What the Skills Cover

The `gramio` skill gives your AI assistant knowledge of:

| Area | Coverage |
|------|----------|
| Bot constructor | All options, proxy (Node/Bun/Deno), custom API URL, test DC, `info` skip |
| API calls | `bot.api.*`, `suppress: true`, `withRetries()`, type helpers, debugging |
| Triggers | `command`, `hears`, `callbackQuery`, `inlineQuery`, `chosenInlineResult`, `reaction` |
| Context | `derive` (scoped/global), `decorate`, middleware, `context.is()` narrowing |
| Hooks | `onStart`, `onStop`, `onError` (scoped, custom kinds), `preRequest`, `onResponse`, `onResponseError` |
| Keyboards | All button types, layout helpers (`.columns()`, `.pattern()`, `.wrap()`), styling, `RemoveKeyboard`, `ForceReply` |
| Formatting | All entities (`bold`, `italic`, `code`, `pre`, `link`, `mention`, `spoiler`...), `join()`, restrictions |
| Files | `MediaUpload` (path/url/buffer/stream/text), `MediaInput`, download, `Bun.file()` |
| CallbackData | Type-safe schemas with `.number()`, `.string()`, `.pack()`, `queryData` |
| Storage | In-memory, Redis, Cloudflare KV adapters, custom adapters |
| Webhooks | Elysia, Fastify, Hono, Express, Koa, Bun.serve, Deno.serve, tunneling |
| Rate limits | `withRetries()`, broadcasting, `@gramio/broadcast`, BullMQ queues |
| All 11 plugins | Session, Scenes, I18n, Autoload, Prompt, Auto Retry, Media Cache, Media Group, Split, Auto Answer CB, PostHog |
| Plugin development | `Plugin` class, `derive`/`decorate`/`error`/`group`, scaffolding, lazy loading, middleware order |
| Telegram Stars | Invoices, pre-checkout, payments, subscriptions, inline invoices, refunds, test mode |
| TMA | Monorepo scaffold, mkcert HTTPS, `@gramio/init-data`, Elysia auth guard |
| Docker | Dockerfile (Node.js/Bun), multi-stage builds, Docker Compose, graceful shutdown |
| Types | `@gramio/types` standalone package, type helpers, Proxy wrapper, declaration merging |
| Updates & Lifecycle | `start()`/`stop()` options, graceful shutdown (SIGINT/SIGTERM), webhook shutdown order |

## Keeping Skills in Sync with Documentation

The `skills/gramio/` directory mirrors the English documentation (`docs/`). When documentation pages change, the corresponding skill files should be updated:

- **New doc page added** — if it covers a new topic, add a matching reference in `skills/gramio/references/` or expand an existing one.
- **Doc page updated** — check if the skill reference covers the changed content. Update code snippets, API signatures, and behavior descriptions.
- **New plugin documented** — add coverage to `skills/gramio/plugins/` (either a dedicated file or expand `other.md`).
- **New example pattern** — add a runnable example in `skills/gramio/examples/`.
- **After any skill change** — update `skills/gramio/SKILL.md` tables (references, examples, coverage counts) and bump `skills/gramio/metadata.json` version.

English documentation is the source of truth. Skills distill docs into concise, code-heavy references for AI consumption — they don't replace the full docs.

## Other AI Configs

### llms.txt

GramIO generates LLM-friendly documentation at build time:

- **[/llms.txt](/llms.txt)** — Table of contents with links to all pages
- **[/llms-full.txt](/llms-full.txt)** — Complete documentation in a single text file

Any AI tool can fetch these URLs for full GramIO context.

### Cursor Rules

This repository includes [Cursor](https://cursor.com/) rules in `.cursor/rules/`:

- **`gramio-docs.mdc`** — Core documentation conventions
- **`gramio-code-examples.mdc`** — GramIO code example patterns

### GitHub Copilot

Project-level instructions in `.github/copilot-instructions.md` for Copilot users.

### AGENTS.md

The [`AGENTS.md`](https://github.com/gramiojs/documentation/blob/main/AGENTS.md) file provides rules for any AI agent — conventions, code patterns, and project structure.
