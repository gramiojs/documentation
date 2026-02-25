# Migration from Telegraf to GramIO

Use this reference when helping users migrate a Telegram bot from Telegraf to GramIO.

## Package changes

```
npm install gramio
npm uninstall telegraf
```

## Symbol mapping

| Telegraf | GramIO |
|---|---|
| `import { Telegraf } from "telegraf"` | `import { Bot } from "gramio"` |
| `new Telegraf(token)` | `new Bot(token)` |
| `bot.launch()` | `bot.start()` |
| `bot.stop("SIGINT")` | `bot.stop()` |
| `ctx.reply(text)` | `ctx.send(text)` |
| `ctx.replyWithPhoto(file_id)` | `ctx.sendPhoto(file_id)` |
| `ctx.replyWithDocument(file_id)` | `ctx.sendDocument(file_id)` |
| `ctx.replyWithVideo(file_id)` | `ctx.sendVideo(file_id)` |
| `ctx.telegram.sendMessage(id, text)` | `ctx.api.sendMessage({ chat_id: id, text })` |
| `bot.telegram.sendMessage(id, text)` | `bot.api.sendMessage({ chat_id: id, text })` |
| `ctx.telegram.banChatMember(id, userId)` | `ctx.api.banChatMember({ chat_id: id, user_id: userId })` |
| `bot.action("data", handler)` | `bot.callbackQuery("data", handler)` |
| `ctx.answerCbQuery()` / `ctx.answerCbQuery("text")` | `ctx.answer()` / `ctx.answer({ text: "text" })` |
| `Markup.inlineKeyboard([[Markup.button.callback(text, data)]])` | `new InlineKeyboard().text(text, data)` |
| `Markup.button.url(text, url)` | `.url(text, url)` on InlineKeyboard |
| `Markup.keyboard([[label]]).resize()` | `new Keyboard().text(label).resized()` |
| `Markup.removeKeyboard()` | `new RemoveKeyboard()` |
| `interface MyContext extends Context {}` | `.derive(ctx => ({...}))` or `.extend(plugin)` |
| `new Telegraf<MyContext>(token)` | `new Bot(token).derive(...)` — type is inferred |
| `bot.use(session({...}))` | `.extend(session({...}))` |
| `ctx.session` (Telegraf session) | `ctx.session` (GramIO session — same pattern) |
| `new Scenes.WizardScene("name", step1, step2)` | `new Scene("name").step("message", handler)...` |
| `new Scenes.Stage([scene])` + `bot.use(stage.middleware())` | `.extend(scenes([scene]))` |
| `ctx.wizard.next()` | Implicit — scene advances on next matching update |
| `ctx.scene.leave()` | `ctx.scene.leave()` — same |
| `ctx.scene.enter("name")` | `ctx.scene.enter(sceneObject)` — pass object not string |
| `bot.catch((err, ctx) => ...)` | `bot.onError(({ error, context, kind }) => ...)` |
| `ctx.updateType` | `ctx.update` (full update object) or check via `ctx.is("type")` |
| HTML / MarkdownV2 strings + `parse_mode` | `format\`${bold\`text\`}\`` — no parse_mode |

## Key conceptual differences

### Type-safe context — .extend() vs interface merging

**Telegraf**: Manually define `interface MyContext extends Context {}` and pass as generic everywhere:
```ts
interface MyContext extends Context { session: { count: number }; isAdmin: boolean; }
const bot = new Telegraf<MyContext>(token);
bot.use(session<MyContext>({ defaultSession: () => ({ count: 0 }) }));
bot.use(async (ctx, next) => { ctx.isAdmin = ctx.from?.id === ADMIN_ID; await next(); });
```

**GramIO**: `.derive()` and `.extend()` infer types automatically — no generic passing:
```ts
const bot = new Bot(token)
    .extend(session({ initial: () => ({ count: 0 }) }))
    .derive((ctx) => ({ isAdmin: ctx.from?.id === ADMIN_ID }));
// ctx.session and ctx.isAdmin are typed everywhere downstream
```

### API calls — named params
```ts
// Telegraf
await ctx.telegram.sendMessage(chatId, "text", { parse_mode: "HTML" });

// GramIO — all named params
await ctx.api.sendMessage({ chat_id: chatId, text: "text" });
```

### Formatting — no parse_mode
```ts
// Telegraf
await ctx.reply("<b>Hello!</b>", { parse_mode: "HTML" });

// GramIO
import { format, bold, italic, link, code, pre, spoiler } from "gramio";
await ctx.send(format`${bold`Hello!`}`);
```

### Keyboards
```ts
// Telegraf
import { Markup } from "telegraf";
ctx.reply("Choose:", Markup.inlineKeyboard([
    [Markup.button.callback("Yes", "yes"), Markup.button.callback("No", "no")],
    [Markup.button.url("GitHub", "https://github.com/gramiojs/gramio")],
]));

// GramIO
import { InlineKeyboard } from "gramio";
ctx.send("Choose:", {
    reply_markup: new InlineKeyboard()
        .text("Yes", "yes").text("No", "no")
        .row()
        .url("GitHub", "https://github.com/gramiojs/gramio"),
});
```

### CallbackData (type-safe callbacks)
```ts
import { CallbackData, InlineKeyboard } from "gramio";
const actionData = new CallbackData("action").number("id");

// Pack when building
new InlineKeyboard().text("Item 1", actionData.pack({ id: 1 }))

// Unpack when handling — fully typed
bot.callbackQuery(actionData, (ctx) => {
    ctx.queryData.id; // ^? number — not string!
});
```

### Scenes
```ts
// Telegraf
import { Scenes, session } from "telegraf";
const wizard = new Scenes.WizardScene("register",
    async (ctx) => { await ctx.reply("Name?"); return ctx.wizard.next(); },
    async (ctx) => { await ctx.reply(`Hi ${ctx.message.text}!`); return ctx.scene.leave(); }
);
const stage = new Scenes.Stage([wizard]);
bot.use(session()); bot.use(stage.middleware());
bot.command("register", (ctx) => ctx.scene.enter("register"));

// GramIO
import { Scene, scenes } from "@gramio/scenes";
import { session } from "@gramio/session";
const registerScene = new Scene("register")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("Name?");
        return ctx.scene.update({ name: ctx.text });
    })
    .step("message", (ctx) => ctx.send(`Hi ${ctx.scene.state.name}!`));
const bot = new Bot(token).extend(session()).extend(scenes([registerScene]));
bot.command("register", (ctx) => ctx.scene.enter(registerScene));
```

### Webhook — Telegraf has built-in server, GramIO does not
```ts
// Telegraf — built-in HTTP server
bot.launch({ webhook: { domain: "https://example.com", port: 3000 } });

// GramIO — bring your own HTTP server
import { Bot, webhookHandler } from "gramio";
import Fastify from "fastify";
const bot = new Bot(token);
const fastify = Fastify();
fastify.post("/webhook", webhookHandler(bot, "fastify"));
fastify.listen({ port: 3000, host: "::" });
bot.start({ webhook: { url: "https://example.com/webhook" } });
// bot.start({ webhook: {...} }) only calls setWebhook on Telegram — NOT a server
```

Supported frameworks for webhookHandler: `"fastify"`, `"express"`, `"hono"`, `"elysia"`, `"koa"`, `"node:http"`, `"bun"`, `"deno"`

### Graceful shutdown
```ts
// Both need manual signal wiring
// Telegraf
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// GramIO
process.on("SIGINT", () => bot.stop());
process.on("SIGTERM", () => bot.stop());
```

## Migration checklist

- [ ] Replace `import { Telegraf } from "telegraf"` with `import { Bot } from "gramio"`
- [ ] Replace `new Telegraf(token)` with `new Bot(token)`
- [ ] Replace `bot.launch()` with `bot.start()`
- [ ] Replace all `ctx.reply(text)` with `ctx.send(text)`
- [ ] Replace `ctx.replyWithPhoto/Document/Video(...)` with `ctx.sendPhoto/Document/Video(...)`
- [ ] Replace `ctx.telegram.method(id, ...)` with `ctx.api.method({ chat_id: id, ... })`
- [ ] Replace `bot.telegram.method(...)` with `bot.api.method({ ... })`
- [ ] Replace `bot.action("data", handler)` with `bot.callbackQuery("data", handler)`
- [ ] Replace `ctx.answerCbQuery()` with `ctx.answer()`
- [ ] Replace `Markup.inlineKeyboard([...])` with `new InlineKeyboard().text(...).row()...`
- [ ] Replace `Markup.keyboard([...]).resize()` with `new Keyboard().text(...).resized()`
- [ ] Replace `Markup.removeKeyboard()` with `new RemoveKeyboard()`
- [ ] Replace `interface MyContext extends Context {}` pattern with `.derive(ctx => ({...}))`
- [ ] Replace `new Telegraf<MyContext>(token)` with `new Bot(token).derive(...)`
- [ ] Replace `bot.use(session({ defaultSession }))` with `.extend(session({ initial }))`
- [ ] Replace `Scenes.WizardScene` + `Stage` with `Scene` + `scenes([...])`
- [ ] Replace `ctx.scene.enter("name")` (string) with `ctx.scene.enter(sceneObject)` (object)
- [ ] Replace `ctx.wizard.next()` calls — not needed in GramIO scenes
- [ ] Replace HTML/MarkdownV2 strings with `format` tagged template literals
- [ ] Replace `bot.catch(...)` with `bot.onError(...)`
- [ ] Replace `bot.launch({ webhook: { domain, port } })` with external server + `webhookHandler`
