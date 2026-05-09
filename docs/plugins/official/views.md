# Views

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/views?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/views)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/views?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/views)
[![JSR](https://jsr.io/badges/@gramio/views)](https://jsr.io/@gramio/views)
[![JSR Score](https://jsr.io/badges/@gramio/views/score)](https://jsr.io/@gramio/views)

</div>

A template system for reusable message views. Auto-detects whether to send a new message or edit the existing one based on context type. Supports programmatic adapters, JSON-driven views with interpolation, filesystem loading, i18n, all keyboard types, and media with URL interpolation.

> [!WARNING]
> This package is a work in progress. The API may change.

### Installation

::: pm-add @gramio/views
:::

### Usage

```ts
import { Bot, InlineKeyboard } from "gramio";
import { initViewsBuilder } from "@gramio/views";

interface Data {
    user: {
        id: number;
        name: string;
        age: number;
    };
    t: (test: "a" | "b", age: number) => string;
}

const defineView = initViewsBuilder<Data>();

const userView = defineView().render(function (test: "a" | "b") {
    return this.response
        .text(this.t(test, this.user.age))
        .keyboard(new InlineKeyboard().text("test", test));
});

const bot = new Bot(process.env.BOT_TOKEN!)
    .derive(["message", "callback_query"], async (context) => {
        const user = {
            id: context.from.id,
            name: context.from.firstName,
            age: 18,
        };

        const t = (test: "a" | "b", age: number) => test + age;

        return {
            render: defineView.buildRender(context, {
                user,
                t,
            }),
        };
    })
    .on("message", async (context) => {
        return context.render(userView, "a");
    })
    .on("callback_query", async (context) => {
        return context.render(userView, context.data === "a" ? "b" : "a");
    });

bot.start();
```

### How it works

Four pieces wire `context.render` together:

1. **`initViewsBuilder<Data>()`** declares the typed shape of the globals you'll pass to `buildRender`.
2. **`defineView().render(function (params) { ... })`** declares one view. Inside the body, `this` carries globals plus `this.response`, the message builder. Use `function`, not arrow — arrow loses `this`.
3. **`.derive(["message", "callback_query"], ctx => ({ render: defineView.buildRender(ctx, globals) }))`** attaches `context.render` to every update type that should render views. Forgetting an update type silently disables `context.render` for that update.
4. **`context.render(view, params)`** sends or edits automatically based on the context type — `sendMessage` for `message`, `editMessageText` / `editMessageMedia` / `editMessageCaption` for `callback_query`.

The same view called from a `command` handler and from a `callbackQuery` handler renders correctly in both — sending a fresh message in the first case, editing in place in the second:

```ts
bot
    .command("profile",       (ctx) => ctx.render(profileView))   // sendMessage
    .callbackQuery("refresh", (ctx) => ctx.render(profileView));  // editMessageText
```

This is the property that lets a single view definition serve both "show a screen" and "redraw a screen" without duplicate message bodies that drift out of sync.

### Globals vs params

`buildRender(context, globals)` runs inside `.derive()` per update. Its second arg becomes `this.<key>` inside `render` bodies and `{{$<key>}}` inside JSON templates — that's where per-update context lives (current user, locale, db handle).

`context.render(view, params)` accepts a second arg too. Those are per-call values — what changes between two `ctx.render` calls in the same handler. Locale belongs in globals (so the i18n adapter factory can route on it); the item the user just clicked belongs in params.

```ts
// derive — per-update context
.derive(["message", "callback_query"], (ctx) => ({
    render: defineView.buildRender(ctx, {
        user:   { id: ctx.from.id, name: ctx.from.firstName },
        locale: ctx.from.languageCode ?? "en",
    }),
}));

// later in a handler — per-call value
ctx.render(productView, { id: 42 });
```

### Lazy globals (since v0.2)

`buildRender` accepts both shapes for `globals`:

```ts
// 1. Plain object — captured once when .derive() runs
defineView.buildRender(ctx, { user, locale });

// 2. Thunk — re-evaluated per render
defineView.buildRender(ctx, () => ({ user, locale, snapshot: getCurrentSnapshot() }));
```

**Why a thunk?** A plain-object globals is captured at the moment `.derive()` runs. If your handler mutates state between `.derive()` and `ctx.render(view)` (session writes, scene `update()`, locale flip, role escalation, onboarding step advance), a captured-once view sees the **stale** snapshot. Pass a function and the views runtime re-invokes it on every `ctx.render(view)` call, so the view always reflects current state. The adapter factory is also re-invoked per render with the freshly resolved globals — so per-locale adapter routing keeps working when locale changes mid-handler.

```ts
.derive(["message", "callback_query"], (ctx) => ({
    render: defineView.buildRender(ctx, () => ({
        user:    { id: ctx.from!.id, name: ctx.from!.firstName },
        // captured fresh per render — locale flip in middleware "just works"
        locale:  ctx.from?.languageCode ?? "en",
        // tokens for @gramio/onboarding — see /plugins/official/onboarding
        onboarding: getCurrentOnboardingTokens(),
    })),
}));
```

> Property getters on a plain-object globals also resolve per render (object spread in `createContext` reads them each time). The thunk form is for cases where the entire shape needs to be rebuilt or where you want `ctx`-bound closures to re-capture.

## Imports

The library uses modular imports to avoid bundling unnecessary dependencies:

```ts
// Main entry — core functionality
import { initViewsBuilder } from "@gramio/views";

// Import adapters separately
import { createJsonAdapter } from "@gramio/views/json";
import { loadJsonViews, loadJsonViewsDir } from "@gramio/views/fs";
import { defineAdapter } from "@gramio/views/define";
```

**Why separate imports?**
- `@gramio/views/fs` includes Node.js filesystem APIs — don't import it in browser/edge environments
- Better tree-shaking and smaller bundles
- Clear separation of concerns

## JSON Adapter

Define views as JSON — useful for CMS-driven or user-editable templates.

```ts
import { initViewsBuilder } from "@gramio/views";
import { createJsonAdapter } from "@gramio/views/json";

const adapter = createJsonAdapter({
    views: {
        welcome: { text: "Hello, {{name}}!" },
        goodbye: { text: "See you later!" },
    },
});

const defineView = initViewsBuilder<Data>().from(adapter);

// Then in a handler:
context.render("welcome", { name: "Alice" });
```

### `reply_markup`, keyboards and media

The `reply_markup` field mirrors the [Telegram Bot API](https://core.telegram.org/bots/api#replykeyboardmarkup) directly. All `{{key}}` interpolation works in button text, `callback_data`, `url`, and `input_field_placeholder`.

**Inline keyboard:**

```json
{
    "welcome": {
        "text": "Hello, {{name}}!",
        "reply_markup": {
            "inline_keyboard": [
                [
                    { "text": "Profile {{name}}", "callback_data": "profile_{{id}}" },
                    { "text": "Help", "callback_data": "help" }
                ],
                [
                    { "text": "Visit", "url": "https://example.com/{{id}}" }
                ]
            ]
        }
    }
}
```

**Reply keyboard:**

```json
{
    "menu": {
        "text": "Choose an option:",
        "reply_markup": {
            "keyboard": [
                [{ "text": "Help" }, { "text": "Settings" }],
                [{ "text": "Share Contact", "request_contact": true }]
            ],
            "resize_keyboard": true,
            "one_time_keyboard": true
        }
    }
}
```

**Remove keyboard / Force reply:**

```json
{ "reply_markup": { "remove_keyboard": true } }
{ "reply_markup": { "force_reply": true, "input_field_placeholder": "Type {{what}}..." } }
```

**Media** (single or group):

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

Supported media types: `photo`, `video`, `animation`, `audio`, `document`.

### Globals access with `{{$path}}`

Use `{{$path}}` to reference globals (the values passed to `buildRender`) directly from JSON templates:

```json
{
    "welcome": { "text": "Welcome to {{$appName}}!" },
    "profile": { "text": "{{$user.name}} (age {{$user.age}})" }
}
```

```ts
// globals passed in .derive():
{ appName: "MyBot", user: { name: "Alice", age: 25 } }
```

Mix `$` globals with regular `{{params}}` freely: `"{{$botName}} says hi to {{name}}"`.

### Custom `resolve` callback

For i18n or any custom interpolation logic, pass a `resolve` function to `createJsonAdapter`. It is called for every `{{key}}` (except `$`-prefixed) before falling back to params:

```ts
const adapter = createJsonAdapter<{ t: (key: string) => string }, ViewMap>({
    views: {
        greet: { text: "{{t:hello}}, {{name}}!" },
    },
    resolve: (key, globals) => {
        if (key.startsWith("t:")) return globals.t(key.slice(2));
    },
});
```

If `resolve` returns `undefined`, the key falls through to params. Unresolved keys are preserved as `{{key}}`.

All three sources work everywhere — text, keyboard buttons, media URLs, placeholders:

```json
{ "text": "{{$brand}}: {{t:title}} — {{subtitle}}" }
```

### i18n with adapter factory

For full i18n, write entire JSON templates in each language and pass a **factory function** to `from()`. The factory receives globals and returns the correct adapter per locale:

```
views/
  en/
    welcome.json    → { "text": "Hello, {{name}}!" }
  ru/
    welcome.json    → { "text": "Привет, {{name}}!" }
```

```ts
import { initViewsBuilder } from "@gramio/views";
import { createJsonAdapter } from "@gramio/views/json";
import { loadJsonViewsDir } from "@gramio/views/fs";

const adapters = {
    en: createJsonAdapter({ views: await loadJsonViewsDir("./views/en") }),
    ru: createJsonAdapter({ views: await loadJsonViewsDir("./views/ru") }),
};

const defineView = initViewsBuilder<Data>().from(
    (globals) => adapters[globals.locale]
);

// In .derive(), locale comes from the user context:
bot.derive(["message", "callback_query"], (context) => ({
    render: defineView.buildRender(context, {
        locale: context.from.languageCode ?? "en",
    }),
}));

// render stays the same — adapter is selected automatically:
context.render("welcome", { name: "Alice" });
// → "Привет, Alice!" for Russian users
```

## Loading JSON views from the filesystem

### Single file

One JSON file with multiple views:

```json
// views.json
{
    "welcome": { "text": "Hello, {{name}}!" },
    "goodbye": { "text": "Bye!" }
}
```

```ts
import { createJsonAdapter } from "@gramio/views/json";
import { loadJsonViews } from "@gramio/views/fs";

const views = await loadJsonViews("./views.json");
const adapter = createJsonAdapter({ views });
```

### Directory

Each `.json` file contains multiple named views:

```
views/
  messages.json         → "messages.welcome", "messages.goodbye", "messages.help"
  goods/
    products.json       → "goods.products.list", "goods.products.detail"
```

```json
// messages.json
{
    "welcome": { "text": "Hello, {{name}}!" },
    "goodbye": { "text": "Bye, {{name}}!" },
    "help": { "text": "Need help?" }
}
```

```json
// goods/products.json
{
    "list": { "text": "Product list" },
    "detail": {
        "text": "Product {{name}}",
        "media": { "type": "photo", "media": "{{photo}}" }
    }
}
```

**How it works:**

Each `.json` file must contain an object where:
- **Keys** are view names
- **Values** are view definitions (`{ text?, reply_markup?, media? }`)

The final view key is the file path (dot-separated) + the view name:

```
views/
  main.json             ← { "home": {...}, "about": {...} }
  user/
    profile.json        ← { "view": {...}, "edit": {...} }
```

```ts
import { createJsonAdapter } from "@gramio/views/json";
import { loadJsonViewsDir } from "@gramio/views/fs";

const views = await loadJsonViewsDir("./views");
const adapter = createJsonAdapter({ views });

// Available keys:
// - "main.home"
// - "main.about"
// - "user.profile.view"
// - "user.profile.edit"
```

## Inline-query results

A view can also be rendered as an `InlineQueryResult` — the same `defineView` body that produces a chat message produces a search-list item with full type safety. Combined with the existing send/edit auto-detection, one view definition serves four contexts: `message`, `callback_query`, `inline_query`, and `chosen_inline_result`.

### `.preview()` — inline-only metadata

Inline results carry preview data (id, title, description, thumbnail) that doesn't appear in regular send/edit. Set it with `.preview()` inside the same render body — ignored when the view renders as a normal message.

```ts
import { CallbackData, InlineKeyboard } from "gramio";
import { initViewsBuilder } from "@gramio/views";

const trackRef = new CallbackData("track").string("src").string("id");

const trackView = defineView<Data>().render(function (track: Track) {
    return this.response
        .text(`${track.title} — ${track.artist}`)
        .media({
            type: "audio",
            media: track.url,
            performer: track.artist,
            duration: track.durationSec,
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

`PreviewOpts` shape:

```ts
type PreviewOpts = {
    id: string;                              // required, ≤ 64 bytes, unique per answer
    title?: string;                          // required for Article + Video/Audio/Voice/Document
    description?: string;
    thumbnail?: {
        url: string;                         // required for Photo/Gif/Mpeg4Gif/Video
        width?: number;
        height?: number;
        mimeType?: "image/jpeg" | "image/gif" | "video/mp4";   // Gif/Mpeg4Gif only
    };
    url?: string;                            // Article only — UI "Visit link"
};
```

### Mapping table

| Render shape | Maps to | Required `.preview()` | Required on `.media()` |
|---|---|---|---|
| text only | `InlineQueryResultArticle` | `id`, `title` | — |
| text + photo | `InlineQueryResultPhoto` | `id`, `thumbnail.url` | — |
| text + audio | `InlineQueryResultAudio` | `id`, `title` | — |
| text + video | `InlineQueryResultVideo` | `id`, `title`, `thumbnail.url` | — |
| text + voice | `InlineQueryResultVoice` | `id`, `title` | — |
| text + document | `InlineQueryResultDocument` | `id`, `title` | `mimeType` (`pdf` \| `zip`) |
| text + animation | `InlineQueryResultMpeg4Gif` | `id`, `thumbnail.url` | — |

`InlineQueryResultArticle` requires `.text(...)` set on the response — it delivers an `InputTextMessageContent`. The transformer throws with field-named errors before any network round-trip if a required field is missing.

### Listing results in `inline_query`

Add `inline_query` to your `.derive()` list, then map your data:

```ts
bot.derive(
    ["message", "callback_query", "inline_query", "chosen_inline_result"],
    (ctx) => ({ render: defineView.buildRender(ctx, globals) }),
);

bot.on("inline_query", async (ctx) => {
    const tracks = await search(ctx.query);
    await ctx.render.answerInline(
        tracks.map((t) => [trackView, t]),
        { cache_time: 0, is_personal: true },
    );
});
```

`ctx.render.answerInline(items, opts?)` is sugar for `ctx.answer(items.map(toInlineResult), opts)`. For more control (filtering by produced shape, custom error handling per item) use the pure transformer:

```ts
const results = await Promise.all(
    tracks.map((t) => ctx.render.inlineResult(trackView, t)),
);
await ctx.answer(results, { cache_time: 0, is_personal: true });
```

`ctx.render.inlineResult(view, ...args)` is **pure** — no IO, returns `InlineQueryResult`.

### Auto-edit on `chosen_inline_result`

In `chosen_inline_result` context, `ctx.render(view, params)` routes to `editMessageText` / `editMessageMedia` / `editMessageCaption` / `editMessageReplyMarkup` keyed by `inline_message_id` — same auto-detect as callback-query edit, just on a different key.

```ts
bot.chosenInlineResult(/.+/, async (ctx) => {
    const data = trackRef.safeUnpack(ctx.resultId);
    if (!data.success) return;
    const fresh = await fetchTrack(data.data.src, data.data.id);
    if (!fresh) return;
    await ctx.render(trackView, fresh);   // → editMessage* via inline_message_id
});
```

`chosen_inline_result` is only delivered if `/setinlinefeedback` is enabled with @BotFather **and** the result included `reply_markup`. Without both, the update never fires; if you call `ctx.render(view, ...)` and `inline_message_id` is missing, the plugin throws with an explanation.

### Forced inline strategies

```ts
ctx.render.inlineResult(view, params)  // pure → InlineQueryResult
ctx.render.answerInline(items, opts?)  // sugar → ctx.answer(items.map(toInlineResult), opts)
ctx.render.editInline(view, params)    // force inline-message edit (replay stored inline_message_id)
```

`render.editInline(...)` is the escape hatch for replaying a stored `inline_message_id` from a non-chosen context — for example, a queue worker updating an inline-sent message hours later.

### `id` as a lookup key, not a payload cache

Result ids are limited to 64 bytes. Use `CallbackData` to pack the small lookup key (provider + provider's id, or your DB primary key) and refetch on chosen, instead of storing the full payload in Redis. Fresher data, no TTL bugs, no Redis on the hot path:

```ts
const trackRef = new CallbackData("track").string("src").string("id");
trackRef.pack({ src: "spotify", id: "abc123" });   // ~16 bytes
```

The same `CallbackData` schema works for both inline `result_id` and callback-button `callback_data`.

### JSON adapter — `preview` key

`@gramio/views/json` recognises a `preview` key on view definitions. Same `{{key}}` and `{{$global}}` interpolation; numeric fields coerce from string after interpolation.

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

### What views deliberately don't do

- **No fetcher / pagination / dedup / ranking** — pagination via `next_offset` is per-answer; pass it to `ctx.answer(items, { next_offset })` yourself.
- **No `id ↔ payload` bridge** — encode lookup keys with `CallbackData` and refetch; views compose visuals.
- **No `cache_time` / `is_personal` / `button` abstraction** — those are per-answer params, passed to `ctx.answer(items, opts)`.

### Deferred (not yet supported)

- **Cached (`file_id`) result variants.** v1 supports only URL forms; cached variants and stickers (which Telegram only offers cached) come in a follow-up.
- **`InlineQueryResultLocation` / `Venue` / `Contact` / `Game` / `Invoice`.** Need new ResponseView shapes (lat/long, invoice prices). Phase 2.
- **Embedded-player video** (`mime_type: "text/html"` for YouTube/Vimeo). Requires `input_message_content` override.
