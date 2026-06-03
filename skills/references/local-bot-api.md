---
name: local-bot-api
description: Self-host the Telegram Bot API server with GramIO — log out of the cloud and connect to a local server, api.baseURL "/bot" rule, the gramiojs/telegram-bot-api Docker image, 2 GB uploads, and downloading files in --local mode (nginx, token-less URLs).
---

# Local Bot API Server

Run your own [Telegram Bot API server](https://github.com/tdlib/telegram-bot-api) instead of the cloud `https://api.telegram.org`. Gains: **2 GB uploads** (vs 50 MB), **unlimited downloads** (vs 20 MB), `file://` local-path uploads, HTTP webhooks on any port.

Official image (multi-arch, non-root, signed): **`ghcr.io/gramiojs/telegram-bot-api`** (Docker Hub: `gramiojs/telegram-bot-api`).

## Migration: cloud → self-hosted (the easy method)

A bot token **cannot** be used on the cloud and a local server at the same time. Migrate in two steps:

**Step 1 — log out of the cloud** (run once, on the cloud API). After this, cloud login is blocked for ~10 minutes.

```ts
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string); // cloud
await bot.api.logOut();
// now start your local server, then connect to it (Step 2)
```

**Step 2 — connect GramIO to the local server.** Point `api.baseURL` at it. **Keep the `/bot` suffix** — GramIO appends the token to `baseURL` (`${baseURL}${token}/${method}`).

```ts
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string, {
    api: { baseURL: "http://localhost:8081/bot" }, // local; in Docker use the service name
});
```

- ✅ `"http://localhost:8081/bot"` — correct
- ❌ `"http://localhost:8081"` — wrong (token gets glued to the host)

> `logOut` ≠ `close`. Use `logOut` to migrate cloud → local. Use [`close`](references/bot-api.md) only to move between two local servers (delete the webhook first).

## Run the server (Docker)

```sh
docker run -d --name telegram-bot-api \
  -e TELEGRAM_API_ID=123456 \
  -e TELEGRAM_API_HASH=your_api_hash \
  -p 8081:8081 \
  -v telegram-bot-api-data:/var/lib/telegram-bot-api \
  ghcr.io/gramiojs/telegram-bot-api:latest
```

Get `api_id` / `api_hash` at <https://my.telegram.org> (they identify the *application*, not the bot). The image runs with `--local` on by default; set `TELEGRAM_LOCAL=0` to keep the cloud-style URL download flow. `TELEGRAM_API_ID`/`TELEGRAM_API_HASH` also accept a `_FILE` suffix for Docker/K8s secrets.

## Downloading files in `--local` mode (gotcha)

With `--local`, `getFile` returns an **absolute path on the server's disk** (e.g. `/var/lib/telegram-bot-api/<bot_id>/documents/x.jpg`), **not** a URL. So `ctx.download()` / `bot.downloadFile()` (which build `…/file/bot<token>/<path>`) **won't work** against a split `--local` server.

Serve files with an **nginx sidecar** sharing the working-dir volume read-only — URLs are path-based, so they contain **no bot token**:

```nginx
# nginx/telegram-files.conf
server {
    listen 80;
    location / { root /var/lib/telegram-bot-api; autoindex off; }
}
```

Then turn the absolute `file_path` into a download URL (prefix swap):

```ts
const file = await bot.api.getFile({ file_id: ctx.document!.fileId });
const rel = file.file_path!.replace("/var/lib/telegram-bot-api/", "");
const url = `${process.env.FILES_BASE_URL}/${rel}`; // token-less
```

Alternatives: if the bot shares the volume, read `file.file_path` off disk directly; or run with `TELEGRAM_LOCAL=0` to keep `ctx.download()` working over the cloud-style URL (loses 2 GB uploads / unlimited downloads).

## Uploading large files

```ts
import { MediaUpload } from "gramio";
ctx.sendDocument(await MediaUpload.path("./big-archive.zip")); // up to 2 GB on a local server
```

See also: [bot-configuration](references/bot-configuration.md) (`api.baseURL`), [files](references/files.md) (upload/download), [docker](references/docker.md).
