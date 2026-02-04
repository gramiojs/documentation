---
title: Хранилища данных для Telegram ботов - Адаптеры и типы хранилищ в GramIO

head:
    - - meta
      - name: "description"
        content: "Узнайте о различных типах хранилищ данных для вашего Telegram бота на GramIO. Изучите встроенные адаптеры для работы с памятью, Redis, MongoDB и другими системами хранения данных, или создайте собственные адаптеры."

    - - meta
      - name: "keywords"
        content: "телеграм бот, фреймворк, как создать бота, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, хранилища данных, адаптеры хранилищ, storage adapters, Redis хранилище, In-memory хранилище, MongoDB хранилище, персистентное хранение, кэширование данных, состояние пользователя, user state, хранение сессий, ключ-значение, TTL, истечение данных, данные между перезапусками"
---

# Хранилища

Это специальные хранилища данных. Их основное применение — в плагинах (например, [сессии](/ru/plugins/official/session)).

## Адаптеры

GramIO имеет множество готовых адаптеров, но вы также можете написать свой собственный!

- [В памяти (In Memory)](#в-памяти) (`@gramio/storage`)

- [Redis](#redis) (`@gramio/storage-redis`)

## Как написать свой собственный адаптер хранилища

Написать свой адаптер очень просто!

Достаточно вернуть объект с необходимыми методами и использовать методы выбранного вами решения для адаптера (например, `ioredis`).

```ts
import type { Storage } from "@gramio/storage";
import ThirdPartyStorage, { type ThirdPartyStorageOptions } from "some-library";

export interface MyOwnStorageOptions extends ThirdPartyStorageOptions {
    /** добавить новое свойство в параметры */
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
> Если вы хотите опубликовать свой адаптер, мы рекомендуем следовать **соглашению** и назвать его начиная с `gramio-storage` и добавить ключевые слова `gramio` + `gramio-storage` в ваш **package.json**

## Как использовать адаптеры хранилища в своем плагине

Работать с адаптерами хранилища в вашем плагине также очень просто!

Всё, что нам нужно, уже есть в `@gramio/storage`.

```ts
import { Plugin } from "gramio";
import { type Storage, inMemoryStorage } from "@gramio/storage";

export interface MyOwnPluginOptions {
    storage?: Storage;
}

export function myOwnPlugin(options: MyOwnPluginOptions = {}) {
    // используем хранилище в памяти по умолчанию
    const storage = options.storage ?? inMemoryStorage();

    return new Plugin("gramio-example");
}
```

> [!IMPORTANT]
> Вы можете создать шаблон этого примера с помощью [create-gramio-plugin](/ru/plugins/how-to-write.html#scaffolding-the-plugin)

## Типобезопасное хранилище с дженериками

Все адаптеры хранилищ поддерживают параметр обобщенного типа `Storage<Data>`, который обеспечивает типобезопасность для ключей и значений. Это позволяет TypeScript автоматически определять правильный тип значения на основе ключа, к которому вы обращаетесь.

### Базовое использование

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

### Шаблонные литеральные типы

`Storage<Data>` отлично работает с шаблонными литеральными типами TypeScript, позволяя определять динамические паттерны ключей:

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

### Сложные объединения типов

Вы можете комбинировать несколько типов записей для различных паттернов ключей:

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

Эта типобезопасность работает во всех адаптерах хранилищ (в памяти, Redis, Cloudflare KV и т.д.) и помогает предотвратить ошибки во время выполнения, выявляя несоответствия типов на этапе компиляции.

## Список

## В памяти

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/storage?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/storage)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/storage?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/storage)
[![JSR](https://jsr.io/badges/@gramio/storage)](https://jsr.io/@gramio/storage)
[![JSR Score](https://jsr.io/badges/@gramio/storage/score)](https://jsr.io/@gramio/storage)

</div>

##### Установка

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

##### Использование

1. С использованием стандартного [Map](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Map)

```ts twoslash
import { inMemoryStorage } from "@gramio/storage";

const storage = inMemoryStorage();
```

2. Предоставление своего собственного [Map](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Map)

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

##### Установка

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

##### Использование

1. Предоставление параметров ioredis для функции `redisStorage`

```ts twoslash
import { redisStorage } from "@gramio/storage-redis";

const storage = redisStorage({
    host: process.env.REDIS_HOST,
});
```

2. Предоставление экземпляра ioredis для функции `redisStorage`

```ts twoslash
import { redisStorage } from "@gramio/storage-redis";
import { Redis } from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST,
});

const storage = redisStorage(redis);
```

##### Советы

- Вы можете установить переменную окружения `DEBUG` в `ioredis:*` для вывода отладочной информации:

```bash
DEBUG=ioredis:* npm run start
```

и это будет выглядеть так:

```bash
  ioredis:redis write command[::1:6379]: 0 -> get([ '@gramio/scenes:617580375' ]) +187ms
  ioredis:redis write command[::1:6379]: 0 -> set([ '@gramio/scenes:617580375', '{"name":"scene-name","state":{},"stepId":0,"previousStepId":0,"firstTime":false}' ]) +1ms
```

- Для проверки того, какие данные хранятся в Redis, мы рекомендуем использовать графические клиенты, такие как [AnotherRedisDesktopManager](https://github.com/qishibo/AnotherRedisDesktopManager).

<!-- TODO: More GramIO backend screens -->

<img src="https://cdn.jsdelivr.net/gh/qishibo/img/ardm/202411081318490.png" alt="AnotherRedisDesktopManager" />

## [Cloudflare KV](https://developers.cloudflare.com/kv/)

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/storage-cloudflare?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/storage-cloudflare)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/storage-cloudflare?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/storage-cloudflare)
[![JSR](https://jsr.io/badges/@gramio/storage-cloudflare)](https://jsr.io/@gramio/storage-cloudflare)
[![JSR Score](https://jsr.io/badges/@gramio/storage-cloudflare/score)](https://jsr.io/@gramio/storage-cloudflare)

</div>

##### Установка

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

##### Использование

1. [Настройте пространство имен Cloudflare KV](https://developers.cloudflare.com/kv/get-started/)

2. Предоставьте пространство имен Cloudflare KV функции `cloudflareStorage`

```ts
import { cloudflareStorage } from "@gramio/storage-cloudflare";

const storage = cloudflareStorage(Env.CLOUDFLARE_KV_NAMESPACE);
```
