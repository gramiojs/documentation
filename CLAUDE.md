# GramIO Documentation — Claude Code Context

## What is GramIO?

GramIO is a **TypeScript Telegram bot framework** that runs on Bun, Node.js, and Deno. This repository contains its VitePress documentation site, served at [gramio.dev](https://gramio.dev).

## Commands

```bash
bun run dev       # Start local dev server
bun run build     # Production build (VitePress)
bun run preview   # Preview the production build
```

## Project Structure

```
docs/                          # English documentation (source of truth)
  .vitepress/
    config.mts                 # VitePress main config
    config/locales/
      en.locale.ts             # English sidebar + nav
      ru.locale.ts             # Russian sidebar + nav
  guides/                      # User-facing guides
  plugins/official/            # Official plugin docs
  ru/                          # Russian translations (mirrors docs/)
    guides/
    plugins/official/
public/                        # Static assets (images for EN docs)
  ru/                          # Static assets (images for RU docs)
skills/                        # User-land AI skills (installed via `npx skills add`)
  gramio/                      # Core framework knowledge (auto-activated)
    examples/                  # 12 runnable TypeScript examples
    references/                # 18 deep-dive API reference docs
    plugins/                   # 6 plugin guides
  gramio-new-bot/              # /gramio-new-bot — scaffold a new bot project
  gramio-add-handler/          # /gramio-add-handler — add command/callback handlers
  gramio-add-plugin/           # /gramio-add-plugin — create a custom plugin
.claude/skills/                # Internal doc skills (metadata.internal: true)
.cursor/rules/                 # Cursor editor rules
.github/copilot-instructions.md  # GitHub Copilot instructions
AGENTS.md                      # Bilingual sync rules & conventions
CLAUDE.md                      # This file — project context for Claude
```

## Key Conventions

- **Bilingual mirroring**: Every `docs/*.md` file must have a `docs/ru/*.md` counterpart. English is the source of truth. See `AGENTS.md` for full rules.
- **Twoslash annotations**: Code blocks use `// ^?` for inline type hints — never delete these.
- **Frontmatter**: Every doc page needs `title`, `description` (meta), and `keywords` (meta) in YAML front matter.
- **Package manager tabs**: Installation examples use `::: code-group` with npm/yarn/pnpm/bun tabs.
- **Images**: EN images go in `public/`, RU images in `public/ru/` with identical relative paths.
- **Sidebar registration**: New pages must be added to both `en.locale.ts` and `ru.locale.ts`.
- **Vue components**: Custom Vue components live in `docs/.vitepress/components/` and must be globally registered in `docs/.vitepress/theme/index.ts` via `app.component()` inside `enhanceApp`. They are **not** auto-registered. See [VitePress docs](https://vitepress.dev/guide/using-vue#using-components).
- **Homepage changelog banner**: The "Latest Updates" / "Последние обновления" section on `docs/index.md` and `docs/ru/index.md` must always reflect the newest changelog entry. When running `/generate-changelog`, update both homepages with the new entry title, date range, and one-line summary.
- **Telegram API method links**: When documenting or mentioning a Telegram Bot API method (e.g. `answerInlineQuery`, `sendMessage`), link to its reference page using a relative path `/telegram/methods/{methodName}` (camelCase, no suffix). Example: [`answerInlineQuery`](/telegram/methods/answerInlineQuery).

## AI Infrastructure

This project ships AI-friendly tooling:

- **User-land skills** in `skills/` — Installed by users via `npx skills add gramiojs/documentation/skills` (or `bunx`). Gives their AI assistant deep GramIO knowledge with examples, references, and plugin guides.
- **Internal doc skills** in `.claude/skills/` — Reusable prompts for documentation tasks (`/add-doc-page`, `/translate-page`, `/add-plugin-doc`, `/sync-translations`). Marked with `metadata.internal: true` so they don't appear in public `skills add` discovery.
- **`vitepress-plugin-llms`** — Generates `llms.txt` and `llms-full.txt` at build time for LLM consumption.
- **Cursor rules** in `.cursor/rules/` — Editor-level conventions for Cursor AI.
- **Copilot instructions** in `.github/copilot-instructions.md` — Project conventions for GitHub Copilot.
- **`AGENTS.md`** — Detailed rules for any AI agent working on this repo.

## Quick Reference

| Task | How |
|------|-----|
| Add a new doc page | Use `/add-doc-page section/page-name` skill |
| Translate a page | Use `/translate-page docs/path.md` skill |
| Add plugin docs | Use `/add-plugin-doc plugin-name` skill |
| Audit translations | Use `/sync-translations` skill |
| Check conventions | Read `AGENTS.md` |
