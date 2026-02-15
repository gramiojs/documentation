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

::: code-group

```bash [npm]
npm install @gramio/views
```

```bash [yarn]
yarn add @gramio/views
```

```bash [pnpm]
pnpm add @gramio/views
```

```bash [bun]
bun install @gramio/views
```

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
