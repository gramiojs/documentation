---
title: GramIO Cheat Sheet - Quick Reference for Telegram Bot Development
head:
    - - meta
      - name: "description"
        content: "Quick reference for GramIO — the TypeScript Telegram Bot API framework. Commands, triggers, keyboards, formatting, plugins, hooks and more in one place."
    - - meta
      - name: "keywords"
        content: "GramIO, cheat sheet, quick reference, telegram bot, TypeScript, commands, triggers, keyboards, hooks, plugins, formatting, sessions, files"
---

# Cheat Sheet

Quick reference for the most common GramIO patterns. Click any heading to go to the full docs.

## [Setup](/get-started)

```bash
npm create gramio my-bot
```

```ts
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.start();
```

## [Commands](/triggers/command)

```ts
bot.command("start", (ctx) => ctx.send("Hello!"));

// With arguments: /say hello world → ctx.args = "hello world"
bot.command("say", (ctx) => ctx.send(ctx.args ?? "nothing"));
```

## [Hears](/triggers/hears)

```ts
// Exact string
bot.hears("hi", (ctx) => ctx.send("Hey!"));

// Regex — ctx.args holds the match array
bot.hears(/^hello (.+)/i, (ctx) => ctx.send(`Hi, ${ctx.args?.[1]}!`));

// Function
bot.hears(
    (ctx) => ctx.text?.startsWith("?"),
    (ctx) => ctx.send("A question!"),
);
```

## [Listen to any update](/bot-api)

```ts
bot.on("message", (ctx) => ctx.send("Got your message!"));

bot.on(["message", "edited_message"], (ctx) => ctx.send("New or edited!"));
```

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

## [Callback Query](/triggers/callback-query)

```ts
// String
bot.callbackQuery("yes", (ctx) => ctx.editText("You said yes!"));

// Type-safe CallbackData
const actionData = new CallbackData("action").number("id");

bot.callbackQuery(actionData, (ctx) => {
    ctx.send(`You picked ID: ${ctx.queryData.id}`);
    //                                      ^? number
});
```

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

## [Remove Keyboard](/keyboards/remove-keyboard)

```ts
import { RemoveKeyboard } from "gramio";

ctx.send("Keyboard removed.", { reply_markup: new RemoveKeyboard() });
```

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

## [Hooks](/hooks/overview)

```ts
bot.onStart((info) => console.log(`@${info.username} is running!`));

bot.onStop(() => console.log("Shutting down..."));

// Intercept every API request
bot.preRequest((ctx) => {
    console.log("Calling", ctx.method);
    return ctx;
});
```

## [Use a Plugin](/plugins/overview)

```ts
import { autoAnswerCallbackQuery } from "@gramio/auto-answer-callback-query";

bot.extend(autoAnswerCallbackQuery());
```

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

## [Scenes (conversations)](/plugins/official/scenes)

```ts
import { Scene, Scenes } from "@gramio/scenes";

const loginScene = new Scene("login")
    .step("message", (ctx) => ctx.send("Enter your email:"))
    .step("message", (ctx) => {
        const email = ctx.text;
        return ctx.send(`Got it: ${email}`);
    });

const bot = new Bot(process.env.BOT_TOKEN as string).extend(
    new Scenes([loginScene]),
);

bot.command("login", (ctx) => ctx.scene.enter("login"));
```

## [Webhook](/updates/webhook)

```ts
bot.start({
    webhook: {
        url: "https://example.com/bot",
        port: 8080,
    },
});
```
