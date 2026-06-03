# Migration from grammY to GramIO

Use this reference when helping users migrate a Telegram bot from grammY to GramIO. Both are TypeScript-first, middleware-based frameworks — the mental model is nearly identical, so most of the work is mechanical symbol renaming plus dropping grammY's "flavor" generics.

## Package changes

```
npm install gramio
npm uninstall grammy
```

## The three differences that matter most

1. **No flavor generics.** grammY threads custom context types through `Bot<MyContext>`, `SessionFlavor<T>`, `ConversationFlavor`. GramIO infers everything from `.derive()` / `.extend()` — never write a context generic.
2. **Named API params.** grammY uses positional args (`ctx.api.sendMessage(id, text)`); GramIO mirrors the official Bot API with a single object (`ctx.api.sendMessage({ chat_id, text })`).
3. **No `parse_mode`.** Replace HTML/MarkdownV2 strings with `format` tagged templates → real `MessageEntity`. Never pass `parse_mode` with `format`.

## Symbol mapping

| grammY | GramIO |
|---|---|
| `import { Bot } from "grammy"` | `import { Bot } from "gramio"` |
| `new Bot<MyContext>(token)` | `new Bot(token)` — no generic |
| `bot.start()` | `bot.start()` — same |
| `ctx.reply(text)` | `ctx.send(text)` |
| `ctx.replyWithPhoto(file_id)` | `ctx.sendPhoto(file_id)` |
| `ctx.answerCallbackQuery()` / `(text)` | `ctx.answer()` / `ctx.answer({ text })` |
| `ctx.api.sendMessage(id, text)` | `ctx.api.sendMessage({ chat_id: id, text })` |
| `bot.api.sendMessage(id, text)` | `bot.api.sendMessage({ chat_id: id, text })` |
| `bot.on("message:text", h)` | `bot.on("message", h)` + `ctx.text` |
| `bot.hears(/re/, h)` | `bot.hears(/re/, h)` — same |
| `ctx.message?.text` | `ctx.text` (shorthand on message ctx) |
| `ctx.match` (regex callback) | `ctx.queryData` with a `CallbackData` schema |
| `bot.catch((err) => ...)` | `bot.onError(({ context, kind, error }) => ...)` |
| `{ remove_keyboard: true }` | `new RemoveKeyboard()` |
| `new InputFile("path")` | `await MediaUpload.path("path")` |
| `import { InlineKeyboard } from "grammy"` | `import { InlineKeyboard } from "gramio"` |
| HTML / MarkdownV2 strings or `fmt` | ``format`${bold`text`}` `` |

## Context typing — flavors → derive/extend

grammY (flavors + generics):

```ts
import { Bot, Context, SessionFlavor, session } from "grammy";

interface SessionData { count: number }
type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(token);
bot.use(session({ initial: (): SessionData => ({ count: 0 }) }));
```

GramIO (inferred — no generics, no flavor types):

```ts
import { Bot } from "gramio";
import { session } from "@gramio/session";

const bot = new Bot(token)
    .extend(session({ initial: () => ({ count: 0 }) }))
    .derive((ctx) => ({ isAdmin: ctx.from?.id === ADMIN_ID }));

bot.on("message", (ctx) => {
    ctx.session.count++; // ✅ { count: number } — inferred
    ctx.isAdmin;         // ✅ boolean — inferred
});
```

## Conversations → Scenes

grammY's `@grammyjs/conversations` uses async-generator `conversation.wait()`. GramIO's `@gramio/scenes` is step-based with typed state — steps advance automatically when a matching update arrives (no explicit `wait()`).

```ts
// grammY
async function register(conversation, ctx) {
    await ctx.reply("Name?");
    const { message } = await conversation.wait();
    await ctx.reply(`Hi, ${message.text}`);
}
```

```ts
// GramIO — @gramio/scenes
const registerScene = new Scene("register")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("Name?");
        return ctx.scene.update({ name: ctx.text });
    })
    .step("message", (ctx) => ctx.send(`Hi, ${ctx.scene.state.name}`));

const bot = new Bot(token).extend(session()).extend(scenes([registerScene]));
bot.command("register", (ctx) => ctx.scene.enter(registerScene));
```

`ctx.scene.state` is typed from what you pass to `ctx.scene.update()`. No `ConversationFlavor`.

## Error handling

```ts
// grammY
bot.catch((err) => console.error(err.ctx.update.update_id, err.error));
```

```ts
// GramIO — centralized, with optional typed error kinds
bot
    .error("NO_RIGHTS", NoRightsError)
    .onError(({ kind, error, context }) => {
        if (kind === "NO_RIGHTS" && context.is("message"))
            context.send(`You need the «${error.role}» role.`);
    });
```

## Webhook

```ts
// grammY
import { webhookCallback } from "grammy";
app.use("/webhook", webhookCallback(bot, "express"));
```

```ts
// GramIO — webhookHandler + bot.start({ webhook }) calls setWebhook (no HTTP server)
import { webhookHandler } from "gramio";
fastify.post("/webhook", webhookHandler(bot, "fastify"));
bot.start({ webhook: { url: "https://example.com/webhook" } });
```

Supported adapters: Hono, Express, Fastify, Elysia, Koa, `Bun.serve`, `Deno.serve`, `node:http`.

## Migration checklist

- [ ] Swap imports `grammy` → `gramio` / `@gramio/*`.
- [ ] Delete every context generic and flavor type — use `.derive()` / `.extend()`.
- [ ] `ctx.reply` → `ctx.send`, `ctx.replyWith*` → `ctx.send*`, `ctx.answerCallbackQuery` → `ctx.answer`.
- [ ] Convert positional API calls to named-param objects.
- [ ] Replace `parse_mode` strings with `format` tagged templates.
- [ ] `bot.on("x:y")` filter syntax → `bot.on("x")` + context getters / `filters` (see filters.md).
- [ ] Regex callback `ctx.match` → `CallbackData` schema + `ctx.queryData` (see callback-data.md).
- [ ] `@grammyjs/conversations` → `@gramio/scenes` (see scenes.md).
- [ ] `bot.catch` → `bot.onError`.
- [ ] `new InputFile(...)` → `await MediaUpload.path/url/buffer(...)` (see files.md).
