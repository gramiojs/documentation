---
name: enrich-api-page
description: Research and fill user-maintained content for Telegram API reference pages — SEO meta, GramIO usage examples, errors with context annotations, tips & gotchas, and see-also links. Supports multiple page names at once.
allowed-tools: Read, Write, Edit, Glob, Grep, WebFetch, WebSearch, Bash
metadata:
  internal: true
---

# Enrich API Reference Page

You are enriching the **user-maintained sections** of one or more Telegram Bot API reference pages in GramIO docs.

## Arguments

The user provides one or more method/type names, space-separated:
```
sendPhoto
sendMessage sendPhoto getUpdates
Message InlineKeyboardMarkup
```

**Process each name sequentially.** After finishing all pages, give a summary of what was done.

## What You Must NEVER Touch

- Anything between `<!-- GENERATED:START -->` and `<!-- GENERATED:END -->` markers in the page body

The frontmatter **IS yours to update** — SEO optimization is a primary goal of enrichment.

---

## Steps (repeat for each name)

### 1. Read the existing page

Find the file:
- Methods: `docs/telegram/methods/{name}.md`
- Types: `docs/telegram/types/{name}.md`

Note which sections are empty/placeholder vs. already have content. **Don't overwrite sections that already have good content** — only improve or fill missing ones.

### 2. Fetch the official Telegram docs

```
https://core.telegram.org/bots/api#{lowercasename}
```

Extract:
- Full description nuances and caveats
- All constraints mentioned (limits, timing, chat-type restrictions)
- Which methods/types are cross-referenced

### 3. Update SEO frontmatter

SEO is critical — people searching Google for `sendMessage telegram`, `telegram bot api sendMessage` etc. should find GramIO docs.

Update the frontmatter fields:

**`title`** — exact search-match format:
```
sendMessage — Telegram Bot API | GramIO
Message Object — Telegram Bot API | GramIO
```

**`description`** (meta) — action-oriented, 140–160 chars, mentions GramIO and TypeScript:
```
Send text messages using GramIO with TypeScript. Complete sendMessage parameter reference,
entity formatting examples, reply_markup, and common error handling.
```
Good description anatomy: `[Action verb] [what it does] using GramIO. [Key features]: [param1], [param2], [use case].`

**`keywords`** (meta) — include all of:
- The method/type name itself (highest priority)
- `telegram bot api`, `telegram bot`
- `gramio {name}`, `{name} typescript`, `{name} example`
- All required parameter names
- Common search phrases: `how to {action} telegram bot`, `telegram {name} method`
- Return type name if notable

Example for `sendMessage`:
```
sendMessage, telegram bot api, send message telegram bot, gramio sendMessage,
telegram send text message, sendMessage typescript, chat_id, parse_mode, reply_markup,
telegram bot send message example, how to send message telegram bot
```

### 4. Research errors

For **methods** only (skip for types).

Use this error knowledge base, then add method-specific ones from official docs:

**Universal (any method):**
- `400 Bad Request: chat not found` — invalid/inaccessible `chat_id`
- `400 Bad Request: message not found` — referenced message doesn't exist
- `403 Forbidden: bot was blocked by the user` — user blocked the bot
- `403 Forbidden: bot is not a member of the channel chat` — bot not in channel
- `403 Forbidden: not enough rights` — bot lacks required permissions
- `429 Too Many Requests: retry after N` — flood control, check `retry_after`

**sendMessage:**
- `400 TEXT_TOO_LONG` — text > 4096 chars
- `400 can't parse entities` — malformed entities or wrong parse_mode markup

**sendPhoto / sendDocument / sendVideo / sendAudio:**
- `400 PHOTO_INVALID_DIMENSIONS` — image dimensions too large
- `400 wrong file identifier/HTTP URL specified` — bad file_id or inaccessible URL

**answerCallbackQuery:**
- `400 query is too old and response timeout expired` — must answer within 10 seconds

**answerInlineQuery:**
- `400 QUERY_ID_INVALID` — query expired (>10s) or already answered

**editMessage*:**
- `400 message is not modified` — new content identical to current
- `400 message can't be edited` — message too old, or sent by a different bot

### 5. Write the enriched sections

#### `## GramIO Usage`

Write 3–6 TypeScript examples:
- Context shorthand first (`ctx.send`, `ctx.reply`, `ctx.answerCallbackQuery`)
- Direct `bot.api.methodName({...})` call second
- One example per key use case
- Imports when needed

**Code rules:**
- `format` tagged template builds **entities**, never add `parse_mode` alongside it
- `ctx.send()` → shorthand for `sendMessage` to current chat
- `ctx.reply()` → additionally sets `reply_parameters`
- For files: `MediaUpload.path("./file.jpg")` or `MediaUpload.url("https://...")`

#### `## Errors`

Write a markdown table with **context annotations** in the Cause column:

```markdown
| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: TEXT_TOO_LONG` | `text` exceeds 4096 chars — use [Split plugin](/plugins/official/split) |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — catch and mark user as inactive |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |
```

**The Cause column is user-maintained non-generated data — make it maximally useful:**
- Don't just repeat what the error says — explain *why it happens*
- Add a short action hint: what should the developer do? (catch, retry, validate, etc.)
- Link to relevant plugins or docs pages when applicable
- For rate limits, always mention `retry_after` and the auto-retry plugin

Add a tip block if auto-retry is relevant:
```markdown
::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::
```

#### `## Tips & Gotchas`

Write 3–6 bullet points. These are also user-maintained — make them **actionable annotations**, not just paraphrased docs:

Good pattern: `**Key point.** Explanation of why it matters + what to do.`

```markdown
- **Text limit is 4096 characters.** For longer content, use the [Split plugin](/plugins/official/split) — it handles entity preservation automatically.
- **`parse_mode` and `entities` are mutually exclusive.** GramIO's `format` helper always produces `entities`, so never pass `parse_mode` alongside it.
- **`chat_id` accepts `@username` strings** for public groups/channels. Private chats always require the numeric ID.
```

Focus on:
- Constraints with consequences (limits, timing, rate limits)
- Mutually exclusive parameters
- Chat-type behavioral differences (private / group / supergroup / channel)
- Common pitfalls that cause silent bugs or unexpected behavior
- GramIO-specific patterns that simplify the task

#### `## See Also`

4–8 links. **Always verify with Glob that the target page exists before linking.**

```bash
# Check if page exists:
ls docs/telegram/methods/sendPhoto.md
ls docs/telegram/types/Message.md
ls docs/plugins/official/auto-retry.md
```

Include:
- Related methods (same category)
- Return type and key parameter types (link to their `/telegram/types/` pages)
- Relevant GramIO guides that exist: `/formatting`, `/keyboards/overview`, `/files`
- Plugins that apply

### 6. Report progress

After each page, briefly list:
- ✅ Sections added/updated
- ⚠️ Anything uncertain or that needs human review
- → Suggested next: related pages worth enriching

After all pages are done, print a summary table:
```
| Page | SEO | Usage | Errors | Tips | See Also |
|------|-----|-------|--------|------|----------|
| sendMessage | ✅ | ✅ | ✅ | ✅ | ✅ |
| sendPhoto   | ✅ | ✅ | ✅ | ✅ | ✅ |
```

---

## Quality Bar

- **SEO:** title matches the exact search query people use; keywords include all major variants
- **Examples:** runnable TypeScript, correct imports, realistic values, idiomatic GramIO
- **Errors:** accurate (mark uncertain ones with `*`); Cause column is a useful annotation, not just error text
- **Tips:** actionable, non-obvious, each one saves a developer real time
- **Links:** only link pages that exist
