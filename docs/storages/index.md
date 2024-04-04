# Storages

These are some kind of data stores. Their main use is in plugins (for example, [sessions](/plugins/official/session)).

## Adapters

GramIO has many ready-made adapters, but you can also write your own!

-   In Memory (`@gramio/storage`)

-   Redis (`@gramio/storage-redis`)

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
> If you want to publish your adapter, we recommend that you follow the **convention** and name it starting with `gramio-storage`

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
