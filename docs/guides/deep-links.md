---
title: Deep links in Telegram bots — every t.me link and where its payload lands

head:
    - - meta
      - name: "description"
        content: "Complete guide to Telegram bot deep links with GramIO: ?start, ?startgroup, ?startchannel, ?startapp, ?startattach, ?game and t.me/share/url — which handler each one reaches, payload encoding rules, and the routing patterns to use."

    - - meta
      - name: "keywords"
        content: "telegram bot, GramIO, deep link, deep links, t.me link, start parameter, start_parameter, startapp, startgroup, startchannel, startattach, referral link, add bot to group, mini app deep link, my_chat_member, ctx.args, base64url, payload, onboarding link, OAuth callback, TypeScript"
---

# Deep Links

A **deep link** is a `https://t.me/…` URL (or `tg://…` URI) that opens Telegram and triggers an action against your bot. Every referral, onboarding flow, OAuth callback, "add me to a group" button, Mini App entry point, and inline-mode auth redirect ultimately goes through one of these.

The catch: there are **eight** bot-related deep-link families, and each one lands in a **different** place in your bot. `/start <args>` is only one of them. Confusing them is the #1 reason "the payload disappears" — for example, `?startapp=foo` does **not** trigger `/start`; it arrives inside the Mini App's `initData` on the frontend.

> Authoritative spec: [core.telegram.org/api/links](https://core.telegram.org/api/links). This page maps every bot-related entry there to its GramIO landing point.
>
> Your AI assistant has this as a canonical reference too — see the [AI Skills guide](/guides/ai-skills) (`references/deep-links.md`).

## TL;DR — link → handler → field

| Link pattern | What it does | Handler | Where the payload lives |
| --- | --- | --- | --- |
| `t.me/<bot>?start=<payload>` | Open PM, send "Start" | [`bot.command("start", …)`](/triggers/command) | `ctx.args` (`string \| null`) |
| `t.me/<bot>?startgroup=<payload>` | Pick a group, add bot **as member** | [`bot.command("start", …)`](/triggers/command) | `ctx.args` — bot receives `/start@bot <payload>` (a `my_chat_member` also fires) |
| `t.me/<bot>?startgroup&admin=<perms>` | Pick a group, add bot **as admin** | `bot.on("my_chat_member", …)` | No payload — read `ctx.newChatMember` rights |
| `t.me/<bot>?startchannel&admin=<perms>` | Pick a channel, add bot **as admin** | `bot.on("my_chat_member", …)` | No payload |
| `t.me/<bot>?startapp=<payload>&mode=<mode>` | Open Main Mini App | Inside the Mini App (frontend) | `Telegram.WebApp.initDataUnsafe.start_param` |
| `t.me/<bot>/<appname>?startapp=<payload>` | Open Direct Mini App `<appname>` | Inside the Mini App (frontend) | `Telegram.WebApp.initDataUnsafe.start_param` |
| `t.me/<bot>?startattach=<payload>&choose=<peers>` | Open the bot's attachment menu | Inside the Mini App (web_app) | `start_param` on the web_app event |
| `t.me/<bot>?game=<short_name>` | Share a Game from the bot | `bot.on("callback_query")` (Play button) | `ctx.gameShortName` on the callback |
| `t.me/share/url?url=…&text=…` | Share-to-chat composer | n/a — UX helper, not a bot update | n/a |
| Inline `start_parameter` (see [inline query](/triggers/inline-query)) | Inline-mode → PM redirect | [`bot.command("start", …)`](/triggers/command) | `ctx.args` — same as `?start=` |

`tg://resolve?domain=<bot>&…` is the URI variant of every `t.me/<bot>?…` link above — same params, same arrival point. Prefer `https://t.me/…` in external links (human-readable, works in browsers); use `tg://` only for in-app contexts where you already know the user has Telegram.

## Payload encoding rules — read this once

These rules apply to **every** `start*` payload (`start=`, `startgroup=`, `startapp=`, `startattach=`):

- **Max 64 characters.**
- **Alphabet: `A-Z a-z 0-9 _ -` only.** This is the base64url alphabet — **no `+`, no `/`, no `=` padding, no `.`, no spaces.** Standard base64 will break the link.
- **Case-sensitive.**
- **Treat it as untrusted user input.** The payload is visible in plain text in the URL; users can edit it. Never put secrets in it — use opaque tokens that index into server-side state.
- **Cold-open caveat.** On some clients (notably Telegram Desktop), a user who already started the bot may receive `/start` *without* the payload after tapping a deep link a second time. Make the payload **idempotent** and gracefully degrade when it's missing.

### Encoding patterns

| What you want to pass | Pattern | Notes |
| --- | --- | --- |
| A single ID | `?start=ref_12345` (prefix + value) | Prefixes namespace the handler — `ref_`, `order_`, `inv_` |
| A short string | `?start=login-inline` | Plain string — kebab-case fits the alphabet |
| A structured object | base64url-encoded JSON, then a prefix | `tok_eyJ1IjoxfQ` — decode + `JSON.parse` on the bot side |
| Anything secret | **server-side token** | Store the real payload server-side; pass only an opaque ID |

Use `Buffer.from(json).toString("base64url")` (Node 16+ / Bun / Deno) to produce a valid `[A-Za-z0-9_-]` string with no padding:

```ts
const token = Buffer.from(JSON.stringify({ u: 1, t: "abc" })).toString("base64url");
const link = `https://t.me/${bot.info.username}?start=tok_${token}`;
```

## 1. `/start` deep links — `?start=`

The classic deep link. Opens the bot's PM, shows a **Start** button, and sends `/start <payload>` to the bot.

```ts
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string).command("start", (ctx) => {
    const payload = ctx.args; // string | null — null when opened without payload

    if (!payload) return ctx.send("Welcome!");

    // Prefix-based routing — longest/most-specific prefix first.
    if (payload.startsWith("ref_")) return handleReferral(ctx, payload.slice(4));
    if (payload.startsWith("order_")) return handleOrderJump(ctx, payload.slice(6));
    if (payload.startsWith("tok_")) return exchangeAuthToken(ctx, payload.slice(4));
    if (payload === "login-inline") return startAuthFlow(ctx);

    // Unknown payload — be graceful. Don't echo the raw value back.
    return ctx.send("Welcome! Couldn't recognise that link, but you're in.");
});
```

`ctx.args` on the `start` command is `string | null` and contains **only** the part after `/start ` (the leading slash and command name are stripped). See [`command`](/triggers/command) for the full trigger reference.

### Generating the link

```ts
const link = `https://t.me/${bot.info.username}?start=${encodeURIComponent(payload)}`;
```

### Common uses

- **Referrals** — `?start=ref_12345` tracks who invited whom. Persist `referrer = 12345` against the new user before any other logic.
- **Context jumps from outside** — `?start=order_987` jumps a user from an email/website straight to a specific order. Render the order; don't dump them on the `/start` home screen.
- **OAuth callback** — an external service redirects to `t.me/<bot>?start=<short-lived-token>`; the bot exchanges the **single-use, minutes-expiry** token server-side and links the account.
- **Inline-mode → PM auth redirect** — see *§5 — Inline-mode redirect button* below.

## 2. Group / channel deep links — `?startgroup=` and `?startchannel=`

`?startgroup=` opens a chat picker so the user can add the bot to a group; `?startchannel` does the same for channels.

```text
https://t.me/<bot>?startgroup=<payload>                       # add as member, carries a payload
https://t.me/<bot>?startgroup=<payload>&admin=<permissions>   # add as admin
https://t.me/<bot>?startchannel&admin=<permissions>           # channels: admin only
```

There are **two distinct flows**, and they reach your bot differently.

### Plain `?startgroup=<payload>` — arrives as a `/start` message

When a user adds your bot via `?startgroup=spaceship` (no `admin=`), the bot is added as a member and **does receive a message** — per the [Bot API](https://core.telegram.org/bots/features#deep-linking), *"the resulting update will contain text in the form: `/start@your_bot spaceship`"*. So your existing `/start` handler fires, with the payload in `ctx.args`:

```ts
bot.command("start", (ctx) => {
    const payload = ctx.args; // "spaceship" — works in groups too (/start@bot spaceship)
    if (ctx.chat.type !== "private" && payload) {
        // user just added the bot to this group via a ?startgroup=<payload> link
    }
});
```

A `my_chat_member` update (status `left` → `member`) **also** fires for the membership change — use whichever fits.

### `admin=` flow — confirm via `my_chat_member`

When the link carries `admin=` (`?startgroup&admin=…` or `?startchannel&admin=…`), the bot is added **as an administrator** with the requested rights. There's no payload field on this flow — use `my_chat_member` to confirm the add and **verify which rights you actually got** (`admin=` is a request; the user can untick boxes — see below). Encode any context **when you generate the link** and store it against the user's session.

### The `admin=` combo — a request, not a grant

`admin=` lists the rights you *want*. The user can untick boxes in the confirmation dialog, so **always verify what you actually got**. Tokens combine with `+`: `admin=post_messages+edit_messages+delete_messages`. Each maps to a `ChatAdministratorRights` field (`post_messages` → `can_post_messages`, `delete_messages` → `can_delete_messages`, `manage_chat` → `can_manage_chat`, and so on).

### Verifying rights on arrival

```ts
bot.on("my_chat_member", (ctx) => {
    const me = ctx.newChatMember;

    if (me.status !== "administrator") {
        return ctx.send(
            "I need to be an admin here to post on your behalf. " +
                "Please promote me with the 'post messages' permission."
        );
    }
    if (!me.canPostMessages?.()) {
        return ctx.send("Almost there — please also grant me 'post messages'.");
    }
    return ctx.send("All set! I'll post here when there are updates.");
});
```

> `bot.on("my_chat_member", …)` needs no special opt-in — it's in Telegram's default `allowed_updates`. The closely-named `chat_member` update (for *other* users' membership changes) is opt-in — see [Updates](/updates/overview).

### Generating the link

```ts
const perms = ["post_messages", "edit_messages", "delete_messages"].join("+");
const link = `https://t.me/${bot.info.username}?startchannel&admin=${perms}`;
```

## 3. Mini App deep links — `?startapp=`

**Main Mini App** (one per bot): `https://t.me/<bot>?startapp=<payload>&mode=<compact|fullscreen>`
**Direct Mini App** (named): `https://t.me/<bot>/<short_name>?startapp=<payload>`

### The payload arrives on the frontend, not as `/start`

It lands **inside the Mini App's `initData`**:

```ts
// Inside your Mini App (React/Vue/etc.), after the SDK has loaded:
const startParam: string | undefined = Telegram.WebApp.initDataUnsafe.start_param;
```

Your bot's TypeScript never sees `start_param` unless the Mini App posts it back (via `Telegram.WebApp.sendData(...)` or a fetch to your backend). If the bot must react server-side, send the payload from the Mini App yourself — typically alongside the `initData` validation request. See the [Mini Apps guide](/tma/overview) for the auth round-trip.

### Generating the link

```ts
// Main app, full-screen
`https://t.me/${bot.info.username}?startapp=${payload}&mode=fullscreen`;
// Direct app named "checkout"
`https://t.me/${bot.info.username}/checkout?startapp=${payload}`;
```

## 4. Attachment-menu deep links — `?startattach=`

Opens the bot's **attachment menu** entry (the paperclip). The bot must have an approved attachment menu — a curated surface most bots don't have.

```text
https://t.me/<bot>?startattach=<payload>
https://t.me/<chat_username>?attach=<bot>&startattach=<payload>
https://t.me/<bot>?startattach=<payload>&choose=users+bots+groups+channels
```

`choose=` constrains the picker (`users`, `bots`, `groups`, `channels`, combined with `+`). The payload lands in the same place as `startapp` — `Telegram.WebApp.initDataUnsafe.start_param` — with the same 64-char / base64url constraints.

## 5. Inline-mode redirect button — `start_parameter`

When an inline query needs auth/setup the bot can't do inline, return an **empty** results array and a top `button` with `start_parameter`. The button sits above the empty results panel; tapping it opens the bot's PM with `/start <param>`.

```ts
bot.inlineQuery(async (ctx) => {
    if (!(await isAuthenticated(ctx.from.id))) {
        return ctx.answer([], {
            cache_time: 0,
            is_personal: true,
            button: {
                text: "Log in to search",
                start_parameter: "login-inline", // routes to /start login-inline
            },
        });
    }
    // ...normal results once authenticated
});

bot.command("start", (ctx) => {
    if (ctx.args === "login-inline") return startAuthFlow(ctx);
});
```

`InlineQueryResultsButton` is a discriminated union — provide **exactly one** of `start_parameter` (deep-link to PM) or `web_app` (launch a Mini App). Full details in [inline query](/triggers/inline-query).

## 6. Game deep links — `?game=`

Mostly used internally by Telegram to render Game messages. As a bot you'll more often *receive* a callback for an existing Game (the Play button) than mint these URLs:

```ts
bot.on("callback_query", (ctx) => {
    if (ctx.gameShortName) {
        return ctx.answer({ url: `https://game.example.com/?u=${ctx.from.id}` });
    }
});
```

Mint the link to share a Game from outside Telegram: `https://t.me/<bot>?game=<short_name>`.

## 7. Share-to-chat helper — `t.me/share/url`

Not a bot update — a UX helper for sharing something *out of* the bot. Wrap it in an inline-keyboard URL button:

```ts
import { InlineKeyboard } from "gramio";

const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(itemUrl)}&text=${encodeURIComponent("Check this out")}`;

const kb = new InlineKeyboard().url("📤 Share", shareUrl);
```

Both `url` and `text` should be `encodeURIComponent`-encoded; `text` is optional.

## 8. Login widget — `t.me/login/<code>`

The [Telegram Login Widget](https://core.telegram.org/widgets/login) flow. Your bot is never the receiver — the widget posts auth data back to your **website** via JS callback or redirect. Listed for completeness; not handled in bot code.

## Opening these links from inside a Mini App

If your Mini App needs to *open* one of these `t.me/…` links programmatically — send the user to a chat, add the bot to a group, jump into another Mini App — use **`Telegram.WebApp.openTelegramLink(url)`**, **not** `openLink(url)`:

- **`openTelegramLink(url)`** handles `https://t.me/…` links **natively inside Telegram** (opens a chat, runs a deep link, the add-to-group picker, launches another Mini App). Since **Bot API 7.0** the Mini App stays open; before 7.0 it was closed after the call.
- **`openLink(url[, { try_instant_view }])`** is for **external** `http(s)` links — it opens them in the in-app/external browser and never closes the Mini App. Passing a `t.me/…` URL here is the wrong tool: it routes a Telegram link through a browser tab that then has to bounce back into Telegram.

```ts
// Inside the Mini App (frontend) — open a t.me link the right way
const url = `https://t.me/${botUsername}?startgroup=onboarding&admin=post_messages`;

Telegram.WebApp.openTelegramLink(url); // ✅ stays in Telegram, native handling

// ❌ wrong — opens the t.me link in a browser, then bounces back into Telegram
// Telegram.WebApp.openLink(url);

// openLink is for genuinely external URLs:
Telegram.WebApp.openLink("https://example.com/docs", { try_instant_view: true });
```

> `openLink` must be called in **response to a user gesture** (a tap inside the Mini App). Prefer `https://t.me/…` URLs with `openTelegramLink` — the `tg://` scheme isn't its input.

## Footguns

- **`startapp` ≠ `/start`.** Mini App payloads arrive on the **frontend** via `initDataUnsafe.start_param`. `bot.command("start", …)` will never see them.
- **From a Mini App, open `t.me/…` links with `openTelegramLink`, not `openLink`.** `openLink` is for external URLs and shoves Telegram links through a browser. (Bot API 7.0+ keeps the Mini App open on `openTelegramLink`; earlier versions closed it.)
- **`startgroup` has two flows.** Plain `?startgroup=<payload>` arrives as a `/start@bot <payload>` message (payload in `ctx.args`). But the **`admin=` variant** (`?startgroup&admin=…`, `?startchannel&admin=…`) adds the bot as admin with no `/start` message and no payload — detect it via `my_chat_member` and encode any context in the link itself.
- **`admin=` is a request, not a grant.** Always verify with `ctx.newChatMember.canPostMessages?.()` etc. — users routinely untick permissions.
- **Payload is plaintext in the URL.** Never put auth tokens, emails, or sensitive IDs in it. Use opaque server-side tokens.
- **`+` / `/` in standard base64 silently break the link.** Use the `base64url` variant. The link won't 404 — it'll just *drop* the parameter.
- **64-char limit is real.** Long JWTs won't fit. Pass a short opaque ID and look the JWT up server-side.

## See also

- [`command`](/triggers/command) — handling `/start` and `ctx.args`.
- [`inline query`](/triggers/inline-query) — the `start_parameter` redirect button.
- [Mini Apps](/tma/overview) — how `start_param` round-trips to your backend.
- [Inline Keyboard](/keyboards/inline-keyboard) — `.url(...)` for rendering these links as buttons.
- [Updates](/updates/overview) — `allowed_updates`, `chat_member` vs `my_chat_member`.
- Telegram spec: [core.telegram.org/api/links](https://core.telegram.org/api/links).
