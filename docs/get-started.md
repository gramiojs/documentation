---
title: Get Started with GramIO - Create Telegram bots using TypeScript/JavaScript

head:
    - - meta
      - name: "description"
        content: Build your first Telegram bot in under a minute. One command scaffolds a full TypeScript project — ORM, linting, plugins, Docker. Works on Node.js, Bun, and Deno.

    - - meta
      - name: "keywords"
        content: telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, quick start, bot token, BotFather, scaffolding, create gramio, bot commands, inline keyboards, message formatting, sessions, plugins, scenes, i18n, middleware, derive, type-safe bot, bot development tutorial
---

# Get Started

Build your first Telegram bot in **under a minute** — type-safe, multi-runtime, with a rich plugin ecosystem.

## 1. Get your bot token

Open [@BotFather](https://t.me/BotFather) in Telegram, send `/newbot`, and follow the prompts. You'll get a token like:

```
110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw
```

## 2. Scaffold your project

One command sets up everything — TypeScript, linting, ORM, plugins, Docker — your choice.

::: pm-create gramio@latest ./bot
:::

::: details What's included in the scaffolder?
- **ORMs** — [Prisma](https://www.prisma.io/), [Drizzle](https://orm.drizzle.team/)
- **Linters** — [Biome](https://biomejs.dev/), [ESLint](https://eslint.org/) (with relevant plugins auto-configured)
- **Official plugins** — [Scenes](/plugins/official/scenes), [Session](/plugins/official/session), [I18n](/plugins/official/i18n), [Autoload](/plugins/official/autoload), [Prompt](/plugins/official/prompt), [Auto-retry](/plugins/official/auto-retry), [Media-cache](/plugins/official/media-cache), [Media-group](/plugins/official/media-group)
- **Other** — Dockerfile + docker-compose, [Husky](https://typicode.github.io/husky/) git hooks, [Jobify](https://github.com/kravetsone/jobify) (BullMQ wrapper), [GramIO storages](/storages)
:::

## 3. Start developing

<PackageManagers type="run" pkg="dev" prefix="cd bot &&" />

Your bot is live and hot-reloading. **That's it.** Now let's see what you can build.

---

## What GramIO looks like

### Handle commands

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (ctx) => ctx.send("Hello! 👋"))
    .command("help", (ctx) => ctx.send("Here's what I can do..."))
    .onStart(({ info }) => console.log(`Running as @${info.username}`));

bot.start();
```

### Format messages

No `parse_mode` — GramIO uses tagged template literals that produce proper `MessageEntity` objects automatically:

```ts twoslash
import { Bot, format, bold, italic, link, code } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (ctx) =>
        ctx.send(
            format`${bold`Welcome to the bot!`}
            Check out ${link("GramIO", "https://gramio.dev")} — ${italic("type-safe all the way down")}.`
        )
    );

bot.start();
```

### Build keyboards

Fluent chainable API for inline and reply keyboards:

```ts twoslash
import { Bot, InlineKeyboard } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("menu", (ctx) =>
        ctx.send("What would you like to do?", {
            reply_markup: new InlineKeyboard()
                .text("About", "about")
                .url("GitHub", "https://github.com/gramiojs/gramio")
                .row()
                .text("Settings ⚙️", "settings"),
        })
    );

bot.start();
```

### Inject type-safe context with `derive`

Enrich every handler with your own data — no casting, fully typed:

```ts twoslash
// @filename: db.ts
export const db = { getUser: async (id: number) => ({ name: "Alice", id }) };

// @filename: index.ts
// ---cut---
import { Bot } from "gramio";
import { db } from "./db";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .derive("message", async (ctx) => ({
        user: await db.getUser(ctx.from!.id),
    }))
    .on("message", (ctx) => {
        ctx.user;
        //   ^?
        //
        //
        //
        //
        return ctx.send(`Hi, ${ctx.user.name}!`);
    });

bot.start();
```

### Middleware pipeline with Composer

`Bot` extends [Composer](/extend/composer) — a chainable type-safe middleware pipeline. Every method enriches the context and returns the updated type, so the chain is always fully typed.

`Composer` also exists as a **standalone class** you can import and use independently of `Bot`. This matters a lot once your project grows:

| Method | What it does |
|--------|-------------|
| `use(ctx, next)` | Raw middleware — call `next()` to continue |
| `derive(fn)` | Async per-request context enrichment |
| `decorate(obj)` | Static enrichment at startup — zero per-request overhead |
| `guard(fn)` | Only continue if predicate returns `true` |
| `on(event, fn)` | Handle a specific update type |
| `extend(composer)` | Merge another composer in — inheriting its full types |

#### Production pattern: shared plugin composer

In a real project, register all your plugins **once** in a shared `Composer`, then extend it in every feature file. Each handler file becomes a plain `Composer` — no `Bot` import, no token, fully testable:

```ts
// src/plugins/index.ts
import { Composer } from "gramio";
import { scenes } from "@gramio/scenes";
import { session } from "@gramio/session";
import { greetingScene } from "../scenes/greeting.ts";

export const composer = new Composer()
    .extend(scenes([greetingScene]))
    .extend(session());
```

```ts
// src/features/start.ts
import { Composer } from "gramio";
import { composer } from "../plugins/index.ts";

export const startFeature = new Composer()
    .extend(composer) // ← inherits all plugin types
    .command("start", (ctx) => {
        ctx.scene; // ✅ fully typed — no Bot, no token needed
        return ctx.scene.enter(greetingScene);
    });
```

```ts
// src/index.ts
import { Bot } from "gramio";
import { composer } from "./plugins/index.ts";
import { startFeature } from "./features/start.ts";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(composer)      // plugins
    .extend(startFeature); // feature handlers

bot.start();
```

::: tip Why this works
`Composer` carries its type through every `.extend()`. When `startFeature` extends `composer`, TypeScript sees all the properties that plugins added — `ctx.scene`, `ctx.session`, etc. — without any casting or manual type annotation.
:::

### Extend with plugins

Plugins are installed with `.extend()`. They can add new context properties, register handlers, and hook into the lifecycle — all fully typed.

Here's how to add [Scenes](/plugins/official/scenes) for multi-step conversation flows:

::: pm-add @gramio/scenes
:::

```ts twoslash
import { Bot } from "gramio";
import { scenes, Scene } from "@gramio/scenes";

const registrationScene = new Scene("registration")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("What's your name?");
        return ctx.scene.update({ name: ctx.text });
    })
    .step("message", (ctx) => {
        ctx.scene.state;
        //          ^?
        //
        //
        //
        //
        return ctx.send(`Nice to meet you, ${ctx.scene.state.name}!`);
    });

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(scenes([registrationScene]))
    .command("start", (ctx) => ctx.scene.enter(registrationScene));

bot.start();
```

Each `.step()` is triggered by the next matching update from the same user. State is persisted across steps and fully typed.

---

## Official plugins

Extend your bot with first-party plugins that integrate seamlessly:

| Plugin | What it does |
|--------|-------------|
| [Session](/plugins/official/session) | Per-user state that persists between messages |
| [Scenes](/plugins/official/scenes) | Multi-step conversation flows and wizards |
| [I18n](/plugins/official/i18n) | Internationalization powered by Fluent |
| [Autoload](/plugins/official/autoload) | Auto-import handlers from the filesystem |
| [Auto-retry](/plugins/official/auto-retry) | Automatic retry on rate-limit errors |
| [Media-cache](/plugins/official/media-cache) | Cache uploaded file IDs to avoid re-uploads |
| [Media-group](/plugins/official/media-group) | Treat album updates as a single event |
| [Views](/plugins/official/views) | JSX-based message rendering |
| [Prompt](/plugins/official/prompt) | Wait for the next user message inline |
| [OpenTelemetry](/plugins/official/opentelemetry) | Distributed tracing and metrics |
| [Sentry](/plugins/official/sentry) | Error tracking and monitoring |

[Browse all plugins →](/plugins/overview)

---

## Manual setup

Prefer to wire things up yourself?

::: pm-add gramio
:::

Create `src/index.ts`:

::: code-group

```ts twoslash [Node.js / Bun]
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (ctx) => ctx.send("Hi! 👋"))
    .onStart(console.log);

bot.start();
```

```ts [Deno]
import { Bot } from "jsr:@gramio/core";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (ctx) => ctx.send("Hi! 👋"))
    .onStart(console.log);

bot.start();
```

:::

And run it:

::: code-group

```bash [tsx]
npx tsx ./src/index.ts
```

```bash [bun]
bun ./src/index.ts
```

```bash [deno]
deno run --allow-net --allow-env ./src/index.ts
```

:::
