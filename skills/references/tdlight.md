---
name: tdlight
description: "@gramio/tdlight — types-only declaration-merging layer for the tdlight-telegram-bot-api server. Adds userbot (user mode) methods, searchMessages/getChats/getChatMembers, message scheduling (send_at), proxies, deleteMessages range, and extra object fields (is_scam/views/...). Mode-split entry points (./ bot, /all, /user). Critical method-name traps (votePoll not setPollAnswer). Docker tdlight/tdlightbotapi."
---

# @gramio/tdlight

[tdlight-telegram-bot-api](https://github.com/tdlight-team/tdlight-telegram-bot-api) is a fork of the local Bot API server (built on TDLight) that adds extra methods, extra object fields, and an experimental **user mode** (drive a real account as a *userbot* via `/user{token}`). [`@gramio/tdlight`](https://github.com/gramiojs/tdlight) is a **types-only** package that augments [`@gramio/types`](types.md) via declaration merging — no runtime. You still connect with `api.baseURL` (see [local-bot-api](local-bot-api.md); all of it applies).

```bash
npm install @gramio/tdlight
```

> User mode is experimental and **risky** — automating a real account can get it limited/banned. Use a throwaway account, low rates.

## Entry points (declaration merging is global per import — pick the smallest)

```ts
import "@gramio/tdlight";       // bot surface: object fields + bot-capable methods + scheduling + deleteMessages range
import "@gramio/tdlight/all";   // bot + user-only methods (userbots)
import "@gramio/tdlight/user";  // object fields + user-only methods only
```

Import once (entry file); types apply app-wide. New objects `AuthorizationState`, `CallbackQueryAnswer`, `TdlightProxy` are exported from every entry: `import type { TdlightProxy } from "@gramio/tdlight"`.

## ⚠️ Method-name traps (the spec lies; these are the real server routes)

Never generate the left-out names — they `404`. The package only types the correct ones:

| Use ✅ | NOT ❌ |
|---|---|
| `bot.api.votePoll(...)` | `setPollAnswer` |
| `bot.api.getMemoryStats()` | `optimizeMemory` |
| `bot.api.addChatMembers(...)` (plural) | `addChatMember` |
| `bot.api.getParticipants` (alias of `getChatMembers`) | — |
| login = empty-method `POST` to `/user{token}/` | `userLogin` (no such method) |

`getMemoryStats`, `toggleGroupInvites`, `reportChat` are accepted but **no-ops** on current builds.

## Methods

- **bot-capable** (`@gramio/tdlight`): `ping()` → number, `getChatMembers({chat_id, filter?, query?, offset?, limit?})`, `getParticipants`, `getMessageInfo`, `getProxies`/`addProxy`/`enableProxy`/`disableProxy`/`deleteProxy`, `getMemoryStats`, `toggleGroupInvites`.
- **user-only** (`/all` or `/user`): `searchMessages`, `searchChatMessages`, `getChats`, `getCommonChats`, `getInactiveChats`, `searchPublicChats`, `createChat`, `joinChat`, `addChatMembers`, `deleteChatHistory`, `getScheduledMessages`, `editMessageScheduling`, `votePoll`, `getCallbackQueryAnswer`, and auth: `authCode`, `authPassword`, `registerUser`.

## Scheduling (send_at) — on the whole send/copy/forward family

```ts
import "@gramio/tdlight";
await bot.api.sendMessage({ chat_id, text: "hi", send_at: "online" });        // when recipient is online
await bot.api.sendDocument({ chat_id, document, send_at: unixTs, repeat_period: 3600 });
```

`send_at`: unix timestamp (≤365d) or `"online"`. Scheduled messages get a **negative** `message_id`.

## deleteMessages range (known limitation)

```ts
await bot.api.deleteMessages({ chat_id, message_ids: [], start: 100, end: 500 }); // range form
```

`start?`/`end?` are typed on `DeleteMessagesParams`, but `message_ids` stays **required** (declaration merging can't relax it) — pass `[]`. Supergroups only. (Upstream fix: make `message_ids` optional in `@gramio/types`.)

## Extra object fields (all optional, typed wherever the object appears)

- `User`: `is_verified`, `is_scam`, `is_fake`, `is_deleted`, `user_status`, `last_seen`
- `Chat`: `is_verified`, `is_scam`, `is_fake`, `distance`
- `Message`: `views`, `forwards`, `is_scheduled`, `scheduled_at`
- chat members: `joined_date`, `inviter`

```ts
bot.on("message", (ctx) => { if (ctx.from?.is_scam) return; const v = ctx.views; });
```

## User mode login

Requires server `TELEGRAM_ALLOW_USERS=1`. Login is an empty-method `POST` to `/user{token}/` with `{ phone_number }` (NOT a `bot.api` call — use `fetch`), returns a token + `AuthorizationState`. Then point a `Bot` at `baseURL: ".../user"` and call typed `authCode({code})` → `authPassword({password})` (if 2FA) → optional `registerUser`. Some standard methods (callbacks, stickers, payments, `reply_markup`) are unavailable as a user; `bot.command` may not fire (no command entities in bot-less chats) — use `bot.on("message")`.

## Docker (tdlight/tdlightbotapi)

```sh
docker run -d -p 8081:8081 \
  -e TELEGRAM_API_ID=123 -e TELEGRAM_API_HASH=hash \
  -e TELEGRAM_LOCAL=1 -e TELEGRAM_ALLOW_USERS=1 \
  -v tdlight-data:/var/lib/telegram-bot-api \
  tdlight/tdlightbotapi:latest
```

tdlight's env names differ from the official image: `TELEGRAM_ALLOW_USERS`, `TELEGRAM_ALLOW_USERS_REGISTRATION`, `TELEGRAM_NO_FILE_LIMIT`, `TELEGRAM_MAX_BATCH` (→ `--max-batch-operations`), `TELEGRAM_STAT` (enables :8082), `TELEGRAM_HTTP_IDLE_TIMEOUT`. HTTP port is hardcoded to **8081** (no env). Work dir `/var/lib/telegram-bot-api` (same as official → nginx file-serving from [local-bot-api](local-bot-api.md) works unchanged).

See also: [local-bot-api](local-bot-api.md), [types](types.md) (declaration merging), [bot-configuration](bot-configuration.md) (`api.baseURL`).

<!--
Source: https://gramio.dev/bot-api/tdlight
-->
