---
title: "JSX Plugin for GramIO - Format Telegram Messages with JSX"

head:
    - - meta
      - name: "description"
        content: "Use JSX to format Telegram bot messages and build keyboards in GramIO. Supports bold, italic, code, links, spoilers, inline and reply keyboards."

    - - meta
      - name: "keywords"
        content: "Telegram bot JSX, GramIO JSX, JSX formatting Telegram, Telegram message formatting, JSX keyboard builder, inline keyboard JSX, reply keyboard JSX, TypeScript JSX Telegram, Telegram bot tools, GramIO plugins, Deno, Bun, Node.js"
---

# JSX

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/jsx?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/jsx)
[![JSR](https://jsr.io/badges/@gramio/jsx)](https://jsr.io/@gramio/jsx)
[![JSR Score](https://jsr.io/badges/@gramio/jsx/score)](https://jsr.io/@gramio/jsx)

</div>

Use **JSX** to format Telegram bot messages and build keyboards. Instead of chaining `format`, `bold`, `italic` functions, write familiar HTML-like syntax that compiles into GramIO's `FormattableString` and `InlineKeyboard`/`Keyboard` objects.

No React dependency required — the package provides its own JSX runtime.

## Installation

::: code-group

```bash [npm]
npm install @gramio/jsx
```

```bash [yarn]
yarn add @gramio/jsx
```

```bash [pnpm]
pnpm add @gramio/jsx
```

```bash [bun]
bun add @gramio/jsx
```

:::

## Configuration

Add the JSX runtime to your `tsconfig.json`:

```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "@gramio/jsx"
    }
}
```

Your files should use the `.tsx` extension.

## Usage

### Text formatting

```tsx
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN!)
    .command("start", (context) =>
        context.send(<b>Hello!</b>)
    );

bot.start();
```

All Telegram formatting entities are supported as JSX elements:

```tsx
await context.send(
    <>
        <b>Bold text</b><br />
        <i>Italic text</i><br />
        <u>Underlined text</u><br />
        <s>Strikethrough</s><br />
        <spoiler>Hidden text</spoiler><br />
        <code>inline code</code><br />
        <pre>{`code block
with multiple lines`}</pre><br />
        <blockquote>Simple blockquote</blockquote><br />
        <blockquote expandable>Expandable blockquote</blockquote><br />
        <a href="https://gramio.dev">GramIO</a><br />
        <mention id={123456789}>User</mention><br />
        <custom-emoji emojiId="5222106016283378623">emoji</custom-emoji>
    </>
);
```

### Formatting elements reference

| Element | Description | Example |
|---------|-------------|---------|
| `<b>` | **Bold** text | `<b>bold</b>` |
| `<i>` | _Italic_ text | `<i>italic</i>` |
| `<u>` | Underlined text | `<u>underline</u>` |
| `<s>` | ~~Strikethrough~~ text | `<s>strikethrough</s>` |
| `<spoiler>` | Spoiler (hidden) text | `<spoiler>hidden</spoiler>` |
| `<code>` | Inline code | `<code>code</code>` |
| `<pre>` | Code block | `<pre>code block</pre>` |
| `<blockquote>` | Blockquote | `<blockquote>quote</blockquote>` |
| `<a href="...">` | Hyperlink | `<a href="https://gramio.dev">link</a>` |
| `<mention id={...}>` | User mention by ID | `<mention id={123}>user</mention>` |
| `<custom-emoji emojiId="...">` | Custom emoji | `<custom-emoji emojiId="123">emoji</custom-emoji>` |
| `<br />` | Line break | `text<br />next line` |

The `<blockquote>` element supports an optional `expandable` boolean prop for expandable blockquotes.

Nesting is supported — for example, `<b><i>bold italic</i></b>`.

### Inline keyboard

Pass a `<keyboard inline>` element to `reply_markup`:

```tsx
await context.send(
    <b>Choose an option:</b>,
    {
        reply_markup: (
            <keyboard inline>
                <row>
                    <button callbackData="action1">Click me</button>
                    <button url="https://gramio.dev">Open link</button>
                </row>
                <row>
                    <button switchToCurrentChat="query">Inline search</button>
                </row>
            </keyboard>
        ),
    }
);
```

#### Inline button props

| Prop | Type | Description |
|------|------|-------------|
| `callbackData` | `string` | Callback data for button press |
| `url` | `string` | URL to open |
| `webApp` | `{ url: string }` | WebApp to open |
| `loginUrl` | `TelegramLoginUrl` | Login URL |
| `switchToChat` | `string` | Switch inline query to another chat |
| `switchToCurrentChat` | `string` | Switch inline query to current chat |
| `switchToChosenChat` | `string \| TelegramSwitchInlineQueryChosenChat` | Switch to chosen chat |
| `copyText` | `string` | Copy text to clipboard |
| `game` | `TelegramCallbackGame` | Callback game |

### Reply keyboard

Omit the `inline` prop on `<keyboard>`:

```tsx
await context.send("Choose an option:", {
    reply_markup: (
        <keyboard oneTime placeholder="Select...">
            <row>
                <button requestContact>Send contact</button>
                <button requestLocation>Send location</button>
            </row>
            <row>
                <button>Simple button</button>
            </row>
        </keyboard>
    ),
});
```

#### Reply keyboard props

| Prop | Type | Description |
|------|------|-------------|
| `persistent` | `boolean` | Always show the keyboard |
| `selective` | `boolean` | Show only to specific users |
| `resized` | `boolean` | Resize the keyboard to fit |
| `oneTime` | `boolean` | Hide after button press |
| `placeholder` | `string` | Input field placeholder |

#### Reply button props

| Prop | Type | Description |
|------|------|-------------|
| `requestContact` | `boolean` | Request user's phone contact |
| `requestLocation` | `boolean` | Request user's location |
| `requestChat` | `TelegramKeyboardButtonRequestChat` | Request a chat selection |
| `requestPoll` | `{ type: "quiz" \| "regular" }` | Request poll creation |
| `webApp` | `{ url: string }` | Open a WebApp |

## Full example

```tsx
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN!)
    .command("start", (context) =>
        context.send(<b>Hello!</b>)
    )
    .command("demo", async (context) => {
        await context.reply(
            <>
                <b>Bold text</b><br />
                <i>Italic text</i><br />
                <u>Underlined</u><br />
                <s>Strikethrough</s><br />
                <spoiler><b>Bold spoiler</b></spoiler><br />
                <a href="https://gramio.dev">GramIO</a><br />
                <mention id={context.from!.id}>You</mention><br />
                <code>print("Hello")</code><br />
                <pre>{`function greet() {
    console.log("Hello!");
}`}</pre>
            </>,
            {
                reply_markup: (
                    <keyboard inline>
                        <row>
                            <button callbackData="test">Click me</button>
                            <button url="https://gramio.dev">Docs</button>
                        </row>
                    </keyboard>
                ),
            }
        );
    })
    .onStart(console.log);

bot.start();
```
