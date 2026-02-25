---
title: Why GramIO — At a Glance
head:
    - - meta
      - name: "description"
        content: Why choose GramIO for your Telegram bot? End-to-end TypeScript type safety, multi-runtime support, composable plugins, and code-generated API types. See how it compares to grammY and Telegraf.
    - - meta
      - name: "keywords"
        content: GramIO vs grammY, GramIO vs Telegraf, telegram bot framework comparison, type-safe telegram bot, typescript telegram bot, gramio introduction, why gramio
---

# Why GramIO

GramIO is a **TypeScript-first Telegram Bot API framework** that runs on Node.js, Bun, and Deno. It's built around one idea: the type system should work _for_ you, not against you.

Here's what that means in practice.

---

## Types that flow, not types you fight

Most frameworks give you a typed context at entry. GramIO goes further — types **propagate through the entire chain** as you build it.

```ts twoslash
// @filename: db.ts
export const db = { getUser: async (id: number) => ({ name: "Alice", role: "admin" as const, balance: 42 }) }
// @filename: index.ts
// ---cut---
// @errors: 2339
import { Bot } from "gramio";
import { db } from "./db";

const bot = new Bot(process.env.BOT_TOKEN as string)
    // add to every handler — typed automatically
    .derive(async (ctx) => ({
        user: await db.getUser(ctx.from!.id),
    }))
    // ctx.user is now fully typed here
    .on("message", (ctx) => {
        ctx.user.role;
        //         ^?
        //
        //
        return ctx.send(`Hi, ${ctx.user.name}!`);
    })
    // ...and here, even for a different event
    .on("callback_query", (ctx) => ctx.user.balance);
```

No casting. No manual type annotations. No `(ctx as any).user`.

---

## Formatting without `parse_mode`

Telegram formatting with raw HTML or MarkdownV2 is painful — you have to escape everything manually and track `parse_mode`. GramIO uses tagged template literals that produce proper `MessageEntity` objects:

```ts twoslash
import { Bot, format, bold, italic, code, link, spoiler } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("start", (ctx) =>
    ctx.send(
        format`${bold`Welcome!`} — ${italic("no parse_mode needed")}.
Version: ${code("2.0.0")}
${spoiler`secret`} · ${link("gramio.dev", "https://gramio.dev")}`
    )
);
```

No escaping. No `parse_mode: "HTML"`. No broken messages when a username contains `<` or `>`.

---

## Plugins that compose, not configure

Plugins in GramIO use `.extend()` — the same mechanism as everything else. A plugin can add context properties, register handlers, and hook into the lifecycle. And it's all typed end-to-end:

```ts twoslash
import { Bot } from "gramio";
import { scenes, Scene } from "@gramio/scenes";
import { session } from "@gramio/session";

const onboarding = new Scene("onboarding")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("What's your name?");
        return ctx.scene.update({ name: ctx.text });
    })
    .step("message", (ctx) =>
        ctx.send(`Welcome, ${ctx.scene.state.name}!`)
    );

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(session())
    .extend(scenes([onboarding]))
    .command("start", (ctx) => ctx.scene.enter(onboarding));
//                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                              fully typed — ctx.scene comes from the plugin

bot.start();
```

---

## Comparison

| Feature | GramIO | grammY | Telegraf |
|---------|--------|--------|----------|
| Language | TypeScript | TypeScript | TypeScript |
| Type propagation through middleware | ✅ Full | ✅ Full | ⚠️ Partial |
| `derive()` with auto-typed context | ✅ | ✅ | ❌ |
| Formatting without `parse_mode` | ✅ Built-in | ❌ Manual | ❌ Manual |
| Plugin system | ✅ `.extend()` | ✅ Flavors | ⚠️ Middleware |
| Multi-runtime (Node/Bun/Deno) | ✅ | ✅ | ⚠️ Node focused |
| Code-generated API types | ✅ Auto-published | ✅ | ⚠️ |
| Built-in test utilities | ✅ `@gramio/test` | ❌ | ❌ |
| Full Telegram API reference | ✅ `/telegram/` | ❌ | ❌ |
| Scenes / conversations | ✅ `@gramio/scenes` | ✅ Conversations | ✅ Scenes |
| I18n | ✅ `@gramio/i18n` (Fluent) | ✅ | ⚠️ |
| Scaffolding CLI | ✅ `create gramio` | ❌ | ❌ |

---

## Everything is a Composer

`Bot` extends `Composer` — a chainable, type-safe middleware pipeline. Every `.derive()`, `.guard()`, `.on()` returns the updated type. You can extract a `Composer` for any feature, test it in isolation, then `.extend()` it into your bot:

```ts
// src/plugins/index.ts — register once
export const composer = new Composer()
    .extend(session())
    .extend(scenes([onboarding]));

// src/features/profile.ts — fully typed, no Bot needed
export const profileFeature = new Composer()
    .extend(composer)          // inherits ctx.session, ctx.scene
    .command("profile", (ctx) => ctx.send(ctx.session.name ?? "anon"));

// src/index.ts — wire together
const bot = new Bot(token)
    .extend(composer)
    .extend(profileFeature);
```

---

## Ready to build?

<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px">

[Get started →](/get-started)

[Browse plugins →](/plugins/overview)

[Telegram API reference →](/telegram/)

</div>
