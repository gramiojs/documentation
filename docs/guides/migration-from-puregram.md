---
title: Migrating from puregram to GramIO
head:
    - - meta
      - name: "description"
        content: "Step-by-step guide to migrating your Telegram bot from puregram to GramIO. Side-by-side code comparisons for bot init, handlers, context, keyboards, sessions, scenes, and middleware."
    - - meta
      - name: "keywords"
        content: "migrate puregram to gramio, puregram vs gramio, gramio migration guide, switch from puregram, telegram bot typescript migration, nitreojs puregram"
---

# Migrating from puregram

This guide is for developers with a bot written in [puregram](https://github.com/nitreojs/puregram) who want to move to GramIO. Side-by-side comparisons show what changes.

---

## Why migrate?

Both are TypeScript-native Telegram bot frameworks. Key differences:

| | puregram | GramIO |
|---|---|---|
| Bot init | `new Telegram({ token })` / `.fromToken()` | `new Bot(token)` |
| Handler registration | `bot.updates.on()` | `bot.on()` |
| Starting the bot | `bot.updates.startPolling()` | `bot.start()` |
| Middleware | `bot.updates.use()` | `bot.use()` |
| Type-safe context extension | Manual augmentation | `.derive()` / `.extend()` — automatic |
| Formatting | HTML/MarkdownV2 strings | Tagged template literals → `MessageEntity` |
| `hears` / text matching | `@puregram/hear` plugin | Built-in `bot.hears()` |
| Scaffolding CLI | ❌ | ✅ `npm create gramio` |
| Built-in test utilities | ❌ | ✅ `@gramio/test` |
| Full Telegram API reference | ❌ | ✅ `/telegram/` |
| Multi-runtime (Node/Bun/Deno) | Node.js | Node.js, Bun, Deno |

---

## Installation

::: code-group

```bash [npm]
npm install gramio
npm uninstall puregram
```

```bash [yarn]
yarn add gramio
yarn remove puregram
```

```bash [pnpm]
pnpm add gramio
pnpm remove puregram
```

```bash [bun]
bun add gramio
bun remove puregram
```

:::

---

## Bot initialization

::: code-group

```ts [puregram]
import { Telegram } from "puregram";

// Object form
const bot = new Telegram({ token: process.env.BOT_TOKEN! });

// Factory form
const bot = Telegram.fromToken(process.env.BOT_TOKEN!);

bot.updates.startPolling();
```

```ts [GramIO]
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.start();
```

:::

**Key changes:**
- `Telegram` → `Bot`
- `new Telegram({ token })` → `new Bot(token)` (token is a direct argument)
- `bot.updates.startPolling()` → `bot.start()`

---

## Handlers

::: code-group

```ts [puregram]
bot.updates.on("message", (context) => {
    context.reply("Hello!");
});

bot.updates.on("callback_query", (context) => {
    context.answerCallbackQuery("Done!");
});
```

```ts [GramIO]
bot.on("message", (ctx) => {
    ctx.send("Hello!");
});

bot.callbackQuery("my-data", (ctx) => {
    ctx.answer();
});
```

:::

**Key changes:**
- `bot.updates.on()` → `bot.on()`
- `context.reply()` → `ctx.send()`
- `context.answerCallbackQuery()` → `ctx.answer()`

---

## Commands

::: code-group

```ts [puregram]
bot.updates.on("message", (context) => {
    if (context.text === "/start") {
        context.reply("Welcome!");
    }
});
```

```ts [GramIO]
// Built-in command handler
bot.command("start", (ctx) => ctx.send("Welcome!"));
```

:::

GramIO has first-class `.command()` support — no manual text checking needed.

---

## Text matching (hears)

::: code-group

```ts [puregram — @puregram/hear]
import { HearManager } from "@puregram/hear";

const hearManager = new HearManager<MessageContext>();

hearManager.hear(/hello/i, (context) => {
    context.reply("Hey!");
});

bot.updates.on("message", (context, next) =>
    hearManager.middleware(context, next)
);
```

```ts [GramIO — built-in]
// No plugin needed
bot.hears(/hello/i, (ctx) => ctx.send("Hey!"));

// String match
bot.hears("hello", (ctx) => ctx.send("Hey!"));

// Function predicate
bot.hears(
    (ctx) => ctx.text?.startsWith("?"),
    (ctx) => ctx.send("A question!"),
);
```

:::

`hears` is built into GramIO — the `@puregram/hear` plugin is not needed.

---

## Context properties

::: code-group

```ts [puregram]
context.chat        // TelegramChat
context.from        // TelegramUser
context.senderId    // context.from?.id shorthand
context.message     // TelegramMessage
context.text        // message text
context.callbackQuery  // on callback_query updates
```

```ts [GramIO]
ctx.chat            // TelegramChat
ctx.from            // TelegramUser | undefined
ctx.from?.id        // no special shorthand
ctx.message         // TelegramMessage | undefined
ctx.text            // string | undefined
// callback data is top-level on callbackQuery events
```

:::

---

## Middleware

::: code-group

```ts [puregram]
bot.updates.use(async (context, next) => {
    console.log("Before");
    await next();
    console.log("After");
});
```

```ts [GramIO]
bot.use(async (ctx, next) => {
    console.log("Before");
    await next();
    console.log("After");
});
```

:::

**Key change:** `bot.updates.use()` → `bot.use()`

---

## Adding data to context

::: code-group

```ts [puregram — middleware]
// Manual context augmentation via middleware
bot.updates.use(async (context, next) => {
    (context as any).user = await db.getUser(context.from?.id);
    await next();
});

// Must manually type-cast everywhere
const user = (context as any).user;
```

```ts [GramIO — derive()]
// Typed automatically — no casts
const bot = new Bot(token)
    .derive(async (ctx) => ({
        user: await db.getUser(ctx.from?.id),
    }));

bot.on("message", (ctx) => {
    ctx.user; // ✅ fully typed, no cast
});
```

:::

```ts
// Static startup-time data (db connection, config)
const bot = new Bot(token)
    .decorate({ db, redis, config });

bot.on("message", (ctx) => {
    ctx.db; // ✅
});
```

---

## Keyboards

### Inline keyboard

::: code-group

```ts [puregram]
import { Keyboard } from "puregram";

const keyboard = Keyboard.inline([
    [
        Keyboard.textButton({ text: "Yes", payload: "yes" }),
        Keyboard.textButton({ text: "No", payload: "no" }),
    ],
]);

context.reply("Choose:", { reply_markup: keyboard });
```

```ts [GramIO]
import { InlineKeyboard } from "gramio";

const keyboard = new InlineKeyboard()
    .text("Yes", "yes")
    .text("No", "no");

ctx.send("Choose:", { reply_markup: keyboard });
```

:::

### Reply keyboard

::: code-group

```ts [puregram]
import { Keyboard } from "puregram";

const keyboard = Keyboard.keyboard([
    [Keyboard.textButton({ text: "Option A" })],
    [Keyboard.textButton({ text: "Option B" })],
]).resize();

context.reply("Choose:", { reply_markup: keyboard });
```

```ts [GramIO]
import { Keyboard } from "gramio";

const keyboard = new Keyboard()
    .text("Option A")
    .row()
    .text("Option B")
    .resized();

ctx.send("Choose:", { reply_markup: keyboard });
```

:::

---

## Formatting

::: code-group

```ts [puregram]
// HTML — manual escaping required
context.reply(
    "<b>Hello</b> <a href='https://gramio.dev'>GramIO</a>",
    { parse_mode: "HTML" }
);

// MarkdownV2 — complex escaping
context.reply("*Bold* _italic_", { parse_mode: "MarkdownV2" });
```

```ts [GramIO]
import { format, bold, italic, link } from "gramio";

// Tagged template literals — no escaping, no parse_mode
ctx.send(
    format`${bold`Hello`} ${link("GramIO", "https://gramio.dev")}`
);
```

:::

---

## Session

::: code-group

```ts [puregram — @puregram/session]
import { SessionManager } from "@puregram/session";

const sessionManager = new SessionManager();

bot.updates.use(sessionManager.middleware);

bot.updates.on("message", (context) => {
    context.session.count ??= 0;
    context.session.count++;
    context.reply(`Count: ${context.session.count}`);
});
```

```ts [GramIO — @gramio/session]
import { session } from "@gramio/session";

const bot = new Bot(token).extend(
    session({ initial: () => ({ count: 0 }) })
);

bot.on("message", (ctx) => {
    ctx.session.count++;
    //    ^? { count: number } — typed!
    ctx.send(`Count: ${ctx.session.count}`);
});
```

:::

---

## Scenes

::: code-group

```ts [puregram — @puregram/scenes]
import { SceneManager, Scene } from "@puregram/scenes";

const sceneManager = new SceneManager();

const loginScene = new Scene("login");

loginScene.addStep(async (context, next) => {
    await context.reply("Enter your email:");
    await next();
});

loginScene.addStep(async (context) => {
    await context.reply(`Got: ${context.text}`);
});

sceneManager.addScenes([loginScene]);
bot.updates.use(sceneManager.middleware);
```

```ts [GramIO — @gramio/scenes]
import { scenes, Scene } from "@gramio/scenes";
import { session } from "@gramio/session";

const loginScene = new Scene("login")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("Enter your email:");
        return ctx.scene.update({ email: ctx.text });
    })
    .step("message", (ctx) =>
        ctx.send(`Got: ${ctx.scene.state.email}`)
    );

const bot = new Bot(token)
    .extend(session())
    .extend(scenes([loginScene]));

bot.command("login", (ctx) => ctx.scene.enter(loginScene));
```

:::

---

## Error handling

::: code-group

```ts [puregram]
// Wrap handlers manually
bot.updates.on("message", async (context) => {
    try {
        await riskyOperation();
    } catch (error) {
        context.reply("Something went wrong.");
    }
});
```

```ts [GramIO]
// Global error handler
bot.onError(({ context, error }) => {
    console.error(error);
    if (context.is("message")) context.send("Something went wrong.");
});

// Custom typed errors
class PaymentError extends Error {
    constructor(public reason: string) { super(); }
}

bot
    .error("PAYMENT_FAILED", PaymentError)
    .onError(({ kind, error }) => {
        if (kind === "PAYMENT_FAILED") console.log(error.reason);
    });
```

:::

---

## Webhook

::: code-group

```ts [puregram]
import { Telegram } from "puregram";
import express from "express";

const bot = Telegram.fromToken(token);
const app = express();

app.use(express.json());
app.post("/bot", (req, res) => {
    bot.updates.handleUpdate(req.body);
    res.sendStatus(200);
});

app.listen(3000);
```

```ts [GramIO]
import { Bot, webhookHandler } from "gramio";
import express from "express";

const app = express();
app.use(express.json());
app.post("/webhook", webhookHandler(bot, "express"));
app.listen(3000);

// Tell Telegram where to send updates
bot.start({
    webhook: { url: "https://example.com/webhook" },
});
```

:::

---

## Sending files

::: code-group

```ts [puregram]
import { MediaSource } from "puregram";

context.replyWithPhoto(MediaSource.path("./photo.jpg"));
context.replyWithPhoto(MediaSource.url("https://example.com/photo.jpg"));
context.replyWithPhoto(MediaSource.buffer(buffer, "photo.jpg"));
```

```ts [GramIO]
import { MediaUpload } from "@gramio/files";

ctx.sendPhoto(await MediaUpload.path("./photo.jpg"));
ctx.sendPhoto(await MediaUpload.url("https://example.com/photo.jpg"));
ctx.sendPhoto(await MediaUpload.buffer(buffer, "photo.jpg"));

// Already-uploaded file_id — pass directly
ctx.sendPhoto("AgACAgIAAxk...");
```

:::

---

## Direct API calls

::: code-group

```ts [puregram]
// Via context
await context.telegram.sendMessage({
    chat_id: context.chat.id,
    text: "Hello",
});

// Via bot
await bot.api.sendMessage({
    chat_id: chatId,
    text: "Hello",
});
```

```ts [GramIO]
// Via context
await ctx.api.sendMessage({ chat_id: ctx.chat.id, text: "Hello" });

// Via bot
await bot.api.sendMessage({ chat_id, text: "Hello" });
```

:::

Both use named params — the API shape is the same.

---

## Lifecycle hooks

::: code-group

```ts [puregram]
// Manual setup — no built-in hooks
process.on("SIGINT", () => bot.updates.stopPolling());
```

```ts [GramIO]
bot.onStart(({ info }) => console.log(`@${info.username} started`));
bot.onStop(() => console.log("Shutting down"));

// Graceful shutdown must be set up manually
process.on("SIGINT", () => bot.stop());
process.on("SIGTERM", () => bot.stop());

bot.start();
```

:::

---

## Quick symbol reference

| puregram | GramIO | Notes |
|----------|--------|-------|
| `new Telegram({ token })` | `new Bot(token)` | Direct token arg |
| `Telegram.fromToken(token)` | `new Bot(token)` | Same |
| `bot.updates.on()` | `bot.on()` | Flat, no `.updates` |
| `bot.updates.use()` | `bot.use()` | Flat, no `.updates` |
| `bot.updates.startPolling()` | `bot.start()` | |
| `context.reply()` | `ctx.send()` | |
| `context.senderId` | `ctx.from?.id` | No shorthand |
| `Keyboard.inline([...])` | `new InlineKeyboard()...` | Fluent builder |
| `Keyboard.keyboard([...])` | `new Keyboard()...` | Fluent builder |
| `MediaSource.path()` | `await MediaUpload.path()` | async |
| `@puregram/hear` | `bot.hears()` built-in | No plugin needed |
| `@puregram/session` | `@gramio/session` | |
| `@puregram/scenes` | `@gramio/scenes` | |
| `@puregram/prompt` | `@gramio/prompt` | |
| `parse_mode: "HTML"` | `format\`${bold\`...\`}\`` | No escaping |

---

## Next steps

- [Get started →](/get-started) — Scaffold a new GramIO project
- [Plugins overview →](/plugins/overview) — Sessions, scenes, i18n and more
- [Cheat Sheet →](/cheat-sheet) — Common patterns at a glance
- [Introduction →](/introduction) — Why GramIO, at a glance
