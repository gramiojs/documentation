---
title: Local Bot API Server - Self-host Telegram Bot API with GramIO

head:
    - - meta
      - name: "description"
        content: "Run your own Telegram Bot API server with GramIO. Upload files up to 2 GB, download without limits, and serve files over HTTP with no bot token in the URL — using the official gramiojs/telegram-bot-api Docker image."

    - - meta
      - name: "keywords"
        content: "telegram bot, GramIO, local bot api server, self-hosted telegram bot api, telegram-bot-api docker, 2GB upload, large files telegram bot, api.baseURL, getFile local path, tdlib bot api, docker, nginx, download files telegram bot"
---

# Local Bot API Server

By default GramIO talks to Telegram's cloud Bot API at `https://api.telegram.org`. You can instead run **your own** [Telegram Bot API server](https://github.com/tdlib/telegram-bot-api) and point GramIO at it.

GramIO publishes a ready-to-use image: **`ghcr.io/gramiojs/telegram-bot-api`** (also on Docker Hub as `gramiojs/telegram-bot-api`) — multi-arch, non-root, healthchecked, signed, and rebuilt automatically when upstream updates.

> [!TIP]
> Need **user mode** (drive a real account as a userbot), message search, `getChats`, or message scheduling? Those live in the [tdlight fork](/bot-api/tdlight) — use the typed [`@gramio/tdlight`](/bot-api/tdlight) layer. For a normal bot with bigger file limits, the official image on this page is the simpler, battle-tested choice.

## Why self-host

| | Cloud API | Local server (`--local`) |
|---|---|---|
| Upload | 50 MB | **2 GB** |
| Download | 20 MB | **unlimited** |
| Upload from disk | — | **`file://` local path** |
| `getFile` result | download URL | **absolute path on disk** |
| Webhooks | HTTPS, fixed ports | **HTTP, any IP/port** |

If you only need small files and standard limits, the cloud API is simpler — stick with it.

## Prerequisites

You need **two different credentials** — don't mix them up:

| Credential | Identifies | Where to get it |
|---|---|---|
| `BOT_TOKEN` | your **bot** | [@BotFather](https://t.me/BotFather) → `/newbot` (you already have this) |
| `api_id` + `api_hash` | your **application** (required to run a local server) | [my.telegram.org](https://my.telegram.org) — steps below |

**Getting `api_id` / `api_hash` (one-time, ~1 min):**

1. Open [my.telegram.org](https://my.telegram.org) and log in with **your Telegram account's phone number** (your own account, *not* the bot — a login code arrives in your Telegram).
2. Click **API development tools**.
3. Fill in any **App title** and **Short name** (platform: *Other*) → **Create application**.
4. Copy **`api_id`** (a number) and **`api_hash`** (a long string). Keep the hash secret.

Then **log out of the cloud API first** — a bot token can't be used on the cloud and a local server at the same time. Call [`logOut`](/telegram/methods/logOut) once, then start your local server. Cloud login stays unavailable for ~10 minutes afterwards.

```ts twoslash
import { Bot } from "gramio";

const cloudBot = new Bot(process.env.BOT_TOKEN as string);
// ---cut---
// Run once on the cloud API, before switching to your local server
await cloudBot.api.logOut();
```

## Run the server

::: code-group

```sh [docker run]
docker run -d --name telegram-bot-api \
  -e TELEGRAM_API_ID=123456 \
  -e TELEGRAM_API_HASH=your_api_hash \
  -p 8081:8081 \
  -v telegram-bot-api-data:/var/lib/telegram-bot-api \
  ghcr.io/gramiojs/telegram-bot-api:latest
```

```yaml [docker-compose.yml]
services:
  telegram-bot-api:
    image: ghcr.io/gramiojs/telegram-bot-api:latest
    restart: unless-stopped
    environment:
      TELEGRAM_API_ID: ${TELEGRAM_API_ID}
      TELEGRAM_API_HASH: ${TELEGRAM_API_HASH}
    volumes:
      - telegram-bot-api-data:/var/lib/telegram-bot-api
    ports:
      - "8081:8081"

volumes:
  telegram-bot-api-data:
```

:::

The image runs with `--local` enabled by default. Set `TELEGRAM_LOCAL=0` to keep the cloud-style URL download flow (see [Downloading files](#downloading-files)).

The image is a small (~50 MB) Alpine build, multi-arch (`amd64` + `arm64`), non-root, and signed.

## Connect GramIO

Point `api.baseURL` at your server. **Keep the `/bot` suffix** — GramIO appends the token to it.

```ts twoslash
import { Bot } from "gramio";
// ---cut---
const bot = new Bot(process.env.BOT_TOKEN as string, {
    api: {
        baseURL: "http://localhost:8081/bot",
    },
});
```

In Docker, use the service name instead of `localhost`, e.g. `http://telegram-bot-api:8081/bot`.

## Downloading files

This is the part that trips people up. In `--local` mode, [`getFile`](/telegram/methods/getFile) returns an **absolute path on the server's filesystem** (e.g. `/var/lib/telegram-bot-api/<bot_id>/documents/file_5.jpg`) — **not** a download URL.

If your bot runs in a **separate container/host from the server** (the common case), it can't read that path off disk, and `ctx.download()` / `bot.downloadFile()` — which build a `…/file/bot<token>/<path>` URL — won't work against `--local`.

### Easiest: the bundled file server (`FILE_SERVER=1`)

The image can serve files itself — no sidecar, no extra service. Set `FILE_SERVER=1` and the container also runs an nginx that serves the working dir over HTTP at **path-based, token-less** URLs (`http://host:8080/<bot_id>/documents/file.jpg`). It's **off by default**; one env var turns it on. This is the simplest option on single-image platforms (Coolify, Dokploy, Railway, …):

```sh
docker run -d --name telegram-bot-api \
  -e TELEGRAM_API_ID=123456 \
  -e TELEGRAM_API_HASH=your_api_hash \
  -e FILE_SERVER=1 \
  -p 8081:8081 -p 8080:8080 \
  -v telegram-bot-api-data:/var/lib/telegram-bot-api \
  ghcr.io/gramiojs/telegram-bot-api:latest
```

Then turn the absolute `file_path` into a download URL (prefix swap), pointing at the file-server port:

```ts
const file = await bot.api.getFile({ file_id: ctx.document!.fileId });
const rel = file.file_path!.replace("/var/lib/telegram-bot-api/", "");
const url = `http://telegram-bot-api:8080/${rel}`; // token-less
```

`FILE_SERVER_PORT` (default `8080`) changes the port. Want one process per container instead? Use the nginx **sidecar** below.

### Alternative: a separate nginx sidecar

Run an `nginx` sidecar that shares the server's working-dir volume **read-only** and serves it over HTTP. The URLs are path-based, so the **bot token never appears in them**.

`nginx/telegram-files.conf`:

```nginx
server {
    listen 80;
    location / {
        root /var/lib/telegram-bot-api;  # mounted read-only
        autoindex off;
    }
}
```

Compose overlay:

```yaml
services:
  nginx:
    image: nginx:alpine
    depends_on:
      telegram-bot-api:
        condition: service_healthy
    volumes:
      - telegram-bot-api-data:/var/lib/telegram-bot-api:ro
      - ./nginx/telegram-files.conf:/etc/nginx/conf.d/default.conf:ro
    ports:
      - "8080:80"
```

Then turn the absolute `file_path` into a download URL by swapping the working-dir prefix for the nginx base URL:

```ts
import { Bot } from "gramio";

const FILES_BASE_URL = "http://localhost:8080";
const WORK_DIR = "/var/lib/telegram-bot-api";

const bot = new Bot(process.env.BOT_TOKEN as string, {
    api: { baseURL: "http://telegram-bot-api:8081/bot" },
});

bot.on("message", async (ctx) => {
    const fileId = ctx.document?.fileId;
    if (!fileId) return;

    const file = await bot.api.getFile({ file_id: fileId });
    if (!file.file_path) return;

    // /var/lib/telegram-bot-api/123/documents/x.pdf -> http://localhost:8080/123/documents/x.pdf
    const rel = file.file_path.replace(`${WORK_DIR}/`, "");
    const url = `${FILES_BASE_URL}/${rel}`;

    await ctx.reply(`Download: ${url}`); // no token in this link
});
```

nginx serves [range requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests) natively, so multi-GB downloads resume correctly. Want access control? Add HTTP basic auth, an IP allow-list, or nginx `secure_link` — all optional and off by default.

### Alternatives

- **Bot shares the volume.** If the bot container mounts the same volume, just read `file.file_path` off disk with `fs`/`Bun.file` — no nginx needed.
- **Disable `--local`.** With `TELEGRAM_LOCAL=0` the server downloads files itself and serves them at the familiar `…/file/bot<token>/<path>` URL, so `ctx.download()` keeps working — but you lose 2 GB uploads and unlimited downloads.

## Uploading large files

A local server raises the upload limit to **2 GB** (the cloud API caps documents at 50 MB — no way around that without a local server). Against a local server a **normal upload works up to 2 GB** — nothing special required:

```ts
import { Bot, MediaUpload } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string, {
    api: { baseURL: "http://localhost:8081/bot" },
});

bot.on("message", (ctx) =>
    // streamed over HTTP to your local server — up to 2 GB
    ctx.sendDocument(MediaUpload.path("./big-archive.zip")),
);
```

If the file already lives **on the server's own disk** (bot co-located, or a shared volume), `MediaUpload.localPath()` is an **optimization** — the server reads it directly via the `file://` scheme, so the bytes never travel over HTTP:

```ts
ctx.sendDocument(MediaUpload.localPath("/var/data/big-archive.zip"));
```

See the [media upload guide](/files/media-upload) and [`sendDocument`](/telegram/methods/sendDocument).

> [!TIP]
> For very large files prefer `MediaUpload.stream(...)` over `MediaUpload.path(...)` — the latter currently reads the whole file into memory.

## Webhooks

A local server accepts **HTTP** webhooks on any IP and port (the cloud API requires HTTPS on a fixed set of ports). See [Webhook](/updates/webhook).

## Environment variables

Every `telegram-bot-api` option is exposed as an environment variable — the rule is `--some-option` → `TELEGRAM_SOME_OPTION`.

| Variable | Flag | Default | Description |
|---|---|---|---|
| `TELEGRAM_API_ID` *(required)* | `--api-id` | — | application identifier from [my.telegram.org](https://my.telegram.org) |
| `TELEGRAM_API_HASH` *(required)* | `--api-hash` | — | application hash from [my.telegram.org](https://my.telegram.org) |
| `TELEGRAM_LOCAL` | `--local` | `1` | enable local mode (set `0` to disable) |
| `FILE_SERVER` | *(bundled nginx)* | `0` | serve the working dir over HTTP (`1` to enable) |
| `FILE_SERVER_PORT` | *(bundled nginx)* | `8080` | port for the bundled file server |
| `TELEGRAM_WORK_DIR` | `--dir` | `/var/lib/telegram-bot-api` | server working directory |
| `TELEGRAM_TEMP_DIR` | `--temp-dir` | `/tmp/telegram-bot-api` | directory for temporary files |
| `TELEGRAM_HTTP_PORT` | `--http-port` | `8081` | HTTP listening port |
| `TELEGRAM_STAT_PORT` | `--http-stat-port` | `8082` | HTTP statistics port (the healthcheck uses it) |
| `TELEGRAM_HTTP_IP_ADDRESS` | `--http-ip-address` | — | local IP to accept HTTP connections on |
| `TELEGRAM_HTTP_STAT_IP_ADDRESS` | `--http-stat-ip-address` | — | local IP to accept statistics connections on |
| `TELEGRAM_FILTER` | `--filter` | — | `<remainder>/<modulo>` — shard bots across servers |
| `TELEGRAM_MAX_WEBHOOK_CONNECTIONS` | `--max-webhook-connections` | — | default max webhook connections per bot |
| `TELEGRAM_MAX_CONNECTIONS` | `--max-connections` | — | maximum number of open file descriptors |
| `TELEGRAM_PROXY` | `--proxy` | — | HTTP proxy for outgoing webhook requests (`http://host:port`) |
| `TELEGRAM_LOG_FILE` | `--log` | — | path to the log file |
| `TELEGRAM_LOG_MAX_FILE_SIZE` | `--log-max-file-size` | `2000000000` | max log file size in bytes before rotation |
| `TELEGRAM_VERBOSITY` | `--verbosity` | — | log verbosity level |
| `TELEGRAM_MEMORY_VERBOSITY` | `--memory-verbosity` | `3` | in-memory log verbosity level |
| `TELEGRAM_USERNAME` | `--username` | — | effective user name to switch to |
| `TELEGRAM_GROUPNAME` | `--groupname` | — | effective group name to switch to |
| `TELEGRAM_CPU_AFFINITY` | `--cpu-affinity` | — | CPU affinity as a 64-bit mask |
| `TELEGRAM_MAIN_THREAD_AFFINITY` | `--main-thread-affinity` | — | CPU affinity of the main thread |

`TELEGRAM_API_ID` / `TELEGRAM_API_HASH` also accept a `_FILE` suffix to read the value from a file (Docker/Kubernetes secrets). Any extra arguments passed to the container are appended to `telegram-bot-api` verbatim.

## Verify it works

```sh
# stats endpoint responds
curl http://localhost:8082/

# container is healthy
docker inspect --format '{{.State.Health.Status}}' telegram-bot-api
```

## See also

- [Download files](/files/download) — GramIO download helpers
- [`logOut`](/telegram/methods/logOut) · [`close`](/telegram/methods/close) — migrate off the cloud API
- [`getFile`](/telegram/methods/getFile) · [`sendDocument`](/telegram/methods/sendDocument)
- [tdlight Bot API Server](/bot-api/tdlight) — fork with user mode, extra methods, and unlimited file size
