---
name: session
description: Persistent user data storage with @gramio/session — key-based sessions with optional Redis/Cloudflare storage.
---

# Session Plugin

Package: `@gramio/session`

```typescript
import { sessionPlugin } from "@gramio/session";

bot.extend(
    sessionPlugin({
        key: "counter",               // access as context.counter
        initial: () => 0,             // initial value (typed via return type)
        storage: undefined,           // optional: redisStorage(), cloudflareStorage()
    })
);

bot.command("count", (context) => {
    context.counter++;
    return context.send(`Count: ${context.counter}`);
});
```

## Multiple Sessions

```typescript
bot.extend(sessionPlugin({ key: "counter", initial: () => 0 }))
   .extend(sessionPlugin({
       key: "settings",
       initial: () => ({ language: "en", notifications: true }),
   }));

// context.counter — number
// context.settings — { language: string, notifications: boolean }
```

## With Redis

```typescript
import { redisStorage } from "@gramio/storage-redis";

bot.extend(sessionPlugin({
    key: "data",
    initial: () => ({ visits: 0 }),
    storage: redisStorage({ host: "localhost", port: 6379 }),
}));
```

## TypeScript Typing

Type is inferred from the `initial` function return type:

```typescript
interface UserSession {
    language: string;
    preferences: Record<string, boolean>;
}

bot.extend(sessionPlugin({
    key: "session",
    initial: (): UserSession => ({
        language: "en",
        preferences: {},
    }),
}));
// context.session is typed as UserSession
```
