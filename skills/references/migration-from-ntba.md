# Migration from node-telegram-bot-api to GramIO

Use this reference when helping users migrate a Telegram bot from `node-telegram-bot-api` (NTBA) to GramIO.

## Package changes

```
npm install gramio
npm uninstall node-telegram-bot-api @types/node-telegram-bot-api
```

## Symbol mapping

| node-telegram-bot-api | GramIO |
|---|---|
| `import TelegramBot from "node-telegram-bot-api"` | `import { Bot } from "gramio"` |
| `new TelegramBot(token, { polling: true })` | `new Bot(token); bot.start()` |
| `bot.on("message", (msg) => ...)` | `bot.on("message", (ctx) => ...)` |
| `bot.sendMessage(msg.chat.id, text)` | `ctx.send(text)` |
| `bot.sendMessage(chatId, text)` (outside handler) | `bot.api.sendMessage({ chat_id: chatId, text })` |
| `bot.onText(/regex/, (msg, match) => ...)` | `bot.hears(/regex/, (ctx) => ...)` |
| `bot.on("callback_query", (query) => ...)` | `bot.callbackQuery("data", (ctx) => ...)` |
| `bot.answerCallbackQuery(query.id)` | `ctx.answer()` |
| `bot.sendPhoto(chat_id, file_id)` | `ctx.sendPhoto(file_id)` |
| `bot.sendDocument(chat_id, file_id)` | `ctx.sendDocument(file_id)` |
| `bot.editMessageText(text, { chat_id, message_id })` | `ctx.editText(text)` |
| `bot.kickChatMember(chatId, userId)` | `bot.api.banChatMember({ chat_id: chatId, user_id: userId })` |
| Raw JSON inline keyboard `{ inline_keyboard: [...] }` | `new InlineKeyboard().text(label, data)` |
| Raw JSON reply keyboard `{ keyboard: [...], resize_keyboard: true }` | `new Keyboard().text(label).resized()` |
| `{ remove_keyboard: true }` | `new RemoveKeyboard()` |
| Manual `Map` state | `@gramio/session` |
| Manual step tracking with `Map` | `@gramio/scenes` |
| `bot.on("polling_error")` | `bot.onError(...)` |
| External `@types/node-telegram-bot-api` | Built-in TypeScript (no @types needed) |

## Key conceptual differences

### No context object in NTBA
NTBA passes raw Telegram objects to callbacks. You must always pass `chat.id` explicitly:
```ts
// NTBA
bot.on("message", (msg) => {
    bot.sendMessage(msg.chat.id, "Hello!");
});

// GramIO — ctx has all reply methods built in
bot.on("message", (ctx) => {
    ctx.send("Hello!"); // no chat_id needed
});
```

### No middleware system in NTBA
NTBA has no concept of middleware or composable handlers. GramIO has full middleware with `.use()`, `.derive()`, `.decorate()`, `.guard()`.

### API calls use named params
```ts
// NTBA — positional arguments
bot.sendMessage(chatId, "text", { parse_mode: "HTML" });

// GramIO — named object params matching Telegram API
bot.api.sendMessage({ chat_id: chatId, text: "text" });
```

### Formatting
```ts
// NTBA
bot.sendMessage(chatId, "<b>Hello!</b>", { parse_mode: "HTML" });

// GramIO — no parse_mode, uses MessageEntity
import { format, bold } from "gramio";
ctx.send(format`${bold`Hello!`}`);
```

### CallbackData (type-safe callbacks)
```ts
import { CallbackData, InlineKeyboard } from "gramio";
const actionData = new CallbackData("action").number("id");

// Pack when building keyboard
new InlineKeyboard().text("Item", actionData.pack({ id: 1 }))

// Unpack when handling — typed
bot.callbackQuery(actionData, (ctx) => {
    ctx.queryData.id; // ^? number
});
```

### Sessions
```ts
import { session } from "@gramio/session";
const bot = new Bot(token).extend(session({ initial: () => ({ count: 0 }) }));
// ctx.session.count is typed as number
```

### Scenes (multi-step conversations)
```ts
import { Scene, scenes } from "@gramio/scenes";
import { session } from "@gramio/session";

const myScene = new Scene("name")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("Question?");
        return ctx.scene.update({ answer: ctx.text });
    })
    .step("message", (ctx) => ctx.send(`You said: ${ctx.scene.state.answer}`));

const bot = new Bot(token).extend(session()).extend(scenes([myScene]));
bot.command("start", (ctx) => ctx.scene.enter(myScene));
```

### Webhook (no built-in server in GramIO)
```ts
import { Bot, webhookHandler } from "gramio";
import Fastify from "fastify";

const bot = new Bot(token);
const fastify = Fastify();
fastify.post("/webhook", webhookHandler(bot, "fastify"));
fastify.listen({ port: 3000, host: "::" });
bot.start({ webhook: { url: "https://example.com/webhook" } });
// bot.start({ webhook: {...} }) calls setWebhook on Telegram — NOT a server
```

Supported frameworks for webhookHandler: `"fastify"`, `"express"`, `"hono"`, `"elysia"`, `"koa"`, `"node:http"`, `"bun"`, `"deno"`

## Migration checklist

- [ ] Replace `import TelegramBot from "node-telegram-bot-api"` with `import { Bot } from "gramio"`
- [ ] Replace `new TelegramBot(token, { polling: true })` with `new Bot(token)` + `bot.start()`
- [ ] Replace all `bot.on("message", (msg) => ...)` callbacks — change `msg` to `ctx`
- [ ] Replace `bot.sendMessage(msg.chat.id, text)` with `ctx.send(text)` inside handlers
- [ ] Replace `bot.sendX(chat_id, ...)` outside handlers with `bot.api.sendX({ chat_id, ... })`
- [ ] Replace `bot.onText(/regex/, handler)` with `bot.hears(/regex/, handler)` — `ctx.args` for capture groups
- [ ] Replace `bot.command("start", handler)` if using `bot.onText(/\/start/, ...)` pattern
- [ ] Replace `bot.on("callback_query", ...)` with `bot.callbackQuery("specific_data", ...)`
- [ ] Replace `bot.answerCallbackQuery(query.id)` with `ctx.answer()`
- [ ] Replace raw JSON keyboards with `new InlineKeyboard()` / `new Keyboard()` builders
- [ ] Replace HTML string formatting with `format` tagged template literals
- [ ] Replace manual state Map with `@gramio/session` + storage adapter
- [ ] Replace manual step tracking with `@gramio/scenes`
- [ ] Replace `bot.on("polling_error")` with `bot.onError(...)`
- [ ] Remove `@types/node-telegram-bot-api` — GramIO has built-in types
