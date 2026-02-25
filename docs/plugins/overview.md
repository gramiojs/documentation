---
title: GramIO Plugins — Official Plugin Overview
head:
    - - meta
      - name: "description"
        content: "Browse GramIO's official plugins: Scenes, Sessions, I18n, Auto-retry, Autoload, Media cache, Pagination, and more. Each plugin composes via .extend() with full TypeScript type propagation."
    - - meta
      - name: "keywords"
        content: "GramIO plugins, telegram bot plugins, scenes plugin, session plugin, i18n plugin, autoload plugin, auto-retry, media cache, pagination, prompt, TypeScript telegram bot extensions"
---

# Plugins Overview

GramIO's plugin system is built on the same `.extend()` mechanism that powers the whole framework. Every plugin composes cleanly — plugins can add context properties, register handlers, and hook into the bot lifecycle, all with **full type propagation** to every downstream handler.

```ts
const bot = new Bot(token)
    .extend(session())       // ctx.session is now typed
    .extend(scenes([...]))   // ctx.scene is now typed
    .extend(i18n())          // ctx.i18n is now typed
    .on("message", (ctx) => {
        ctx.session; // ✅
        ctx.scene;   // ✅
        ctx.i18n;    // ✅
    });
```

---

## Official Plugins

### [Scenes](/plugins/official/scenes) — `@gramio/scenes`

Multi-step conversation flows. Build wizards, onboarding sequences, and multi-step forms where each step waits for the user's next message.

- Steps are typed: state flows from step to step
- Enter a scene from any handler; exit or jump to any step
- Works with session for persistent state across restarts

```ts
const registerScene = new Scene("register")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("What's your name?");
        return ctx.scene.update({ name: ctx.text });
    })
    .step("message", (ctx) =>
        ctx.send(`Welcome, ${ctx.scene.state.name}!`)
    );
```

[Full docs →](/plugins/official/scenes)

---

### [Session](/plugins/official/session) — `@gramio/session`

Per-user persistent state across messages. Reads and writes are transparent — just use `ctx.session` like a plain object.

- In-memory by default; plug in any [storage adapter](/storages)
- Initial state factory is typed end-to-end
- Works great with Scenes for storing scene state

```ts
const bot = new Bot(token).extend(
    session({ initial: () => ({ count: 0, name: "" }) })
);

bot.command("count", (ctx) => {
    ctx.session.count++;
    return ctx.send(`Count: ${ctx.session.count}`);
});
```

[Full docs →](/plugins/official/session)

---

### [I18n](/plugins/official/i18n) — `@gramio/i18n`

TypeScript-native internationalization with **full compile-time type safety** — no codegen, no `.ftl` files. Define translations as plain TS functions; `ShouldFollowLanguage` ensures every locale matches the primary language's keys and signatures.

- Translation values are plain functions — use `format`/`bold`/etc. directly
- Per-user locale from any source (database, session, Telegram `language_code`)
- Auto-completes keys and argument types in your editor
- Fluent `.ftl` support also available if you need advanced pluralization

```ts
import { defineI18n, type LanguageMap, type ShouldFollowLanguage } from "@gramio/i18n";
import { format, bold } from "gramio";

const en = {
    welcome: (name: string) => format`Hello, ${bold(name)}!`,
} satisfies LanguageMap;

const ru = {
    welcome: (name: string) => format`Привет, ${bold(name)}!`,
} satisfies ShouldFollowLanguage<typeof en>;

const i18n = defineI18n({ primaryLanguage: "en", languages: { en, ru } });

const bot = new Bot(token)
    // build a per-request t() scoped to the user's locale
    .derive((ctx) => ({
        t: i18n.buildT(ctx.from?.language_code ?? "en"),
    }));

bot.command("start", (ctx) =>
    ctx.send(ctx.t("welcome", ctx.from?.first_name ?? "stranger"))
);
```

[Full docs →](/plugins/official/i18n)

---

### [Autoload](/plugins/official/autoload) — `@gramio/autoload`

File-based handler registration. Drop a file in `src/commands/` and it registers automatically — no manual imports, no central registry.

- Glob pattern configurable (`src/commands/**/*.ts` by default)
- Each file exports a default function `(bot: Bot) => Bot`
- Works great with large bots split across many feature files

```ts
// src/index.ts
const bot = new Bot(token).extend(autoload());

// src/commands/start.ts
export default (bot: Bot) => bot.command("start", (ctx) => ctx.send("Hi!"));
```

[Full docs →](/plugins/official/autoload)

---

### [Prompt](/plugins/official/prompt) — `@gramio/prompt`

Awaitable single-reply prompts. Ask a question and `await` the user's response in a linear, readable flow — no need for state machines.

- Pauses execution and resumes when the user replies
- Optional timeout
- Pairs naturally with Scenes for complex flows

```ts
bot.command("rename", async (ctx) => {
    const reply = await ctx.prompt("What's your new name?");
    await ctx.send(`Name updated to: ${reply.text}`);
});
```

[Full docs →](/plugins/official/prompt)

---

### [Auto Retry](/plugins/official/auto-retry) — `@gramio/auto-retry`

Automatic handling of Telegram rate limits. When Telegram responds with `retry_after`, the plugin waits and retries transparently — no changes to your code needed.

- Handles `Too Many Requests` (429) errors automatically
- Configurable max retries and delay strategy
- Works for broadcasts, high-throughput bots

```ts
const bot = new Bot(token).extend(autoRetry());
// All API calls now retry automatically on rate limit
```

[Full docs →](/plugins/official/auto-retry)

---

### [Auto Answer Callback Query](/plugins/official/auto-answer-callback-query) — `@gramio/auto-answer-callback-query`

Never forget to acknowledge a callback query. Automatically answers all `callback_query` updates that weren't already answered — Telegram requires a response within 10 seconds or shows an error.

```ts
const bot = new Bot(token).extend(autoAnswerCallbackQuery());
// Now every inline button click is auto-acknowledged
```

[Full docs →](/plugins/official/auto-answer-callback-query)

---

### [Media Cache](/plugins/official/media-cache) — `@gramio/media-cache`

Upload a file once, reuse its `file_id` forever. Transparently caches `file_id` for uploaded media so Telegram doesn't re-upload the same file on every send.

- Works with any storage backend
- Reduces upload latency for repeated sends
- Transparent — no changes to send calls

[Full docs →](/plugins/official/media-cache)

---

### [Media Group](/plugins/official/media-group) — `@gramio/media-group`

Aggregate media group updates. Telegram sends `media_group` messages as individual updates. This plugin buffers them and delivers the full group to your handler as one event.

```ts
bot.on("message", (ctx) => {
    if (ctx.mediaGroup) {
        // ctx.mediaGroup is the full array of media group items
        ctx.send(`Got ${ctx.mediaGroup.length} photos`);
    }
});
```

[Full docs →](/plugins/official/media-group)

---

### [Pagination](/plugins/official/pagination) — `@gramio/pagination`

Typed paginated inline keyboards. Build multi-page lists with type-safe page data, next/prev buttons, and clean handler logic.

```ts
const paginationData = new CallbackData("page").number("offset");

const keyboard = pagination({
    data: paginationData,
    total: items.length,
    pageSize: 5,
    current: offset,
});
```

[Full docs →](/plugins/official/pagination)

---

### [Views](/plugins/official/views) — `@gramio/views`

Reusable message templates. Define a message (text + keyboard + options) once and render it anywhere, keeping UI and logic separate.

[Full docs →](/plugins/official/views)

---

### [JSX](/plugins/official/jsx) — `@gramio/jsx`

Write bot messages using JSX. Use familiar React-like syntax to compose rich messages with formatting entities.

```tsx
bot.command("start", (ctx) =>
    ctx.send(<b>Hello!</b> <i>Welcome to my bot.</i>)
);
```

[Full docs →](/plugins/official/jsx)

---

### [PostHog](/plugins/official/posthog) — `@gramio/posthog`

Analytics for your bot. Track user commands, events, and behavior in [PostHog](https://posthog.com/) with automatic event capture.

[Full docs →](/plugins/official/posthog)

---

### [OpenTelemetry](/plugins/official/opentelemetry) — `@gramio/opentelemetry`

Distributed tracing. Instrument your bot with [OpenTelemetry](https://opentelemetry.io/) spans for full observability — traces every API call, handler, and hook.

[Full docs →](/plugins/official/opentelemetry)

---

### [Sentry](/plugins/official/sentry) — `@gramio/sentry`

Error monitoring. Automatically captures unhandled errors and sends them to [Sentry](https://sentry.io/) with context (update type, user ID, etc.).

[Full docs →](/plugins/official/sentry)

---

### [Split](/plugins/official/split) — `@gramio/split`

Multi-instance routing. Split incoming updates across multiple bot instances or workers for high-throughput scenarios.

[Full docs →](/plugins/official/split)

---

## Which plugin do I need?

| Scenario | Use |
|----------|-----|
| Multi-step forms / wizards | [Scenes](/plugins/official/scenes) |
| Store user preferences / state | [Session](/plugins/official/session) |
| Multi-language bot | [I18n](/plugins/official/i18n) |
| Large bot with many command files | [Autoload](/plugins/official/autoload) |
| Ask a question, await response | [Prompt](/plugins/official/prompt) |
| Handle rate limits automatically | [Auto Retry](/plugins/official/auto-retry) |
| Avoid unacknowledged callback errors | [Auto Answer Callback Query](/plugins/official/auto-answer-callback-query) |
| Avoid re-uploading the same files | [Media Cache](/plugins/official/media-cache) |
| Handle album/media group messages | [Media Group](/plugins/official/media-group) |
| Paginated lists with inline buttons | [Pagination](/plugins/official/pagination) |
| Track user events and funnels | [PostHog](/plugins/official/posthog) |
| Error monitoring in production | [Sentry](/plugins/official/sentry) |
| Distributed tracing / observability | [OpenTelemetry](/plugins/official/opentelemetry) |

---

## Stacking plugins

Plugins compose — extend your bot with as many as you need, and the types stay correct throughout:

```ts
const bot = new Bot(token)
    .extend(session({ initial: () => ({ locale: "en", name: "" }) }))
    .extend(i18n())
    .extend(scenes([registerScene]))
    .extend(autoAnswerCallbackQuery())
    .extend(autoRetry());

// In any handler: ctx.session, ctx.i18n, ctx.scene — all typed ✅
```

---

## Write your own plugin

Any `Composer` can be packaged as a plugin. The [`Plugin`](/plugins/how-to-write) class adds a name and a clean `.extend()` interface.

```ts
import { Plugin } from "gramio";

export const myPlugin = new Plugin("my-plugin")
    .derive((ctx) => ({ isAdmin: ctx.from?.id === ADMIN_ID }));

// In consuming bot:
bot.extend(myPlugin);
// ctx.isAdmin is now typed everywhere ✅
```

[How to write a plugin →](/plugins/how-to-write)
