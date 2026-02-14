# GramIO Documentation — Agent Guidelines

## Project Overview

GramIO is a TypeScript Telegram bot framework for Bun, Node.js, and Deno. This repository is the VitePress documentation site at [gramio.dev](https://gramio.dev). All documentation is bilingual (English + Russian).

## Build & Dev Commands

```bash
bun run dev       # Start VitePress dev server
bun run build     # Production build — must pass after any change
bun run preview   # Preview the build locally
```

After making changes, always run `bun run build` to verify the site compiles successfully.

## Bilingual Sync Rules

- For every markdown file in `docs/`, ensure there is a corresponding file in `docs/ru/` with the same relative path and filename.
- When a file is added, changed, renamed, or deleted in `docs/`, mirror the change in `docs/ru/`.
- If a translation is missing in `docs/ru/`, automatically translate the English page to Russian and create the full Russian version.
- When a file is changed in `docs/ru/`, check if `docs/` has the same relative path. If so, suggest updating the English version if the Russian file is newer.
- Subdirectories and their contents should be mirrored between `docs/` and `docs/ru/`.
- Directory structure changes (create, rename, delete) in `docs/` should be reflected in `docs/ru/`.
- This rule set is bi-directional, but prioritizes English (`docs/`) as the source of truth.
- Exclude double translation (do not translate `docs/ru/` back into `docs/ru/`).
- You can check updates via `Recent changes`.
- Correct grammatical punctuation and other errors in both: original and other language modified files.

### Examples

- `docs/plugins/official/scenes.md` ↔ `docs/ru/plugins/official/scenes.md`
- `docs/index.md` ↔ `docs/ru/index.md`
- `docs/guides/usage.md` ↔ `docs/ru/guides/usage.md`

## Skill ↔ Documentation Sync Rules

The `skills/gramio/` directory distills English documentation into concise, code-heavy references for AI consumption. Keep them in sync:

- When a documentation page in `docs/` is added or substantially updated, check if the corresponding skill file in `skills/gramio/references/` or `skills/gramio/plugins/` needs updating.
- When a new doc page covers a topic not yet in the skill, create a new reference file (YAML frontmatter with `name` and `description`, H1 heading, code-heavy sections, HTML source comment at bottom).
- When a new runnable pattern emerges, add an example in `skills/gramio/examples/` (complete TypeScript, full imports, no partial snippets).
- After any skill content change, update `skills/gramio/SKILL.md` tables and bump `skills/gramio/metadata.json` version.
- English documentation (`docs/`) is the source of truth — skills condense it, they don't replace it.

## Code Example Conventions

### Twoslash Annotations

- Code blocks may use ` ```ts twoslash ` for inline type hints powered by Shiki Twoslash.
- **Never delete `// ^?`** — these markers generate inline type hover annotations.
- Twoslash annotations must be preserved exactly during translation.

### Package Manager Groups

Installation examples must use VitePress code groups with all four package managers:

```md
::: code-group

\`\`\`bash [npm]
npm install @gramio/package-name
\`\`\`

\`\`\`bash [yarn]
yarn add @gramio/package-name
\`\`\`

\`\`\`bash [pnpm]
pnpm add @gramio/package-name
\`\`\`

\`\`\`bash [bun]
bun install @gramio/package-name
\`\`\`

:::
```

### Runnable Examples

When showing GramIO code, prefer complete runnable snippets that import from `gramio`:

```ts
import { Bot } from "gramio";

const bot = new Bot("TOKEN");
// example code here
bot.start();
```

## Frontmatter Requirements

Every documentation page must include YAML frontmatter with:

```yaml
---
title: Page Title for GramIO

head:
    - - meta
      - name: "description"
        content: "Concise description of the page content for SEO."

    - - meta
      - name: "keywords"
        content: "comma, separated, keywords, gramio, telegram bot"
---
```

- `title` — used in browser tabs and SEO.
- `description` meta — concise summary for search engines.
- `keywords` meta — relevant keywords including "gramio" and "telegram bot".

## Plugin Documentation Template

Official plugin pages follow this structure:

1. **Frontmatter** (title, description, keywords)
2. **H1 heading** — plugin name
3. **Badges** — npm, JSR, JSR score in a `<div class="badges">` wrapper
4. **Short description** paragraph
5. **Installation** — `::: code-group` with npm/yarn/pnpm/bun
6. **Usage** — code example with `twoslash` where appropriate
7. **Configuration / Options** — if applicable
8. **Additional examples** — advanced usage patterns

## Image Placement

- English assets go under `public/` (e.g., `public/keyboards/example.png`).
- Russian counterparts go under `public/ru/` with identical relative paths (e.g., `public/ru/keyboards/example.png`).
- Reference in docs as `/keyboards/example.png` (EN) and `/ru/keyboards/example.png` (RU).

## File Organization

```
docs/                          # English docs (source of truth)
  .vitepress/
    config.mts                 # Main VitePress config
    config/locales/
      en.locale.ts             # EN sidebar & nav
      ru.locale.ts             # RU sidebar & nav
  guides/                      # User guides
  plugins/official/            # Official plugin docs
  ru/                          # Russian translations (mirrors docs/)
public/                        # EN static assets
  ru/                          # RU static assets
```

## Sidebar Registration

When adding a new page, it **must** be registered in both sidebar configs:
- `docs/.vitepress/config/locales/en.locale.ts`
- `docs/.vitepress/config/locales/ru.locale.ts`

Follow the existing patterns for section grouping and link formatting.
