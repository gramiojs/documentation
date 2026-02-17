---
name: formatting
description: Text formatting utilities — template literals, entity functions, combination restrictions, and the join helper.
---

# Formatting

Package: `@gramio/format` (built into GramIO, also usable standalone).

## Template Literals

```typescript
import { format, bold, italic, link } from "@gramio/format";
// or from "gramio"

// format strips leading indentation (like dedent)
context.send(format`Hello ${bold("world")}!`);

// formatSaveIndents preserves indentation
import { formatSaveIndents } from "@gramio/format";
context.send(formatSaveIndents`
    Indented
    ${bold("text")}
`);
```

## Entity Functions

| Function | Example | Restrictions |
|----------|---------|-------------|
| `bold(text)` | **Bold** | Cannot combine with code/pre |
| `italic(text)` | _Italic_ | Cannot combine with code/pre |
| `underline(text)` | Underline | Cannot combine with code/pre |
| `strikethrough(text)` | ~~Strike~~ | Cannot combine with code/pre |
| `spoiler(text)` | Spoiler | Cannot combine with code/pre |
| `blockquote(text)` | Blockquote | Cannot nest |
| `expandableBlockquote(text)` | Expandable | Cannot nest |
| `code(text)` | `Inline code` | Cannot combine with anything |
| `pre(text, lang?)` | Code block | Cannot combine with anything |
| `link(text, url)` | Hyperlink | Cannot combine with code/pre |
| `mention(text, user)` | User mention | Cannot combine with code/pre |
| `customEmoji(emoji, id)` | Custom emoji | Bot owner needs Telegram Premium |

All work as both tagged template literals and function calls:

```typescript
bold`text`       // tagged template
bold("text")     // function call
pre(`code`, "typescript")  // with language param
mention("Click here", { id: 123456789 })  // mention user without @username
```

## Custom Emoji

```typescript
customEmoji("⭐", "5368324170671202286");
```

Requirements:
- Bot owner must have Telegram Premium
- Works in DMs and regular group chats (not channels)
- No Fragment username purchase needed

## Join Helper

Format arrays safely:

```typescript
const items = ["TypeScript", "Bun", "Deno"];

context.send(
    format`Supported:
${join(items, (item) => bold(item), "\n")}`
);
// Default separator: ", "
```

<!--
Source: https://gramio.dev/formatting
-->
