---
title: GramIO Cheat Sheet - Quick Reference for Telegram Bot Development
head:
    - - meta
      - name: "description"
        content: "Quick reference for GramIO — the TypeScript Telegram Bot API framework. Commands, triggers, keyboards, formatting, plugins, hooks, guards, i18n, testing and more in one page."
    - - meta
      - name: "keywords"
        content: "GramIO, cheat sheet, quick reference, telegram bot, TypeScript, commands, triggers, keyboards, hooks, plugins, formatting, sessions, files, guard, derive, i18n, testing"
---

# Cheat Sheet

Quick reference for the most common GramIO patterns. Click any heading to go to the full docs.

**On this page:** [Setup](#setup) · [Commands](#commands) · [Hears](#hears) · [Any update](#listen-to-any-update) · [Derive & Decorate](#derive-decorate) · [Guards](#guards) · [Inline Keyboard](#inline-keyboard) · [Callback Query](#callback-query) · [Reply Keyboard](#reply-keyboard) · [Formatting](#format-messages) · [Files](#send-files) · [Session](#session) · [Scenes](#scenes-conversations) · [I18n](#i18n) · [Error Handling](#error-handling) · [Hooks](#hooks) · [Plugins](#use-a-plugin) · [Write Plugin](#write-a-plugin) · [Inline Query](#inline-query) · [Autoload](#autoload-handlers) · [Testing](#testing) · [Webhook](#webhook)

---

## [Setup](/get-started)

```bash
npm create gramio my-bot
```

```ts
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.start();
```

---

## [Commands](/triggers/command)

```ts
bot.command("start", (ctx) => ctx.send("Hello!"));

// With arguments: /say hello world → ctx.args = "hello world"
bot.command("say", (ctx) => ctx.send(ctx.args ?? "nothing"));
```

---

## [Hears](/triggers/hears)

```ts
// Exact string
bot.hears("hi", (ctx) => ctx.send("Hey!"));

// Regex — ctx.args holds the match array
bot.hears(/^hello (.+)/i, (ctx) => ctx.send(`Hi, ${ctx.args?.[1]}!`));

// Function predicate
bot.hears(
    (ctx) => ctx.text?.startsWith("?"),
    (ctx) => ctx.send("A question!"),
);
```

---

## [Listen to any update](/bot-api)

```ts
bot.on("message", (ctx) => ctx.send("Got your message!"));

bot.on(["message", "edited_message"], (ctx) => ctx.send("New or edited!"));
```

---

## [Derive & Decorate](/extend/middleware)

`derive` runs per-request; `decorate` runs once at startup.

```ts
// Per-request: enriches ctx with fresh data each time
const bot = new Bot(token)
    .derive(async (ctx) => ({
        user: await db.getUser(ctx.from?.id),
    }))
    .on("message", (ctx) => {
        ctx.user; // fully typed ✅
    });
```

```ts
// Per-update-type: only for specific events
const bot = new Bot(token)
    .derive("message", async (ctx) => ({
        isAdmin: await db.isAdmin(ctx.from.id),
    }))
    .on("message", (ctx) => {
        ctx.isAdmin; // ✅ — only typed on "message" handlers
    });
```

```ts
// Startup-time: no per-request overhead
const bot = new Bot(token)
    .decorate({ db, redis, config })
    .on("message", (ctx) => {
        ctx.db.query("..."); // ✅ — same instance every time
    });
```

---

## [Guards](/extend/middleware)

Stop the middleware chain when a condition isn't met. Downstream handlers only run if the guard passes.

```ts
// Reusable admin guard
const adminOnly = bot.guard(
    (ctx) => ctx.from?.id === ADMIN_ID,
    // optional rejection handler:
    (ctx) => ctx.send("Admins only.")
);

adminOnly.command("ban", (ctx) => ctx.send("User banned."));
```

```ts
// Narrow update type — filter for messages with text
const textOnly = bot.guard((ctx) => ctx.is("message") && !!ctx.text);

textOnly.on("message", (ctx) => {
    ctx.text; // string — narrowed by the guard ✅
});
```

---

## [Inline Keyboard](/keyboards/inline-keyboard)

```ts
import { InlineKeyboard, CallbackData } from "gramio";

// Simple text buttons
const keyboard = new InlineKeyboard()
    .text("Yes ✅", "yes")
    .text("No ❌", "no")
    .row()
    .url("GitHub", "https://github.com/gramiojs/gramio");

ctx.send("Choose:", { reply_markup: keyboard });
```

```ts
// Type-safe callback data
const actionData = new CallbackData("action").number("id");

ctx.send("Pick one:", {
    reply_markup: new InlineKeyboard()
        .text("Item 1", actionData.pack({ id: 1 }))
        .text("Item 2", actionData.pack({ id: 2 })),
});
```

---

## [Callback Query](/triggers/callback-query)

```ts
// String match
bot.callbackQuery("yes", (ctx) => ctx.editText("You said yes!"));

// Type-safe CallbackData
const actionData = new CallbackData("action").number("id");

bot.callbackQuery(actionData, (ctx) => {
    ctx.send(`You picked ID: ${ctx.queryData.id}`);
    //                                      ^? number
});
```

---

## [Reply Keyboard](/keyboards/keyboard)

```ts
import { Keyboard } from "gramio";

const keyboard = new Keyboard()
    .text("Option A")
    .text("Option B")
    .row()
    .requestLocation("Share location 📍")
    .resized();

ctx.send("Choose:", { reply_markup: keyboard });
```

---

## [Remove Keyboard](/keyboards/remove-keyboard)

```ts
import { RemoveKeyboard } from "gramio";

ctx.send("Keyboard removed.", { reply_markup: new RemoveKeyboard() });
```

---

## [Format Messages](/formatting)

```ts
import { format, bold, italic, link, code, pre, spoiler } from "gramio";

ctx.send(format`
    ${bold`Hello!`} Welcome to ${link("GramIO", "https://gramio.dev")}.

    Here is some ${italic`styled`} text and a ${spoiler`surprise`}.

    ${code("inline code")} or a block:
    ${pre("const x = 1;", "typescript")}
`);
```

---

## [Send Files](/files/media-upload)

```ts
import { MediaUpload } from "@gramio/files";

// From disk
ctx.sendDocument(await MediaUpload.path("./report.pdf"));

// From URL
ctx.sendPhoto(await MediaUpload.url("https://example.com/cat.png"));

// From Buffer
ctx.sendDocument(await MediaUpload.buffer(buffer, "file.pdf"));

// By file_id (already uploaded to Telegram)
ctx.sendPhoto("AgACAgIAAxk...");
```

---

## [Session](/plugins/official/session)

```ts
import { session } from "@gramio/session";

const bot = new Bot(process.env.BOT_TOKEN as string).extend(
    session({
        key: "session",
        initial: () => ({ count: 0 }),
    }),
);

bot.command("count", (ctx) => {
    ctx.session.count++;
    //    ^? { count: number }
    ctx.send(`Count: ${ctx.session.count}`);
});
```

---

## [Scenes (conversations)](/plugins/official/scenes)

```ts
import { Scene, scenes } from "@gramio/scenes";
import { session } from "@gramio/session";

const loginScene = new Scene("login")
    .step("message", (ctx) => {
        if (ctx.scene.step.firstTime) return ctx.send("Enter your email:");
        return ctx.scene.update({ email: ctx.text });
    })
    .step("message", (ctx) =>
        ctx.send(`Registered: ${ctx.scene.state.email}`)
    );

const bot = new Bot(process.env.BOT_TOKEN as string)
    .extend(session())
    .extend(scenes([loginScene]));

bot.command("login", (ctx) => ctx.scene.enter(loginScene));
```

---

## [I18n](/plugins/official/i18n)

```ts
import { defineI18n, type LanguageMap, type ShouldFollowLanguage } from "@gramio/i18n";
import { format, bold } from "gramio";

const en = {
    welcome: (name: string) => format`Hello, ${bold(name)}!`,
    items: (count: number) => `You have ${count} item${count === 1 ? "" : "s"}`,
} satisfies LanguageMap;

const ru = {
    welcome: (name: string) => format`Привет, ${bold(name)}!`,
    items: (count: number) => `У вас ${count} предмет${count === 1 ? "" : "ов"}`,
} satisfies ShouldFollowLanguage<typeof en>; // must match en keys/signatures

const i18n = defineI18n({ primaryLanguage: "en", languages: { en, ru } });

const bot = new Bot(token)
    .derive((ctx) => ({
        t: i18n.buildT(ctx.from?.language_code ?? "en"),
    }));

bot.command("start", (ctx) =>
    ctx.send(ctx.t("welcome", ctx.from?.first_name ?? "stranger"))
);
```

---

## [Error Handling](/hooks/on-error)

```ts
// Catch all errors
bot.onError(({ context, kind, error }) => {
    console.error(kind, error.message);
    if (context.is("message")) context.send("Something went wrong.");
});

// Only for specific update types
bot.onError("message", ({ context, kind, error }) => {
    context.send(`${kind}: ${error.message}`);
});

// Custom typed errors
class NoRights extends Error {
    constructor(public role: "admin" | "moderator") {
        super();
    }
}

const bot = new Bot(process.env.BOT_TOKEN as string)
    .error("NO_RIGHTS", NoRights)
    .onError(({ kind, error, context }) => {
        if (kind === "NO_RIGHTS" && context.is("message"))
            context.send(`You need the «${error.role}» role.`);
    });
```

---

## [Hooks](/hooks/overview)

```ts
bot.onStart((info) => console.log(`@${info.username} is running!`));

bot.onStop(() => console.log("Shutting down..."));

// Intercept every API request
bot.preRequest((ctx) => {
    console.log("Calling", ctx.method);
    return ctx;
});

// Inspect every response
bot.onResponse((ctx) => {
    console.log(ctx.method, "→", ctx.response);
    return ctx;
});
```

---

## [Use a Plugin](/plugins/overview)

```ts
import { autoAnswerCallbackQuery } from "@gramio/auto-answer-callback-query";

bot.extend(autoAnswerCallbackQuery());
```

---

## [Write a Plugin](/plugins/how-to-write)

```ts
import { Plugin } from "gramio";

const myPlugin = new Plugin("my-plugin").derive("message", (ctx) => ({
    isAdmin: ctx.from?.id === 123456789,
}));

bot.extend(myPlugin);

bot.on("message", (ctx) => {
    if (ctx.isAdmin) ctx.send("Hi boss!");
    //     ^? boolean
});
```

---

## [Inline Query](/triggers/inline-query)

```ts
bot.inlineQuery("cats", async (ctx) => {
    await ctx.answer(
        [
            ctx.buildInlineQueryResult.article({
                id: "1",
                title: "Cat fact",
                input_message_content: { message_text: "Cats purr at 25Hz." },
            }),
        ],
        { cache_time: 30 },
    );
});
```

---

## [Autoload handlers](/plugins/official/autoload)

```ts
import { autoload } from "@gramio/autoload";

// Loads all files from ./src/commands/**/*.ts automatically
const bot = new Bot(process.env.BOT_TOKEN as string).extend(autoload());
```

```ts
// src/commands/start.ts
import type { Bot } from "gramio";

export default (bot: Bot) => bot.command("start", (ctx) => ctx.send("Hi!"));
```

---

## [Testing](/testing)

```ts
import { describe, expect, it } from "bun:test";
import { Bot } from "gramio";
import { TelegramTestEnvironment } from "@gramio/test";

const bot = new Bot("test");
bot.command("start", (ctx) => ctx.send("Hello!"));

const env = new TelegramTestEnvironment(bot);
const user = env.createUser({ first_name: "Alice" });

// Simulate a /start command
await user.sendMessage("/start");

// Assert the response
expect(env.apiCalls[0].method).toBe("sendMessage");
expect(env.apiCalls[0].params.text).toBe("Hello!");
```

---

## [Webhook](/updates/webhook)

GramIO has no built-in HTTP server — bring your own framework and use `webhookHandler`:

```ts
import { Bot, webhookHandler } from "gramio";
import Fastify from "fastify";

const bot = new Bot(process.env.BOT_TOKEN as string);
const fastify = Fastify();

fastify.post("/webhook", webhookHandler(bot, "fastify"));
fastify.listen({ port: 3000, host: "::" });

bot.start({
    webhook: { url: "https://example.com/webhook" },
});
```

See [all supported frameworks →](/updates/webhook) (Hono, Express, Elysia, Koa, Bun.serve, Deno.serve, node:http)
