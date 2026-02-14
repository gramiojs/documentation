---
name: tma
description: Telegram Mini Apps — scaffold monorepo, HTTPS on localhost with mkcert, Vite config, and @gramio/init-data for backend auth (validate, parse, sign).
---

# Telegram Mini Apps (TMA)

## Scaffold Monorepo

```bash
npm create gramio@latest ./bot
# Choose TMA monorepo — creates apps/bot, apps/mini-app, apps/server, packages/db
```

Or scaffold the frontend separately with tma.js:

```bash
npx @telegram-apps/mini-app@latest ./mini-app
```

## HTTPS on Localhost

BotFather requires `https://` URLs. Use `mkcert` to avoid tunnels:

```bash
# 1. Install mkcert
brew install mkcert          # macOS
sudo apt install libnss3-tools && brew install mkcert  # Linux

# 2. Create & install certificate
mkcert mini-app.local
mkcert --install

# 3. Add hostname
sudo echo "127.0.0.1 mini-app.local" >> /etc/hosts
```

### Vite Config

```typescript
import fs from "node:fs";
import { defineConfig } from "vite";

export default defineConfig({
    server: {
        port: 443,
        host: "0.0.0.0",
        hmr: { host: "mini-app.local", port: 443 },
        https: {
            key: fs.readFileSync("./mini-app.local-key.pem"),
            cert: fs.readFileSync("./mini-app.local.pem"),
        },
    },
});
```

## @gramio/init-data

```bash
npm install @gramio/init-data
```

### getBotTokenSecretKey

Pre-compute the secret key once for best performance:

```typescript
import { getBotTokenSecretKey } from "@gramio/init-data";
const secretKey = getBotTokenSecretKey(process.env.BOT_TOKEN as string);
```

### validateAndParseInitData

Validates hash + parses `WebAppInitData`. Returns `false` if invalid:

```typescript
import { validateAndParseInitData } from "@gramio/init-data";

const result = validateAndParseInitData(initDataString, secretKey);
if (!result || !result.user) throw new Error("Unauthorized");
const userId = result.user.id;
```

### signInitData

Generate valid init data strings for testing:

```typescript
import { signInitData, type WebAppUser } from "@gramio/init-data";

const signed = signInitData(
    { user: { id: 1, first_name: "Test", username: "test" } } satisfies WebAppUser,
    secretKey
);
```

### Elysia Auth Guard

```typescript
import { validateAndParseInitData, signInitData, getBotTokenSecretKey } from "@gramio/init-data";
import { Elysia, t } from "elysia";

const secretKey = getBotTokenSecretKey(process.env.BOT_TOKEN as string);

export const authElysia = new Elysia({ name: "auth" })
    .guard({
        headers: t.Object({
            "x-init-data": t.String({
                examples: [signInitData({ user: { id: 1, first_name: "durov", username: "durov" } }, secretKey)],
            }),
        }),
        response: { 401: t.Literal("UNAUTHORIZED") },
    })
    .resolve(({ headers, error }) => {
        const result = validateAndParseInitData(headers["x-init-data"], secretKey);
        if (!result || !result.user) return error("Unauthorized", "UNAUTHORIZED");
        return { tgId: result.user.id, user: result.user };
    })
    .as("plugin");
```

<!--
Source: https://gramio.dev/tma/overview, https://gramio.dev/tma/init-data
-->
