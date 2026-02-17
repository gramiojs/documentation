---
name: views
description: Template system for reusable message views with @gramio/views — programmatic and JSON-driven rendering, keyboards, media, i18n, and filesystem loading.
---

# Views Plugin

Package: `@gramio/views`

> **Work in progress** — API may change.

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

Auto-detects whether to `send` or `edit` based on context type.

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
