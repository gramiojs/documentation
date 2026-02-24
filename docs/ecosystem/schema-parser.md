---
title: "@gramio/schema-parser — Telegram Bot API Schema Parser"

head:
    - - meta
      - name: "description"
        content: "@gramio/schema-parser parses the Telegram Bot API HTML documentation into a structured TypeScript schema with semantic type markers, InputFile unions, currency enums, and oneOf support. Used internally by @gramio/types."

    - - meta
      - name: "keywords"
        content: "gramio, schema-parser, telegram bot api, schema, typescript, type generation, InputFile, currencies, semantic types, formattable, code generation"
---

# @gramio/schema-parser

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/schema-parser?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/schema-parser)
[![JSR](https://jsr.io/badges/@gramio/schema-parser)](https://jsr.io/@gramio/schema-parser)

</div>

A TypeScript library that parses the [Telegram Bot API](https://core.telegram.org/bots/api) HTML documentation into a structured, type-annotated schema. It is used internally by [`@gramio/types`](/types) to generate all TypeScript type declarations — replacing the previous dependency on the Rust-based `tg-bot-api` crate.

> This is an **advanced / infrastructure package**. Regular bot developers don't need it. It's relevant if you're building type generators, linters, documentation tools, or anything that needs a machine-readable representation of the Telegram Bot API.

## Installation

::: code-group

```bash [npm]
npm install @gramio/schema-parser
```

```bash [yarn]
yarn add @gramio/schema-parser
```

```bash [pnpm]
pnpm add @gramio/schema-parser
```

```bash [bun]
bun add @gramio/schema-parser
```

:::

## Basic Usage

```ts
import { parseSchema } from "@gramio/schema-parser";

const schema = await parseSchema(); // fetches https://core.telegram.org/bots/api

console.log(schema.methods.sendMessage);
// {
//   name: "sendMessage",
//   description: "...",
//   fields: [ ... ],
//   returns: { type: "reference", name: "Message" }
// }

console.log(schema.objects.Message);
// {
//   name: "Message",
//   description: "...",
//   fields: [ ... ]
// }
```

## Schema Structure

The parsed schema has two top-level maps:

```ts
interface BotAPISchema {
    methods: Record<string, Method>;
    objects: Record<string, TelegramObject | ObjectWithEnum>;
}
```

### Fields & Types

Each field in a method or object has a `type` discriminated union:

| `type` value | Meaning |
|---|---|
| `"string"` | Plain string |
| `"number"` | Integer or float |
| `"boolean"` | Boolean |
| `"reference"` | Reference to another object (e.g. `Message`) |
| `"array"` | Array of another type |
| `"one_of"` | Union of types |
| `"file"` | `InputFile` — a file upload field |

### Semantic Type Markers

Fields carry optional `semanticType` markers that convey meaning beyond the raw type:

| `semanticType` | Meaning | How detected |
|---|---|---|
| `"formattable"` | Text that supports entities/parse_mode | Has `_entities` or `_parse_mode` sibling field |
| `"markup"` | Keyboard/reply markup object | Object name matches keyboard types |
| `"updateType"` | Update discriminator string | Field used in event routing |

Example — `sendMessage.text` has `semanticType: "formattable"` because the method also has `parse_mode` and `entities` parameters.

### InputFile Detection

String fields that accept file uploads (detected via "More information on Sending Files" link in the description) are automatically converted to `one_of` unions:

```ts
// Instead of: { type: "string" }
// You get:
{
    type: "one_of",
    variants: [
        { type: "file" },     // InputFile — local upload
        { type: "string" },   // file_id or URL
    ]
}
```

### Currencies Enum

The parser fetches Telegram's `currencies.json` and synthesizes a `Currencies` enum object, including `XTR` (Telegram Stars) which isn't in the currencies file:

```ts
schema.objects.Currencies;
// {
//   name: "Currencies",
//   type: "enum",
//   values: ["AED", "AFN", ..., "XTR", "ZMW"]
// }
```

Fields typed as ISO 4217 currency codes (like `currency` in `sendInvoice`) automatically reference this enum.

## Exported Types

```ts
import type {
    BotAPISchema,
    Method,
    TelegramObject,
    ObjectWithEnum,
    Field,
    FieldType,
    FieldFile,
    SemanticType,
} from "@gramio/schema-parser";
```

## Use Case: Custom Type Generator

```ts
import { parseSchema } from "@gramio/schema-parser";

const schema = await parseSchema();

for (const [name, method] of Object.entries(schema.methods)) {
    const returnType = method.returns;
    console.log(`${name} → ${JSON.stringify(returnType)}`);
}
```

## See Also

- [`@gramio/types`](/types) — the generated TypeScript types powered by this package
- [Telegram Bot API](https://core.telegram.org/bots/api) — the source documentation
