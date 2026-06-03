---
title: tdlight Bot API Server + @gramio/tdlight - userbots, extra methods & types

head:
    - - meta
      - name: "description"
        content: "Self-host the tdlight-telegram-bot-api server and get full TypeScript types in GramIO with @gramio/tdlight. User mode (userbots), searchMessages/getChats, message scheduling, proxies, and unlimited file size — via declaration merging over @gramio/types."

    - - meta
      - name: "keywords"
        content: "tdlight, tdlight-telegram-bot-api, GramIO, userbot telegram typescript, telegram user mode bot api, searchMessages, getChats, getChatMembers, votePoll, message scheduling send_at, telegram proxies bot api, @gramio/tdlight, declaration merging @gramio/types, tdlight docker, tdlight/tdlightbotapi, self-hosted telegram bot api, unlimited file size"
---

# tdlight Bot API Server

[tdlight-telegram-bot-api](https://github.com/tdlight-team/tdlight-telegram-bot-api) is a community fork of Telegram's open-source [Bot API server](https://github.com/tdlib/telegram-bot-api), built on the lightweight **TDLight** library. It is a drop-in replacement: it speaks the standard Bot API **plus** a set of extra methods, extra fields on existing objects, and — its headline feature — an experimental **user mode** that lets you drive a real user account (a *userbot*), not just a bot.

GramIO talks to it the same way it talks to any self-hosted server: through [`api.baseURL`](/bot-class). What was missing was **types** — calling `searchMessages` or reading `message.views` was untyped. That's what [`@gramio/tdlight`](https://github.com/gramiojs/tdlight) adds.

> [!IMPORTANT]
> `@gramio/tdlight` is a **types-only** package. It augments [`@gramio/types`](/types) via TypeScript declaration merging so `bot.api.*` and the response objects gain tdlight's surface. There is no runtime — you still point GramIO at a tdlight server with `api.baseURL`. New to self-hosting? Read the [Local Bot API Server](/bot-api/local) guide first; everything there (the `/bot` suffix, file-download gotcha, 2 GB uploads) applies to tdlight too.

## Why tdlight

The standard Bot API is deliberately narrow: a bot can only see chats it was added to, can't search, can't list a group's full membership, can't schedule messages, and can never act as a user. tdlight lifts those limits.

| Capability | Cloud API | Official local (`--local`) | **tdlight** |
|---|---|---|---|
| 2 GB uploads, unlimited downloads, `file://` paths | — | ✅ | ✅ |
| Unlimited file **size** (`--no-file-limit`) | — | — | ✅ |
| **User mode** — act as a real account (userbot) | — | — | ✅ |
| Global message search ([`searchMessages`](#messages-scheduling)) | — | — | ✅ |
| List all your chats ([`getChats`](#chats)) | — | — | ✅ |
| Full member list ([`getChatMembers`](#members-info)) | partial | partial | ✅ (up to 200/page) |
| Message scheduling ([`send_at`](#scheduling-messages)) | — | — | ✅ |
| MTProto [proxies](#proxies) | — | — | ✅ |
| `views` / `forwards` on messages | — | — | ✅ |
| `is_scam` / `is_fake` / `is_verified` flags | — | — | ✅ |

If you only need a normal bot with bigger file limits, the [official local server](/bot-api/local) is simpler and battle-tested — use that. Reach for tdlight when you specifically need user-mode or the extra read methods.

> [!WARNING]
> **User mode is experimental and risky.** Logging a real account into a third-party server and automating it can get that account **limited or banned** by Telegram, especially for bulk actions (mass joining, adding members, scraping). Use a throwaway/secondary account, keep request rates low, and never run user mode against an account you can't afford to lose. tdlight itself labels user support as experimental.

## Install

::: pm-add @gramio/tdlight
:::

`@gramio/tdlight` declares [`@gramio/types`](/types) as a peer dependency — you already have it transitively through `gramio`.

## Entry points — pick the smallest surface

Declaration merging is **global per import**, so the package is split by mode. Import only what you need, and your `bot.api` won't be polluted with methods that can't run on your token.

| Import | Adds to `bot.api` / objects | Use when |
|---|---|---|
| `@gramio/tdlight` | object fields + **bot-capable** methods (`ping`, `getChatMembers`, `getMessageInfo`, proxies…), scheduling params, `deleteMessages` range | A normal **bot token** against a tdlight server — the safe default |
| `@gramio/tdlight/all` | everything above **plus** user-only methods (`searchMessages`, `votePoll`, `getChats`, the auth flow…) | A **userbot** (`/user` token), which uses both surfaces |
| `@gramio/tdlight/user` | object fields + **only** the user-only methods | You want just the user-only delta |

The import is a one-time side-effect — do it once (e.g. in your entry file) and the types apply everywhere.

```ts
// types apply globally for the rest of your app
import "@gramio/tdlight";
```

## Quick start (bot mode)

A tdlight server in bot mode behaves like the official local server, with extra methods bolted on.

```ts
import { Bot } from "gramio";
import "@gramio/tdlight"; // augments bot.api with tdlight's bot-mode methods

const bot = new Bot(process.env.BOT_TOKEN as string, {
    api: {
        baseURL: "http://localhost:8081/bot", // your tdlight server — keep the /bot suffix
    },
});

bot.command("ping", async (ctx) => {
    const seconds = await bot.api.ping(); // number — MTProto round-trip
    await ctx.reply(`pong in ${seconds.toFixed(3)}s`);
});

bot.command("admins", async (ctx) => {
    const admins = await bot.api.getChatMembers({
        chat_id: ctx.chatId,
        filter: "admins",
    });
    await ctx.reply(`${admins.length} admins`);
});

bot.start();
```

> The `/bot` suffix matters: GramIO builds the request URL as `${baseURL}${token}/${method}`. `"http://localhost:8081/bot"` ✅ · `"http://localhost:8081"` ❌ (the token glues to the host). See [Local Bot API Server → Connect GramIO](/bot-api/local#connect-gramio).

## Run the tdlight server (Docker)

tdlight publishes a multi-arch image to Docker Hub (`tdlight/tdlightbotapi`) and GHCR (`ghcr.io/tdlight-team/tdlightbotapi`). Like the official image, an entrypoint script maps `TELEGRAM_*` environment variables to CLI flags.

You need an `api_id` / `api_hash` from [my.telegram.org](https://my.telegram.org) (identifies your *application*, not the bot) — exactly as for the [official local server](/bot-api/local#prerequisites). And as there, a bot token can't be used on the cloud and a local server at once: call [`logOut`](/telegram/methods/logOut) on the cloud API once before switching a bot over.

::: code-group

```sh [docker run]
docker run -d --name tdlight \
  -e TELEGRAM_API_ID=123456 \
  -e TELEGRAM_API_HASH=your_api_hash \
  -e TELEGRAM_LOCAL=1 \
  -p 8081:8081 \
  -v tdlight-data:/var/lib/telegram-bot-api \
  tdlight/tdlightbotapi:latest
```

```yaml [docker-compose.yml]
services:
  tdlight:
    image: tdlight/tdlightbotapi:latest
    restart: unless-stopped
    environment:
      TELEGRAM_API_ID: ${TELEGRAM_API_ID}
      TELEGRAM_API_HASH: ${TELEGRAM_API_HASH}
      TELEGRAM_LOCAL: 1            # local mode: big files, on-disk file_path
      TELEGRAM_ALLOW_USERS: 1      # enable user mode (omit for bot-only)
      # TELEGRAM_ALLOW_USERS_REGISTRATION: 1  # allow registerUser (new accounts)
    volumes:
      - tdlight-data:/var/lib/telegram-bot-api
    ports:
      - "8081:8081"

volumes:
  tdlight-data:
```

:::

> [!WARNING]
> **tdlight's env-var names are its own — don't copy them from the official image.** They overlap but differ: tdlight uses `TELEGRAM_STAT` (presence-only, enables the 8082 stats port), `TELEGRAM_MAX_BATCH` (→ `--max-batch-operations`), `TELEGRAM_STAT_HIDE_SENSIBLE_DATA`, `TELEGRAM_NO_FILE_LIMIT`, etc. The HTTP port is **hardcoded to 8081** in the entrypoint — there is no `TELEGRAM_HTTP_PORT`. To change it you must pass a full command (any positional arg makes the entrypoint exec it verbatim, skipping env processing).

Build it yourself from the repo's `Dockerfile` (Alpine, non-root) if you prefer pinning to a commit. The data dir is `/var/lib/telegram-bot-api` (same as the official image), so the [file-download nginx pattern](/bot-api/local#downloading-files) carries over unchanged.

## User mode (userbots)

User mode lets `@gramio/tdlight` drive a **real account**. Requests go to `/user{token}/…` instead of `/bot{token}/…`, and many extra methods (`searchMessages`, `getChats`, `votePoll`, …) only work here. Enable it on the server with `TELEGRAM_ALLOW_USERS=1` (and `TELEGRAM_ALLOW_USERS_REGISTRATION=1` only if you need to register brand-new accounts).

### The login flow

A user token doesn't exist up front — you obtain it by logging in. This is **not** a normal method call: login starts with an empty-method `POST` to `/user{token}/` carrying the phone number, then proceeds through code → 2FA password → (optional) registration. Each step returns an [`AuthorizationState`](#new-objects).

Because the first step has no method name, it can't go through `bot.api.*` — you make it with a plain `fetch` (a runtime login helper is planned for a future release). Once you hold a user token, the follow-up steps **are** typed methods:

```ts
import { Bot } from "gramio";
import "@gramio/tdlight/all";

const SERVER = "http://localhost:8081";

// Step 1 — start login (empty method) and get a user token + state
const res = await fetch(`${SERVER}/userlogin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number: "+1555..." }),
});
const { result } = (await res.json()) as {
    result: { token: string; authorization_state: string };
};
const USER_TOKEN = result.token;

// Step 2+ — now use a typed Bot pointed at /user{token}
const userbot = new Bot(USER_TOKEN, {
    api: { baseURL: `${SERVER}/user` }, // note: /user, not /bot
});

// submit the login code the account just received (returns the next AuthorizationState)
const afterCode = await userbot.api.authCode({ code: 12345 });

// if the account has 2FA enabled:
if (afterCode.authorization_state === "wait_password") {
    await userbot.api.authPassword({ password: process.env.TWO_FA as string });
}

// the account is now logged in — drive it as a userbot
const hits = await userbot.api.searchMessages({ query: "invoice", limit: 50 });
```

> [!NOTE]
> Some standard methods are **unavailable in user mode** (a user has no `answerCallbackQuery`, `setMyCommands`, sticker-set or payments methods, and can't attach `reply_markup`). And because command messages aren't created in chats without bots, your `bot.command(...)` handlers may never fire for a userbot — drive it imperatively or with `bot.on("message", …)` instead.

## Extra methods

All method names below are the ones the tdlight server **actually routes** (it lowercases the incoming name). Several names in tdlight's OpenAPI spec are wrong and would `404` — `@gramio/tdlight` types the real routes. See [Method-name traps](#method-name-traps).

### Members & info

```ts
import "@gramio/tdlight";

// full member list with filter + paging (bot-capable)
const banned = await bot.api.getChatMembers({
    chat_id: -1001234567890,
    filter: "banned",
    offset: 0,
    limit: 200,
});

// `getParticipants` is an alias of `getChatMembers` (same handler)
const all = await bot.api.getParticipants({ chat_id: -1001234567890 });

// full info for a single message
const msg = await bot.api.getMessageInfo({ chat_id: -1001234567890, message_id: 42 });
```

### Chats

User-mode (`@gramio/tdlight/all` or `/user`):

```ts
import "@gramio/tdlight/all";

const chats = await userbot.api.getChats();                       // all your chats
const common = await userbot.api.getCommonChats({ user_id: 777 }); // chats in common with a user
const found = await userbot.api.searchPublicChats({ query: "gramio" });
await userbot.api.joinChat({ invite_link: "https://t.me/+abc123" });
const created = await userbot.api.createChat({
    title: "Project X",
    type: "supergroup",
    description: "secret plans",
});
```

### Messages & scheduling

```ts
import "@gramio/tdlight/all";

const results = await userbot.api.searchMessages({ query: "deadline", limit: 100 });
const inChat = await userbot.api.searchChatMessages({
    chat_id: -1001234567890,
    query: "release",
    from_user_id: 777,
});
const scheduled = await userbot.api.getScheduledMessages({ chat_id: 777 });
```

### Interaction

```ts
import "@gramio/tdlight/all";

// vote in a poll  ⚠ the route is `votePoll`, NOT `setPollAnswer`
await userbot.api.votePoll({ chat_id: -100..., message_id: 42, option_ids: [0, 2] });

// trigger a callback button and read what the originating bot would have answered
const answer = await userbot.api.getCallbackQueryAnswer({
    chat_id: -100...,
    message_id: 42,
    callback_data: "buy:item-7",
});
```

### Proxies

Manage the MTProto proxies the server connects through (bot-capable):

```ts
import "@gramio/tdlight";

const proxy = await bot.api.addProxy({
    server: "1.2.3.4",
    port: 443,
    type: "mtproto",
    secret: "ee...",
});
await bot.api.enableProxy({ proxy_id: proxy.id });
const proxies = await bot.api.getProxies(); // TdlightProxy[]
```

## Scheduling messages

tdlight adds `send_at` (and `repeat_period`) to the whole send/copy/forward family. Pass a Unix timestamp (≤ 365 days out) or the string `"online"` to send when the recipient is next online. Scheduled messages get a **negative** `message_id`.

```ts
import "@gramio/tdlight";

// send when the recipient comes online
await bot.api.sendMessage({ chat_id: 777, text: "ping", send_at: "online" });

// send at a specific time
await bot.api.sendDocument({
    chat_id: 777,
    document: "BQACAgI...",
    send_at: Math.floor(Date.now() / 1000) + 3600, // in 1 hour
});

// reschedule (or send-now) an existing scheduled message
await bot.api.editMessageScheduling({ chat_id: 777, message_id: -5, send_at: "online" });
```

## Deleting message ranges

tdlight extends [`deleteMessages`](/telegram/methods/deleteMessages) with a `start`/`end` **range** form (supergroups only, `start < end`, bounded by `--max-batch-operations`, default 10000). `@gramio/tdlight` types `start?` and `end?` on the params.

```ts
import "@gramio/tdlight";

// standard form (unchanged)
await bot.api.deleteMessages({ chat_id: -100..., message_ids: [10, 11, 12] });

// tdlight range form — delete everything from id 100 to 500
await bot.api.deleteMessages({ chat_id: -100..., message_ids: [], start: 100, end: 500 });
```

> [!NOTE]
> **Known limitation:** `@gramio/types` types `message_ids` as **required**, and TypeScript declaration merging can't relax a required field. So the range form still type-requires `message_ids` — pass `[]`. The clean fix belongs upstream (making `message_ids` optional in `@gramio/types`).

## Extra object fields

The augmentation adds tdlight's extra fields (all optional) to the objects you already read off the context, so they're typed wherever a `User` / `Chat` / `Message` / chat member appears:

```ts
import "@gramio/tdlight";

bot.on("message", (ctx) => {
    // User extras
    if (ctx.from?.is_scam) return; // is_scam / is_fake / is_verified / is_deleted
    const seen = ctx.from?.user_status; // "online" | "offline" | "recently" | ...

    // Message extras (channels)
    const views = ctx.views;       // number | undefined
    const forwards = ctx.forwards;  // number | undefined
});
```

| Object | tdlight fields |
|---|---|
| `User` | `is_verified` · `is_scam` · `is_fake` · `is_deleted` · `user_status` · `last_seen` |
| `Chat` | `is_verified` · `is_scam` · `is_fake` · `distance` |
| `Message` | `views` · `forwards` · `is_scheduled` · `scheduled_at` |
| chat members | `joined_date` · `inviter` |

### New objects

`@gramio/tdlight` also exports three new object types (from any entry point):

- **`AuthorizationState`** — returned by the [login flow](#the-login-flow).
- **`CallbackQueryAnswer`** — returned by `getCallbackQueryAnswer`.
- **`TdlightProxy`** — returned by `getProxies` / `addProxy`.

```ts
import type { AuthorizationState, TdlightProxy } from "@gramio/tdlight";
```

## Method-name traps

tdlight's published OpenAPI spec documents several method names the server doesn't actually route. `@gramio/tdlight` types the **real** routes (verified against the server's C++ source), so you don't hit silent `404`s:

| Use this ✅ | Not this ❌ (404s) |
|---|---|
| `votePoll` | `setPollAnswer` |
| `getMemoryStats` | `optimizeMemory` |
| `addChatMembers` (plural) | `addChatMember` |
| `getParticipants` (alias of `getChatMembers`) | — |
| login via empty-method `POST` | `userLogin` (no such method) |

> [!NOTE]
> `getMemoryStats`, `toggleGroupInvites`, and `reportChat` are **accepted but no-ops / unimplemented** on current tdlight builds — they're typed (with a JSDoc note) for completeness, but don't rely on their effects.

## Downloading files

File handling is identical to the [official local server](/bot-api/local#downloading-files): in `--local` mode, [`getFile`](/telegram/methods/getFile) returns an **absolute path on disk**, not a URL, so `ctx.download()` won't work against a split deployment. Serve files with the [nginx sidecar pattern](/bot-api/local#recommended-serve-files-with-nginx-no-bot-token-in-the-url) — it works unchanged because tdlight uses the same `/var/lib/telegram-bot-api` work dir.

## Environment variables (tdlight-specific)

The `--some-option` → `TELEGRAM_SOME_OPTION` rule mostly holds, but **tdlight has its own names** for several — don't copy them from the official image.

| Variable | Flag | Notes |
|---|---|---|
| `TELEGRAM_API_ID` *(required)* | `--api-id` | from [my.telegram.org](https://my.telegram.org) |
| `TELEGRAM_API_HASH` *(required)* | `--api-hash` | from [my.telegram.org](https://my.telegram.org) |
| `TELEGRAM_LOCAL` | `--local` | presence-only — big files, on-disk `file_path` |
| `TELEGRAM_ALLOW_USERS` | `--allow-users` | set `1` to enable user mode |
| `TELEGRAM_ALLOW_USERS_REGISTRATION` | `--allow-users-registration` | set `1` to allow `registerUser` |
| `TELEGRAM_NO_FILE_LIMIT` | `--no-file-limit` | presence-only — remove file-size cap |
| `TELEGRAM_MAX_BATCH` | `--max-batch-operations` | range-delete cap (default 10000) |
| `TELEGRAM_HTTP_IDLE_TIMEOUT` | `--http-idle-timeout` | seconds; default 500 |
| `TELEGRAM_STAT` | `--http-stat-port=8082` | presence-only — enables the stats port |
| `TELEGRAM_STAT_HIDE_SENSIBLE_DATA` | `--stats-hide-sensible-data` | hide token/webhook on the stats page |
| `TELEGRAM_INSECURE` | `--insecure` | allow HTTP in non-local mode |
| `TELEGRAM_RELATIVE` | `--relative` | allow only relative file paths in local mode |
| `TELEGRAM_VERBOSITY` | `--verbosity` | log level (0–4, 1024) |
| `TELEGRAM_PROXY` | `--proxy` | outgoing webhook proxy |
| `TELEGRAM_WORK_DIR` | `--dir` | default `/var/lib/telegram-bot-api` |
| `TELEGRAM_TEMP_DIR` | `--temp-dir` | default `/tmp/telegram-bot-api` |

The HTTP API port is **hardcoded to 8081** in the entrypoint (no env var). Pass `TELEGRAM_API_ID`/`TELEGRAM_API_HASH` directly — the binary reads them from the environment.

## See also

- [Local Bot API Server](/bot-api/local) — the official server; prerequisites, file downloads, and 2 GB uploads all apply to tdlight too
- [@gramio/types](/types) — the package `@gramio/tdlight` augments
- [Bot configuration](/bot-class) — `api.baseURL` and other options
- [`logOut`](/telegram/methods/logOut) · [`getFile`](/telegram/methods/getFile) · [`deleteMessages`](/telegram/methods/deleteMessages)
