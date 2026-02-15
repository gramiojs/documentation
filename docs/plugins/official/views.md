# Views

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/views?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/views)
[![JSR](https://jsr.io/badges/@gramio/views)](https://jsr.io/@gramio/views)
[![JSR Score](https://jsr.io/badges/@gramio/views/score)](https://jsr.io/@gramio/views)

</div>

A template system for reusable message views. Auto-detects whether to send or edit based on context type. Supports programmatic adapters, JSON-driven views with interpolation, filesystem loading, i18n, all keyboard types, and media with URL interpolation.

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

Define a programmatic adapter with `defineAdapter` and wire it into your bot using `initViewsBuilder`:

```typescript
import { Bot } from "gramio";
import { initViewsBuilder } from "@gramio/views";
import { defineAdapter } from "@gramio/views/define";

const adapter = defineAdapter({
    welcome(name: string) {
        return this.response
            .text(`Hello, ${name}!`)
            .keyboard([[{ text: "Start", callback_data: "start" }]]);
    },
});

const defineView = initViewsBuilder().from(adapter);

const bot = new Bot(process.env.BOT_TOKEN!)
    .derive(["message", "callback_query"], (context) => ({
        render: defineView.buildRender(context, {}),
    }))
    .command("start", (context) => context.render("welcome", "Alice"));

await bot.start();
```

## Methods

### JSON Adapter

Use `createJsonAdapter` for JSON-driven views with `{{key}}` interpolation:

```typescript
import { createJsonAdapter } from "@gramio/views/json";

const adapter = createJsonAdapter({
    views: {
        welcome: {
            text: "Hello, {{name}}!",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Profile {{name}}", callback_data: "profile_{{id}}" }],
                ],
            },
        },
    },
});
```

### Filesystem Loading

Load JSON view files from a directory with `loadJsonViewsDir`. File names become view name prefixes:

```typescript
import { loadJsonViewsDir } from "@gramio/views/fs";

// views/messages.json → "messages.welcome", "messages.goodbye"
const views = await loadJsonViewsDir("./views");
```

### i18n Support

Select adapters per locale using an adapter factory:

```typescript
const defineView = initViewsBuilder<{ locale: string }>()
    .from((globals) => adapters[globals.locale]);
```

Or use a custom `resolve` function for translation keys:

```typescript
const adapter = createJsonAdapter({
    views: { greet: { text: "{{t:hello}}, {{name}}!" } },
    resolve: (key, globals) => {
        if (key.startsWith("t:")) return globals.t(key.slice(2));
    },
});
```

### Globals Access

Access global values in JSON templates using `{{$path}}` syntax. Globals are passed as the second argument to `buildRender` and can be referenced anywhere in a view template.
