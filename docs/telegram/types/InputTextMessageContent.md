---
title: InputTextMessageContent — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputTextMessageContent Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputTextMessageContent, telegram bot api types, gramio InputTextMessageContent, InputTextMessageContent object, InputTextMessageContent typescript
---

# InputTextMessageContent

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputtextmessagecontent" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents the [content](https://core.telegram.org/bots/api#inputmessagecontent) of a text message to be sent as the result of an inline query.

## Fields

<ApiParam name="message_text" type="String" required description="Text of the message to be sent, 1-4096 characters" :minLen="1" :maxLen="4096" />

<ApiParam name="parse_mode" type="String" description="*Optional*. Mode for parsing entities in the message text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="entities" type="MessageEntity[]" description="*Optional*. List of special entities that appear in message text, which can be specified instead of *parse\_mode*" />

<ApiParam name="link_preview_options" type="LinkPreviewOptions" description="*Optional*. Link preview generation options for the message" />

<!-- GENERATED:END -->

## GramIO Usage

`message_text` accepts a [`FormattableString`](/formatting) (the result of ``format`…` ``) directly — GramIO's `formatMiddleware` decomposes it into `text` + `entities` when serializing the request. You do **not** need `parse_mode`, and you must **not** call `.toString()`.

::: warning Misleading type signature
The field is typed as `string | { toString(): string }`. Despite what the `{ toString(): string }` implies, GramIO **does not** call `.toString()` on a `FormattableString` — entities are preserved. Pass the ``format`…` `` result directly.
:::

```typescript
import {
    format,
    bold,
    link,
    InlineQueryResult,
    InputMessageContent,
} from "gramio";

bot.inlineQuery(/find (.*)/i, async (ctx) => {
    await ctx.answer(
        [
            InlineQueryResult.article(
                "result-1",
                `Result for ${ctx.args![1]}`,
                InputMessageContent.text(
                    format`Found ${bold(ctx.args![1])} — see ${link`details`("https://example.com")}`,
                ),
            ),
        ],
        { cache_time: 0 },
    );
});
```

Plain strings still work — only use ``format`…` `` when you need entities.

## See Also

- [InputMessageContent](/telegram/types/InputMessageContent) — the union this variant belongs to
- [`answerInlineQuery`](/telegram/methods/answerInlineQuery)
- [InlineQueryResultArticle](/telegram/types/InlineQueryResultArticle)
- [MessageEntity](/telegram/types/MessageEntity)
- [Formatting guide](/formatting)
