---
name: sync-translations
description: Audit EN/RU documentation for sync issues — find missing translations, outdated pages, and auto-translate missing Russian pages.
allowed-tools: Read, Write, Glob, Grep, Bash
metadata:
  internal: true
---

# Sync Translations

You are auditing and synchronizing the bilingual GramIO documentation.

## Steps

1. **List all English pages**:
   - Use Glob to find all `docs/**/*.md` files (excluding `docs/ru/`).

2. **List all Russian pages**:
   - Use Glob to find all `docs/ru/**/*.md` files.

3. **Find missing Russian pages**:
   - For each English page `docs/{path}.md`, check if `docs/ru/{path}.md` exists.
   - Collect all missing pages.

4. **Find outdated translations**:
   - For pages that exist in both languages, compare modification times using `ls -la` or `stat`.
   - Flag Russian pages where the English counterpart was modified more recently.

5. **Report findings**:
   - Print a summary table with:
     - Missing Russian pages (no counterpart exists)
     - Outdated Russian pages (EN modified after RU)
     - Counts and percentages

6. **Translate missing pages**:
   - Ask the user if they want to translate the missing pages.
   - If yes, for each missing page read `docs/{path}.md` and create a full Russian translation at `docs/ru/{path}.md`:
     - Translate frontmatter (`title`, `description`, `keywords`) to Russian.
     - Translate all body content to Russian.
     - Preserve code blocks, twoslash annotations, and markdown structure exactly.
   - Also check if the missing pages need sidebar registration in `ru.locale.ts`.

7. **Summary**: Report how many pages were translated and what manual steps remain (sidebar registration, review).
