---
name: ux-patterns
description: Best-practice UX patterns for Telegram bots — button-first navigation, /start anatomy, nested menus, toggle buttons, destructive confirmations, loading and empty states, formatting hierarchy, command discovery, deep links. Focus is "what to render, when, and why" — not keyboard/formatting API (see keyboards.md, formatting.md).
---

# UX Patterns

This reference is about **product** decisions, not API surface. The `keyboards.md` and `formatting.md` files cover *how* to build a keyboard or entity; this file covers *what* to build and *why*. Working example: [`examples/ux-menu.ts`](../examples/ux-menu.ts).

## The one rule that drives everything else

> **Telegram users prefer tapping buttons to typing commands.** Commands are for *discovery* (BotFather menu, deep links) — navigation belongs to buttons.

Every pattern below follows from this: if a flow can be a button, make it a button. If the same button can edit the current message instead of sending a new one, edit it. If a user can reach a dead end, add a back button.

---

## 1. Button-first navigation

**Bad:** `/start` sends a wall of text ending with "type /help for help, /settings to configure, /delete to delete your account."

**Good:** `/start` sends a short hero + an inline keyboard whose buttons take the user exactly where those commands would have.

Why:
- Discoverability. Users don't read `/help` — they tap tiles.
- Fewer typos, fewer `@botname` collisions in groups.
- Works identically on mobile (where typing is expensive) and desktop.

Commands still exist — you register them with `setMyCommands` so Telegram's **menu** button shows them as shortcuts (see §10). But the *primary* UI is buttons.

---

## 2. Anatomy of a great `/start`

A well-composed `/start` is three things stacked:

```text
<BOLD HERO TITLE>                ← 1 line, what the bot is
<blockquote short pitch>         ← 2-3 lines of plain-English value
<italic tip or meta>             ← 1 line, optional (e.g., "v2.1 · beta")

[ primary action ] [ secondary ]
[      tertiary wide button    ]
```

Concretely (from [`examples/ux-menu.ts`](../examples/ux-menu.ts)):

```typescript
import { bold, italic, blockquote, format, InlineKeyboard } from "gramio";

const hero = format`${bold`🤖 GramIO Demo Bot`}

${blockquote`Button-first bot — every screen fits in one edited message. Tap a tile below to navigate; the message rewrites in place.`}

${italic`Tip: nothing here types commands — it all clicks.`}`;

const kb = new InlineKeyboard()
    .text("⚙️ Settings", nav.pack({ to: "settings" }))
    .text("📊 Stats",    nav.pack({ to: "stats" }))
    .row()
    .text("❓ Help",     nav.pack({ to: "help" }));

bot.command("start", (ctx) => ctx.send(hero, { reply_markup: kb }));
```

Rules:

- **No walls of text.** If the user scrolls on mobile, rewrite.
- **No "Welcome!" on its own line.** The title already welcomes.
- **Keep primary actions above the fold.** On mobile, that means ≤ 4 rows of buttons before they start scrolling.
- **Don't list every feature.** `/start` is a homepage, not a sitemap.

---

## 3. Edit in place, don't spam new messages

When a user navigates inside the bot, **one message lives and gets rewritten** via `editMessageText` / `editMessageCaption` / `editMessageMedia`. New messages are for *events* (notifications, results, errors) — not for navigation.

```typescript
bot.callbackQuery(nav, async (ctx) => {
    await ctx.answer();
    return ctx.editText("📜 History", { reply_markup: backKb });
    // NOT ctx.send(...) — that would push the old menu up and clutter the chat
});
```

Why:
- Chat stays clean — the bot feels like an app, not a chatbot.
- User's scroll position is preserved.
- "Where am I" is always the **bottom** of the chat.

When to break the rule: action results the user wants to keep as history (order confirmation, receipt, payment success). Those are events, send new.

If you find yourself duplicating the same message body between `ctx.send(...)` and `ctx.editText(...)` call sites, graduate to `@gramio/views` — its `context.render(view, params)` auto-detects send vs. edit. See [views](../plugins/views.md).

---

## 4. Nested menus — breadcrumbs, Back, Home

Any menu more than one level deep needs three things in the text, keyboard, and handler respectively:

1. **Breadcrumb in the text** — `⚙️ Settings · home › settings` so the user knows where they are.
2. **"◀ Back" button** in the last row — one level up.
3. **"🏠 Home" button** on screens deeper than two levels — escape hatch.

```typescript
const text = format`${bold`⚙️ Settings`} ${italic`· home › settings`}

${blockquote`Toggle a row to flip the value.`}`;

const kb = new InlineKeyboard()
    // … setting rows …
    .row()
    .text("◀ Back", nav.pack({ to: "home" }));
```

Anti-patterns:

- **Dead ends.** Every non-home screen must expose a way back without typing a command.
- **Inconsistent back targets.** "◀ Back" from `/help` and "◀ Back" from `settings/notifications` mean different things — the label is the same but the `callback_data` is different and specific.
- **No "Home".** If a user has drilled three levels deep, don't make them tap Back three times.

---

## 5. Toggle buttons — label is the state

A toggle button's **label** shows whether the setting is on. One tap flips the field and re-renders the same screen; the visible label change *is* the feedback.

```typescript
function toggleLabel(on: boolean, label: string) {
    return `${on ? "✅" : "⬜"} ${label}`;
}

// in the keyboard:
.text(toggleLabel(session.notifications, "Notifications"),
      toggle.pack({ key: "notifications" }))
```

Pattern:

| UI | Meaning |
|---|---|
| `✅ Notifications` | On — tap to turn off |
| `⬜ Notifications` | Off — tap to turn on |
| `🔒 Premium only` | Disabled — tap answers with explanation |

**One handler per *schema*, not per field.** Share a `CallbackData("toggle").enum("key", […])` across all toggles on a screen; the handler flips `session[key]` and rerenders. This is how [`ux-menu.ts`](../examples/ux-menu.ts) handles Notifications and Quiet Hours with one handler.

**Don't mix toggles with destination buttons in the same row.** Visually confusing — the user can't tell "this navigates" from "this flips a setting" at a glance.

---

## 6. Destructive actions — always confirm

Never wire "Delete account", "Clear data", "Leave channel" to a single click. Pattern:

1. Settings shows a **red** "🗑 Delete account" button (`style: "danger"`).
2. Tapping it **edits** the current screen into a confirmation view.
3. The confirm screen has two buttons: safe default first, destructive second.

```typescript
const kb = new InlineKeyboard()
    .text("🗑 Delete account", nav.pack({ to: "account.confirmDelete" }),
          { style: "danger" });

// confirm screen:
const confirmKb = new InlineKeyboard()
    .text("❌ Cancel",       nav.pack({ to: "settings" }))
    .text("💥 Yes, delete",  nav.pack({ to: "account.doDelete" }),
          { style: "danger" });
```

Rules:

- **Safe action first** (left) — default position for accidental taps.
- **Destructive action styled** (`style: "danger"`, requires `@gramio/keyboards` ≥ 1.3.0).
- **Re-state the impact** in the confirm text: "All data will be erased. This cannot be undone."
- **Never confirm with `alert`** — alerts block the whole client, are limited to 200 chars, and can't show buttons. Use an edited screen.

---

## 7. `ctx.answer()` on every callback — always

Telegram shows a loading spinner on any inline button until the bot calls `answerCallbackQuery`. If you forget, the spinner hangs for ~15 seconds. Worse, users think the button is broken.

```typescript
bot.callbackQuery(nav, async (ctx) => {
    await ctx.answer();        // ← first thing. Empty answer is fine.
    // … do work, edit message, etc.
});
```

**Three forms:**

| Form | UI | Use for |
|---|---|---|
| `ctx.answer()` | Spinner stops, nothing visible | Navigation (the edited message is the feedback) |
| `ctx.answer("Saved")` | Small toast at top of screen (~5s) | Quick confirmations, field-level feedback |
| `ctx.answer({ text: "…", show_alert: true })` | Modal dialog with OK button | Errors, warnings, required acknowledgement |

Don't use `show_alert` for routine feedback — it's interruptive. Don't use a toast for errors the user must act on — they'll miss it.

For handlers that definitely need a toast, prefer [`@gramio/auto-answer-callback-query`](../plugins/other.md) — it answers empty for you so you never forget.

---

## 8. Loading / progress / optimistic UI

If an action takes more than ~300ms (API call, DB write, LLM response), **give feedback immediately**:

```typescript
bot.callbackQuery(search, async (ctx) => {
    await ctx.answer();
    await ctx.editText("⏳ Searching…");         // instant placeholder
    const results = await doExpensiveSearch();    // might take seconds
    return ctx.editText(formatResults(results)); // final state
});
```

For background work spanning many seconds, edit the placeholder repeatedly with progress (`⏳ 3 / 10 pages`). Telegram rate-limits edits to about 1/sec per message — coarse updates (every ~2s), not per-event spam.

---

## 9. Empty states

A blank list is an anti-pattern. Replace it with an **empty state**: a friendly explanation + a clear CTA.

```typescript
const text = format`${bold`📊 Stats`}

${blockquote`You don't have any activity yet — this is where a real bot would show a populated view.`}`;

const kb = new InlineKeyboard()
    .text("➕ Create your first entry", "stats.create")
    .row()
    .text("◀ Back", nav.pack({ to: "home" }));
```

Rule of thumb:

- **First-time empty state** — explain what will appear here once data exists, offer the action to create the first item.
- **Filtered-to-empty state** — "No results for `foo`. [🔄 Clear filters]"
- **Just-deleted-last-item state** — "All done! [➕ Add another]"

---

## 10. Command discovery — `setMyCommands` and menu button

Register commands once on startup so they appear in Telegram's native `/` menu and the chat-input menu button:

```typescript
bot.onStart(async ({ bot }) => {
    await bot.api.setMyCommands({
        commands: [
            { command: "start",    description: "Open main menu" },
            { command: "settings", description: "Open settings" },
            { command: "help",     description: "How this bot works" },
        ],
    });
});
```

Guidelines:

- **Keep the list short** (≤ 5 commands). This is a *shortcut*, not a sitemap.
- **Every listed command must also be reachable by buttons.** Commands are a backup navigation, not the only way.
- **Localize commands** with `language_code` if the bot is multilingual.
- **Scope** with `scope: { type: "chat_administrators" }` etc. to show admin-only commands only to admins.

For Mini Apps, replace the default menu button with `bot.api.setChatMenuButton({ menu_button: { type: "web_app", text: "…", web_app: { url } } })` — see [tma.md](./tma.md).

---

## 11. Reply keyboards vs. inline keyboards

| | Reply keyboard | Inline keyboard |
|---|---|---|
| Attached to | Chat input area | A specific message |
| Persists | Until replaced / removed | Until the message is deleted |
| Button press | Sends the label as a new user message | Fires a `callback_query` |
| Best for | Persistent *main navigation* (2–4 tiles) in simple bots | **Everything else** — menus, actions, toggles, pagination |

**When to use reply keyboards:**

- Simple utility bots (calculator, currency, 1-step lookup).
- A persistent "Home / Shop / Profile" bottom bar (pair with `.persistent(true).resized(true)`).
- Non-text requests (`requestContact`, `requestLocation`, `requestUsers`, `webApp`) — these don't exist for inline keyboards in the same form.

**When to use inline keyboards:**

- Any nested menu, any editable screen, any flow with more than one step.
- Anywhere you want to edit the message later (reply keyboards can't do that).

Mixing is fine: a persistent reply keyboard for the main nav, inline keyboards *inside* each screen. Just don't make the user switch mental models mid-flow.

---

## 12. Formatting hierarchy — bold title, blockquote context, italic meta

Every screen has at most three text zones:

```
<bold title>                 ← 1 line, what this screen is
<blockquote description>     ← 1-3 lines, why you're here / what to do
<italic metadata>            ← optional: state, timestamps, IDs
```

```typescript
format`${bold`⚙️ Settings`} ${italic`· home › settings`}

${blockquote`Toggle a row to flip the value.`}`
```

Tactics:

- **`bold`** for the title only. Bolding every second word = nothing is bold.
- **`blockquote`** for descriptive context. It renders as a left-bar block — users' eyes jump to it.
- **`expandableBlockquote`** for long disclosures (terms, error details) users *might* want to read.
- **`italic`** for secondary metadata — state badges, dates, "v2.1".
- **`code` / `pre`** for literal values (IDs, tokens, URLs the user might copy). Combine with a `.copy()` button for best UX.
- **`link`** only for external URLs. Internal navigation = buttons, not links.
- **`spoiler`** for intentionally-hidden content (puzzle answers, NSFW) — *not* as a styling trick.

And the formatting footguns (full rules in [formatting.md](./formatting.md)):

- Never `parse_mode: "HTML"` with `format`. Never.
- Never native `Array.prototype.join()` on Formattables — use the `join` helper.
- Never `.toString()` on a `FormattableString` — pass it directly to `send` / `editText`.
- Always wrap reused Formattables in outer `format\`\`` — plain template interpolation strips entities.

---

## 13. Button label discipline

- **Short.** ≤ ~20 characters. Mobile truncates long labels mid-word.
- **Consistent emoji system.** Pick one convention and stick with it:
  - `⚙️` settings · `📊` stats · `❓` help · `🏠` home · `◀` back
  - `✅` / `⬜` toggles · `🗑` / `💥` destructive · `❌` cancel
  - `➕` create · `🔄` refresh · `💾` save · `📋` copy
- **Sentence case or title case — pick one.** "Open settings" or "Open Settings", not "open settings" or "OPEN SETTINGS".
- **Verbs, not nouns,** for action buttons: "Delete account", not "Account". Exception: navigation tiles ("Settings", "Stats") where the noun *is* the destination.

Layout:

- Max **2–3 buttons per row** for labels > 10 chars, or **4** for short ones ("◀", "▶", page numbers).
- **Primary above secondary.** The button you expect users to tap goes on row 1.
- **`.columns(N)` for grids**, `.pattern([1, 2, 1])` for asymmetric layouts — never compute rows by hand with `.row()` spam.

---

## 14. Deep links — onboarding and cross-chat continuity

`/start <param>` is how you link directly to an in-bot screen from outside Telegram — a website, an email, another bot, or an inline-query button.

```typescript
bot.command("start", (ctx) => {
    if (ctx.args === "login-inline") return handleAuthRedirect(ctx);
    if (ctx.args?.startsWith("ref_")) return handleReferral(ctx, ctx.args.slice(4));
    return ctx.send(heroText(), { reply_markup: mainKeyboard() });
});
```

Link format: `https://t.me/<bot_username>?start=<param>` (64 chars max, `[A-Za-z0-9_-]`).

Common uses:

- **Auth redirect from inline mode** — inline query returns an empty result + a `button` with `start_parameter`; the user lands in PM with `/start login-inline` and you kick off auth. See [triggers.md](./triggers.md) → inlineQuery.
- **Referrals** — `?start=ref_12345` tracks who invited whom.
- **Context jumps** — `?start=order_987` jumps straight to a specific order screen.
- **OAuth callbacks** — the external service redirects to `t.me/<bot>?start=<token>` after login; the bot exchanges the token.

---

## 15. Silent and reply behavior

- `disable_notification: true` — send as silent (no push). Right for periodic updates, daily digests, "here's your number".
- `protect_content: true` — prevents forwarding and copying. Right for sensitive content (OTPs, receipts).
- `reply_parameters: { message_id }` — reply to a specific message. Use when the response wouldn't make sense without the context message right above it; don't use "for aesthetics" in 1-on-1 chats.
- `parse_mode` — **don't**. You're using `format``. See §12.

---

## 16. Groups vs. private chats

If the bot works in groups, a few patterns flip:

- **Mention yourself in replies** or use `reply_parameters` — otherwise users don't know which message the bot answered.
- **Respect privacy mode.** By default, bots only see commands and @mentions in groups. If the bot should see all messages, disable privacy with `/setprivacy` in BotFather — but only if you actually need it.
- **Don't edit messages users didn't interact with.** Edits in groups are visible to everyone; only edit the message tied to the current user's callback.
- **Be quieter.** Use `disable_notification` liberally in groups.
- **`selective: true`** on reply keyboards/`RemoveKeyboard` to target one user only.

---

## Checklist — before you ship

Before declaring a bot done, walk this list:

- [ ] `/start` is a hero + buttons, not a wall of text.
- [ ] Every non-home screen has a **Back** button.
- [ ] Every screen more than 2 levels deep has a **Home** button.
- [ ] Every callback handler calls `ctx.answer()` as its first line.
- [ ] Every navigation edits the message; no new sends for nav.
- [ ] Toggle buttons show `✅` / `⬜` in the label.
- [ ] Destructive actions route through a confirm screen with a safe default.
- [ ] Empty states have a friendly message and a CTA.
- [ ] Long operations show a `⏳` placeholder immediately.
- [ ] `setMyCommands` is called on startup; the list is short and every command is reachable by buttons too.
- [ ] No `parse_mode`. No native `.join()` on Formattables. No `.toString()` on FormattableStrings.
- [ ] Button labels are ≤ 20 chars and use a consistent emoji system.
- [ ] For group bots: privacy mode is the right setting; replies use `reply_parameters` when needed.

Working example of most of this in one file: [`examples/ux-menu.ts`](../examples/ux-menu.ts).
