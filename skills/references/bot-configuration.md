---
name: bot-configuration
description: Bot constructor options, API configuration, proxy support, custom API URLs, test data center, and startup optimization.
---

# Bot Configuration

## Constructor

Two forms:

```typescript
// Token as first argument
const bot = new Bot(process.env.BOT_TOKEN as string, options);

// Token inside options
const bot = new Bot({ token: process.env.BOT_TOKEN as string, ...options });
```

## Constructor Options

### `info` — Skip getMe on startup

Provide bot info to avoid the initial `getMe` call. Critical for horizontal scaling and serverless:

```typescript
const bot = new Bot(process.env.BOT_TOKEN as string, {
    info: {
        id: 1234567890,
        is_bot: true,
        first_name: "MyBot",
        username: "my_bot",
    },
});
```

### `plugins` — Disable default plugins

```typescript
const bot = new Bot(token, {
    plugins: { format: false }, // disables built-in format`` template literal
});
```

## API Options

Nested under `api:` in constructor options.

| Option | Default | Description |
|--------|---------|-------------|
| `baseURL` | `"https://api.telegram.org/bot"` | Custom Telegram Bot API server URL |
| `useTest` | `false` | Send requests to test data center |
| `retryGetUpdatesWait` | `1000` | ms before re-calling getUpdates on empty response |
| `fetchOptions` | `{}` | Standard `fetch` RequestInit passed to every request |

```typescript
const bot = new Bot(token, {
    api: {
        baseURL: "https://my-custom-api.com/bot",
        useTest: true,
        retryGetUpdatesWait: 500,
        fetchOptions: {
            headers: { "X-Custom": "value" },
        },
    },
});
```

## Proxy Support

### Node.js — undici ProxyAgent

```typescript
import { ProxyAgent } from "undici";

const bot = new Bot(token, {
    api: {
        fetchOptions: {
            dispatcher: new ProxyAgent("http://proxy.example.com:8080"),
        },
    },
});
```

WARNING: Install `undici` explicitly. Avoid `"lib": ["DOM"]` in tsconfig.json or the `dispatcher` type disappears.

### Bun — native proxy string

```typescript
const bot = new Bot(token, {
    api: {
        fetchOptions: {
            proxy: "https://user:pass@proxy.example.com:8080",
        },
    },
});
```

### Deno — createHttpClient (unstable)

```typescript
const bot = new Bot(token, {
    api: {
        fetchOptions: {
            client: Deno.createHttpClient({
                proxy: { url: "http://proxy.example.com:8080" },
            }),
        },
    },
});
```

Requires `--unstable` flag.

## Debugging

```bash
DEBUG=gramio:api:* node index.js              # GramIO debug logs
BUN_CONFIG_VERBOSE_FETCH=curl bun src/index.ts # Bun fetch debug
```

## Startup Optimization (Bun)

```bash
bun --fetch-preconnect=https://api.telegram.org:443/ ./src/bot.ts
```

Warms up DNS/TCP/TLS before code execution.

<!--
Source: https://gramio.dev/bot-class
-->
