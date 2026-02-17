---
name: keyboards
description: Complete keyboard builder API — Keyboard, InlineKeyboard, RemoveKeyboard, ForceReplyKeyboard — with all button types, layout helpers, and styling options.
---

# Keyboards

Package: `@gramio/keyboards` (built into GramIO, also usable standalone).

## Keyboard (Reply Keyboard)

```typescript
import { Keyboard } from "gramio";
```

### Button Types

| Method | Description |
|--------|-------------|
| `.text(label, options?)` | Send label as message |
| `.requestUsers(label, requestId, options?)` | Pick users |
| `.requestChat(label, requestId, options?)` | Pick chat (default `chat_is_channel: false`) |
| `.requestPoll(label, type?)` | Pick poll type (`"quiz"`, etc.) |
| `.requestLocation(label)` | Share location |
| `.requestContact(label)` | Share phone contact |
| `.webApp(label, url)` | Launch Web App |

### Options

| Method | Description |
|--------|-------------|
| `.resized(bool?)` | Resize vertically (default `true`). `.resized(false)` to disable |
| `.oneTime(bool?)` | Hide keyboard after use |
| `.persistent(bool?)` | Always visible |
| `.selective(bool?)` | Show only to mentioned users |
| `.placeholder(text?)` | Input field placeholder (1-64 chars) |

### Button Styling (since @gramio/keyboards 1.3.0)

```typescript
new Keyboard()
    .text("Delete", { style: "danger" })      // red
    .text("Confirm", { style: "success" })     // green
    .text("Info", { style: "primary" })         // blue
    .text("Custom", { icon_custom_emoji_id: "5368324170671202286" });
```

## InlineKeyboard

```typescript
import { InlineKeyboard } from "gramio";
```

### Button Types

| Method | Description |
|--------|-------------|
| `.text(label, callbackData, options?)` | Callback button |
| `.url(label, url, options?)` | Open URL |
| `.webApp(label, url, options?)` | Launch Web App |
| `.copy(label, textToCopy, options?)` | Copy to clipboard |
| `.login(label, urlOrOptions, options?)` | Telegram Login |
| `.pay(label, options?)` | Pay button (**must** be first in first row) |
| `.switchToChat(label, query?, options?)` | Switch to another chat with inline query |
| `.switchToChosenChat(label, queryOrOptions?, options?)` | Pick chat type for inline |
| `.switchToCurrentChat(label, query?, options?)` | Inline in current chat |
| `.game(label, params, options?)` | Game (**must** be first in first row) |

Same button styling support as Keyboard.

## Layout Helpers (both Keyboard and InlineKeyboard)

```typescript
const kb = new InlineKeyboard()
    .text("A", "a").text("B", "b").row()    // manual row break
    .text("C", "c").text("D", "d");

// Auto columns (max N per row)
new InlineKeyboard().columns(3)
    .text("1", "1").text("2", "2").text("3", "3")
    .text("4", "4").text("5", "5");
// Result: row [1,2,3] then row [4,5]

// Pattern — specify columns per row
new InlineKeyboard().pattern([1, 2, 3])
    .text("A", "a")           // row 1: 1 button
    .text("B", "b").text("C", "c")  // row 2: 2 buttons
    .text("D", "d").text("E", "e").text("F", "f"); // row 3: 3 buttons

// Custom wrap logic
new Keyboard().wrap(({ button, index, row, rowIndex }) => {
    return index % 3 === 0; // break every 3 buttons
});

// Filter buttons
new InlineKeyboard()
    .text("Keep", "keep").text("Remove", "remove")
    .filter(({ button }) => button.callback_data !== "remove");

// Conditional buttons
const isAdmin = true;
new InlineKeyboard()
    .text("Public", "public")
    .addIf(isAdmin, InlineKeyboard.text("Admin", "admin"));

// Button matrix
new InlineKeyboard().matrix(3, 3, ({ rowIndex, index }) =>
    InlineKeyboard.text(`${rowIndex},${index}`, `cell_${rowIndex}_${index}`)
);

// Combine keyboards
const kb1 = new InlineKeyboard().text("A", "a");
const kb2 = new InlineKeyboard().text("B", "b");
kb1.combine(kb2); // merges rows
```

Static methods mirror instance: `Keyboard.text("label")`, `InlineKeyboard.text("label", "data")`.

## RemoveKeyboard

```typescript
import { RemoveKeyboard } from "gramio";

context.send("Keyboard removed", {
    reply_markup: new RemoveKeyboard().selective(),
});
```

## ForceReplyKeyboard

```typescript
import { ForceReplyKeyboard } from "gramio";

context.send("Please reply:", {
    reply_markup: new ForceReplyKeyboard()
        .selective()
        .placeholder("Type your answer..."),
});
```

<!--
Source: https://gramio.dev/keyboards/
-->
