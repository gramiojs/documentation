---
title: Migrating from grammY to GramIO
head:
    - - meta
      - name: "description"
        content: "Step-by-step guide to migrating your Telegram bot from grammY to GramIO. Side-by-side code comparisons for handlers, context, keyboards, sessions, conversations/scenes, formatting, TypeScript, and webhooks."
    - - meta
      - name: "keywords"
        content: "migrate grammy to gramio, grammy vs gramio, grammy migration guide, switch from grammy, telegram bot framework migration, TypeScript bot migration, grammY alternative"
---

# Migrating from grammY

This guide is for developers with a bot written in [grammY](https://grammy.dev/) who want to switch to GramIO. Both are TypeScript-first, middleware-based frameworks — the mental model is very similar, but the APIs differ in important ways.

---

## Why migrate?

| | grammY | GramIO |
|---|---|---|
| TypeScript context extension | Manual flavor interfaces + generic `Bot<Ctx>` | `.derive()` / `.extend()` — types flow automatically |
| Plugin typing | `SessionFlavor<T>`, `ConversationFlavor`, etc. | `.extend(plugin())` — no flavor types needed |
| Formatting | HTML / MarkdownV2 strings or `fmt` helper | Tagged template literals → `MessageEntity` |
| Conversations / multi-step flows | `@grammyjs/conversations` — async generator style | `@gramio/scenes` — step-based, typed state |
| Built-in test utilities | ❌ | ✅ `@gramio/test` |
| Full Telegram API reference | ❌ | ✅ `/telegram/` |
| Scaffolding CLI | ❌ | ✅ `npm create gramio` |
| Filters syntax | `bot.on(":text")`, `bot.on(["msg:text", ...])` | Plain event names + `.filter()` / `.derive()` |
| `ctx.reply()` | Sends a reply to the incoming message | `ctx.send()` — same behavior, different name |

---

## Installation

::: pm-add gramio
:::

::: pm-remove grammy
:::

---

## Bot initialization

Both frameworks use `new Bot(token)` and `bot.start()` — initialization is nearly identical.

::: code-group

```ts [grammY]
import { Bot } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN!);

bot.start();
```

```ts [GramIO]
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.start();
```

:::

The import source changes from `"grammy"` to `"gramio"` — everything else stays the same.

---

## Handlers

::: code-group

```ts [grammY]
// Command
bot.command("start", (ctx) => ctx.reply("Hello!"));

// Any message
bot.on("message", (ctx) => ctx.reply("Got it!"));

// Text filter (grammY shorthand syntax)
bot.on("message:text", (ctx) => ctx.reply(ctx.message.text));

// Hears
bot.hears(/hello/i, (ctx) => ctx.reply("Hey!"));

// Callback query
bot.callbackQuery("yes", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply("You said yes!");
});
```

```ts [GramIO]
// Command
bot.command("start", (ctx) => ctx.send("Hello!"));

// Any message
bot.on("message", (ctx) => ctx.send("Got it!"));

// Text available as ctx.text on message context
bot.on("message", (ctx) => ctx.send(ctx.text ?? ""));

// Hears
bot.hears(/hello/i, (ctx) => ctx.send("Hey!"));

// Callback query
bot.callbackQuery("yes", (ctx) => {
    ctx.answer(); // auto-acknowledges
    ctx.send("You said yes!");
});
```

:::

**Key changes:**
- `ctx.reply()` → `ctx.send()`
- `bot.on("message:text")` grammY filter → plain `bot.on("message")` with `ctx.text`
- `ctx.answerCallbackQuery()` → `ctx.answer()`

---

## Context properties

::: code-group

```ts [grammY]
ctx.message          // Message | undefined
ctx.message?.text    // string | undefined
ctx.from             // User | undefined
ctx.chat             // Chat | undefined
ctx.update           // raw Update object
ctx.callbackQuery    // CallbackQuery | undefined
```

```ts [GramIO]
ctx.message          // TelegramMessage | undefined
ctx.text             // string | undefined  (shorthand on message ctx)
ctx.from             // TelegramUser | undefined
ctx.chat             // TelegramChat | undefined
// callback_query is a top-level property on callbackQuery events
```

:::

---

## Sending messages

::: code-group

```ts [grammY]
await ctx.reply("Hello!");
await ctx.reply("<b>Hello!</b>", { parse_mode: "HTML" });
await ctx.replyWithPhoto("file_id");
await ctx.api.sendMessage(chatId, "Hello from outside!");
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
- `ctx.api.method(positional, args)` → `bot.api.method({ named_params })`
- No `parse_mode` — use `format` tagged template literals

---

## Direct API calls

::: code-group

```ts [grammY]
// Positional arguments
await ctx.api.sendMessage(chatId, "Hello!");
await ctx.api.sendPhoto(chatId, "file_id");
await ctx.api.banChatMember(chatId, userId);

// Outside a handler
await bot.api.sendMessage(chatId, "Hello!");
```

```ts [GramIO]
// Named arguments
await ctx.api.sendMessage({ chat_id: chatId, text: "Hello!" });
await ctx.api.sendPhoto({ chat_id: chatId, photo: "file_id" });
await ctx.api.banChatMember({ chat_id: chatId, user_id: userId });

// Outside a handler
await bot.api.sendMessage({ chat_id: chatId, text: "Hello!" });
```

:::

**Key change:** grammY uses positional arguments, GramIO uses named params matching the official Telegram Bot API docs.

---

## Keyboards

Both frameworks share similar keyboard class names, but the import source changes.

::: code-group

```ts [grammY]
import { InlineKeyboard, Keyboard } from "grammy";

// Inline keyboard
ctx.reply("Choose:", {
    reply_markup: new InlineKeyboard()
        .text("Yes ✅", "yes")
        .text("No ❌", "no")
        .row()
        .url("GitHub", "https://github.com/gramiojs/gramio"),
});

// Reply keyboard
ctx.reply("Choose:", {
    reply_markup: new Keyboard()
        .text("Option A")
        .text("Option B")
        .resized(),
});

// Remove keyboard
ctx.reply("Removed.", { reply_markup: { remove_keyboard: true } });
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
- Import from `"gramio"` instead of `"grammy"`
- `ctx.reply()` → `ctx.send()`
- `{ remove_keyboard: true }` → `new RemoveKeyboard()`

---

## Type-safe callback data

::: code-group

```ts [grammY]
// Building
ctx.reply("Choose:", {
    reply_markup: new InlineKeyboard()
        .text("Item 1", "action:1")
        .text("Item 2", "action:2"),
});

// Handling
bot.callbackQuery(/action:(\d+)/, async (ctx) => {
    const id = parseInt(ctx.match[1]);
    await ctx.reply(`You picked: ${id}`);
    await ctx.answerCallbackQuery();
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

```ts [grammY]
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

grammY requires declaring "flavor" interfaces and passing them as generics. GramIO's `.derive()` and `.extend()` infer everything automatically.

::: code-group

```ts [grammY]
import { Bot, Context, SessionFlavor, session } from "grammy";

// 1. Declare flavor types
interface SessionData { count: number }
type MyContext = Context & SessionFlavor<SessionData>;

// 2. Pass the generic to every construct
const bot = new Bot<MyContext>(token);

// 3. Register middleware with the generic
bot.use(session<MyContext, SessionData>({
    initial: () => ({ count: 0 }),
}));

// 4. Custom properties need manual flavor augmentation
interface CustomFlavor { isAdmin: boolean }
type FullContext = Context & SessionFlavor<SessionData> & CustomFlavor;
```

```ts [GramIO]
import { Bot } from "gramio";
import { session } from "@gramio/session";

// No generics or flavor types — just compose and types flow
const bot = new Bot(token)
    .extend(session({ initial: () => ({ count: 0 }) }))
    .derive((ctx) => ({
        isAdmin: ctx.from?.id === ADMIN_ID,
    }));

bot.on("message", (ctx) => {
    ctx.isAdmin;    // ✅ boolean — inferred
    ctx.session;    // ✅ { count: number } — inferred
});
```

:::

---

## Session

::: code-group

```ts [grammY]
import { Bot, Context, SessionFlavor, session } from "grammy";

interface SessionData { count: number }
type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(token);
bot.use(session({ initial: (): SessionData => ({ count: 0 }) }));

bot.command("count", async (ctx) => {
    ctx.session.count++;
    await ctx.reply(`Count: ${ctx.session.count}`);
});
```

```ts [GramIO]
import { Bot } from "gramio";
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

## Conversations / Scenes

grammY's `@grammyjs/conversations` uses an async-generator/`conversation.wait()` pattern. GramIO's `@gramio/scenes` uses a step-based approach.

::: code-group

```ts [grammY — @grammyjs/conversations]
import { conversations, createConversation } from "@grammyjs/conversations";
import { session } from "grammy";

async function register(conversation, ctx) {
    await ctx.reply("What's your name?");
    const { message } = await conversation.wait();
    await ctx.reply(`Hello, ${message.text}!`);
}

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.use(createConversation(register));

bot.command("register", (ctx) => ctx.conversation.enter("register"));
```

```ts [GramIO — @gramio/scenes]
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
- No `conversation.wait()` — steps advance automatically when matching updates arrive
- State is typed: `ctx.scene.state` carries what you passed to `ctx.scene.update()`
- No `ConversationFlavor` type — GramIO infers everything from the scene definition

---

## Error handling

::: code-group

```ts [grammY]
// Global error handler
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    console.error(err.error);
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
- `bot.catch((err) => ...)` → `bot.onError(({ context, kind, error }) => ...)`
- Errors can be given typed names with `.error("KIND", ErrorClass)`

---

## Graceful shutdown

::: code-group

```ts [grammY]
// grammY handles SIGINT/SIGTERM automatically when using bot.start()
bot.start({
    onStop: () => console.log("Shutting down"),
});
```

```ts [GramIO]
bot.onStop(() => console.log("Shutting down"));

process.on("SIGINT", () => bot.stop());
process.on("SIGTERM", () => bot.stop());

bot.start();
```

:::

---

## Webhook

::: code-group

```ts [grammY]
import { Bot, webhookCallback } from "grammy";
import express from "express";

const bot = new Bot(process.env.BOT_TOKEN!);
const app = express();

app.use(express.json());
app.use("/webhook", webhookCallback(bot, "express"));
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

Both frameworks use identical `(ctx, next) => ...` middleware chains.

::: code-group

```ts [grammY]
bot.use(async (ctx, next) => {
    console.log("Before:", ctx.update.update_id);
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

## Files

::: code-group

```ts [grammY]
import { InputFile } from "grammy";

await ctx.replyWithPhoto(new InputFile("./photo.jpg"));
await ctx.replyWithPhoto(new InputFile(new URL("https://example.com/photo.jpg")));
await ctx.replyWithPhoto(new InputFile(buffer, "photo.jpg"));
```

```ts [GramIO]
import { MediaUpload } from "@gramio/files";

await ctx.sendPhoto(await MediaUpload.path("./photo.jpg"));
await ctx.sendPhoto(await MediaUpload.url("https://example.com/photo.jpg"));
await ctx.sendPhoto(await MediaUpload.buffer(buffer, "photo.jpg"));

// Already-uploaded file_id — pass directly
await ctx.sendPhoto("AgACAgIAAxk...");
```

:::

---

## Quick reference

| grammY | GramIO |
|---|---|
| `import { Bot } from "grammy"` | `import { Bot } from "gramio"` |
| `bot.start()` | `bot.start()` |
| `ctx.reply(text)` | `ctx.send(text)` |
| `ctx.replyWithPhoto(file_id)` | `ctx.sendPhoto(file_id)` |
| `ctx.api.sendMessage(id, text)` | `ctx.api.sendMessage({ chat_id: id, text })` |
| `bot.api.sendMessage(id, text)` | `bot.api.sendMessage({ chat_id: id, text })` |
| `ctx.answerCallbackQuery()` | `ctx.answer()` |
| `bot.on("message:text")` | `bot.on("message")` + `ctx.text` |
| `type Ctx = Context & SessionFlavor<T>` | `.extend(session({...}))` |
| `new Bot<MyContext>(token)` | `new Bot(token)` (no generic needed) |
| `bot.use(session({...}))` | `.extend(session({...}))` |
| `@grammyjs/conversations` | `@gramio/scenes` |
| `conversation.wait()` | step advances automatically |
| `bot.catch((err) => ...)` | `bot.onError(({ error, context }) => ...)` |
| `new InputFile("path")` | `await MediaUpload.path("path")` |
| HTML / MarkdownV2 strings | `format\`${bold\`text\`}\`` |
| `import { InlineKeyboard } from "grammy"` | `import { InlineKeyboard } from "gramio"` |
| `{ remove_keyboard: true }` | `new RemoveKeyboard()` |

---

## Next steps

- [Get started →](/get-started) — Scaffold a new GramIO project
- [Plugins overview →](/plugins/overview) — Sessions, scenes, i18n and more
- [Cheat Sheet →](/cheat-sheet) — Common patterns at a glance
- [Introduction →](/introduction) — Why GramIO, at a glance
