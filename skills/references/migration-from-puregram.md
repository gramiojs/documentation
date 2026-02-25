---
name: migration-from-puregram
description: Complete puregram → GramIO migration reference. Symbol mapping, API comparisons, and refactoring patterns for converting puregram bots to GramIO.
---

# puregram → GramIO Migration Reference

Use this when the user wants to migrate, refactor, or convert a puregram bot to GramIO.

## Critical Symbol Mapping

| puregram | GramIO | Notes |
|----------|--------|-------|
| `import { Telegram } from "puregram"` | `import { Bot } from "gramio"` | |
| `new Telegram({ token })` | `new Bot(token)` | Token as direct arg |
| `Telegram.fromToken(token)` | `new Bot(token)` | Same |
| `bot.updates.on(event, handler)` | `bot.on(event, handler)` | Drop `.updates` |
| `bot.updates.use(middleware)` | `bot.use(middleware)` | Drop `.updates` |
| `bot.updates.startPolling()` | `bot.start()` | |
| `bot.updates.stopPolling()` | handled by `bot.stop()` or SIGINT | |
| `context.reply(text, opts?)` | `ctx.send(text, opts?)` | |
| `context.send(text, opts?)` | `ctx.send(text, opts?)` | |
| `context.senderId` | `ctx.from?.id` | No shorthand in GramIO |
| `context.from` | `ctx.from` | Same |
| `context.chat` | `ctx.chat` | Same |
| `context.message` | `ctx.message` | Same |
| `context.text` | `ctx.text` | Same |
| `context.answerCallbackQuery(text?)` | `ctx.answer(text?)` | |
| `context.telegram.sendMessage({...})` | `ctx.api.sendMessage({...})` | Both named params |
| `Keyboard.inline([[...]])` | `new InlineKeyboard().text(...)` | Fluent builder |
| `Keyboard.keyboard([[...]])` | `new Keyboard().text(...)` | Fluent builder |
| `Keyboard.textButton({ text, payload })` | `.text(label, callbackData)` | Inline; `.text(label)` for reply |
| `MediaSource.path(p)` | `await MediaUpload.path(p)` | Note: async |
| `MediaSource.url(u)` | `await MediaUpload.url(u)` | Note: async |
| `MediaSource.buffer(b, name)` | `await MediaUpload.buffer(b, name)` | Note: async |
| `@puregram/hear` HearManager | `bot.hears()` built-in | No plugin needed |
| `@puregram/session` SessionManager | `@gramio/session` via `.extend()` | |
| `@puregram/scenes` SceneManager | `@gramio/scenes` via `.extend()` | |
| `@puregram/prompt` | `@gramio/prompt` | |
| `parse_mode: "HTML"` | `format\`${bold\`...\`}\`` | No parse_mode |

## Bot Init Pattern

```typescript
// puregram
import { Telegram } from "puregram";
const bot = new Telegram({ token: process.env.BOT_TOKEN! });
bot.updates.startPolling();

// GramIO
import { Bot } from "gramio";
const bot = new Bot(process.env.BOT_TOKEN as string);
bot.start();
```

## Handler Registration

```typescript
// puregram
bot.updates.on("message", (context) => { context.reply("Hi!"); });
bot.updates.on("callback_query", (context) => { context.answerCallbackQuery(); });

// GramIO
bot.on("message", (ctx) => { ctx.send("Hi!"); });
bot.command("start", (ctx) => ctx.send("Welcome!"));          // built-in
bot.hears(/pattern/i, (ctx) => ctx.send("Matched!"));         // built-in
bot.callbackQuery("data", (ctx) => ctx.answer());             // built-in
```

## Middleware

```typescript
// puregram
bot.updates.use(async (context, next) => {
    await next();
});

// GramIO — identical signature, different registration
bot.use(async (ctx, next) => {
    await next();
});
```

## Context Extension (the big difference)

```typescript
// puregram — manual middleware + type augmentation
bot.updates.use(async (context, next) => {
    (context as any).user = await db.getUser(context.from?.id);
    await next();
});

// GramIO — derive() is typed automatically
const bot = new Bot(token)
    .derive(async (ctx) => ({
        user: await db.getUser(ctx.from?.id),
    }));
// ctx.user is fully typed everywhere downstream

// Static values (db connections etc) — decorate()
const bot = new Bot(token).decorate({ db, redis });
```

## Keyboards

```typescript
// puregram inline
import { Keyboard } from "puregram";
Keyboard.inline([
    [{ text: "Yes", callback_data: "yes" }, { text: "No", callback_data: "no" }],
]);

// GramIO inline
import { InlineKeyboard } from "gramio";
new InlineKeyboard().text("Yes", "yes").text("No", "no");

// puregram reply
Keyboard.keyboard([[{ text: "A" }, { text: "B" }]]).resize();

// GramIO reply
import { Keyboard } from "gramio";
new Keyboard().text("A").text("B").resized();
```

## Formatting

```typescript
// puregram
context.reply("<b>Hello</b>", { parse_mode: "HTML" });

// GramIO — NEVER use parse_mode with format entities
import { format, bold, italic, code, link, spoiler } from "gramio";
ctx.send(format`${bold`Hello`} ${italic`world`}`);
// GramIO passes entities automatically — adding parse_mode BREAKS messages
```

## Session

```typescript
// puregram (@puregram/session)
import { SessionManager } from "@puregram/session";
const sessionManager = new SessionManager();
bot.updates.use(sessionManager.middleware);
// context.session is untyped

// GramIO (@gramio/session)
import { session } from "@gramio/session";
const bot = new Bot(token).extend(
    session({ initial: () => ({ count: 0, name: "" }) })
);
// ctx.session is { count: number; name: string } — fully typed
```

## Scenes

```typescript
// puregram (@puregram/scenes)
import { SceneManager, Scene } from "@puregram/scenes";
const scene = new Scene("register");
scene.addStep(async (ctx, next) => { await ctx.reply("Name?"); await next(); });
scene.addStep(async (ctx) => { await ctx.reply(`Got: ${ctx.text}`); });
const manager = new SceneManager();
manager.addScenes([scene]);
bot.updates.use(manager.middleware);

// GramIO (@gramio/scenes) — typed state between steps
import { scenes, Scene } from "@gramio/scenes";
import { session } from "@gramio/session";
const registerScene = new Scene("register")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("Name?");
        return ctx.scene.update({ name: ctx.text });
    })
    .step("message", (ctx) => ctx.send(`Welcome, ${ctx.scene.state.name}!`));
const bot = new Bot(token).extend(session()).extend(scenes([registerScene]));
bot.command("start", (ctx) => ctx.scene.enter(registerScene));
```

## Error Handling

```typescript
// puregram — try/catch in every handler
bot.updates.on("message", async (context) => {
    try { ... } catch (e) { context.reply("Error"); }
});

// GramIO — global handler
bot.onError(({ context, error }) => {
    if (context.is("message")) context.send("Error");
});
// + typed custom errors via .error("KIND", ErrorClass)
```

## File Upload

```typescript
// puregram
import { MediaSource } from "puregram";
context.replyWithPhoto(MediaSource.path("./photo.jpg"));
context.replyWithPhoto(MediaSource.url("https://..."));

// GramIO — async MediaUpload
import { MediaUpload } from "@gramio/files";
ctx.sendPhoto(await MediaUpload.path("./photo.jpg"));
ctx.sendPhoto(await MediaUpload.url("https://..."));
ctx.sendPhoto("file_id_string"); // reuse uploaded file_id directly
```

## Webhook

```typescript
// puregram — manual express setup
app.post("/bot", (req, res) => {
    bot.updates.handleUpdate(req.body);
    res.sendStatus(200);
});

// GramIO — bring your own HTTP server + webhookHandler
import { webhookHandler } from "gramio";
import express from "express";

const app = express();
app.use(express.json());
app.post("/webhook", webhookHandler(bot, "express"));
app.listen(3000);

// bot.start only registers the URL with Telegram (setWebhook), does NOT create a server
bot.start({ webhook: { url: "https://example.com/webhook" } });
```

## Lifecycle Hooks

```typescript
// puregram — manual
process.on("SIGINT", () => bot.updates.stopPolling());

// GramIO — hooks exist, but SIGINT/SIGTERM must be wired manually
bot.onStart(({ info }) => console.log(`@${info.username} started`));
bot.onStop(() => console.log("Stopped"));

process.on("SIGINT", () => bot.stop());
process.on("SIGTERM", () => bot.stop());
```

## Common Migration Checklist

- [ ] Replace `import { Telegram }` with `import { Bot }`
- [ ] Replace `new Telegram({ token })` with `new Bot(token)`
- [ ] Replace `bot.updates.on()` with `bot.on()`
- [ ] Replace `bot.updates.use()` with `bot.use()`
- [ ] Replace `bot.updates.startPolling()` with `bot.start()`
- [ ] Replace `context.reply()` with `ctx.send()`
- [ ] Replace `context.answerCallbackQuery()` with `ctx.answer()`
- [ ] Replace `context.senderId` with `ctx.from?.id`
- [ ] Remove `@puregram/hear` — use `bot.hears()` instead
- [ ] Replace `@puregram/session` with `@gramio/session` + `.extend(session(...))`
- [ ] Replace `@puregram/scenes` with `@gramio/scenes` + `.extend(scenes(...))`
- [ ] Replace `MediaSource.*` with `await MediaUpload.*`
- [ ] Replace `Keyboard.inline([[...]])` with `new InlineKeyboard().text(...)`
- [ ] Replace `Keyboard.keyboard([[...]])` with `new Keyboard().text(...)`
- [ ] Replace HTML/parse_mode formatting with `format` tagged template literals
- [ ] Replace manual context type augmentation with `.derive()` / `.decorate()`
- [ ] Add `.command()` handlers instead of checking `context.text === "/cmd"`

<!--
Source: https://gramio.dev/guides/migration-from-puregram
-->
