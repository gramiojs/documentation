---
title: Migrating from Telegraf to GramIO
head:
    - - meta
      - name: "description"
        content: "Step-by-step guide to migrating your Telegram bot from Telegraf to GramIO. Side-by-side code comparisons for handlers, context, keyboards, sessions, scenes, TypeScript, and webhooks."
    - - meta
      - name: "keywords"
        content: "migrate telegraf to gramio, telegraf vs gramio, telegraf migration guide, switch from telegraf, telegram bot framework migration, TypeScript bot migration"
---

# Migrating from Telegraf

This guide is for developers who have a bot written with [Telegraf](https://telegraf.js.org/) and want to switch to GramIO. Both are TypeScript-first middleware-based frameworks — the mental model is similar, but the APIs differ in important ways.

---

## Why migrate?

| | Telegraf | GramIO |
|---|---|---|
| TypeScript plugin typing | Manual interface merging | `.extend()` — types flow automatically |
| Formatting | HTML / MarkdownV2 strings | Tagged template literals → `MessageEntity` |
| Built-in test utilities | ❌ | ✅ `@gramio/test` |
| Full Telegram API reference | ❌ | ✅ `/telegram/` |
| Scaffolding CLI | ❌ | ✅ `npm create gramio` |
| `derive()` auto-typing | Manual context augmentation | ✅ first-class `.derive()` |
| Built-in webhook server | ✅ (via `bot.launch()`) | ❌ (bring your own + `webhookHandler`) |
| Scenes / WizardScene | `Scenes.WizardScene` + `Stage` | `@gramio/scenes` — typed state flow |
| Named API params | Mixed positional/object | All named `{ chat_id, text }` |

---

## Installation

::: code-group

```bash [npm]
npm install gramio
npm uninstall telegraf
```

```bash [yarn]
yarn add gramio
yarn remove telegraf
```

```bash [pnpm]
pnpm add gramio
pnpm remove telegraf
```

```bash [bun]
bun add gramio
bun remove telegraf
```

:::

---

## Bot initialization

::: code-group

```ts [Telegraf]
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.launch();
```

```ts [GramIO]
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.start();
```

:::

**Key changes:**
- `new Telegraf(token)` → `new Bot(token)`
- `bot.launch()` → `bot.start()`

---

## Handlers

::: code-group

```ts [Telegraf]
// Command
bot.command("start", (ctx) => ctx.reply("Hello!"));

// Text message
bot.on("text", (ctx) => ctx.reply(ctx.message.text));

// Any message
bot.on("message", (ctx) => ctx.reply("Got it!"));

// Hears
bot.hears(/hello/i, (ctx) => ctx.reply("Hey!"));

// Callback query (button press)
bot.action("yes", (ctx) => {
    ctx.answerCbQuery();
    ctx.reply("You said yes!");
});
```

```ts [GramIO]
// Command
bot.command("start", (ctx) => ctx.send("Hello!"));

// Text message
bot.on("message", (ctx) => ctx.send(ctx.text ?? ""));

// Any message
bot.on("message", (ctx) => ctx.send("Got it!"));

// Hears
bot.hears(/hello/i, (ctx) => ctx.send("Hey!"));

// Callback query (button press)
bot.callbackQuery("yes", (ctx) => {
    ctx.answer(); // auto-acknowledges
    ctx.send("You said yes!");
});
```

:::

**Key changes:**
- `ctx.reply()` → `ctx.send()`
- `bot.on("text")` Telegraf filter → use `ctx.text` inside `bot.on("message")`
- `bot.action("data")` → `bot.callbackQuery("data")`
- `ctx.answerCbQuery()` → `ctx.answer()`

---

## Context properties

::: code-group

```ts [Telegraf]
ctx.message          // TelegramMessage | undefined
ctx.message?.text    // string | undefined
ctx.from             // TelegramUser | undefined
ctx.chat             // TelegramChat | undefined
ctx.callbackQuery    // TelegramCallbackQuery | undefined
ctx.update           // raw TelegramUpdate
```

```ts [GramIO]
ctx.message          // TelegramMessage | undefined
ctx.text             // string | undefined  (shorthand on message ctx)
ctx.from             // TelegramUser | undefined
ctx.chat             // TelegramChat | undefined
// (callback_query and inline_query are top-level ctx properties on those events)
```

:::

---

## Sending messages

::: code-group

```ts [Telegraf]
await ctx.reply("Hello!");
await ctx.reply("<b>Hello!</b>", { parse_mode: "HTML" });
await ctx.replyWithPhoto("file_id");
await ctx.telegram.sendMessage(chatId, "Hello from outside!");
```

```ts [GramIO]
await ctx.send("Hello!");

import { format, bold } from "gramio";
await ctx.send(format`${bold`Hello!`}`); // no parse_mode needed

await ctx.sendPhoto("file_id");
await bot.api.sendMessage({ chat_id: chatId, text: "Hello from outside!" });
```

:::

**Key changes:**
- `ctx.reply()` → `ctx.send()`
- `ctx.replyWithPhoto()` → `ctx.sendPhoto()`
- `ctx.telegram.method()` → `bot.api.method({ ...namedParams })`
- No `parse_mode` — use `format` tagged template literals

---

## Direct API calls

::: code-group

```ts [Telegraf]
// From inside a handler
await ctx.telegram.sendMessage(chatId, "Hello!");
await ctx.telegram.sendPhoto(chatId, { source: "./photo.jpg" });
await ctx.telegram.banChatMember(chatId, userId);

// Outside a handler
await bot.telegram.sendMessage(chatId, "Hello!");
```

```ts [GramIO]
// From inside a handler
await ctx.api.sendMessage({ chat_id: chatId, text: "Hello!" });
await ctx.api.sendPhoto({ chat_id: chatId, photo: "file_id" });
await ctx.api.banChatMember({ chat_id: chatId, user_id: userId });

// Outside a handler
await bot.api.sendMessage({ chat_id: chatId, text: "Hello!" });
```

:::

**Key change:** `ctx.telegram` / `bot.telegram` → `ctx.api` / `bot.api` with fully named params.

---

## Keyboards

::: code-group

```ts [Telegraf]
import { Markup } from "telegraf";

// Inline keyboard
ctx.reply("Choose:", Markup.inlineKeyboard([
    [
        Markup.button.callback("Yes ✅", "yes"),
        Markup.button.callback("No ❌", "no"),
    ],
    [Markup.button.url("GitHub", "https://github.com/gramiojs/gramio")],
]));

// Reply keyboard
ctx.reply("Choose:", Markup.keyboard([
    ["Option A", "Option B"],
]).resize());

// Remove keyboard
ctx.reply("Removed.", Markup.removeKeyboard());
```

```ts [GramIO]
import { InlineKeyboard, Keyboard, RemoveKeyboard } from "gramio";

// Inline keyboard
ctx.send("Choose:", {
    reply_markup: new InlineKeyboard()
        .text("Yes ✅", "yes")
        .text("No ❌", "no")
        .row()
        .url("GitHub", "https://github.com/gramiojs/gramio"),
});

// Reply keyboard
ctx.send("Choose:", {
    reply_markup: new Keyboard()
        .text("Option A")
        .text("Option B")
        .resized(),
});

// Remove keyboard
ctx.send("Removed.", { reply_markup: new RemoveKeyboard() });
```

:::

**Key changes:**
- `Markup.inlineKeyboard([...])` → `new InlineKeyboard().text(...).row()...`
- `Markup.keyboard([...]).resize()` → `new Keyboard().text(...).resized()`
- `Markup.removeKeyboard()` → `new RemoveKeyboard()`

---

## Type-safe callback data

::: code-group

```ts [Telegraf]
// Building
ctx.reply("Choose:", Markup.inlineKeyboard([
    [
        Markup.button.callback("Item 1", "action:1"),
        Markup.button.callback("Item 2", "action:2"),
    ],
]));

// Handling
bot.action(/action:(\d+)/, (ctx) => {
    const id = parseInt(ctx.match[1]);
    ctx.reply(`You picked: ${id}`);
    ctx.answerCbQuery();
});
```

```ts [GramIO]
import { CallbackData, InlineKeyboard } from "gramio";

const actionData = new CallbackData("action").number("id");

// Building
ctx.send("Choose:", {
    reply_markup: new InlineKeyboard()
        .text("Item 1", actionData.pack({ id: 1 }))
        .text("Item 2", actionData.pack({ id: 2 })),
});

// Handling
bot.callbackQuery(actionData, (ctx) => {
    ctx.send(`You picked: ${ctx.queryData.id}`);
    //                                  ^? number
});
```

:::

---

## Formatting

::: code-group

```ts [Telegraf]
await ctx.reply(
    "<b>Hello!</b> Visit <a href='https://gramio.dev'>GramIO</a>.",
    { parse_mode: "HTML" }
);
```

```ts [GramIO]
import { format, bold, link } from "gramio";

await ctx.send(
    format`${bold`Hello!`} Visit ${link("GramIO", "https://gramio.dev")}.`
);
```

:::

---

## TypeScript / Adding custom context

In Telegraf you augment the context interface manually and pass it as a generic. In GramIO, `.derive()` and `.extend()` do this automatically with zero boilerplate.

::: code-group

```ts [Telegraf]
// 1. Define your custom context
interface MyContext extends Context {
    session: { count: number };
    isAdmin: boolean;
}

// 2. Pass it as generic to every construct
const bot = new Telegraf<MyContext>(token);

// 3. Register middleware that fills it in
bot.use(session<MyContext>({ ... }));
bot.use(async (ctx, next) => {
    ctx.isAdmin = ctx.from?.id === ADMIN_ID;
    await next();
});

// 4. Use it
bot.on("message", (ctx) => {
    ctx.isAdmin; // boolean — but not statically verified by the compiler
});
```

```ts [GramIO]
// .derive() enriches the context — types flow automatically
const bot = new Bot(token)
    .extend(session({ initial: () => ({ count: 0 }) }))
    .derive((ctx) => ({
        isAdmin: ctx.from?.id === ADMIN_ID,
    }));

bot.on("message", (ctx) => {
    ctx.isAdmin; // ✅ boolean — inferred by the compiler
    ctx.session; // ✅ { count: number } — from .extend(session(...))
});
```

:::

---

## Session

::: code-group

```ts [Telegraf]
import { session } from "telegraf/session";

interface SessionData { count: number }
interface MyContext extends Context { session: SessionData }

const bot = new Telegraf<MyContext>(token);
bot.use(session<MyContext>({ defaultSession: () => ({ count: 0 }) }));

bot.command("count", (ctx) => {
    ctx.session.count++;
    ctx.reply(`Count: ${ctx.session.count}`);
});
```

```ts [GramIO]
import { session } from "@gramio/session";

const bot = new Bot(token).extend(
    session({ initial: () => ({ count: 0 }) })
);

bot.command("count", (ctx) => {
    ctx.session.count++;
    //    ^? { count: number }
    ctx.send(`Count: ${ctx.session.count}`);
});
```

:::

---

## Scenes / WizardScene

::: code-group

```ts [Telegraf]
import { Scenes, session } from "telegraf";

const wizard = new Scenes.WizardScene(
    "register",
    async (ctx) => {
        await ctx.reply("What's your name?");
        return ctx.wizard.next();
    },
    async (ctx) => {
        const name = ctx.message && "text" in ctx.message ? ctx.message.text : "";
        await ctx.reply(`Hello, ${name}!`);
        return ctx.scene.leave();
    },
);

const stage = new Scenes.Stage([wizard]);
bot.use(session());
bot.use(stage.middleware());

bot.command("register", (ctx) => ctx.scene.enter("register"));
```

```ts [GramIO]
import { Scene, scenes } from "@gramio/scenes";
import { session } from "@gramio/session";

const registerScene = new Scene("register")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("What's your name?");
        return ctx.scene.update({ name: ctx.text });
    })
    .step("message", (ctx) =>
        ctx.send(`Hello, ${ctx.scene.state.name}!`)
    );

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(session())
    .extend(scenes([registerScene]));

bot.command("register", (ctx) => ctx.scene.enter(registerScene));
```

:::

**Key changes:**
- No `Stage` class — pass scenes directly to `scenes([...])`
- No `ctx.wizard.next()` — steps advance automatically when a matching update arrives
- State is typed: `ctx.scene.state` carries what you passed to `ctx.scene.update()`
- Leave a scene with `ctx.scene.leave()` (or it ends after the last step)

---

## Error handling

::: code-group

```ts [Telegraf]
// Per-handler try/catch
bot.command("start", async (ctx) => {
    try {
        await riskyOperation();
    } catch (e) {
        await ctx.reply("Something went wrong.");
    }
});

// Global error handler
bot.catch((err, ctx) => {
    console.error(err);
    ctx.reply("An error occurred.");
});
```

```ts [GramIO]
// Centralized error handler
bot.onError(({ context, kind, error }) => {
    console.error(kind, error.message);
    if (context.is("message")) context.send("Something went wrong.");
});

// Custom typed errors
class NoRights extends Error {
    constructor(public role: "admin" | "moderator") { super(); }
}

const bot = new Bot(process.env.BOT_TOKEN as string)
    .error("NO_RIGHTS", NoRights)
    .onError(({ kind, error, context }) => {
        if (kind === "NO_RIGHTS" && context.is("message"))
            context.send(`You need the «${error.role}» role.`);
    });
```

:::

**Key changes:**
- `bot.catch((err, ctx) => ...)` → `bot.onError(({ context, kind, error }) => ...)`
- Errors can be given typed names with `.error("KIND", ErrorClass)`

---

## Graceful shutdown

::: code-group

```ts [Telegraf]
// Built into bot.launch()
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
```

```ts [GramIO]
// Wire up manually
process.on("SIGINT", () => bot.stop());
process.on("SIGTERM", () => bot.stop());
```

:::

---

## Webhook

Telegraf has a built-in HTTP server via `bot.launch({ webhook: { ... } })`. GramIO does not — you bring your own framework and use `webhookHandler`.

::: code-group

```ts [Telegraf]
// Built-in webhook server
bot.launch({
    webhook: {
        domain: "https://example.com",
        port: 3000,
    },
});

// Or manual with express
import express from "express";
const app = express();
app.use(express.json());
app.use(bot.webhookCallback("/webhook"));
app.listen(3000);
```

```ts [GramIO]
import { Bot, webhookHandler } from "gramio";
import Fastify from "fastify";

const bot = new Bot(process.env.BOT_TOKEN as string);
const fastify = Fastify();

fastify.post("/webhook", webhookHandler(bot, "fastify"));
fastify.listen({ port: 3000, host: "::" });

// Calls setWebhook on Telegram — does NOT start an HTTP server
bot.start({
    webhook: { url: "https://example.com/webhook" },
});
```

:::

See [all supported frameworks →](/updates/webhook) (Hono, Express, Elysia, Koa, Bun.serve, Deno.serve, node:http)

---

## Middleware

Both frameworks use `(ctx, next) => ...` middleware chains.

::: code-group

```ts [Telegraf]
bot.use(async (ctx, next) => {
    console.log("Before:", ctx.updateType);
    await next();
    console.log("After");
});
```

```ts [GramIO]
bot.use(async (ctx, next) => {
    console.log("Before:", ctx.update);
    await next();
    console.log("After");
});
```

:::

The shape is identical — `bot.use()` works the same way.

---

## Quick reference

| Telegraf | GramIO |
|---|---|
| `new Telegraf(token)` | `new Bot(token)` |
| `bot.launch()` | `bot.start()` |
| `ctx.reply(text)` | `ctx.send(text)` |
| `ctx.replyWithPhoto(file_id)` | `ctx.sendPhoto(file_id)` |
| `ctx.telegram.sendMessage(id, text)` | `ctx.api.sendMessage({ chat_id: id, text })` |
| `bot.telegram.sendMessage(id, text)` | `bot.api.sendMessage({ chat_id: id, text })` |
| `bot.action("data", handler)` | `bot.callbackQuery("data", handler)` |
| `ctx.answerCbQuery()` | `ctx.answer()` |
| `Markup.inlineKeyboard([...])` | `new InlineKeyboard().text(...)` |
| `Markup.keyboard([...]).resize()` | `new Keyboard().text(...).resized()` |
| `Markup.removeKeyboard()` | `new RemoveKeyboard()` |
| `interface MyContext extends Context {}` | `.derive(ctx => ({...}))` |
| `bot.use(session({...}))` | `.extend(session({...}))` |
| `new Scenes.WizardScene(...)` + `Stage` | `new Scene(...) ` + `scenes([...])` |
| `bot.catch((err, ctx) => ...)` | `bot.onError(({ error, context }) => ...)` |
| Built-in webhook server | `webhookHandler(bot, "framework")` + your server |
| HTML / MarkdownV2 strings | `format\`${bold\`text\`}\`` |
