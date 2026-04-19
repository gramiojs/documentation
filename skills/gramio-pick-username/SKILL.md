---
description: Pick an available Telegram bot username. Takes a topic (and optional audience/language), generates candidates respecting BotFather's rules, batch-checks availability on t.me via the bundled `check-usernames.mjs` script, and returns a ranked shortlist of free names. Use BEFORE `/gramio-new-bot` or whenever the user asks "find a bot username", "check if @foo_bot is taken", "придумай юзернейм для бота", "неминг бота".
allowed-tools: Bash, WebFetch, WebSearch, Read, Write
---

# Pick a Telegram Bot Username

You help the user find a short, memorable, **available** Telegram bot username that satisfies BotFather's rules.

## Arguments

The user provides free-form context, typically a topic and audience. Examples:

- `/gramio-pick-username weather bot for Russian users`
- `/gramio-pick-username крипто-трекер, русскоязычная аудитория`
- `/gramio-pick-username is @weatherly_bot free?`

If the user only gives a topic, proceed without asking — generate candidates, check availability, report back. Ask only when the topic is genuinely ambiguous (e.g. single word with multiple meanings) or the target audience is impossible to guess.

## Rules BotFather enforces

Validate every candidate against **all** of these before wasting a fetch on it:

1. **Length**: 5–32 characters total.
2. **Charset**: `a-z`, `A-Z`, `0-9`, `_` only (case-insensitive at lookup time, but store lowercase).
3. **Suffix**: must end in `bot` (case-insensitive — `FooBot`, `foo_bot`, `fooBOT` all legal). *Exception*: collectible usernames on [Fragment](https://fragment.com) skip the `bot` suffix but require a paid upgrade (1000+ TON) — do not suggest these unless the user explicitly asks for short/premium names.
4. **Underscores**: cannot start or end with `_`, cannot contain consecutive `__`.
5. **First character**: must be a letter (cannot start with a digit or underscore).
6. **Reserved / profane**: Telegram silently rejects some words; if a legal-looking name is refused in BotFather, drop it and move on.

Any candidate violating 1–5 is filtered out locally before any network check.

## Candidate-generation strategy

Given topic `T` and audience language `L`:

1. **Obvious direct forms** — `{T}bot`, `{T}_bot`, `the{T}bot`, `my{T}bot`, `{T}ai_bot`, `{T}hub_bot`. Almost always taken for popular topics, but you must rule them out explicitly.
2. **Prefixes** — `my`, `the`, `get`, `ask`, `hey`, `now`, `ok`, `tap`, `go`, `it`, `ai`, `hub`, `box`, `pal`, `peek`, `lens`.
3. **Suffix variants before `bot`** — `ly`, `ify`, `io`, `hq`, `lab`, `kit`, `zen`, `wise`, `mate`, `pal`.
4. **Transliteration for non-English audiences** — e.g. for Russian weather bot: `pogoda`, `kakpogoda`, `chopogoda`, `pogoday`, `pogodnik`, `pogodushka`, `gradus`, `nebo`. Always include both English and transliterated forms when `L` is not English.
5. **Domain synonyms** — pull from the topic's jargon. Weather → `meteo`, `forecast`, `sky`, `cloud`, `rain`, `climate`, `nimbus`, `breeze`. Crypto → `chain`, `block`, `token`, `ledger`, `hodl`. Tasks → `todo`, `task`, `doit`, `tick`, `check`.
6. **Soft mutations** — drop a vowel (`weathr`), add `r`/`y`/`q` (`climatiq`, `weathery`), swap `s`→`z`. Keep readable.
7. **Two-word merges that read as one** — `weatherit_bot` ✓ (reads cleanly) ; `weather_one_bot` ✗ (two words plus `bot` = visually noisy). Prefer the merge that lets `bot` fuse into the tail.

Generate **~20 candidates** before any network call. More = wasted fetches; fewer = likely all taken.

## Availability check (t.me button inspection)

The truth signal is the main CTA button on `https://t.me/<username>`:

| Button text           | og:title pattern           | Verdict                                                              |
| --------------------- | -------------------------- | -------------------------------------------------------------------- |
| `Start Bot`           | `Telegram: Launch @xxx`    | **taken** — live bot                                                 |
| `View Bot`            | `Telegram: Contact @xxx`   | **taken** — bot without /start handler, still reserved               |
| `Send Message`        | generic "Telegram: Contact" | **free** — username not registered as bot *or* user                  |
| `View Channel` / `View Group` | —                  | **taken by non-bot** (rare for `*bot` suffix, but possible)           |

Additional taken-signals to double-check: presence of avatar image, `tgme_page_description` block, `Subscribe` button.

### Critical caveats (spell these out to the user in the final report)

- **t.me always returns HTTP 200** and shows the boilerplate "If you have Telegram, you can contact @..." page. The boilerplate text says **nothing** about availability — only the button text does.
- **"Free on t.me" ≠ "creatable in BotFather"**. If a bot owner deletes their bot via `/deletebot`, the username often stays **reserved** and BotFather refuses `/newbot` on it. The only ground truth is attempting `/newbot` in [@BotFather](https://t.me/BotFather). Always tell the user to do this final check before committing.
- **Case doesn't matter**. `@WeatherBot` and `@weatherbot` resolve to the same account. Lowercase your candidates before fetching.
- **Rate limits exist**. If you batch too aggressively and start seeing 429s or rate-limit pages, back off and slow the batch.

## Availability check — use the bundled script, not WebFetch

This skill ships with `check-usernames.mjs` in its own directory. **Always use it** for availability checks — do not fall back to WebFetch per-URL.

Why:

- One subprocess invocation returns a compact JSON verdict per username instead of 20+ KB of raw HTML per fetch. Your context stays clean.
- It validates each name locally (length, charset, suffix, leading digit, consecutive/trailing underscores) before fetching, so invalid candidates cost zero requests.
- Parallelism is handled in-process with a bounded worker pool (default 8) — no wall-of-tool-calls.
- Runs on any machine with Node ≥18, Bun, or Deno (all ship a native `fetch`). Zero dependencies. No bash / no Windows `sh` quirks — portable across Claude Code, Cursor, Copilot, and any other agent runtime that can spawn `node`.

### How to invoke

```bash
# Pass candidates as CLI args (preferred for small batches)
node skills/gramio-pick-username/check-usernames.mjs --json \
  weatherbot weatheritbot meteobot kakpogodabot nebobot

# Or pipe from stdin (useful for larger lists)
printf 'weatherbot\nweatheritbot\nmeteobot\n' | \
  node skills/gramio-pick-username/check-usernames.mjs --json

# Tuning knobs
node … --concurrency 4 --timeout 10000 foo_bot bar_bot
```

From inside the user's project, the script lives under whatever path they installed the skills to — usually `./skills/gramio-pick-username/check-usernames.mjs`. Check the cwd before running, and if the script isn't where you expect, fall back to `bun` or copy the script to a known location.

### JSON output schema

The `--json` flag emits an array of result objects:

```json
[
  {
    "username": "weatheritbot",
    "verdict": "free",
    "kind": "unclaimed",
    "button": "Send Message",
    "ogTitle": "Telegram: Contact @weatheritbot",
    "hasAvatar": false,
    "status": 200
  },
  {
    "username": "weatherbot",
    "verdict": "taken",
    "kind": "bot_live",
    "button": "Start Bot",
    "hasAvatar": true,
    "status": 200
  },
  {
    "username": "1foo",
    "verdict": "invalid",
    "reasons": ["MUST_START_WITH_LETTER", "MISSING_BOT_SUFFIX"]
  }
]
```

Verdicts: `free` · `taken` · `invalid` · `rate_limited` · `error` · `unknown`.
Kinds (when `taken`): `bot_live` · `bot_no_start` · `user` · `channel` · `group`.

### Handling non-clean results

- `rate_limited` → back off: reduce `--concurrency` to 2–3, wait ~60s, retry only those names. Do not spam the endpoint.
- `error` → retry once with a higher `--timeout`. If it still fails, mark the name as "unknown, verify manually" in the final report — do not silently treat it as free.
- `unknown` → the HTML didn't match known patterns (rare). Fetch the page manually once via WebFetch to inspect, then update the classifier if you've found a new pattern.

## Final ranking (criteria for the shortlist)

Rank surviving free candidates by:

1. **Length** — prefer ≤16 chars (comfortable inline mention, fits in bio/ads).
2. **Readability in target language** — a native reader should parse it at first glance, no syllable backtracking.
3. **No digits / no underscores** if a clean alternative exists. `weatherit_bot` beats `weather_1_bot`.
4. **`bot` fuses into the word** — `weatheritbot` > `weatheronebot`. Two-word roots + `bot` look like three tokens.
5. **Pronounceable aloud** — useful for podcasts, demos, referrals.
6. **No trademark risk** — flag candidates that collide with a known brand in the topic (e.g. `chatgpt_bot` is a legal minefield).

## Output format

Deliver a compact report the user can act on:

```
Topic: <topic>  ·  Audience: <language/region>

✅ FREE (ranked)
1. @weatheritbot      — 12 chars · reads clean in EN · "it" nod to imperative mood
2. @kakpogodabot      — 11 chars · RU-native · "how's the weather" question form
3. @nebobot           — 6 chars  · RU · "sky" · very short, memorable

⚠️  FREE ON T.ME BUT VERIFY IN BOTFATHER
4. @breezybot         — maybe deleted-and-reserved · try `/newbot` first

❌ TAKEN (checked)
- @weatherbot       (Start Bot)
- @pogodabot        (View Bot)
- @meteobot         (Start Bot)
- ... (condensed list, grouped)

NEXT STEP
Open @BotFather → /newbot → paste "@weatheritbot" when asked for the username.
If BotFather rejects it, try the next one down the list.
```

## Anti-patterns to avoid

- **Don't** judge availability from the "If you have Telegram" boilerplate text — it's identical for free and taken names.
- **Don't** rely on HTTP status codes — they're always 200.
- **Don't** suggest names with consecutive `__`, trailing `_`, or leading digit — BotFather rejects them and you'll have wasted the user's time.
- **Don't** skip the "verify in BotFather" reminder — `t.me` free ≠ creatable.
- **Don't** propose `gpt`/`openai`/`telegram`-prefixed names without flagging the trademark risk.
- **Don't** burn fetches on candidates that fail local validation. Validate, *then* fetch.
- **Don't** over-ask. If the topic is clear, just generate and check — deliver a shortlist, not a questionnaire.

## When to hand off to `/gramio-new-bot`

Once the user picks a name from the shortlist and confirms BotFather accepted it, invoke `/gramio-new-bot <project-name>` to scaffold the project. The bot's `@username` and token from BotFather go into `.env` as `BOT_TOKEN=...`.
