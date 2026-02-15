---
name: storage
description: Storage system — in-memory, Redis, SQLite, and Cloudflare KV adapters, type-safe generics, and custom adapter authoring.
---

# Storage

Interface with `get`, `has`, `set`, `delete` methods. Used by session, scenes, and other stateful plugins.

## Adapters

### In-Memory (`@gramio/storage`)

```typescript
import { inMemoryStorage } from "@gramio/storage";

const storage = inMemoryStorage();
// Or with custom Map:
const storage = inMemoryStorage(new Map());
```

### Redis (`@gramio/storage-redis`)

Install both packages (`ioredis` is a peer dependency):

```bash
npm install @gramio/storage-redis ioredis
```

```typescript
import { redisStorage } from "@gramio/storage-redis";
import { Redis } from "ioredis";

// Pass connection options
const storage = redisStorage({ host: "localhost", port: 6379 });

// Or existing instance
const redis = new Redis();
const storage = redisStorage(redis);
```

Debug: `DEBUG=ioredis:* npm run start`

### SQLite (`@gramio/storage-sqlite`)

Supports both **Bun** (`bun:sqlite`) and **Node.js** (`node:sqlite`). Auto-selects the correct implementation based on runtime.

```typescript
import { sqliteStorage } from "@gramio/storage-sqlite";

// Pass filename
const storage = sqliteStorage({ filename: "bot-data.db" });

// Or existing Database instance (Bun or Node.js)
import { Database } from "bun:sqlite"; // or node:sqlite
const storage = sqliteStorage({ db: new Database("bot-data.db") });

// With TTL (seconds)
const storage = sqliteStorage({ filename: "data.db", $ttl: 3600 });
```

Options: `filename`, `db`, `$ttl`, `tableName` (default `"gramio_storage"`).

### Cloudflare KV (`@gramio/storage-cloudflare`)

```typescript
import { cloudflareStorage } from "@gramio/storage-cloudflare";

const storage = cloudflareStorage(Env.KV_NAMESPACE);
```

## Type-Safe Generics

```typescript
const storage = inMemoryStorage<{ username: string; age: number }>();

// Template literal key types
type Data =
    & Record<`user:${number}`, { name: string }>
    & Record<`session:${string}`, { token: string }>;

const storage = inMemoryStorage<Data>();
await storage.set("user:123", { name: "John" });  // typed
await storage.get("session:abc");                   // typed
```

## Writing Custom Adapters

```typescript
import type { Storage } from "@gramio/storage";

function myStorage<T>(): Storage<T> {
    return {
        async get(key: string) { /* return T | undefined */ },
        async has(key: string) { /* return boolean */ },
        async set(key: string, value: T) { /* persist */ },
        async delete(key: string) { /* remove */ },
    };
}
```

Convention: name packages `gramio-storage-*`, add keywords `"gramio"` + `"gramio-storage"`.

<!--
Source: https://gramio.dev/storages
-->
