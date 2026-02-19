---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

title: GramIO - Powerful Telegram Bot API framework for TypeScript/JavaScript

head:
    - - meta
      - name: "description"
        content: GramIO is a TypeScript/JavaScript framework for building Telegram bots that works on Node.js, Bun and Deno. To start, bootstrap a new project with «npx create gramio bot-dir» and run the bot with «npm run dev». This is all it needs to do a get started with GramIO.

    - - meta
      - name: "keywords"
        content: telegram bot, framework, how to create a bot, Telegram, Telegram Bot API, GramIO, TypeScript, JavaScript, Node.JS, Nodejs, Deno, Bun, bot development, easy bot creation, modern bot framework, cross-platform bots, inline keyboards, webhook support, bot plugins, command handlers, conversation flow, middleware, context-based API

hero:
    name: "GramIO"
    text: |
        Create your 
        <span class="text-telegram"><span class="i-logos:telegram inline-block text-3xl md:text-5xl"></span> Telegram</span> bots with convenience!

    image:
        dark: /logo.svg
        light: /logo-light.svg
    actions:
        - theme: brand
          text: Get started
          link: /get-started
        # - theme: alt
        #   text: API Examples
        #   link: /api-examples
features:
    # - title: Alpha
    #   details: The project is currently in development (but it can already be used)
    - icon: 🔥
      title: Fast start project
      details: With <strong>npm create gramio</strong> you can quickly start a project in various configurations without wasting time on boring setup
    - icon: ✨
      title: Extensible
      details: Our <a href="/plugins/overview">plugin</a> and <a href="/hooks/overview">hook</a> system is awesome
    - icon: ⚙️
      title: Code-generated
      details: Many parts are code-generated
    - icon: 🛡️
      title: Type-safe
      details: Written in TypeScript with love ❤️
    - icon: 🌐
      title: Multi-runtime
      details: Works on <a href="https://nodejs.org/">Node.js</a>, <a href="https://bun.sh/">Bun</a> and <a href="https://deno.com/">Deno</a>
    - icon: 🪄
      title: And something else
      # details: Works on <a href="https://nodejs.org/">Node.js</a>, <a href="https://bun.sh/">Bun</a> and <a href="https://deno.com/">Deno</a>
---

## Latest Updates

**[GramIO v0.5.0 — Composer Rearchitecture, Observability & Testing Superpowers](/changelogs/2026-02-17)** — February 16–18, 2026

GramIO v0.5.0 drops `middleware-io` and builds on `@gramio/composer` v0.2.0 with `decorate()`, `when()`, `inspect()`, `trace()`, and custom framework methods. `@gramio/test` reaches v0.1.0 with reactions, inline queries, and a fluent scope API. `@gramio/session` v0.2.0 adds lazy session loading — reducing storage reads by up to 90%.

[All changelogs →](/changelogs/)

## Get started

This command will help you create a project with GramIO (and ORM, linters and plugins) the easiest way.

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

```bash [deno]
TODO:// Deno is supported but not in scaffolding
```

:::

For more information, see the «[Get started](/get-started)» section.

### GramIO in action

Example which uses some interesting features.

```ts twoslash
// @filename: utils.ts
export function findOrRegisterUser() {
    return {} as { id: number; name: string; balance: number };
}

// @filename: index.ts
// ---cut---
// @errors: 2339
import { Bot, format, bold, code } from "gramio";
import { findOrRegisterUser } from "./utils";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .derive("message", async () => {
        const user = await findOrRegisterUser();

        return {
            user,
        };
    })
    .on("message", (context) => {
        context.user;
        //        ^?
        //
        //
        //
        //
        //
        //
        //

        return context.send(format`
        Hi, ${bold(context.user.name)}! 
        You balance: ${code(context.user.balance)}`);
    })
    .on("callback_query", (context) => {
        //
        //
        context.user;
    });
```
