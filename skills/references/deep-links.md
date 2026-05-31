---
title: Deep links — how every t.me/bot link arrives at your bot
description: Complete reference for bot-related Telegram deep links — ?start, ?startgroup, ?startchannel, ?startapp, ?startattach, ?game, t.me/share/url — with the exact handler/context each one lands in, payload rules, and the routing pattern to use.
---

# Deep Links

A **deep link** is a `https://t.me/...` URL (or `tg://...` URI) that opens Telegram and triggers an action against your bot. Every onboarding flow, OAuth callback, referral, "add me to a group" button, Mini App entry point, and inline-mode auth redirect ultimately goes through one of these.

There are **eight** bot-related deep-link families, and each one lands in a **different** place in your bot — `/start <args>` is only one of them. Confusing them is the #1 reason "the payload disappears": e.g. `?startapp=foo` does **not** trigger `/start` — it arrives inside `WebAppInitData`. Use the table below as your routing map.

> Authoritative spec: [core.telegram.org/api/links](https://core.telegram.org/api/links). This page maps every bot-related entry from there to its GramIO landing point.

## TL;DR — link → handler → field

| Link pattern                                         | What it does                       | Handler                                      | Where the payload lives                             |
| ---------------------------------------------------- | ---------------------------------- | -------------------------------------------- | --------------------------------------------------- |
| `t.me/<bot>?start=<payload>`                         | Open PM, send "Start"              | `bot.command("start", …)`                    | `ctx.args` (string \| null)                         |
| `t.me/<bot>?startgroup=<payload>`                    | Add bot to a group **as member**   | `bot.command("start", …)`                    | `ctx.args` — bot gets `/start@bot <payload>` (+ a `my_chat_member`) |
| `t.me/<bot>?startgroup&admin=<perms>`                | Add bot to a group **as admin**    | `bot.on("my_chat_member", …)`                | No payload. Read `ctx.newChatMember`                |
| `t.me/<bot>?startchannel&admin=<perms>`              | Add bot to a channel **as admin**  | `bot.on("my_chat_member", …)`                | No payload                                          |
| `t.me/<bot>?startapp=<payload>&mode=<mode>`          | Open Main Mini App                 | Inside the Mini App (frontend)               | `Telegram.WebApp.initDataUnsafe.start_param`        |
| `t.me/<bot>/<appname>?startapp=<payload>`            | Open Direct Mini App `<appname>`   | Inside the Mini App (frontend)               | `Telegram.WebApp.initDataUnsafe.start_param`        |
| `t.me/<bot>?startattach=<payload>&choose=<peers>`    | Open the bot's attachment menu     | Inside the Mini App (web_app), or after pick | `start_param` on the web_app event                  |
| `t.me/<user>?attach=<bot>&startattach=<payload>`     | Open attach menu pre-targeted      | Same as above                                | Same as above                                       |
| `t.me/<bot>?game=<short_name>`                       | Share a Game from the bot          | `bot.on("callback_query")` (Play button)     | `ctx.gameShortName` on the callback                 |
| `t.me/share/url?url=…&text=…`                        | Share-to-chat composer             | n/a — UX helper, not a bot update            | n/a                                                 |
| Inline `start_parameter` (see [triggers](./triggers.md)) | Inline-mode → PM redirect      | `bot.command("start", …)`                    | `ctx.args` — same as `?start=`                      |

`tg://resolve?domain=<bot>&...` is the deep-link variant of every `t.me/<bot>?...` URL above. Same params, same arrival point. Prefer `https://t.me/...` in external links (the URL is human-readable and works in browsers); `tg://` is for in-app contexts where you already know the user has Telegram.

## Payload encoding rules — read this once

These rules apply to **every** `start*` payload (`start=`, `startgroup=`, `startapp=`, `startattach=`):

- **Max 64 characters.**
- **Alphabet: `A-Z a-z 0-9 _ -` only.** This is the base64url alphabet — **no `+`, no `/`, no `=` padding, no `.`, no dot, no spaces.** Standard base64 will break — always use base64url and strip `=` padding.
- **Case-sensitive.**
- **Treat as untrusted user input.** A payload is visible in plain text in the URL bar; users can edit it. Never put secrets in it. Use opaque tokens that index into server-side state instead.
- **Cold-open caveat.** On some clients (notably Telegram Desktop), a user who already has the bot open may receive `/start` *without* the payload after tapping a deep link a second time. Make the payload **idempotent** — re-running the link should be safe — and don't rely on the payload being present every single time. If state matters, look it up by the user, not by the payload.

### Encoding patterns

| What you want to pass             | Pattern                                   | Notes                                                                |
| --------------------------------- | ----------------------------------------- | -------------------------------------------------------------------- |
| A single ID                       | `?start=ref_12345` (prefix + value)       | Prefixes namespace the handler — `ref_`, `order_`, `inv_`            |
| A short string                    | `?start=login-inline`                     | Plain string — kebab-case fits the alphabet                          |
| A structured object               | base64url-encoded JSON, then prefix       | `tok_eyJ1IjoxLCJ0IjoiYWJjIn0` — decode + JSON.parse on the bot side  |
| Anything secret                   | **server-side token**                     | Store the real payload server-side; pass only an opaque ID           |

Use `Buffer.from(json).toString("base64url")` (Node 16+ / Bun / Deno) to produce a valid `[A-Za-z0-9_-]` string with no padding.

## 1. `/start` deep links — `?start=`

The classic deep link. Opens the bot's PM, shows a **Start** button (or invokes "Restart" if the user already started the bot), and sends `/start <payload>` to the bot.

```typescript
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string).command("start", (ctx) => {
    const payload = ctx.args; // string | null — null when opened without payload

    if (!payload) return ctx.send("Welcome!");

    // Prefix-based routing — read left to right, longest prefix first.
    if (payload.startsWith("ref_")) return handleReferral(ctx, payload.slice(4));
    if (payload.startsWith("order_")) return handleOrderJump(ctx, payload.slice(6));
    if (payload.startsWith("tok_")) return exchangeAuthToken(ctx, payload.slice(4));
    if (payload === "login-inline") return startAuthFlow(ctx);

    // Unknown payload — be graceful. Don't echo the raw value.
    return ctx.send("Welcome! Couldn't recognise that link, but you're in.");
});
```

`ctx.args` is `string | null` on the `start` command (unlike `RegExp` commands where it's `RegExpMatchArray | null` — see [triggers](./triggers.md)). It contains **only** the part after `/start `; the leading slash and the command name are stripped.

### Generating the link

```typescript
const link = `https://t.me/${bot.info.username}?start=${encodeURIComponent(payload)}`;
```

`encodeURIComponent` is defensive — your payload should already only contain `[A-Za-z0-9_-]`, but encoding is the right habit when constructing URLs.

### Common uses

- **Referrals** — `?start=ref_12345` tracks who invited whom. Persist `referrer = 12345` against the new user in your DB before any other logic runs.
- **Context jumps from outside** — `?start=order_987` jumps a user from an email/website straight to a specific order screen. Render the order; don't dump them on `/start` home.
- **OAuth callback from an external service** — the external service redirects to `t.me/<bot>?start=<short-lived-token>`; the bot exchanges the token server-side and links the account. The token must be **single-use** and expire in minutes.
- **Inline-mode → PM auth redirect** — see [triggers](./triggers.md) → `InlineQueryResultsButton.start_parameter`. The button lands the user in PM with `/start <param>`.

## 2. Group / channel deep links — `?startgroup=` and `?startchannel=`

`?startgroup=` opens a chat picker so the user can add the bot to a group; `?startchannel` does the same for channels.

```text
https://t.me/<bot>?startgroup=<payload>                       # add as member, carries a payload
https://t.me/<bot>?startgroup=<payload>&admin=<permissions>   # add as admin
https://t.me/<bot>?startchannel&admin=<permissions>           # channels: admin only
```

There are **two distinct flows** — plain `?startgroup=<payload>` and the `admin=` variant — and they reach the bot differently.

### Plain `?startgroup=<payload>` — DOES arrive as a `/start` message

When a user adds the bot via `?startgroup=spaceship` (no `admin=`), the bot is added as a member and **receives a message**. Per the [Bot API](https://core.telegram.org/bots/features#deep-linking): *"the resulting update will contain text in the form: `/start@your_bot spaceship`"*. So `bot.command("start")` fires, with the payload in `ctx.args` (works in group chats too — `/start@bot spaceship`). A `my_chat_member` update (`left` → `member`) also fires; use whichever fits.

```typescript
bot.command("start", (ctx) => {
    const payload = ctx.args; // "spaceship", even when added to a group via ?startgroup=
});
```

### `admin=` flow — detect via `my_chat_member`, no payload

When the link carries `admin=` (`?startgroup&admin=…` or `?startchannel&admin=…`), the bot is added as an **administrator** with the requested rights. There's no payload field on this flow — use `my_chat_member` to confirm the add and verify which rights you actually got (`admin=` is a request; the user can untick boxes). Encode any context **client-side when you generate the link** and pick it up when `my_chat_member` arrives.

### The `admin=` combo — what you ask for vs. what you get

`admin=` is a **request**. The user can untick boxes in the confirmation dialog. Always verify what you actually got.

| `admin=` token                                                   | Maps to `ChatAdministratorRights` field |
| ---------------------------------------------------------------- | --------------------------------------- |
| `change_info`                                                    | `can_change_info`                       |
| `post_messages` (channels only)                                  | `can_post_messages`                     |
| `edit_messages` (channels only)                                  | `can_edit_messages`                     |
| `delete_messages`                                                | `can_delete_messages`                   |
| `restrict_members`                                               | `can_restrict_members`                  |
| `invite_users`                                                   | `can_invite_users`                      |
| `pin_messages`                                                   | `can_pin_messages`                      |
| `promote_members`                                                | `can_promote_members`                   |
| `manage_video_chats` (groups only)                               | `can_manage_video_chats`                |
| `manage_chat`                                                    | `can_manage_chat`                       |
| `anonymous`                                                      | `is_anonymous`                          |
| `manage_topics` (forum supergroups)                              | `can_manage_topics`                     |
| `post_stories` (channels only)                                   | `can_post_stories`                      |
| `edit_stories` (channels only)                                   | `can_edit_stories`                      |
| `delete_stories` (channels only)                                 | `can_delete_stories`                    |

Combine with `+`: `admin=post_messages+delete_messages+edit_messages`.

### Verifying rights on arrival

```typescript
bot.on("my_chat_member", (ctx) => {
    const me = ctx.newChatMember;
    // Bot was just added or promoted.
    if (me.status !== "administrator") {
        return ctx.send(
            "I need to be an admin in this channel to post on your behalf. " +
                "Please promote me with 'post messages' permission."
        );
    }
    if (me.status === "administrator" && !me.canPostMessages?.()) {
        return ctx.send(
            "Almost there — please also grant me the 'post messages' permission."
        );
    }
    return ctx.send("All set! I'll post here when there are updates.");
});
```

> `bot.on("my_chat_member", …)` requires no special opt-in — it's in Telegram's default `allowed_updates`. (The closely-named `chat_member` update — for *other* users' membership changes — is opt-in; see [bot configuration](./bot-configuration.md).)

### Generating the link

```typescript
const adminPerms = ["post_messages", "edit_messages", "delete_messages"].join("+");
const link = `https://t.me/${bot.info.username}?startchannel&admin=${adminPerms}`;
```

## 3. Mini App deep links — `?startapp=` and `t.me/<bot>/<appname>?startapp=`

**Main Mini App** (one per bot, configured in BotFather):

```text
https://t.me/<bot>?startapp=<payload>&mode=<compact|fullscreen>
```

**Direct Mini App** (multiple per bot, each with a `short_name`):

```text
https://t.me/<bot>/<short_name>?startapp=<payload>&mode=<compact|fullscreen>
```

### The payload does NOT arrive as `/start` either

It arrives **inside the Mini App's `initData`**, on the frontend:

```typescript
// Inside your Mini App (e.g. React/Vue), after the SDK has loaded:
const startParam: string | undefined = Telegram.WebApp.initDataUnsafe.start_param;
```

The bot's TypeScript code never sees `start_param` unless the Mini App explicitly posts it back via `Telegram.WebApp.sendData(...)` or a fetch to your backend. If your flow needs the bot to react server-side, send the payload from the Mini App to your backend yourself — typically as part of the `initData` validation request. See [tma](./tma.md) for the auth round-trip.

### `mode=`

- `mode=compact` (default) — the standard half-screen Mini App.
- `mode=fullscreen` — full-screen Mini App (requires the bot's BotFather config to allow it).

### Generating the link

```typescript
// Main app
`https://t.me/${bot.info.username}?startapp=${payload}&mode=fullscreen`
// Direct app named "checkout"
`https://t.me/${bot.info.username}/checkout?startapp=${payload}`
```

### Opening a `t.me/…` link from inside a Mini App — `openTelegramLink`, not `openLink`

When the Mini App frontend needs to *open* one of these deep links (jump to a chat, add-to-group picker, launch another Mini App), use `Telegram.WebApp.openTelegramLink(url)` — NOT `openLink(url)`:

- **`openTelegramLink(url)`** — handles `https://t.me/…` links **natively inside Telegram**. Since **Bot API 7.0** the Mini App stays open (before 7.0 it was closed after the call).
- **`openLink(url[, { try_instant_view }])`** — for **external** `http(s)` URLs only; opens an in-app/external browser, never closes the app. Feeding it a `t.me/…` URL routes a Telegram link through a browser tab that then bounces back into Telegram. `openLink` must be called in response to a user gesture.

```typescript
// frontend (inside the Mini App)
Telegram.WebApp.openTelegramLink(`https://t.me/${botUsername}?startgroup=x&admin=post_messages`); // ✅
Telegram.WebApp.openLink("https://example.com/docs", { try_instant_view: true });                 // external only
```

## 4. Attachment-menu deep links — `?startattach=`

Opens the bot's **attachment menu** entry (the paperclip icon). The bot must have an approved attachment menu — most bots don't; this is a curated surface.

```text
# Open the attach menu in any chat the user picks
https://t.me/<bot>?startattach=<payload>

# Pre-target a specific chat
https://t.me/<chat_username>?attach=<bot>&startattach=<payload>

# Constrain the picker to certain peer types
https://t.me/<bot>?startattach=<payload>&choose=users+bots+groups+channels
```

`choose=` combines with `+`. Allowed values: `users`, `bots`, `groups`, `channels`.

`startattach` payload lands in the same place as `startapp` — inside `Telegram.WebApp.initDataUnsafe.start_param` when the Mini App loads. Same constraints (64 chars, base64url alphabet).

## 5. Inline-mode redirect button — `start_parameter`

When an inline query needs auth/setup the bot can't do inline, return an **empty** results array and a top button with `start_parameter`. The button lives above the empty results panel; tapping it opens the bot's PM with `/start <param>`.

```typescript
bot.inlineQuery("anything", async (ctx) => {
    return ctx.answer([], {
        button: {
            text: "Log in to search",
            start_parameter: "login-inline", // routes to /start login-inline
        },
        cache_time: 0,
    });
});

bot.command("start", (ctx) => {
    if (ctx.args === "login-inline") return startAuthFlow(ctx);
    // ...
});
```

`InlineQueryResultsButton` is a discriminated union — provide **exactly one** of `start_parameter` or `web_app`. Full details in [triggers](./triggers.md).

## 6. Game deep links — `?game=`

Mostly used internally by Telegram clients to render Game messages. As a bot, you'll more often *receive* a callback for an existing Game (the Play button) than mint these URLs:

```typescript
bot.on("callback_query", (ctx) => {
    if (ctx.gameShortName) {
        return ctx.answer({ url: `https://game.example.com/?u=${ctx.from.id}` });
    }
});
```

Mint the link when you want to share a Game from outside Telegram: `https://t.me/<bot>?game=<short_name>`.

## 7. Share-to-chat helper — `t.me/share/url`

Not a bot update — a UX helper. Useful when you want the user to share something *out of the bot* (a link, a generated card, etc.). Wrap it in an inline-keyboard URL button:

```typescript
import { InlineKeyboard } from "gramio";

const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(itemUrl)}&text=${encodeURIComponent("Check this out")}`;

const kb = new InlineKeyboard().url("📤 Share", shareUrl);
```

Both `url` and `text` should be `encodeURIComponent`-encoded. `text` is optional.

## 8. Login widget — `t.me/login/<code>`

User-to-Telegram authorisation flow used by the [Telegram Login Widget](https://core.telegram.org/widgets/login). Your bot is never the receiver here — the widget posts auth data back to your **website** via JS callback or redirect. Mentioned for completeness; not something you handle in bot code.

## Building links from inside the bot

```typescript
// Always know your bot's username at runtime:
bot.onStart(({ info }) => {
    console.log(info.username); // — available after start
});

// In a handler:
function buildStartLink(payload: string) {
    return `https://t.me/${bot.info.username}?start=${payload}`;
}

function buildAddToChannelLink(perms: readonly string[]) {
    return `https://t.me/${bot.info.username}?startchannel&admin=${perms.join("+")}`;
}
```

Render these as `InlineKeyboard.url(...)` buttons or include them in formatted messages. They are public URLs — fine to share anywhere.

## Footguns

- **`startapp` ≠ `/start`.** Mini App payloads arrive on the **frontend** via `initDataUnsafe.start_param`. If you wrote `bot.command("start", (ctx) => ctx.args)` and expected the Mini App's deep-link payload, you'll wait forever.
- **From a Mini App, open `t.me/…` links with `Telegram.WebApp.openTelegramLink(url)`, not `openLink(url)`.** `openLink` is for external `http(s)` URLs and shoves Telegram links through a browser; `openTelegramLink` handles them natively (and, since Bot API 7.0, keeps the Mini App open instead of closing it).
- **`startgroup` has two flows — don't conflate them.** Plain `?startgroup=<payload>` DOES reach the bot as a `/start@bot <payload>` message (payload in `ctx.args`). Only the **`admin=` variant** (`?startgroup&admin=…`, `?startchannel&admin=…`) gives no `/start` and no payload — there you detect the add via `my_chat_member` and encode context in the link itself.
- **`admin=` is a request, not a grant.** Always verify with `ctx.newChatMember.canPostMessages?.()` etc. — users routinely untick permissions.
- **Payload is plaintext in the URL.** Anyone who sees the URL sees the payload. Never put auth tokens, emails, or IDs you wouldn't paste into a tweet. Use opaque server-side tokens.
- **Cold-open without payload.** On some clients, re-tapping a deep link for a bot the user already started can deliver `/start` without `ctx.args`. Make payloads idempotent; gracefully degrade when missing.
- **`+` in base64 will silently break the link.** Standard base64 uses `+` and `/`; Telegram only accepts base64url (`-` and `_`). Always encode with the `base64url` variant. The link won't 404 — it'll just *drop* the parameter or open the bot without one.
- **64-char limit is real.** Long signed JWTs won't fit. Use a short opaque ID; look the JWT up server-side.

## See also

- [triggers](./triggers.md) — `bot.command`, `bot.inlineQuery`, inline-mode `start_parameter` button.
- [ux-patterns](./ux-patterns.md) — `/start` anatomy and the broader onboarding playbook.
- [tma](./tma.md) — Mini App auth and how `start_param` round-trips to your backend.
- [keyboards](./keyboards.md) — `InlineKeyboard.url(...)` for rendering these links as buttons.
- [bot-configuration](./bot-configuration.md) — `allowed_updates` (relevant for `chat_member` vs. `my_chat_member`).
- Telegram spec: [core.telegram.org/api/links](https://core.telegram.org/api/links).
- Worked example: [`examples/deep-links.ts`](../examples/deep-links.ts).
