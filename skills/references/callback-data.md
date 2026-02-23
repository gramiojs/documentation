---
name: callback-data
description: Type-safe callback data schemas with CallbackData class — define, pack, and unpack structured callback button data.
---

# CallbackData

Type-safe callback data for inline keyboard buttons.

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

## Comparison with Raw Strings

```typescript
// Without CallbackData — manual, error-prone
bot.callbackQuery(/^item_(\d+)_(.+)$/, (context) => {
    const [, id, action] = context.data!.match(/^item_(\d+)_(.+)$/)!;
    // id is string, needs Number() conversion
    // action is string, no type narrowing
});

// With CallbackData — type-safe, auto-parsed
bot.callbackQuery(itemAction, (context) => {
    context.queryData.id;     // number (auto-converted)
    context.queryData.action; // string
});
```

<!--
Source: https://gramio.dev/triggers/callback-query
-->
