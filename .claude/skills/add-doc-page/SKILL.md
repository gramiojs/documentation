---
name: add-doc-page
description: Create a new documentation page in both EN and RU with proper frontmatter, sidebar registration, and automatic Russian translation.
allowed-tools: Read, Write, Edit, Glob, Grep
metadata:
  internal: true
---

# Add Documentation Page

You are adding a new documentation page to the GramIO docs site.

## Arguments

The user provides `[section/page-name]` — e.g., `guides/webhooks` or `plugins/official/my-plugin`.

## Steps

1. **Read AGENTS.md** for conventions (frontmatter, bilingual sync, image rules).

2. **Create the English page** at `docs/{section}/{page-name}.md`:
   - Add YAML frontmatter with `title`, `description` meta, and `keywords` meta.
   - Add an H1 heading matching the title.
   - Add a brief introductory paragraph placeholder.
   - Follow existing page patterns in the same section (read a sibling page for reference).

3. **Create the Russian translation** at `docs/ru/{section}/{page-name}.md`:
   - Translate the frontmatter (`title`, `description`, `keywords`) to Russian.
   - Translate the H1 heading and all body content to Russian.
   - Preserve code blocks, twoslash annotations, and markdown structure exactly.
   - Use the `/translate-page` skill conventions for translation quality.

4. **Register in EN sidebar** — edit `docs/.vitepress/config/locales/en.locale.ts`:
   - Find the appropriate section in the sidebar config.
   - Add the new page link following existing patterns.

5. **Register in RU sidebar** — edit `docs/.vitepress/config/locales/ru.locale.ts`:
   - Find the matching section.
   - Add the new page link with `/ru/` prefix.

6. **Report** what was created and where the user should add content.
