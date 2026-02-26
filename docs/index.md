---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

title: GramIO - Powerful Telegram Bot API framework for TypeScript/JavaScript

head:
    - - meta
      - name: "description"
        content: GramIO is a type-safe TypeScript framework for building Telegram bots on Node.js, Bun and Deno. One command scaffolds everything — plugins, ORM, Docker. End-to-end typed, multi-runtime, extensible.

    - - meta
      - name: "keywords"
        content: telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, bot development, type-safe, inline keyboards, webhook support, bot plugins, command handlers, middleware, scenes, sessions, i18n

hero:
    name: "GramIO"
    text: |
        Build <span class="text-telegram"><span class="i-logos:telegram inline-block text-3xl md:text-5xl"></span> Telegram</span> bots, the right way.
    tagline: Type-safe · Multi-runtime · Extensible
    image:
        dark: /logo.svg
        light: /logo-light.svg
    actions:
        - theme: brand
          text: Get started →
          link: /get-started
        - theme: alt
          text: Why GramIO
          link: /introduction

features:
    - icon: ⚡
      title: Zero to bot in 30 seconds
      details: <code>npm create gramio@latest</code> scaffolds a full project — TypeScript, ORM, linting, plugins, Docker — your choice.
    - icon: 🛡️
      title: End-to-end type safety
      details: Types flow from plugins through <a href="/extend/middleware">middleware</a> and <a href="/extend/composer">derive()</a> all the way into handlers. No casting, no <code>any</code>.
    - icon: 🧩
      title: Rich plugin ecosystem
      details: <a href="/plugins/official/scenes">Scenes</a>, <a href="/plugins/official/session">Sessions</a>, <a href="/plugins/official/i18n">I18n</a>, <a href="/plugins/official/auto-retry">Auto-retry</a>, <a href="/plugins/official/autoload">Autoload</a> and more — all composable via <code>.extend()</code>.
    - icon: 🌐
      title: Truly multi-runtime
      details: Runs on <a href="https://nodejs.org/">Node.js</a>, <a href="https://bun.sh/">Bun</a>, and <a href="https://deno.com/">Deno</a> with zero configuration changes.
    - icon: 📡
      title: Full Telegram API reference
      details: Every method and type documented with GramIO TypeScript examples, error tables, and tips. <a href="/telegram/">Browse the reference →</a>
    - icon: ⚙️
      title: Code-generated & always up to date
      details: Telegram Bot API types are auto-generated and published on every API release — you're never waiting for a maintainer.
---

## See it in action

::: code-group

```ts [Commands & Formatting]
import { Bot, format, bold, link } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("start", (ctx) =>
        ctx.send(
            format`${bold`Hello, ${ctx.from?.first_name ?? "stranger"}!`}

Welcome to ${link("GramIO", "https://gramio.dev")} — build Telegram bots the right way.`
        )
    )
    .onError(({ kind, error }) => console.error(kind, error))
    .start();
```

```ts [Keyboards & Callbacks]
import { Bot, InlineKeyboard, CallbackData } from "gramio";

const voteData = new CallbackData("vote").string("choice");

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("poll", (ctx) =>
        ctx.send("Do you like GramIO?", {
            reply_markup: new InlineKeyboard()
                .text("Yes ✅", voteData.pack({ choice: "yes" }))
                .text("Absolutely 🔥", voteData.pack({ choice: "yes2" })),
        })
    )
    .callbackQuery(voteData, (ctx) => {
        ctx.queryData.choice; // ^? string
        return ctx.answer();
    })
    .start();
```

```ts [I18n]
import { defineI18n, type LanguageMap, type ShouldFollowLanguage } from "@gramio/i18n";
import { Bot, format, bold } from "gramio";

const en = {
    welcome: (name: string) => format`Hello, ${bold(name)}!`,
    items: (n: number) => `You have ${n} item${n === 1 ? "" : "s"}`,
} satisfies LanguageMap;

const ru = {
    welcome: (name: string) => format`Привет, ${bold(name)}!`,
    items: (n: number) => `У вас ${n} предмет${n === 1 ? "" : "ов"}`,
} satisfies ShouldFollowLanguage<typeof en>; // enforces matching keys & signatures

const i18n = defineI18n({ primaryLanguage: "en", languages: { en, ru } });

const bot = new Bot(process.env.BOT_TOKEN as string)
    .derive((ctx) => ({
        t: i18n.buildT(ctx.from?.language_code ?? "en"),
    }))
    .command("start", (ctx) =>
        ctx.send(ctx.t("welcome", ctx.from?.first_name ?? "stranger"))
    )
    .start();
```

```ts [Scenes]
import { Bot } from "gramio";
import { session } from "@gramio/session";
import { Scene, scenes } from "@gramio/scenes";

const registerScene = new Scene("register")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("What's your name?");
        return ctx.scene.update({ name: ctx.text });
    })
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send(`Hi, ${ctx.scene.state.name}! Your email?`);
        return ctx.scene.update({ email: ctx.text });
    })
    .step("message", (ctx) =>
        ctx.send(`Registered: ${ctx.scene.state.name} — ${ctx.scene.state.email} ✅`)
    );

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(session())
    .extend(scenes([registerScene]))
    .command("register", (ctx) => ctx.scene.enter(registerScene))
    .start();
```

```ts [Composer]
import { Bot } from "gramio";
import { Composer } from "@gramio/composer";

// Shared middleware — typed context available in every module
const withUser = new Composer()
    .derive(async (ctx) => ({
        user: await db.getUser(ctx.from?.id ?? 0),
    }))
    .as("scoped");

// Feature module — guard + commands in one chain
const adminRouter = new Composer()
    .extend(withUser)
    .guard(
        (ctx) => ctx.user.role === "admin",
        (ctx) => ctx.send("Admins only."),
    )
    .command("ban",   (ctx) => ctx.send(`Banned by ${ctx.user.name}`))
    .command("stats", (ctx) => ctx.send("Stats..."));

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(withUser)      // ctx.user — typed everywhere below
    .extend(adminRouter)   // withUser inside → deduplicated, runs once
    .command("profile", (ctx) =>  // no guard — runs for every user
        ctx.send(`Hello, ${ctx.user.name}!`)
        //                  ^? fully typed
    )
    .start();
```

:::

## Latest Updates

**[Testing Gets Richer, CallbackData Gets Safer, TypeScript API Reference Launches](/changelogs/2026-02-23)** — February 18–22, 2026

`@gramio/test` v0.3.0 adds 9 new methods: edit messages, forward, pin, send media groups, and click inline buttons by label text. `@gramio/callback-data` v0.1.0 ships `safeUnpack()` — never crash on stale buttons. The full TypeScript API reference launches at `/api/`.

[All changelogs →](/changelogs/)

## Get started

::: code-group

```bash [npm]
npm create gramio@latest ./bot
```

```bash [yarn]
yarn create gramio@latest ./bot
```

```bash [pnpm]
pnpm create gramio@latest ./bot
```

```bash [bun]
bun create gramio@latest ./bot
```

:::

[Full get started guide →](/get-started)
