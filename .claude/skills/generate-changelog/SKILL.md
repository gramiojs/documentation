---
name: generate-changelog
description: Generate changelog pages from gramiojs org patches using ghlog CLI. Tracks last-run date for incremental updates. Also updates docs and skills to reflect changes.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
metadata:
  internal: true
---

# Generate Changelog

You are generating a changelog page for the GramIO documentation site by analyzing recent commits across the `gramiojs` GitHub organization.

## Steps

### 1. Read State

Read `.changelog-state.json` from the project root. If it does not exist, this is the first run — ask the user for a `--since` date to start from.

The state file has the shape:
```json
{ "lastRunDate": "2026-02-15", "lastPage": "changelogs/2026-02-15" }
```

### 2. Fetch Patches

Run `ghlog` to get commit data and patches from all `gramiojs` repos:

```bash
bunx ghlog --org gramiojs --since <last-date> --until <today> --patch --patch-dir /tmp/gramio-patches --format markdown --output /tmp/gramio-ghlog.md
```

Replace `<last-date>` with the value from state (or the user-provided start date) and `<today>` with today's date (`YYYY-MM-DD`).

### 3. Read the Markdown Summary

Read `/tmp/gramio-ghlog.md` to get a structured commit overview per repository.

### 4. Read and Analyze Patches

Read the patch files from `/tmp/gramio-patches/`. Focus on extracting:

- **Breaking changes** — API signature changes, removed exports, renamed methods
- **New features** — new exports, new methods, new options, new plugins
- **Bug fixes** — error corrections, edge-case handling
- **Dependency bumps and version changes** — read `package.json` diffs to extract version numbers
- **Documentation-relevant changes** — anything that should be reflected in docs or skills

### 5. Compose the Changelog Page

Create `docs/changelogs/YYYY-MM-DD.md` (using today's date) with:

- **Frontmatter**: `title` should highlight the biggest change of the period — make it punchy and exciting. `description` (meta) and `keywords` (meta) as usual.
- **H1**: Lead with the most impactful change as a bold headline, followed by the date range. Think release blog post, not dry log.
- **Sections by repo/package**, each containing:
  - Attention-grabbing subheadings that announce what happened — not generic "New Features" but specific headlines like "Keyboards now support copy-to-clipboard buttons" or "Session plugin gets Redis adapter"
  - Version numbers (extracted from `package.json` changes in patches)
  - What changed, written in clear, enthusiastic prose — sell the feature, explain why it matters
  - Inline links to GitHub commits/PRs where relevant
  - Migration instructions for breaking changes with before/after code examples
  - Code examples for notable new features
- Write like a developer blog post — exciting, informative, and opinionated. Highlight what's most useful to bot developers. This is NOT a raw commit log.

Example structure:

```markdown
---
title: "Inline Keyboards Get Superpowers, Sessions Go Persistent — February 2026"
head:
  - - meta
    - name: "description"
      content: "GramIO February 2026: inline keyboard copy buttons, persistent Redis sessions, 40% faster media uploads, and breaking changes in @gramio/keyboards v2"
  - - meta
    - name: "keywords"
      content: "gramio, changelog, updates, february 2026, inline keyboard, redis sessions"
---

# Inline Keyboards Get Superpowers & Sessions Go Persistent

**February 1 – 15, 2026**

The highlight of this cycle: inline keyboards learned new tricks and sessions finally support Redis out of the box. Here's everything that shipped.

## gramio v1.2.3 — Faster Media Uploads

### Media uploads are now 40% faster

We reworked the upload pipeline to stream files directly instead of buffering...

```ts
// Before: buffered the entire file
// Now: streams automatically, no code changes needed
await context.sendPhoto(MediaUpload.path("./photo.jpg"));
```

### New `onStop` hook for graceful cleanup

You can now run teardown logic when the bot shuts down...

## @gramio/keyboards v2.0.0 — Copy-to-Clipboard & Breaking Changes

### Inline keyboards now support copy-to-clipboard buttons

The long-awaited Telegram feature is here...

### BREAKING: `Keyboard.text()` renamed to `Keyboard.button()`

Migration is straightforward:

```ts
// Before
Keyboard.text("Click me")

// After
Keyboard.button("Click me")
```

## @gramio/session v0.5.0 — Redis Adapter

### Sessions can now persist to Redis

No more losing session data on restart...
```

### 6. Create Russian Translation

Create `docs/ru/changelogs/YYYY-MM-DD.md`:

- Translate all prose to Russian
- Preserve code blocks, links, and frontmatter structure exactly
- Use natural Russian technical writing style
- Follow the same conventions as other RU docs (read a sibling RU page for reference)

### 7. Update Existing Docs and Skills

This is the most critical step. Based on the patches analyzed, update existing documentation and skills to reflect the changes:

#### Documentation Pages (`docs/`)

If patches reveal new API methods, changed behavior, new options, new plugin features, etc.:

- Update the relevant existing doc pages (e.g., `docs/keyboards/overview.md`, `docs/plugins/official/session.md`, etc.)
- Update their Russian translations in `docs/ru/`
- Add new code examples, update signatures, fix outdated information
- Preserve twoslash annotations (`// ^?`) — never delete them

#### Public Skills (`skills/`)

Update the skill reference files, examples, and plugin guides under `skills/gramio/`:

- `skills/gramio/references/` — Update relevant API reference docs
- `skills/gramio/examples/` — Add or update code examples showing new features
- `skills/gramio/plugins/` — Update plugin guides if plugin behavior changed
- `skills/metadata.json` — Bump the version date

For each update, keep a record of what file was changed and why for the final report.

### 8. Register in Sidebars

Add the new changelog page to both sidebar configs:

**`docs/.vitepress/config/locales/en.locale.ts`** — Add the new entry under the "Changelogs" section, newest first:

```typescript
{
  text: "YYYY-MM-DD",
  link: "/changelogs/YYYY-MM-DD",
}
```

**`docs/.vitepress/config/locales/ru.locale.ts`** — Same, with `/ru/` prefix:

```typescript
{
  text: "YYYY-MM-DD",
  link: "/ru/changelogs/YYYY-MM-DD",
}
```

### 9. Update Changelog Index

Add the new entry link to both:

- `docs/changelogs/index.md` — newest first
- `docs/ru/changelogs/index.md` — newest first

### 10. Update State

Write `.changelog-state.json` at the project root:

```json
{ "lastRunDate": "YYYY-MM-DD", "lastPage": "changelogs/YYYY-MM-DD" }
```

### 11. Clean Up

Remove temporary files:

```bash
rm -rf /tmp/gramio-patches/ /tmp/gramio-ghlog.md
```

### 12. Report

Summarize:

- What repos/packages were covered, how many commits processed
- The generated changelog page path
- All documentation pages that were updated (and why)
- All skill files that were updated (and why)
- Any changes that need manual review or attention
