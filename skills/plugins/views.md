---
name: views
description: Composing reusable Telegram message screens — `@gramio/views` is the recommended approach (templates, keyboards, media, i18n, auto send/edit). Plain render functions remain a valid fallback for trivial bots.
---

# Views

A **view** is a piece of code that produces a Telegram message — text, a keyboard, maybe media.

For the UX *rationale* behind views — button-first nav, edit-in-place over new sends, breadcrumbs, toggles, destructive confirm — see [ux-patterns](../references/ux-patterns.md). This file is about *how* to compose screens with views.

**For any non-trivial bot, use the [`@gramio/views`](https://gramio.dev/plugins/official/views) plugin.** It is the recommended way to compose screens in GramIO and scales from a 3-screen menu to a fully i18n'd, JSON-driven bot without structural rewrites. Reach for plain render functions only for throwaway or one-off bots with 2-3 static screens.

| Situation | Use |
|---|---|
| Two or three simple screens, static text, no media, throwaway bot | Plain render functions (later in this doc) |
| Everything else — menus, flows, media, i18n, CMS-driven content | **`@gramio/views` plugin** |

### Why default to `@gramio/views`

- **Separation of content and code** — text, keyboards, and media live in typed view templates (or JSON files), not inlined inside every handler.
- **Auto send-vs-edit** — `context.render(view, params)` figures out whether to `sendMessage` or `editMessageText` / `editMessageCaption` / `editMessageMedia` based on the update type. You stop writing the `ctx.is("callback_query") ? ctx.editText(...) : ctx.send(...)` branching by hand — this is the most common source of duplicated message bodies that drift out of sync.
- **Keyboards, media, interpolation, i18n out of the box** — `{{param}}` and `{{$global}}` interpolation in text, button labels, `callback_data`, URLs, and media paths; per-locale adapters via factory for i18n.
- **Refactor-friendly** — renaming or restructuring a view doesn't require hunting down `ctx.send(...)` call sites across handler files.

> `@gramio/views` is marked **work-in-progress** — its helper and adapter details may evolve. The core shape (`initViewsBuilder`, `.render(fn)`, `context.render(view, params)`, adapter factories) is stable and is considered the long-term direction for view composition in GramIO. Pin the version and upgrade intentionally.

---

# Views Plugin (recommended)

Package: `@gramio/views`

## Basic Usage

```typescript
import { Bot, InlineKeyboard } from "gramio";
import { initViewsBuilder } from "@gramio/views";

interface Data {
    user: { id: number; name: string; age: number };
    t: (key: "a" | "b", age: number) => string;
}

const defineView = initViewsBuilder<Data>();

const userView = defineView().render(function (test: "a" | "b") {
    return this.response
        .text(this.t(test, this.user.age))
        .keyboard(new InlineKeyboard().text("test", test));
});

const bot = new Bot(process.env.BOT_TOKEN!)
    .derive(["message", "callback_query"], async (context) => ({
        render: defineView.buildRender(context, {
            user: { id: context.from.id, name: context.from.firstName, age: 18 },
            t: (test, age) => test + age,
        }),
    }))
    .on("message", (context) => context.render(userView, "a"))
    .on("callback_query", (context) =>
        context.render(userView, context.data === "a" ? "b" : "a")
    );
```

`context.render(view, params)` auto-detects whether to `send` or `edit` based on context type — one call site, no branching.

## Modular Imports

```typescript
import { initViewsBuilder } from "@gramio/views";        // core
import { createJsonAdapter } from "@gramio/views/json";   // JSON adapter
import { loadJsonViews, loadJsonViewsDir } from "@gramio/views/fs"; // filesystem
import { defineAdapter } from "@gramio/views/define";     // custom adapters
```

- `@gramio/views/fs` includes Node.js filesystem APIs — don't import in browser/edge
- Better tree-shaking with separate imports

## JSON Adapter

```typescript
import { createJsonAdapter } from "@gramio/views/json";

const adapter = createJsonAdapter({
    views: {
        welcome: { text: "Hello, {{name}}!" },
        goodbye: { text: "See you later!" },
    },
});

const defineView = initViewsBuilder<Data>().from(adapter);

// In handler:
context.render("welcome", { name: "Alice" });
```

### Keyboards in JSON

`reply_markup` mirrors the Telegram Bot API directly. `{{key}}` interpolation works in button text, `callback_data`, `url`, and `input_field_placeholder`.

```json
{
    "welcome": {
        "text": "Hello, {{name}}!",
        "reply_markup": {
            "inline_keyboard": [
                [
                    { "text": "Profile {{name}}", "callback_data": "profile_{{id}}" },
                    { "text": "Help", "callback_data": "help" }
                ]
            ]
        }
    }
}
```

Also supports reply keyboards, remove keyboard, and force reply.

### Media in JSON

```json
{
    "photo_view": {
        "text": "A caption",
        "media": { "type": "photo", "media": "{{photoUrl}}" }
    },
    "gallery": {
        "text": "My photos",
        "media": [
            { "type": "photo", "media": "{{photo1}}" },
            { "type": "photo", "media": "{{photo2}}" }
        ]
    }
}
```

Supported types: `photo`, `video`, `animation`, `audio`, `document`.

### Globals with `{{$path}}`

Access globals (from `buildRender`) directly in JSON templates:

```json
{ "welcome": { "text": "Welcome to {{$appName}}!" } }
{ "profile": { "text": "{{$user.name}} (age {{$user.age}})" } }
```

### Custom `resolve` Callback

For i18n or custom interpolation:

```typescript
const adapter = createJsonAdapter({
    views: { greet: { text: "{{t:hello}}, {{name}}!" } },
    resolve: (key, globals) => {
        if (key.startsWith("t:")) return globals.t(key.slice(2));
    },
});
```

### i18n with Adapter Factory

Pass a factory function to `from()` for per-locale adapter selection:

```typescript
const adapters = {
    en: createJsonAdapter({ views: await loadJsonViewsDir("./views/en") }),
    ru: createJsonAdapter({ views: await loadJsonViewsDir("./views/ru") }),
};

const defineView = initViewsBuilder<Data>().from(
    (globals) => adapters[globals.locale]
);
```

## Filesystem Loading

```typescript
// Single file
const views = await loadJsonViews("./views.json");

// Directory — keys are dot-separated file paths + view names
// views/messages.json { "welcome": {...} } → "messages.welcome"
// views/goods/products.json { "list": {...} } → "goods.products.list"
const views = await loadJsonViewsDir("./views");
const adapter = createJsonAdapter({ views });
```

---

# Plain Render Functions (fallback — trivial bots only)

For throwaway bots or bots with literally 2-3 static screens, you can skip the plugin and use plain functions. **Anything more complex should use `@gramio/views`** — this pattern stops scaling the moment you add i18n, media, JSON-driven content, or more than a handful of screens.

The pattern:

1. Each "screen" is a plain function `render<Name>(ctx)` that calls `ctx.send` or `ctx.editText`.
2. One shared `CallbackData` schema names the destinations.
3. **One** `bot.callbackQuery(nav, …)` handler fans out to the render functions via `switch`.

This pattern is critical because it **avoids the "first-registered wins" silent conflict** — if two different plugins each call `bot.callbackQuery(nav, …)` with the same schema, only the first handler fires, the rest become dead code (see [middleware-routing](../references/middleware-routing.md)). Centralising the router in one place eliminates that class of bug.

```typescript
import { Bot, CallbackData, InlineKeyboard, type ContextType } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN!);

// `typeof bot` carries derives/decorates through — render fns stay typed.
type NavCtx = ContextType<typeof bot, "callback_query">;

const nav = new CallbackData("nav").enum("to", ["home", "history", "settings"]);

function renderHome(ctx: NavCtx) {
    const kb = new InlineKeyboard()
        .text("History", nav.pack({ to: "history" }))
        .text("Settings", nav.pack({ to: "settings" }));
    return ctx.editText("🏠 Home", { reply_markup: kb });
}

function renderHistory(ctx: NavCtx) {
    const kb = new InlineKeyboard().text("◀ Home", nav.pack({ to: "home" }));
    return ctx.editText("📜 History (empty)", { reply_markup: kb });
}

function renderSettings(ctx: NavCtx) {
    const kb = new InlineKeyboard().text("◀ Home", nav.pack({ to: "home" }));
    return ctx.editText("🛠 Settings", { reply_markup: kb });
}

bot.command("start", (ctx) => {
    const kb = new InlineKeyboard()
        .text("History", nav.pack({ to: "history" }))
        .text("Settings", nav.pack({ to: "settings" }));
    return ctx.send("Menu", { reply_markup: kb });
})
    // ONE place handles all nav clicks. Fan-out via switch.
    .callbackQuery(nav, async (ctx) => {
        await ctx.answer();
        switch (ctx.queryData.to) {
            case "home":     return renderHome(ctx);
            case "history":  return renderHistory(ctx);
            case "settings": return renderSettings(ctx);
        }
    });

bot.start();
```

Full worked example: [`skills/examples/callback-routing.ts`](../examples/callback-routing.ts).

### Rules for this pattern

1. **Never type render functions as `ctx: any`** — derive `NavCtx` from `ContextType<typeof bot, "callback_query">` (or your appropriate update name). The AI that writes `any` here is the AI that writes `any` throughout your bot — stop it at the first example.
2. **Render functions don't register handlers.** They take `ctx` and return the edit/send promise. The router calls them.
3. **Don't let each view register its own `.callbackQuery(nav, …)`** — first-registered wins silently. Centralise on the bot or on one router plugin.
4. If you need many views spread across feature plugins, each plugin exports its render functions (without registering any nav handler) and the root bot file owns the one `.callbackQuery(nav, …)` dispatcher.
5. If a screen needs data (user profile, cart, …), pull it from `ctx.*` that comes from `.derive()`/`.decorate()` on the bot — `NavCtx` already carries those types.

### When to graduate to `@gramio/views`

Graduate as soon as any of the following apply (in practice: most real bots):

- Text content grows large and non-trivial to inline in `.ts`
- You want JSON-driven templates (designers can edit without touching code)
- You need i18n with per-locale content files
- You render media (photo galleries, albums) based on dynamic data
- Auto-detect "send vs. edit" becomes painful to hand-code — i.e. the same screen is reached from both `bot.command` and `bot.callbackQuery`

The plugin is designed for exactly these scenarios and handles them without further restructuring.
