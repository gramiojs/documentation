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
npx skills add gramiojs/documentation
```

```bash [bunx]
bunx skills add gramiojs/documentation
```

:::

This installs skills for all detected AI agents (Claude Code, Cursor, Cline, etc.) in your project.

### Install Options

```bash
# Install all skills without prompts
npx skills add gramiojs/documentation --all

# Install only for Claude Code
npx skills add gramiojs/documentation --agent claude-code

# Install globally (available in all projects)
npx skills add gramiojs/documentation --global

# Install a specific skill
npx skills add gramiojs/documentation --skill gramio

# List available skills without installing
npx skills add gramiojs/documentation --list
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

- **10 runnable examples** — basic bot, keyboards, callbacks, formatting, files, errors, webhooks, sessions, scenes, Telegram Stars
- **12 reference docs** — bot configuration, API, context, triggers, hooks, keyboards, formatting, files, CallbackData, storage, webhooks, rate limits
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
| Telegram Stars | Invoices, pre-checkout, payments, refunds, pay buttons, payment links |

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
