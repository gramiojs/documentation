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

- **Frontmatter**: `title` should highlight the biggest change of the period — make it punchy and exciting. Do NOT include month/year names in titles (multiple changelogs may fall in the same month). `description` (meta) and `keywords` (meta) as usual.
- **H1**: Lead with the most impactful change as a bold headline, followed by the date range. Think release blog post, not dry log.
- **Sections by repo/package**, each containing:
  - **Commit links** under each `## package` heading — list the key commit SHAs as inline links. Use `gh api` to fetch commits for the period: `gh api "search/commits?q=org:gramiojs+committer-date:<since>..<until>&sort=committer-date&order=desc&per_page=100"`. Format: `[`short-sha`](https://github.com/gramiojs/<repo>/commit/<full-sha>)` separated by spaces
  - Attention-grabbing subheadings that announce what happened — not generic "New Features" but specific headlines like "Keyboards now support copy-to-clipboard buttons" or "Session plugin gets Redis adapter"
  - Version numbers (extracted from `package.json` changes in patches)
  - What changed, written in clear, enthusiastic prose — sell the feature, explain why it matters
  - Migration instructions for breaking changes with before/after code examples
  - Code examples for notable new features
- Write like a developer blog post — exciting, informative, and opinionated. Highlight what's most useful to bot developers. This is NOT a raw commit log.

Example structure:

```markdown
---
title: "Inline Keyboards Get Superpowers, Sessions Go Persistent, New Redis Adapter"
head:
  - - meta
    - name: "description"
      content: "GramIO changelog: inline keyboard copy buttons, persistent Redis sessions, 40% faster media uploads, and breaking changes in @gramio/keyboards v2"
  - - meta
    - name: "keywords"
      content: "gramio, changelog, updates, inline keyboard, redis sessions"
---

# Inline Keyboards Get Superpowers & Sessions Go Persistent

**February 1 – 15, 2026**

The highlight of this cycle: inline keyboards learned new tricks and sessions finally support Redis out of the box. Here's everything that shipped.

## gramio v1.2.3 — Faster Media Uploads

[`abc1234`](https://github.com/gramiojs/gramio/commit/abc1234) [`def5678`](https://github.com/gramiojs/gramio/commit/def5678)

### Media uploads are now 40% faster

We reworked the upload pipeline to stream files directly instead of buffering...

## @gramio/keyboards v2.0.0 — Copy-to-Clipboard & Breaking Changes

[`aaa1111`](https://github.com/gramiojs/keyboards/commit/aaa1111)

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

[`bbb2222`](https://github.com/gramiojs/session/commit/bbb2222)

### Sessions can now persist to Redis

No more losing session data on restart...
```

### 6. Create Russian Translation

Create `docs/ru/changelogs/YYYY-MM-DD.md`:

- Translate all prose to Russian
- Preserve code blocks, links (including commit links!), and frontmatter structure exactly
- Use **natural Russian technical writing style** — write like a Russian developer, not a translator. Use dev slang where appropriate ("прокидывает", "лезть в", "из коробки", "Было/Стало")
- Follow the same conventions as other RU docs (read a sibling RU page for reference)

### 7. Update Existing Docs and Skills

This is the most critical step. Based on the patches analyzed, update existing documentation and skills to reflect the changes:

#### New Plugin Documentation Pages

**CRITICAL**: If patches reveal entirely new packages/plugins (e.g., a new `@gramio/xxx` plugin), you MUST create full documentation pages for them:

- Create `docs/plugins/official/<plugin-name>.md` (EN) following the existing plugin doc style (see `docs/plugins/official/posthog.md` for reference)
- Create `docs/ru/plugins/official/<plugin-name>.md` (RU) in natural Russian
- Each page needs: heading, badges div (npm + JSR), description, installation code-group, usage examples, API/methods section
- Register the new pages in both sidebar configs (`en.locale.ts` and `ru.locale.ts`) under the "Official" plugins section

#### Existing Documentation Pages (`docs/`)

If patches reveal new API methods, changed behavior, new options, new plugin features, etc.:

- Update the relevant existing doc pages (e.g., `docs/keyboards/overview.md`, `docs/plugins/official/session.md`, etc.)
- Update their Russian translations in `docs/ru/`
- Add new code examples, update signatures, fix outdated information
- Preserve twoslash annotations (`// ^?`) — never delete them

#### Public Skills (`skills/`) — MANDATORY SYNC

**CRITICAL**: Skills MUST stay in sync with documentation. Every doc change should be mirrored in skills. This is NOT optional.

**New plugin → new skill file:**
If you created a new plugin doc page (`docs/plugins/official/<name>.md`), you MUST also create `skills/plugins/<name>.md` with:
- YAML frontmatter (`name`, `description`)
- Package name, setup code, key API methods, usage examples
- Follow existing skill style (see `skills/plugins/session.md` or `skills/plugins/prompt.md`)

**New doc page → new reference skill:**
If you created a new standalone doc page (e.g., testing, storages), you MUST also create `skills/references/<name>.md` with:
- YAML frontmatter (`name`, `description`)
- Concise API reference with code examples
- Follow existing style (see `skills/references/webhook.md`)

**New feature → new or updated example:**
If a notable new feature was added, create or update `skills/examples/<name>.ts` with a runnable example.

**Always update:**
- `skills/references/` — Update relevant API reference docs when behavior changes
- `skills/examples/` — Add or update code examples showing new features
- `skills/plugins/` — Update plugin guides if plugin behavior changed
- `skills/metadata.json` — Bump the version number and date

**Checklist before moving on from this step:**
- [ ] Every new plugin doc page has a corresponding `skills/plugins/<name>.md`
- [ ] Every new standalone doc page has a corresponding `skills/references/<name>.md`
- [ ] Notable new features have examples in `skills/examples/`
- [ ] Changed plugin behavior is reflected in existing `skills/plugins/` files
- [ ] `skills/metadata.json` version and date are bumped

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

### 10. Update Homepage "Latest Updates" Section

Update the "Latest Updates" / "Последние обновления" section on both homepages with the newly created changelog entry:

**`docs/index.md`** — Replace the existing "Latest Updates" content (between `## Latest Updates` and the next `##`) with:
- A bold link to the new changelog page with its title
- The date range
- A one-line summary of the highlights
- The "All changelogs →" link

**`docs/ru/index.md`** — Same in Russian under `## Последние обновления`.

### 11. Update State

Write `.changelog-state.json` at the project root:

```json
{ "lastRunDate": "YYYY-MM-DD", "lastPage": "changelogs/YYYY-MM-DD" }
```

### 12. Clean Up

Remove temporary files:

```bash
rm -rf /tmp/gramio-patches/ /tmp/gramio-ghlog.md
```

### 13. Report

Summarize:

- What repos/packages were covered, how many commits processed
- The generated changelog page path
- All documentation pages that were updated (and why)
- All skill files that were updated (and why)
- Any changes that need manual review or attention
