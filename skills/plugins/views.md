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

### How the four pieces fit together

The basic example wires up four things — knowing what each one does is the difference between "this works" and "this works after I changed three files."

| # | Piece | Purpose |
|---|---|---|
| 1 | `initViewsBuilder<Data>()` | Declare the **globals shape** once. `Data` is the type of values you'll pass to `buildRender`. |
| 2 | `defineView().render(function (params) {...})` | Declare one view. Inside, `this` carries globals (typed) **and** `this.response` (the message builder). |
| 3 | `.derive(["message", "callback_query"], ctx => ({ render: defineView.buildRender(ctx, globals) }))` | Wire `context.render` onto **every update type** that should render views. Forgetting an update type silently disables `ctx.render` for that update. |
| 4 | `context.render(view, params)` | Calls `sendMessage` / `editMessageText` / `editMessageMedia` / `editMessageCaption` automatically based on `ctx` type. |

### Use `function`, not arrow, inside `.render`

The view's globals reach the body via `this`. Arrow functions don't bind `this`:

```ts
// ❌ `this` is undefined inside the body
defineView().render((params) => this.response.text("nope"));

// ✅
defineView().render(function (params) {
    return this.response.text(`hi ${this.user.name}`);
});
```

This is the most common silent breakage when migrating from inline `ctx.send` to a view.

### Same view, two contexts — the killer feature

```ts
const profileView = defineView<Data>().render(function () {
    return this.response
        .text(`${this.user.name} — age ${this.user.age}`)
        .keyboard(new InlineKeyboard().text("Refresh", "refresh"));
});

bot
    .command("profile",        (ctx) => ctx.render(profileView))   // → sendMessage
    .callbackQuery("refresh",  (ctx) => ctx.render(profileView));  // → editMessageText
```

Same view, two call sites, **zero** `ctx.is("callback_query") ? ctx.editText(...) : ctx.send(...)` branching. This branching is the #1 source of message bodies that duplicate and drift out of sync — views eliminate the entire class.

Rule of thumb: when you find yourself writing both `ctx.send(...)` and `ctx.editText(...)` for the same screen, that screen wants to be a view.

### Globals vs params — what goes where

`buildRender(context, globals)` is called inside `.derive()` per update. The second arg becomes `this.<key>` in `render` and `{{$<key>}}` in JSON templates. `context.render(view, params)` accepts a second arg too — those are per-call values.

```ts
.derive(["message", "callback_query"], (ctx) => ({
    render: defineView.buildRender(ctx, {
        user:    { id: ctx.from.id, name: ctx.from.firstName },
        locale:  ctx.from.languageCode ?? "en",
        db:      yourDb,                 // service handle, not just data
    }),
}));

// later:
ctx.render(productView, { id: 42 });  // 42 is per-call → params
```

Conventions that scale:

- **Group globals by namespace** (`user.*`, `session.*`, `app.*`). Flat globals collide and become a bag of misc.
- **Globals are per-update context**: current user, locale, db/service handles. Per-call values (the item just clicked, the page number) go to `params`.
- **Locale belongs in globals, not params** — that's how the i18n adapter factory `(globals) => adapters[globals.locale]` selects the right adapter automatically.
- **Fetch once in `.derive()`, read in render.** Don't fetch DB inside `render` — it runs per redraw.

### When `ctx.render` doesn't exist (TS error or runtime undefined)

The derive list is missing that update type. Add it:

```ts
.derive(["message", "callback_query", "inline_query"], ...)
```

The derive must list every update type that will call `context.render`. There is no wildcard "all updates."

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

# Composition cookbook

### View vs Scene vs Prompt — when to use which

| Need | Use |
|---|---|
| One screen, react to button clicks | **View** |
| Multi-step flow with validated input ("name → email → confirm") that must survive restarts | **Scene** rendering a view per step |
| Single one-shot ask, in-memory only ("type your name now") | **`@gramio/prompt`** (in-memory) |
| Confirm before destructive action | View with two-button keyboard + a `callbackQuery` handler that does or aborts |

Views are the **rendering** layer. Scenes are the **state** layer. They compose: a scene-step renders its question via `context.render(askNameView)` instead of writing `ctx.send(...)` by hand. See [scenes](./scenes.md) for the state side; see [ux-patterns](../references/ux-patterns.md) for the UX rationale (button-first nav, edit-in-place, breadcrumbs, destructive confirms).

### Centralize the callback router (also when using views)

The first-registered-wins trap from the plain-render pattern below applies to view-based bots too. If two plugins each call `bot.callbackQuery(nav, …)` with the same `CallbackData` schema, only the first fires — the rest become silent dead code (see [middleware-routing](../references/middleware-routing.md)).

Rule: **views are values, not handler-registrars.** Each plugin exports its views; the root bot file (or one router plugin) owns the single `bot.callbackQuery(nav, ...)` dispatcher that fans out via `switch` to `ctx.render(...)`. Never let a view file register its own callback handler.

### Anti-patterns

**1. `ctx.send` next to a view of the same screen.**

```ts
// ❌ Half-migrated. Two bodies, no auto-edit.
bot.command("profile",   (ctx) => ctx.send(`${user.name} — age ${user.age}`, { reply_markup: kb }));
bot.callbackQuery("ref", (ctx) => ctx.render(profileView));
```

If a view exists for a screen, **every** call site goes through `ctx.render(view)`. Mixing breaks send/edit auto-detection and drifts the two bodies apart over time.

**2. Fetching data inside `render`.**

```ts
// ❌ Hits DB on every redraw, can't share with neighbors.
defineView<Data>().render(async function () {
    const user = await db.users.find(this.userId);
    return this.response.text(`${user.name}`);
});
```

Fetch in `.derive()`, expose via globals, read with `this.user` in render. Render is a pure function of `(globals, params)` — keep it that way.

**3. Bloating globals with per-call data.**

```ts
// ❌ "currentItemId" changes per click — that's params, not globals
defineView.buildRender(ctx, { user, currentItemId: ctx.queryData.id });
```

Globals are per-update context. Per-call values are the second arg of `ctx.render(view, params)`.

**4. Inlining JSON-driven content into `.ts` "for now".**

If the text is meant to be CMS-edited or i18n'd, put it in JSON from the start. Migrating later forces touching every handler.

**5. Registering a `callbackQuery` handler inside a view module.**

A view is a value — text + keyboard + media. It must not import the bot or register listeners. Let the root file route.

---

# Inline-query and chosen-inline-result

The same view definition serves four contexts: `message` (send), `callback_query` (chat edit), `inline_query` (each list item is one `InlineQueryResult`), and `chosen_inline_result` (edit-in-place via `inline_message_id`). One render body, zero duplication.

### `.preview()` — inline-only metadata

Inline results carry preview data (id, title, description, thumbnail) that doesn't appear in regular send/edit. Set it with `.preview()` inside the same render body — it's ignored when the view is rendered as a normal message.

```typescript
const trackView = defineView<Data>().render(function (track: Track) {
    return this.response
        .text(`${track.title} — ${track.artist}`)
        .media({
            type: "audio",
            media: track.url,
            performer: track.artist,    // → InlineQueryResultAudio.performer
            duration: track.durationSec, // → audio_duration
        })
        .keyboard(new InlineKeyboard().text("Refresh", "refresh"))
        .preview({
            id: trackRef.pack({ src: track.source, id: track.id }),
            title: track.title,
            description: track.artist,
            thumbnail: { url: track.albumArt, width: 200, height: 200 },
        });
});
```

The `id` lives **inside** `.preview()` — it's typically a function of `params`, so co-locating with the rest of the preview keeps the call site clean.

### Required preview fields by result type

The transformer enforces the Telegram Bot API requirements at render time, with field-named errors. Quick reference:

| Render shape | Maps to | Required `.preview()` fields | Required on `.media()` |
|---|---|---|---|
| text only | `Article` | `id`, `title` | — |
| text + photo | `Photo` | `id`, `thumbnail.url` | — |
| text + audio | `Audio` | `id`, `title` | — |
| text + video | `Video` | `id`, `title`, `thumbnail.url` | — |
| text + voice | `Voice` | `id`, `title` | — |
| text + document | `Document` | `id`, `title` | `mimeType` (`application/pdf` \| `application/zip`) |
| text + animation | `Mpeg4Gif` | `id`, `thumbnail.url` | — |

`InlineQueryResultArticle` requires the response to also have `.text(...)` set — it delivers an `InputTextMessageContent`.

### Listing results in `inline_query`

`ctx.render.inlineResult(view, ...args)` is a **pure transformer** — no IO. Map your data, then answer:

```typescript
bot.on("inline_query", async (ctx) => {
    const tracks = await search(ctx.query);
    await ctx.answer(
        await Promise.all(tracks.map((t) => ctx.render.inlineResult(trackView, t))),
        { cache_time: 0, is_personal: true },
    );
});
```

Or use `answerInline` sugar:

```typescript
bot.on("inline_query", async (ctx) => {
    const tracks = await search(ctx.query);
    await ctx.render.answerInline(
        tracks.map((t) => [trackView, t]),
        { cache_time: 0, is_personal: true },
    );
});
```

`answerInline` runs all transformers in parallel and calls `ctx.answer(results, opts)`. Use it for the common case; reach for the `Promise.all` form when you need to filter results by-shape after rendering.

### Auto-edit on `chosen_inline_result`

`ctx.render(view, params)` in `chosen_inline_result` context routes to `editMessageText` / `editMessageMedia` / `editMessageCaption` / `editMessageReplyMarkup` keyed by `inline_message_id` — same auto-detect as callback-query edit, just on a different key.

```typescript
bot.chosenInlineResult(/.+/, async (ctx) => {
    const data = trackRef.safeUnpack(ctx.resultId);
    if (!data.success) return;
    const fresh = await fetchTrack(data.data.src, data.data.id);
    if (!fresh) return;
    await ctx.render(trackView, fresh);   // ← auto-edits via inline_message_id
});
```

Don't forget to add `chosen_inline_result` to your `.derive()` list:

```typescript
bot.derive(
    ["message", "callback_query", "inline_query", "chosen_inline_result"],
    (ctx) => ({ render: defineView.buildRender(ctx, globals) }),
);
```

### `id` is your responsibility — encode lookup keys, don't store payloads

Views compose visuals; they don't bridge `id ↔ payload`. Pair with `CallbackData` (the same class works for `result_id` packing as for callback buttons) and **refetch on chosen** instead of caching the full payload in Redis. Fresher data, no TTL bugs, no Redis on the hot path.

```typescript
const trackRef = new CallbackData("track").string("src").string("id");

// pack into result.id inside .preview()
.preview({ id: trackRef.pack({ src, id }), title, ... })

// unpack on chosen
const data = trackRef.safeUnpack(ctx.resultId);
```

If your payload genuinely doesn't fit in 64 bytes and you have no stable id to refetch by, use a separate registry — that's outside views' scope.

### What views deliberately don't do

- **No fetcher / pagination / dedup / ranking** — `.map` over your data yourself; pagination via `next_offset` belongs in the handler.
- **No `id ↔ payload` bridge** — encode lookup keys with `CallbackData` and refetch.
- **No `answerInlineQuery`-level params abstraction** — `cache_time`, `is_personal`, `next_offset`, `button` go to `ctx.answer(items, opts)` directly. They're per-answer, not per-view.

### Forced strategies for inline

```typescript
ctx.render.inlineResult(view, params)  // pure → InlineQueryResult
ctx.render.answerInline(items, opts?)  // sugar → ctx.answer(items.map(toInlineResult), opts)
ctx.render.editInline(view, params)    // force inline-message edit (replay stored inline_message_id)
```

`render.editInline(...)` is the escape hatch for replaying a stored `inline_message_id` from a non-`chosen_inline_result` context — for example, a queue worker updating an inline-sent message hours later.

### Inline anti-patterns

**1. Reply keyboards in inline results** — Telegram only supports `inline_keyboard` markup. The transformer throws.

```typescript
.keyboard({ keyboard: [[{ text: "Help" }]] })  // ❌ throws on .toInlineResult()
.keyboard(new InlineKeyboard().text("Help", "help"))  // ✅
```

**2. Relying on `chosen_inline_result` without `/setinlinefeedback`** — Telegram only delivers the update if `setinlinefeedback` is enabled with @BotFather AND the result included `reply_markup`. Without both, `chosen_inline_result` never fires; `inline_message_id` is undefined; `ctx.render(view, ...)` throws explaining this. Configure it once in BotFather and add an `InlineKeyboard` to results that need follow-up edits.

**3. Caching full track/item objects under `result_id`** — encode the lookup key (`{src, id}` via `CallbackData`) and refetch on chosen. You get fresh data, no TTL bugs, no Redis on the hot path. Reach for storage only when no stable id exists.

**4. Using cached (`file_id`) result variants** — not supported in v1. URLs only; sticker results (which Telegram only offers in cached form) are deferred.

**5. Forgetting `inline_query` in `.derive()`** — `ctx.render` won't be present, and the inline handler will silently break.

### JSON adapter — `preview` key

`@gramio/views/json` recognises a `preview` key on view definitions. Same `{{key}}` and `{{$global}}` interpolation; numeric fields (`duration`, `width`, `height`) coerce after interpolation.

```json
{
    "track-result": {
        "text": "{{title}} — {{artist}}",
        "media": {
            "type": "audio",
            "media": "{{audioUrl}}",
            "performer": "{{artist}}",
            "duration": "{{duration}}"
        },
        "reply_markup": {
            "inline_keyboard": [[{ "text": "Open", "callback_data": "open_{{packedId}}" }]]
        },
        "preview": {
            "id": "{{packedId}}",
            "title": "{{title}}",
            "description": "{{artist}}",
            "thumbnail": { "url": "{{albumArt}}", "width": 200, "height": 200 }
        }
    }
}
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
