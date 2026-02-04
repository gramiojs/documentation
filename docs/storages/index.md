---
title: Storage for plugins in GramIO

head:
    - - meta
      - name: "description"
        content: "These are some kind of data stores. Their main use is in plugins (for example, sessions)."

    - - meta
      - name: "keywords"
        content: "Telegram, Telegram Bot API, GramIO, TypeScript, Deno, Bun, Node.JS, Nodejs, api, redis, in-memory"
---

# Storages

These are some kind of data stores. Their main use is in plugins (for example, [sessions](/plugins/official/session)).

## Adapters

GramIO has many ready-made adapters, but you can also write your own!

- [In Memory](#in-memory) (`@gramio/storage`)

- [Redis](#redis) (`@gramio/storage-redis`)

- [Cloudflare KV](#cloudflare-kv) (`@gramio/storage-cloudflare`)

## How to write my own storage adapters

It is very simple to write your adapter!

It is enough to return the object with the required methods and use the methods of the solution you have chosen for the adapter. (for example, `ioredis`)

```ts
import type { Storage } from "@gramio/storage";
import ThirdPartyStorage, { type ThirdPartyStorageOptions } from "some-library";

export interface MyOwnStorageOptions extends ThirdPartyStorageOptions {
    /** add new property to options */
    some?: number;
}

export function myOwnStorage(options: MyOwnStorageOptions = {}): Storage {
    const storage = new ThirdPartyStorage(options);

    return {
        async get(key) {
            const data = await storage.get(key);

            return data ? JSON.parse(data) : undefined;
        },
        async has(key) {
            return storage.has(key);
        },
        async set(key, value) {
            await storage.set(key, JSON.stringify(value));
        },
        async delete(key) {
            return storage.delete(key);
        },
    };
}
```

> [!IMPORTANT]
> If you want to publish your adapter, we recommend that you follow the **convention** and name it starting with `gramio-storage` and add `gramio` + `gramio-storage` keywords in your **package.json**

## How to use storage adapters in my own plugin

It is also very easy to work with storage adapters in your plugin!

Everything we need is already in `@gramio/storage`.

```ts
import { Plugin } from "gramio";
import { type Storage, inMemoryStorage } from "@gramio/storage";

export interface MyOwnPluginOptions {
    storage?: Storage;
}

export function myOwnPlugin(options: MyOwnPluginOptions = {}) {
    // use in memory storage by default
    const storage = options.storage ?? inMemoryStorage();

    return new Plugin("gramio-example");
}
```

> [!IMPORTANT]
> You can scaffold this example by [create-gramio-plugin](/plugins/how-to-write.html#scaffolding-the-plugin)

## Type-safe storage with generics

All storage adapters support a generic type parameter `Storage<Data>` that provides type safety for keys and values. This enables TypeScript to infer the correct value type based on the key you're accessing.

### Basic usage

```ts twoslash
import { inMemoryStorage } from "@gramio/storage";

interface UserData {
    username: string;
    email: string;
    age: number;
}

const storage = inMemoryStorage<UserData>();

await storage.set("username", "john_doe");
await storage.set("email", "john@example.com");

const username = await storage.get("username");
// ^?
```

### Template literal types

`Storage<Data>` works seamlessly with TypeScript's template literal types, allowing you to define dynamic key patterns:

```ts twoslash
import { inMemoryStorage } from "@gramio/storage";

type Data = Record<`user:${number}`, { name: string; age: number }> &
    Record<`session:${string}`, { token: string; expires: number }>;

const storage = inMemoryStorage<Data>();

await storage.set("user:1", { name: "Alice", age: 30 });
await storage.set("session:abc123", { token: "xyz", expires: 1234567890 });

const user = await storage.get("user:1");
// ^?

const session = await storage.get("session:abc123");
// ^?
```

### Complex type unions

You can combine multiple record types for different key patterns:

```ts twoslash
import { inMemoryStorage } from "@gramio/storage";

type StorageSchema =
    | Record<`counter:${string}`, number>
    | Record<`flag:${string}`, boolean>
    | Record<`data:${string}`, { value: string; timestamp: number }>;

const storage = inMemoryStorage<StorageSchema>();

await storage.set("counter:views", 42);
await storage.set("flag:enabled", true);
await storage.set("data:config", { value: "test", timestamp: Date.now() });

const views = await storage.get("counter:views");
// ^?
```

This type safety works across all storage adapters (in-memory, Redis, Cloudflare KV, etc.) and helps prevent runtime errors by catching type mismatches at compile time.

## List

## In Memory

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/storage?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/storage)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/storage?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/storage)
[![JSR](https://jsr.io/badges/@gramio/storage)](https://jsr.io/@gramio/storage)
[![JSR Score](https://jsr.io/badges/@gramio/storage/score)](https://jsr.io/@gramio/storage)

</div>

##### Installation

::: code-group

```bash [npm]
npm install @gramio/storage
```

```bash [yarn]
yarn add @gramio/storage
```

```bash [pnpm]
pnpm add @gramio/storage
```

```bash [bun]
bun install @gramio/storage
```

:::

##### Usage

1. With default [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

```ts twoslash
import { inMemoryStorage } from "@gramio/storage";

const storage = inMemoryStorage();
```

2. Provide your own [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

```ts twoslash
import { inMemoryStorage, type InMemoryStorageMap } from "@gramio/storage";

const map: InMemoryStorageMap = new Map();

const storage = inMemoryStorage(map);
```

## Redis

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/storage-redis?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/storage-redis)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/storage-redis?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/storage-redis)
[![JSR](https://jsr.io/badges/@gramio/storage-redis)](https://jsr.io/@gramio/storage-redis)
[![JSR Score](https://jsr.io/badges/@gramio/storage-redis/score)](https://jsr.io/@gramio/storage-redis)

</div>

##### Installation

::: code-group

```bash [npm]
npm install @gramio/storage-redis
```

```bash [yarn]
yarn add @gramio/storage-redis
```

```bash [pnpm]
pnpm add @gramio/storage-redis
```

```bash [bun]
bun install @gramio/storage-redis
```

:::

##### Usage

1. Provide ioredis options to the `redisStorage` function

```ts twoslash
import { redisStorage } from "@gramio/storage-redis";

const storage = redisStorage({
    host: process.env.REDIS_HOST,
});
```

2. Provide ioredis instance to the `redisStorage` function

```ts twoslash
import { redisStorage } from "@gramio/storage-redis";
import { Redis } from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST,
});

const storage = redisStorage(redis);
```

##### Tips

- You can set the `DEBUG` env to `ioredis:*` to print debug info:

```bash
DEBUG=ioredis:* npm run start
```

and it will looks like this:

```bash
  ioredis:redis write command[::1:6379]: 0 -> get([ '@gramio/scenes:617580375' ]) +187ms
  ioredis:redis write command[::1:6379]: 0 -> set([ '@gramio/scenes:617580375', '{"name":"scene-name","state":{},"stepId":0,"previousStepId":0,"firstTime":false}' ]) +1ms
```

- For inspecting which data is stored in Redis, we recommend you to use GUI clients like [AnotherRedisDesktopManager](https://github.com/qishibo/AnotherRedisDesktopManager).

<!-- TODO: More GramIO backend screens -->

<img src="https://cdn.jsdelivr.net/gh/qishibo/img/ardm/202411081318490.png" alt="AnotherRedisDesktopManager" />

## [Cloudflare KV](https://developers.cloudflare.com/kv/)

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/storage-cloudflare?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/storage-cloudflare)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/storage-cloudflare?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/storage-cloudflare)
[![JSR](https://jsr.io/badges/@gramio/storage-cloudflare)](https://jsr.io/@gramio/storage-cloudflare)
[![JSR Score](https://jsr.io/badges/@gramio/storage-cloudflare/score)](https://jsr.io/@gramio/storage-cloudflare)

</div>

##### Installation

::: code-group

```bash [npm]
npm install @gramio/storage-cloudflare
```

```bash [yarn]
yarn add @gramio/storage-cloudflare
```

```bash [pnpm]
pnpm add @gramio/storage-cloudflare
```

```bash [bun]
bun install @gramio/storage-cloudflare
```

:::

##### Usage

1. [Configure Cloudflare KV namespace](https://developers.cloudflare.com/kv/get-started/)

2. Provide Cloudflare KV namespace to the `cloudflareStorage` function

```ts
import { cloudflareStorage } from "@gramio/storage-cloudflare";

const storage = cloudflareStorage(Env.CLOUDFLARE_KV_NAMESPACE);
```
