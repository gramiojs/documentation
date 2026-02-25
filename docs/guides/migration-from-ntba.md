---
title: Migrating from node-telegram-bot-api to GramIO
head:
    - - meta
      - name: "description"
        content: "Step-by-step guide to migrating your Telegram bot from node-telegram-bot-api (NTBA) to GramIO. Side-by-side code comparisons for handlers, keyboards, sessions, webhooks, and TypeScript typing."
    - - meta
      - name: "keywords"
        content: "migrate node-telegram-bot-api to gramio, ntba vs gramio, node-telegram-bot-api migration, switch from ntba, telegram bot migration, TypeScript telegram bot"
---

# Migrating from node-telegram-bot-api

This guide is for developers who have a bot written with [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) (NTBA) and want to switch to GramIO. NTBA is a minimal, callback-based library — GramIO gives you a full framework with middleware, typed context, keyboards builder, sessions, and first-class TypeScript.

---

## Why migrate?

| | node-telegram-bot-api | GramIO |
|---|---|---|
| TypeScript | External `@types/` package, limited | First-class, fully inferred |
| Middleware | ❌ | ✅ composable `.use()` / `.derive()` |
| Context object | ❌ (raw `msg` object) | ✅ rich `ctx` with helper methods |
| Keyboard builders | ❌ (raw JSON) | ✅ `InlineKeyboard`, `Keyboard` |
| Sessions | ❌ (manual state) | ✅ `@gramio/session` |
| Conversations / flows | ❌ | ✅ `@gramio/scenes` + `@gramio/prompt` |
| Formatting | Manual HTML strings | Tagged template literals → entities |
| Built-in test utilities | ❌ | ✅ `@gramio/test` |
| Plugin system | ❌ | ✅ `.extend()` with type propagation |
| Full Telegram API reference | ❌ | ✅ `/telegram/` |
| Scaffolding CLI | ❌ | ✅ `npm create gramio` |

---

## Installation

::: code-group

```bash [npm]
npm install gramio
npm uninstall node-telegram-bot-api @types/node-telegram-bot-api
```

```bash [yarn]
yarn add gramio
yarn remove node-telegram-bot-api @types/node-telegram-bot-api
```

```bash [pnpm]
pnpm add gramio
pnpm remove node-telegram-bot-api @types/node-telegram-bot-api
```

```bash [bun]
bun add gramio
bun remove node-telegram-bot-api @types/node-telegram-bot-api
```

:::

---

## Bot initialization

::: code-group

```ts [NTBA]
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN!, { polling: true });
```

```ts [GramIO]
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.start();
```

:::

**Key changes:**
- Import is a named `Bot` class, not a default export
- Pass options to `bot.start()` instead of the constructor
- Long polling is the default — no extra config needed

---

## Handlers

::: code-group

```ts [NTBA]
// Any message
bot.on("message", (msg) => {
    bot.sendMessage(msg.chat.id, "Got it!");
});

// Regex match
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hello!");
});

// Regex with capture group
bot.onText(/\/say (.+)/, (msg, match) => {
    const text = match?.[1] ?? "nothing";
    bot.sendMessage(msg.chat.id, text);
});

// Callback query (button press)
bot.on("callback_query", (query) => {
    bot.answerCallbackQuery(query.id);
    if (query.data === "yes") {
        bot.sendMessage(query.message!.chat.id, "You said yes!");
    }
});
```

```ts [GramIO]
// Any message
bot.on("message", (ctx) => ctx.send("Got it!"));

// Command
bot.command("start", (ctx) => ctx.send("Hello!"));

// Hears (regex)
bot.hears(/\/say (.+)/, (ctx) => ctx.send(ctx.args?.[1] ?? "nothing"));

// Callback query (button press)
bot.callbackQuery("yes", (ctx) => {
    ctx.answer(); // auto-acknowledges the query
    ctx.send("You said yes!");
});
```

:::

**Key changes:**
- `bot.on("message", (msg) => ...)` → `bot.on("message", (ctx) => ...)`
- No more `msg.chat.id` — just `ctx.send()` replies in context
- `bot.onText(/regex/)` → `bot.hears(/regex/)`, with `ctx.args` for capture groups
- `bot.command("start")` for `/start` commands (cleaner than `bot.onText(/\/start/)`)
- `bot.callbackQuery("data")` instead of filtering inside `bot.on("callback_query")`
- `ctx.answer()` instead of `bot.answerCallbackQuery(query.id)`

---

## Sending messages

::: code-group

```ts [NTBA]
// Plain text
await bot.sendMessage(msg.chat.id, "Hello!");

// HTML
await bot.sendMessage(msg.chat.id, "<b>Bold</b>", { parse_mode: "HTML" });

// Photo
await bot.sendPhoto(msg.chat.id, "file_id");

// Document
await bot.sendDocument(msg.chat.id, "file_id");

// Edit a message
await bot.editMessageText("New text", {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
});
```

```ts [GramIO]
// Plain text
await ctx.send("Hello!");

// Formatted (no parse_mode needed)
import { format, bold } from "gramio";
await ctx.send(format`${bold`Bold`}`);

// Photo
await ctx.sendPhoto("file_id");

// Document
await ctx.sendDocument("file_id");

// Edit a message (inside a handler)
await ctx.editText("New text");
```

:::

**Key changes:**
- Every `bot.sendX(chat_id, ...)` → `ctx.sendX(...)` — no `chat_id` argument
- `parse_mode: "HTML"` → use `format` tagged template with `bold`, `italic`, etc.
- `bot.editMessageText(text, { chat_id, message_id })` → `ctx.editText(text)`

---

## API calls (direct)

Sometimes you need to call the API directly, outside of a handler.

::: code-group

```ts [NTBA]
// Direct API call
await bot.sendMessage(chatId, "Hello from outside a handler!");
await bot.sendPhoto(chatId, "file_id");
await bot.kickChatMember(chatId, userId);
```

```ts [GramIO]
// Direct API call
await bot.api.sendMessage({ chat_id: chatId, text: "Hello from outside a handler!" });
await bot.api.sendPhoto({ chat_id: chatId, photo: "file_id" });
await bot.api.banChatMember({ chat_id: chatId, user_id: userId });
```

:::

**Key changes:**
- `bot.sendX(id, ...)` → `bot.api.sendX({ chat_id: id, ... })` — named parameters
- API method names align with official Telegram Bot API docs

---

## Keyboards

NTBA requires raw JSON. GramIO has fluent keyboard builders.

::: code-group

```ts [NTBA]
// Inline keyboard
bot.sendMessage(msg.chat.id, "Choose:", {
    reply_markup: {
        inline_keyboard: [
            [
                { text: "Yes", callback_data: "yes" },
                { text: "No", callback_data: "no" },
            ],
        ],
    },
});

// Reply keyboard
bot.sendMessage(msg.chat.id, "Choose:", {
    reply_markup: {
        keyboard: [
            [{ text: "Option A" }, { text: "Option B" }],
        ],
        resize_keyboard: true,
    },
});

// Remove keyboard
bot.sendMessage(msg.chat.id, "Removed.", {
    reply_markup: { remove_keyboard: true },
});
```

```ts [GramIO]
import { InlineKeyboard, Keyboard, RemoveKeyboard } from "gramio";

// Inline keyboard
ctx.send("Choose:", {
    reply_markup: new InlineKeyboard()
        .text("Yes", "yes")
        .text("No", "no"),
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
- Replace raw JSON objects with fluent builder classes
- `.row()` to start a new row
- `.resized()` instead of `resize_keyboard: true`
- `new RemoveKeyboard()` instead of `{ remove_keyboard: true }`

---

## Type-safe callback data

In NTBA you parse `query.data` manually with string comparisons or regexes. GramIO has `CallbackData` for structured, type-safe callback data.

::: code-group

```ts [NTBA]
// Building
bot.sendMessage(chat_id, "Choose:", {
    reply_markup: {
        inline_keyboard: [[
            { text: "Item 1", callback_data: "action:1" },
            { text: "Item 2", callback_data: "action:2" },
        ]],
    },
});

// Handling
bot.on("callback_query", (query) => {
    if (query.data?.startsWith("action:")) {
        const id = parseInt(query.data.split(":")[1]);
        bot.sendMessage(query.message!.chat.id, `You picked: ${id}`);
    }
    bot.answerCallbackQuery(query.id);
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

## Formatting messages

::: code-group

```ts [NTBA]
bot.sendMessage(chat_id, "<b>Hello!</b> Visit <a href='https://gramio.dev'>GramIO</a>.", {
    parse_mode: "HTML",
});
```

```ts [GramIO]
import { format, bold, link } from "gramio";

ctx.send(format`${bold`Hello!`} Visit ${link("GramIO", "https://gramio.dev")}.`);
```

:::

No `parse_mode` needed — GramIO produces `MessageEntity` arrays automatically.

---

## Session / State management

NTBA has no built-in session system. Common patterns use a `Map` or database directly.

::: code-group

```ts [NTBA]
// Manual state (global Map — does not survive restarts)
const userState = new Map<number, { count: number }>();

bot.on("message", (msg) => {
    const state = userState.get(msg.from!.id) ?? { count: 0 };
    state.count++;
    userState.set(msg.from!.id, state);
    bot.sendMessage(msg.chat.id, `Count: ${state.count}`);
});
```

```ts [GramIO]
import { session } from "@gramio/session";

const bot = new Bot(process.env.BOT_TOKEN as string).extend(
    session({ initial: () => ({ count: 0 }) }),
);

bot.on("message", (ctx) => {
    ctx.session.count++;
    //    ^? { count: number }
    ctx.send(`Count: ${ctx.session.count}`);
});
```

:::

`@gramio/session` supports [storage adapters](/storages) for Redis, databases, and more.

---

## Multi-step conversations

NTBA has no built-in conversation system. A common workaround is tracking a "step" in a Map.

::: code-group

```ts [NTBA]
// Manual step tracking
const userStep = new Map<number, string>();

bot.onText(/\/register/, (msg) => {
    userStep.set(msg.from!.id, "awaiting_name");
    bot.sendMessage(msg.chat.id, "What's your name?");
});

bot.on("message", (msg) => {
    const step = userStep.get(msg.from!.id);
    if (step === "awaiting_name") {
        userStep.delete(msg.from!.id);
        bot.sendMessage(msg.chat.id, `Hello, ${msg.text}!`);
    }
});
```

```ts [GramIO]
import { Scene, scenes } from "@gramio/scenes";
import { session } from "@gramio/session";

const registerScene = new Scene("register")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("What's your name?");
        return ctx.scene.update({ name: ctx.text });
    })
    .step("message", (ctx) => ctx.send(`Hello, ${ctx.scene.state.name}!`));

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(session())
    .extend(scenes([registerScene]));

bot.command("register", (ctx) => ctx.scene.enter(registerScene));
```

:::

---

## Error handling

::: code-group

```ts [NTBA]
// Wrap every handler manually
bot.on("message", async (msg) => {
    try {
        await riskyOperation();
    } catch (e) {
        console.error(e);
        bot.sendMessage(msg.chat.id, "Something went wrong.");
    }
});

// Handle polling errors
bot.on("polling_error", (error) => {
    console.error("Polling error:", error);
});
```

```ts [GramIO]
// Centralized error handling
bot.onError(({ context, kind, error }) => {
    console.error(kind, error.message);
    if (context.is("message")) context.send("Something went wrong.");
});
```

:::

---

## Webhook

::: code-group

```ts [NTBA]
import TelegramBot from "node-telegram-bot-api";
import express from "express";

const bot = new TelegramBot(process.env.BOT_TOKEN!, { webHook: true });
const app = express();

app.use(express.json());
app.post("/webhook", (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.listen(3000);
bot.setWebHook("https://example.com/webhook");
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

## TypeScript

::: code-group

```ts [NTBA]
import TelegramBot from "node-telegram-bot-api";
// Requires: npm install @types/node-telegram-bot-api

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg: TelegramBot.Message) => {
    const text = msg.text; // string | undefined
    // No context methods — must call bot.sendMessage(msg.chat.id, ...)
});
```

```ts [GramIO]
import { Bot } from "gramio";

const bot = new Bot(token)
    .derive(async (ctx) => ({
        user: await db.getUser(ctx.from?.id),
    }));

bot.on("message", (ctx) => {
    ctx.user;   // ✅ fully typed — your custom field
    ctx.text;   // string | undefined
    ctx.send;   // ✅ context method — no chat_id needed
});
```

:::

In NTBA, TypeScript only types the raw Telegram objects. In GramIO, everything flows through the context including custom fields added via `.derive()` and `.decorate()`.

---

## Quick reference

| node-telegram-bot-api | GramIO |
|---|---|
| `new TelegramBot(token, { polling: true })` | `new Bot(token); bot.start()` |
| `bot.on("message", (msg) => ...)` | `bot.on("message", (ctx) => ...)` |
| `bot.sendMessage(msg.chat.id, text)` | `ctx.send(text)` |
| `bot.onText(/regex/, (msg, match) => ...)` | `bot.hears(/regex/, (ctx) => ...)` |
| `bot.on("callback_query", (query) => ...)` | `bot.callbackQuery("data", (ctx) => ...)` |
| `bot.answerCallbackQuery(query.id)` | `ctx.answer()` |
| `bot.sendPhoto(chat_id, file_id)` | `ctx.sendPhoto(file_id)` |
| Raw JSON inline keyboards | `new InlineKeyboard().text(label, data)` |
| Raw JSON reply keyboards | `new Keyboard().text(label).resized()` |
| `{ remove_keyboard: true }` | `new RemoveKeyboard()` |
| Manual state Map | `@gramio/session` |
| Manual step tracking | `@gramio/scenes` |
| `bot.on("polling_error")` | `bot.onError(...)` |
| External `@types/` package | Built-in TypeScript |
