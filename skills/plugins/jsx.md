---
name: jsx
description: Write Telegram message formatting and keyboards as JSX — `<b>`, `<i>`, `<a href>`, `<keyboard inline>` — with no React dependency.
---

# JSX (`@gramio/jsx`)

Replaces `format` + `bold()` + `italic()` helpers with JSX syntax. Compiles to the same `FormattableString` / `InlineKeyboard` / `Keyboard` that GramIO expects — no runtime change in bot behavior. Package ships its own JSX runtime; no React.

## Setup

```bash
npm add @gramio/jsx
```

`tsconfig.json`:

```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "@gramio/jsx"
    }
}
```

Files that use JSX must be `.tsx`.

## Text formatting

```tsx
import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN as string)
    .command("demo", (context) =>
        context.send(
            <>
                <b>Bold</b><br />
                <i>Italic</i><br />
                <u>Underline</u> <s>Strike</s><br />
                <spoiler>hidden</spoiler><br />
                <code>inline</code><br />
                <pre>{`multi
line`}</pre><br />
                <blockquote expandable>long quote...</blockquote><br />
                <a href="https://gramio.dev">GramIO</a><br />
                <mention id={context.from!.id}>You</mention><br />
                <custom-emoji emojiId="5222106016283378623">emoji</custom-emoji>
            </>
        )
    );

bot.start();
```

**All elements:** `<b>`, `<i>`, `<u>`, `<s>`, `<spoiler>`, `<code>`, `<pre>`, `<blockquote>` (with `expandable`), `<a href>`, `<mention id>`, `<custom-emoji emojiId>`, `<br />`. Nest freely: `<b><i>bold italic</i></b>`.

## Inline keyboard

Pass the JSX keyboard as `reply_markup`:

```tsx
await context.send(<b>Pick one:</b>, {
    reply_markup: (
        <keyboard inline>
            <row>
                <button callbackData="open">Open</button>
                <button url="https://gramio.dev">Docs</button>
            </row>
            <row>
                <button switchToCurrentChat="search">Search inline</button>
            </row>
        </keyboard>
    ),
});
```

**Inline `<button>` props:** `callbackData`, `url`, `webApp={{ url }}`, `loginUrl`, `switchToChat`, `switchToCurrentChat`, `switchToChosenChat`, `copyText`, `game`, `pay`.

## Reply keyboard

Omit `inline` to build a reply keyboard:

```tsx
await context.send("Choose:", {
    reply_markup: (
        <keyboard oneTime placeholder="Select...">
            <row>
                <button requestContact>Send contact</button>
                <button requestLocation>Send location</button>
            </row>
            <row>
                <button>Plain text button</button>
            </row>
        </keyboard>
    ),
});
```

**`<keyboard>` props:** `persistent`, `selective`, `resized`, `oneTime`, `placeholder`.
**Reply `<button>` props:** `requestContact`, `requestLocation`, `requestChat`, `requestPoll={{ type: "quiz" | "regular" }}`, `webApp={{ url }}`.

## Rules

- **Never mix `parse_mode`** — JSX produces entities, not HTML strings. Setting `parse_mode: "HTML"` corrupts the message, same rule as `format`.
- **`.toString()` on a JSX element destroys entities** — pass the element directly to `text:` / `caption:` in `send`, `editMessageText`, `editMessageCaption`.
- **Reusable pieces = functions returning JSX** — write `function Greeting({ name }: { name: string }) { return <b>Hi, {name}!</b>; }`, not `any`-typed builders. Compose: `<><Greeting name="Ada" /><br />...</>`.
- **JSX and `format` interop** — both emit `FormattableString`; you can embed `format` output inside JSX children via `{bold("x")}` and vice versa, but don't `.toString()` either one.
