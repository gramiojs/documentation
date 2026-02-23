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

### 2. Ask Contextual Questions During Analysis

After analyzing patches (step 5), you will face **placement decisions** — don't guess silently. Use the **`AskUserQuestion` tool** to present structured choices before writing any files.

- Use `multiSelect: false` for mutually exclusive placement decisions (new page vs existing page)
- Use `multiSelect: true` when asking which items to document out of a list
- Always mark your recommended option first and append `(Recommended)` to its label
- Group related questions into a single `AskUserQuestion` call (up to 4 questions at once) rather than asking one by one
- Proceed to write files only after all questions are answered

Example questions to ask:

- New plugin found → "Where should I document `@gramio/storage-redis`?" with options: "New standalone page `docs/plugins/official/storage-redis.md` (Recommended)", "Section in existing session page", "Skip — not ready yet"
- Many new API methods → "The keyboard API gained 5 new methods. How should I document them?" with options: "Expand existing `docs/keyboards/overview.md` (Recommended)", "Create new `docs/keyboards/advanced.md`"
- Internal-only breaking change → "This change breaks `@gramio/session` internals but keeps public API intact. Document it?" with options: "Yes, as a migration note (Recommended)", "No, skip it"

### 3. Fetch Patches

Run `ghlog` to get commit data and patches from all `gramiojs` repos:

```bash
bunx ghlog --org gramiojs --since <last-date> --until <tomorrow> --patch --patch-dir /tmp/gramio-patches --format markdown --output /tmp/gramio-ghlog.md
```

Replace `<last-date>` with the value from state (or the user-provided start date).
Replace `<tomorrow>` with **today's date + 1 day** (i.e. if today is `2026-02-23`, use `2026-02-24`).

> **Critical — how GitHub API interprets dates:**
>
> - `--since DATE` → includes commits **from** `DATE T00:00:00Z` (inclusive)
> - `--until DATE` → includes commits **before** `DATE T00:00:00Z` (exclusive — the named date itself is NOT included)
>
> This means `--until <today>` would silently drop all commits made today. Always pass `--until <tomorrow>` to capture the full current day. Compute `<tomorrow>` as:
>
> ```bash
> date -v+1d +%Y-%m-%d   # macOS / BSD
> date -d "+1 day" +%Y-%m-%d  # Linux / GNU
> ```
>
> For sequential runs: the `--since` of the next run must equal the `--until` of this run (both are stored as `lastRunDate` in state). This guarantees no gaps and no duplicates between runs.

### 4. Read the Markdown Summary

Read `/tmp/gramio-ghlog.md` to get a structured commit overview per repository.

### 5. Read and Analyze Patches

Read the patch files from `/tmp/gramio-patches/`. Focus on extracting:

- **Breaking changes** — API signature changes, removed exports, renamed methods
- **New features** — new exports, new methods, new options, new plugins
- **Bug fixes** — error corrections, edge-case handling
- **Dependency bumps and version changes** — read `package.json` diffs to extract version numbers
- **Documentation-relevant changes** — anything that should be reflected in docs or skills

**Token budget — skip heavy patches that don't need full reading:**

Not every patch is worth reading in full. Use the commit message/title to decide:

Use the commit message/title to decide whether to open the patch at all:

| Patch type | Default action | Open the patch if… |
|---|---|---|
| `docs:` — prose updates, API reference, translations | Skip | Title mentions a new page, new section, or new feature being documented for the first time |
| `chore:` / `ci:` — internal tooling, CI config, formatting | Skip | Title hints at a user-visible change (e.g. "add exports field", "drop Node 16 support") |
| `refactor:` — internal restructuring | Skip | Title mentions a public API being touched |
| `fix:` / `feat:` with small diffs (< ~50 lines) | Read fully | — |
| `feat:` / `BREAKING CHANGE:` with large diffs | Read selectively | Always — focus on `package.json`, exported types/interfaces, entry point. Skip test files, lock files, generated files. |
| `bump` / `release` — only `package.json` changes | Read only `package.json` | — |

**Rule of thumb:** if the commit subject already tells you everything you need for the changelog entry, don't open the patch. The title is the first filter — only reach for the diff when you need concrete details (new API signatures, before/after examples, version numbers).

### 6. Compose the Changelog Page

Create `docs/changelogs/YYYY-MM-DD.md` (using today's date) with:

- **Frontmatter**: `title` should highlight the biggest change of the period — make it punchy and exciting. Do NOT include month/year names in titles (multiple changelogs may fall in the same month). `description` (meta) and `keywords` (meta) as usual.
- **H1**: Lead with the most impactful change as a bold headline, followed by the date range. Think release blog post, not dry log.
- **Sections by repo/package**, each containing:
    - **Feature subheadings ARE commit/compare links** — instead of listing commit SHAs separately below the heading, make the heading itself a clickable link. Format: `### [Keyboards now support copy-to-clipboard buttons](url)`. Choose the right link type:
        - **Single commit** → link to the commit: `https://github.com/gramiojs/<repo>/commit/<full-sha>`
        - **Version bump / release** → prefer a compare link spanning the release: `https://github.com/gramiojs/<repo>/compare/v1.2.2...v1.2.3`
        - **Multiple unrelated commits** → link the heading to the most important commit; mention others inline in the prose as `([abc1234](url), [def5678](url))`
    - Attention-grabbing subheadings that announce what happened — not generic "New Features" but specific headlines like "Keyboards now support copy-to-clipboard buttons" or "Session plugin gets Redis adapter"
    - Version numbers (extracted from `package.json` changes in patches)
    - What changed, written in clear, enthusiastic prose — sell the feature, explain why it matters
    - Migration instructions for breaking changes with before/after code examples
    - Code examples for notable new features
- Write like a developer blog post — exciting, informative, and opinionated. Highlight what's most useful to bot developers. This is NOT a raw commit log.

Example structure:

````markdown
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

## [gramio v1.2.3 — Faster Media Uploads](https://github.com/gramiojs/gramio/compare/v1.2.2...v1.2.3)

### [Media uploads are now 40% faster](https://github.com/gramiojs/gramio/commit/abc1234full)

We reworked the upload pipeline to stream files directly instead of buffering ([def5678](https://github.com/gramiojs/gramio/commit/def5678full))...

## [@gramio/keyboards v2.0.0 — Copy-to-Clipboard & Breaking Changes](https://github.com/gramiojs/keyboards/compare/v1.9.0...v2.0.0)

### [Inline keyboards now support copy-to-clipboard buttons](https://github.com/gramiojs/keyboards/commit/aaa1111full)

The long-awaited Telegram feature is here...

### [BREAKING: `Keyboard.text()` renamed to `Keyboard.button()`](https://github.com/gramiojs/keyboards/commit/aaa2222full)

Migration is straightforward:

```ts
// Before
Keyboard.text("Click me");

// After
Keyboard.button("Click me");
```
````

## @gramio/session v0.5.0 — Redis Adapter

### [Sessions can now persist to Redis](https://github.com/gramiojs/session/commit/bbb2222full)

No more losing session data on restart...

````

### 7. Create Russian Translation

Create `docs/ru/changelogs/YYYY-MM-DD.md`:

- Translate all prose to Russian
- Preserve code blocks, links (including commit links in headings!), and frontmatter structure exactly
- Use **natural Russian technical writing style** — write like a Russian developer, not a translator. Use dev slang where appropriate ("прокидывает", "лезть в", "из коробки", "Было/Стало")
- Follow the same conventions as other RU docs (read a sibling RU page for reference)

### 8. Update Existing Docs and Skills

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

### 9. Register in Sidebars

Add the new changelog page to both sidebar configs:

**`docs/.vitepress/config/locales/en.locale.ts`** — Add the new entry under the "Changelogs" section, newest first:

```typescript
{
  text: "YYYY-MM-DD",
  link: "/changelogs/YYYY-MM-DD",
}
````

**`docs/.vitepress/config/locales/ru.locale.ts`** — Same, with `/ru/` prefix:

```typescript
{
  text: "YYYY-MM-DD",
  link: "/ru/changelogs/YYYY-MM-DD",
}
```

### 10. Update Changelog Index

Add the new entry link to both:

- `docs/changelogs/index.md` — newest first
- `docs/ru/changelogs/index.md` — newest first

### 11. Update Homepage "Latest Updates" Section

Update the "Latest Updates" / "Последние обновления" section on both homepages with the newly created changelog entry:

**`docs/index.md`** — Replace the existing "Latest Updates" content (between `## Latest Updates` and the next `##`) with:

- A bold link to the new changelog page with its title
- The date range
- A one-line summary of the highlights
- The "All changelogs →" link

**`docs/ru/index.md`** — Same in Russian under `## Последние обновления`.

### 12. Update `public/changelog.json`

Read `public/changelog.json`. If it doesn't exist, create it with an empty `entries` array. Prepend a new entry for this changelog to the top of `entries` (newest first).

**Entry structure:**

```json
{
    "id": "2026-02-17-inline-keyboards-superpowers",
    "date": "2026-02-17",
    "dateRange": {
        "from": "2026-02-01",
        "to": "2026-02-17"
    },
    "page": {
        "en": "https://gramio.dev/changelogs/2026-02-17",
        "ru": "https://gramio.dev/ru/changelogs/2026-02-17"
    },
    "en": {
        "title": "Inline Keyboards Get Superpowers, Sessions Go Persistent",
        "summary": [
            "Inline keyboards now support copy-to-clipboard buttons",
            "Sessions got a Redis adapter — no more lost data on restart",
            "Media uploads are 40% faster"
        ]
    },
    "ru": {
        "title": "Инлайн-клавиатуры обзавелись суперсилами, сессии стали постоянными",
        "summary": [
            "Инлайн-клавиатуры теперь поддерживают кнопки копирования в буфер",
            "Сессии получили Redis-адаптер — данные больше не теряются при перезапуске",
            "Загрузка медиа стала на 40% быстрее"
        ]
    },
    "packages": ["gramio", "@gramio/keyboards", "@gramio/session"],
    "tags": ["keyboards", "sessions", "performance"]
}
```

**Field rules:**

- `id` — `YYYY-MM-DD-<kebab-slug>` where slug is 3–5 words from the EN title (lowercase, hyphens). Must be unique.
- `dateRange.from` — the `--since` date used for this run (= `lastRunDate` from state, or the user-provided start date)
- `dateRange.to` — the **last actually included day** = `--until - 1 day` (= today's date). Since `--until` is exclusive, the range covers `[from, to]` inclusive when expressed in calendar days.
- `summary` — array of short bullet strings, plain text only (no markdown, no links). Each item = one key change, 1 line, punchy. 12 bullets max. EN and RU versions independently written (not translated mechanically) — write like a native speaker of each language.
- `packages` — list of affected package names extracted from patches (e.g. `"gramio"`, `"@gramio/keyboards"`)
- `tags` — 3–6 lowercase keywords useful for bot filtering (e.g. `"breaking"`, `"keyboards"`, `"sessions"`, `"performance"`, `"new-plugin"`)

**Top-level file structure:**

```json
{
    "version": 1,
    "entries": [
        /* newest first */
    ]
}
```

### 13. Update State

Write `.changelog-state.json` at the project root:

```json
{ "lastRunDate": "YYYY-MM-DD", "lastPage": "changelogs/YYYY-MM-DD" }
```

**`lastRunDate` must be set to `<today>` (not `<tomorrow>`).** Reason: if you run mid-day and then push more commits later the same day, the next run must re-scan from today to catch them. Saving `<tomorrow>` here would cause those commits to fall into the gap between `[..., tomorrow)` and `[tomorrow, ...]` — they'd be skipped permanently.

- The next run will slightly overlap (re-fetching today's already-processed commits), but that's harmless — changelogs are human-reviewed.
- Sequence: `lastRunDate = today`, next run uses `--since today --until <next-tomorrow>`.

### 14. Clean Up

Remove temporary files:

```bash
rm -rf /tmp/gramio-patches/ /tmp/gramio-ghlog.md
```

### 15. Report

Summarize:

- What repos/packages were covered, how many commits processed
- The generated changelog page path
- All documentation pages that were updated (and why)
- All skill files that were updated (and why)
- Any changes that need manual review or attention

**Ideas based on the changelog.** If during analysis you spotted opportunities to improve the docs — new guide that would help explain a feature, a page that's grown stale, a missing example, a plugin that deserves its own doc page, etc. — list them at the end of the report as suggestions. Don't implement them automatically; just mention them so the user can decide. Format as a short bullet list under a "💡 Ideas" heading.
