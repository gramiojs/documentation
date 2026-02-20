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

### 5. Verify types via JSR API references

**CRITICAL: Never invent types or properties.** Before writing any code example, look up the actual type signatures on JSR.

**Context naming convention — camelCase only:**
- GramIO contexts use **camelCase** for all properties and methods: `ctx.text`, `ctx.from`, `ctx.chat`, `ctx.replyToMessage`, `ctx.senderChat`, etc.
- **NEVER use snake_case** on context objects — `ctx.reply_to_message` is WRONG, `ctx.message.reply_to_message` is WRONG
- Snake_case exists **only** in the raw Telegram payload: `ctx.payload.reply_to_message` — but prefer the typed camelCase accessors
- When in doubt, check the context class on JSR to find the correct camelCase property name

> **Note:** JSR docs may lag slightly behind the latest release. Use them as the primary reference, but if a property clearly should exist based on the Telegram API and the context class pattern, verify against the actual source code or the latest npm/jsr package version.

Use `WebFetch` to check types at these URLs:

| Package | JSR Doc URL | What to check |
|---------|-------------|---------------|
| `@gramio/contexts` | `https://jsr.io/@gramio/contexts/doc` | **All context classes** — the actual `ctx` object types. Start here for any `ctx.*` usage |
| `@gramio/types` | `https://jsr.io/@gramio/types/doc` | Telegram API types (`TelegramMessage`, `TelegramUser`, `APIMethodParams<"methodName">`, etc.) |
| `@gramio/core` | `https://jsr.io/@gramio/core/doc` | `Bot` class, `bot.api.*` methods |
| `@gramio/format` | `https://jsr.io/@gramio/format/doc` | `format`, `bold`, `italic`, `code`, `link` and other formatting helpers |
| `@gramio/keyboards` | `https://jsr.io/@gramio/keyboards/doc` | `Keyboard`, `InlineKeyboard`, `ForceReply`, `RemoveKeyboard` |
| `@gramio/files` | `https://jsr.io/@gramio/files/doc` | `MediaUpload` (`.path()`, `.url()`, `.buffer()`, `.text()`) |

**Key context types** (from `@gramio/contexts`):

| Event | Context class | JSR doc URL |
|-------|--------------|-------------|
| `message` | `MessageContext` | `https://jsr.io/@gramio/contexts/doc/~/MessageContext` |
| `callback_query` | `CallbackQueryContext` | `https://jsr.io/@gramio/contexts/doc/~/CallbackQueryContext` |
| `inline_query` | `InlineQueryContext` | `https://jsr.io/@gramio/contexts/doc/~/InlineQueryContext` |
| `pre_checkout_query` | `PreCheckoutQueryContext` | `https://jsr.io/@gramio/contexts/doc/~/PreCheckoutQueryContext` |
| `chat_join_request` | `ChatJoinRequestContext` | `https://jsr.io/@gramio/contexts/doc/~/ChatJoinRequestContext` |
| `chat_member` | `ChatMemberContext` | `https://jsr.io/@gramio/contexts/doc/~/ChatMemberContext` |
| All mappings | `ContextsMapping` | `https://jsr.io/@gramio/contexts/doc/~/ContextsMapping` |

**How to verify:**
1. **Context properties** (`ctx.text`, `ctx.from`, `ctx.chat`, etc.): fetch the specific context class from `@gramio/contexts` — e.g. `https://jsr.io/@gramio/contexts/doc/~/MessageContext` to see what properties/methods actually exist
2. **API method params**: fetch `https://jsr.io/@gramio/types/doc/~/APIMethodParams` to see the actual parameter type for `bot.api.methodName()`
3. **Telegram objects** (e.g. `TelegramMessage`, `TelegramUser`): check `@gramio/types` — all Telegram types are prefixed with `Telegram` (e.g. `TelegramMessage`, not `Message`)
4. **If a property doesn't exist on JSR — don't use it.** Find the correct way to access the data

### 6. Write the enriched sections

#### `## GramIO Usage`

Write 3–6 TypeScript examples:
- Context shorthand first (`ctx.send`, `ctx.reply`, `ctx.answerCallbackQuery`)
- Direct `bot.api.methodName({...})` call second
- One example per key use case
- Imports when needed

**Code format — use `ts twoslash`:**

All code blocks MUST use ` ```ts twoslash ` instead of ` ```typescript `. This enables **build-time type checking** — if you use a type that doesn't exist, the VitePress build will fail.

Pattern for examples:
````markdown
```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// The visible example starts after ---cut---
bot.command("start", (ctx) => ctx.send("Hello!"));
```
````

- `// ---cut---` hides the setup code (imports, Bot creation) from the rendered page but keeps it for type checking
- `// ^?` shows an inline type hover annotation — use sparingly for key types
- If the example needs extra imports (format, keyboards, etc.), put them before `// ---cut---`
- If the example is a standalone snippet (not inside a handler), you may omit `// ---cut---`

**Code rules:**
- `format` tagged template builds **entities**, never add `parse_mode` alongside it
- `ctx.send()` → shorthand for `sendMessage` to current chat
- `ctx.reply()` → additionally sets `reply_parameters`
- For files: `await MediaUpload.path("./file.jpg")` or `await MediaUpload.url("https://...")` — both are **async**, always use `await`
- `MediaUpload.buffer(buf, "name.ext")` and `MediaUpload.text("content", "name.txt")` are synchronous (no `await` needed)
- Always link to [`/files/media-upload`](/files/media-upload) in See Also when the method involves file uploads
- Always link to [`/formatting`](/formatting) in See Also when the method accepts `text`, `caption`, or `message_text` (formatting is applicable)
- Always link to [`/keyboards/overview`](/keyboards/overview) in See Also when the method involves `reply_markup`, inline keyboards, or callback queries

**Import convention — prefer importing from `"gramio"` directly:**
- `Keyboard`, `InlineKeyboard`, `ForceReply`, `RemoveKeyboard` are **re-exported from `"gramio"`** — import them from `"gramio"`, not `"@gramio/keyboards"`
- `MediaUpload` is **re-exported from `"gramio"`** — import it from `"gramio"`, not `"@gramio/files"`
- `format`, `bold`, `italic`, `code`, `link`, etc. are **re-exported from `"gramio"`** — import them from `"gramio"`, not `"@gramio/format"`
- Only use the individual package imports (`@gramio/keyboards`, `@gramio/files`, `@gramio/format`) when explicitly working outside of the main `gramio` package

Good:
```ts
import { Bot, InlineKeyboard, MediaUpload, format, bold } from "gramio";
```
Avoid:
```ts
import { InlineKeyboard } from "@gramio/keyboards";
import { MediaUpload } from "@gramio/files";
```

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

### 7. Report progress

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
- **Types:** every property access, method call, and type annotation must exist in the real GramIO/Telegram types — verified via JSR docs. **Zero invented types.**
- **Examples:** `ts twoslash` code blocks, correct imports, realistic values, idiomatic GramIO. Build MUST pass — if twoslash fails, the type is wrong
- **Errors:** accurate (mark uncertain ones with `*`); Cause column is a useful annotation, not just error text
- **Tips:** actionable, non-obvious, each one saves a developer real time
- **Links:** only link pages that exist
