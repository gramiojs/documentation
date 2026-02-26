---
title: GramIO Guides — Learning Path for Telegram Bot Development
head:
    - - meta
      - name: "description"
        content: "GramIO guides for every skill level — from your first bot to production-ready architecture. Beginner tutorials, topic deep-dives, and advanced patterns."
    - - meta
      - name: "keywords"
        content: "GramIO guides, telegram bot tutorial, TypeScript bot guide, bot development learning path, beginner telegram bot, GramIO examples"
---

# Guides

Practical guides for building Telegram bots with GramIO — from your first `/start` command to production-scale architecture.

---

## Beginner Path

New to GramIO or Telegram bots in general? Start here. This series walks you through building a real bot from scratch, explaining the concepts as you go.

| Step | What you'll learn |
|------|-------------------|
| [1. Introduction](/guides/for-beginners/1) | What GramIO is, how Telegram bots work, getting your bot token |
| [2. First steps](/guides/for-beginners/2) | Setting up the project, handling your first command |
| [3. TypeScript & keyboards](/guides/for-beginners/3) | Type safety in practice, inline and reply keyboards |

---

## Topic Guides

Focused deep-dives on specific features and integrations.

### Bot Setup & Deployment

- [Get started](/get-started) — Scaffold, run, and understand the project structure
- [Webhooks](/guides/webhook) — Run your bot on a web server instead of long polling
- [Docker](/guides/docker) — Containerize your bot for easy deployment

### Payments & Monetization

- [Telegram Stars](/guides/telegram-stars) — Accept payments with Telegram's native payment system

### Filtering & Routing

- [Filters](/guides/filters) — Route updates to the right handler with composable filter functions

### Architecture

- [Composer (modules)](/guides/composer) — Split a large bot into feature modules, share context with `derive()`, type handlers across files

### AI & Tooling

- [AI Skills](/guides/ai-skills) — Give your AI assistant deep GramIO knowledge with installable skills

### Migrating from another framework

- [Migrate from grammY](/guides/migration-from-grammy) — Side-by-side code comparisons for grammY users
- [Migrate from puregram](/guides/migration-from-puregram) — Side-by-side code comparisons for puregram users
- [Migrate from Telegraf](/guides/migration-from-telegraf) — Side-by-side code comparisons for Telegraf users
- [Migrate from node-telegram-bot-api](/guides/migration-from-ntba) — Side-by-side code comparisons for NTBA users

---

## Quick references

Already know the basics? Jump straight to what you need:

- [Cheat Sheet](/cheat-sheet) — Most common patterns in one page
- [Bot API](/bot-api) — How GramIO maps to the Telegram Bot API
- [Formatting](/formatting) — Bold, italic, code, spoilers without `parse_mode`
- [Keyboards](/keyboards/overview) — Inline, reply, remove, force-reply keyboards
- [Triggers](/triggers/hears) — Commands, hears, callback queries, inline queries
- [Hooks](/hooks/overview) — onStart, onStop, onError, preRequest, onResponse
- [Files](/files/overview) — Upload, download, reuse media
- [Plugins](/plugins/overview) — Sessions, scenes, i18n, and more
- [Testing](/testing) — Test your bot with `@gramio/test`

---

## Need help?

- Browse the [Telegram API Reference](/telegram/) — every method with GramIO examples
- Open an issue on [GitHub](https://github.com/gramiojs/gramio/issues)
- Chat in the [GramIO Telegram community](https://t.me/gramio_forum)
