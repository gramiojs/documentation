---
name: callback-data
description: Type-safe callback data schemas with CallbackData class — define, pack, and unpack structured callback button data.
---

# CallbackData

Type-safe callback data for inline keyboard buttons.

## ⚠️ Prefix is a Hash — Never Compare with `.startsWith()`

`CallbackData.pack()` produces a compact string: `<id><serialized-payload>`, where `<id>` is the **first 6 characters of sha1(nameId), base64url-encoded** (e.g. `nav` → `qh31PD`). It is **not** a literal prefix like `"nav:"`.

```typescript
const nav = new CallbackData("nav").enum("to", ["home", "history"]);
nav.pack({ to: "home" }); // → "qh31PDHome" (or similar) — NOT "nav:home"
```

This means:

```typescript
// ❌ Always false at runtime — "nav:" is never the actual prefix
bot.on("callback_query", (ctx) => {
    if (ctx.data?.startsWith("nav:")) { /* never reached */ }
});

// ❌ Manually slicing never works either
bot.on("callback_query", (ctx) => {
    const payload = ctx.data?.slice("nav:".length);
});
```

Always route through one of the four supported matchers (see next section).

## Decision Tree — Which API to Use

| Your callback data shape | API |
|---|---|
| Fixed string (no variables) | `bot.callbackQuery("refresh", handler)` |
| Simple pattern with 1-2 captures | `bot.callbackQuery(/^page_(\d+)$/, handler)` + `ctx.match` |
| Structured multi-field payload | `new CallbackData(...)` + `bot.callbackQuery(schema, handler)` |
| Same schema may be stale in old messages | `schema.safeUnpack(ctx.data!)` for graceful fallback |

```typescript
// Fixed string
bot.callbackQuery("refresh", (ctx) => ctx.answer("Refreshed"));

// Pattern — ctx.match is the RegExp result array
bot.callbackQuery(/^page_(\d+)$/, (ctx) => {
    const [, page] = ctx.match!;
    ctx.answer(`Page ${page}`);
});

// Schema
const itemAction = new CallbackData("item").number("id").string("action");
bot.callbackQuery(itemAction, (ctx) => {
    ctx.queryData.id;     // number
    ctx.queryData.action; // string
});

// Stale-safe
const result = itemAction.safeUnpack(ctx.data!);
if (!result.success) return ctx.answer("Button expired");
result.data.id; // typed
```

## Define Schema

```typescript
import { CallbackData } from "gramio";

const itemAction = new CallbackData("item")
    .number("id")
    .string("action");

// Methods available:
// .number(key) — numeric field
// .string(key) — string field
```

## Pack Data for Buttons

```typescript
import { InlineKeyboard } from "gramio";

const keyboard = new InlineKeyboard()
    .text("Buy #1", itemAction.pack({ id: 1, action: "buy" }))
    .text("Info #1", itemAction.pack({ id: 1, action: "info" }))
    .row()
    .text("Buy #2", itemAction.pack({ id: 2, action: "buy" }));
```

## Handle with Type Safety

```typescript
bot.callbackQuery(itemAction, (context) => {
    // context.queryData is typed: { id: number, action: string }
    const { id, action } = context.queryData;

    if (action === "buy") {
        return context.answer(`Buying item #${id}`);
    }
    return context.answer(`Info for item #${id}`, { show_alert: true });
});
```

## safeUnpack() (v0.1.0+)

Never throws — returns a discriminated union. Useful for stale buttons from old schema versions:

```typescript
const result = data.safeUnpack(ctx.data!);
if (!result.success) {
    return ctx.answerCallbackQuery({ text: "This button is outdated!" });
}
console.log(result.data.id); // typed
```

Return type: `SafeUnpackResult<T>` = `{ success: true; data: T } | { success: false; error: Error }`

### Schema Migration Safety

Safe: adding optional fields to the end of a schema
```typescript
const v2 = new CallbackData("page")
    .number("id")
    .string("tab", { optional: true }); // safe — old strings unpack as tab=undefined
```

Unsafe (breaking): adding required fields, reordering, renaming `nameId`, changing types.

## Schema vs RegExp

If all you need is 1-2 numeric ids, RegExp routing is fine. But the moment you have two or more fields with mixed types, switch to `CallbackData` — it is shorter to write, type-safe, and robust against schema changes:

```typescript
// RegExp — fine for one integer
bot.callbackQuery(/^item_(\d+)$/, (ctx) => {
    const id = Number(ctx.match![1]); // must convert by hand, no type safety
});

// CallbackData — preferred for anything structured
bot.callbackQuery(itemAction, (ctx) => {
    ctx.queryData.id;     // number (auto-converted)
    ctx.queryData.action; // string (auto-typed)
});
```

> Do **not** write the regex variant that parses two fields by hand (`/^item_(\d+)_(.+)$/`) — it looks concise but loses type safety, union narrowing for enums, and default handling for optional fields.

<!--
Source: https://gramio.dev/triggers/callback-query
-->
