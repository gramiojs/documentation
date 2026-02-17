---
name: translate-page
description: Translate a GramIO documentation page from English to Russian (or vice versa), preserving code blocks, twoslash annotations, and frontmatter.
allowed-tools: Read, Write, Edit, Glob
metadata:
  internal: true
---

# Translate Documentation Page

You are translating a GramIO documentation page between English and Russian.

## Arguments

The user provides `[path]` — e.g., `docs/storages.md` or `docs/ru/guides/telegram-stars.md`.

## Steps

1. **Determine direction**:
   - If path starts with `docs/ru/` → translating RU to EN, target is `docs/{rest-of-path}`.
   - Otherwise → translating EN to RU, target is `docs/ru/{rest-of-path}` (remove leading `docs/`).

2. **Read the source page** completely.

3. **Read AGENTS.md** for translation conventions.

4. **Translate** the content with these rules:
   - Translate all prose (headings, paragraphs, list items, table cells).
   - **Do NOT translate** code blocks — keep all code exactly as-is.
   - **Do NOT modify** `// ^?` twoslash annotations.
   - **Do NOT translate** frontmatter field names, only values (`title`, `description` content, `keywords` content).
   - Update image paths: EN uses `/path/image.png`, RU uses `/ru/path/image.png`.
   - Keep all links functional — internal links should use the correct locale prefix.
   - Preserve markdown formatting (bold, italic, code spans, blockquotes, admonitions).
   - Keep `::: code-group`, `::: tip`, `::: warning`, `::: danger` markers unchanged.
   - Keep badge HTML blocks unchanged.

5. **Write the translated page** to the target path.

6. **Verify** the target file exists and has the same structure as the source.
