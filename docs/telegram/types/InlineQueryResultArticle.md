---
title: InlineQueryResultArticle — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InlineQueryResultArticle Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InlineQueryResultArticle, telegram bot api types, gramio InlineQueryResultArticle, InlineQueryResultArticle object, InlineQueryResultArticle typescript
---

# InlineQueryResultArticle

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inlinequeryresultarticle" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Represents a link to an article or web page.

## Fields

<ApiParam name="type" type="String" required description="Type of the result, must be *article*" constValue="article" />

<ApiParam name="id" type="String" required description="Unique identifier for this result, 1-64 Bytes" />

<ApiParam name="title" type="String" required description="Title of the result" />

<ApiParam name="input_message_content" type="InputMessageContent" required description="Content of the message to be sent" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="*Optional*. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message" docsLink="/keyboards/overview" />

<ApiParam name="url" type="String" description="*Optional*. URL of the result" />

<ApiParam name="description" type="String" description="*Optional*. Short description of the result" />

<ApiParam name="thumbnail_url" type="String" description="*Optional*. Url of the thumbnail for the result" />

<ApiParam name="thumbnail_width" type="Integer" description="*Optional*. Thumbnail width" />

<ApiParam name="thumbnail_height" type="Integer" description="*Optional*. Thumbnail height" />

<!-- GENERATED:END -->

## GramIO Usage

Build article results with `InlineQueryResult.article()`:

```typescript
import {
    format,
    bold,
    InlineKeyboard,
    InlineQueryResult,
    InputMessageContent,
} from "gramio";

bot.inlineQuery(/wiki (.*)/i, async (ctx) => {
    const entry = await lookup(ctx.args![1]);

    await ctx.answer(
        [
            InlineQueryResult.article(
                entry.id,
                entry.title,
                InputMessageContent.text(
                    format`${bold(entry.title)}\n${entry.summary}`
                ),
                {
                    description: entry.shortDescription,
                    url: entry.url,
                    thumbnail_url: entry.thumbJpegUrl, // see warning below
                    thumbnail_width: 200,
                    thumbnail_height: 200,
                    reply_markup: new InlineKeyboard().url(
                        "Open source",
                        entry.url
                    ),
                }
            ),
        ],
        { cache_time: 0 }
    );
});
```

::: warning Thumbnail constraints
`thumbnail_url` must be a **JPEG** URL — PNG/WebP silently fail in some Telegram clients and the preview disappears instead of falling back to a default. Keep the image **≤320×320 px** and **≤200 KB**; oversized JPEGs fail the same way. If previews don't render and the URL is reachable, start by checking the format and dimensions.
:::

`input_message_content.message_text` on [`InputTextMessageContent`](/telegram/types/InputTextMessageContent) accepts a [`FormattableString`](/formatting) (the result of ``format`…` ``) directly — GramIO preserves entities. Do **not** call `.toString()` or set `parse_mode`.

For the full set of `context.answer()` options — including `button` for auth redirects, `next_offset` for pagination, and `is_personal` — see the [inlineQuery trigger guide](/triggers/inline-query#context-answer-options).

## See Also

- [InlineQueryResult](/telegram/types/InlineQueryResult) — the union this variant belongs to
- [`answerInlineQuery`](/telegram/methods/answerInlineQuery) — the method that accepts these results
- [`inlineQuery` trigger](/triggers/inline-query) — GramIO handler API
- [InputTextMessageContent](/telegram/types/InputTextMessageContent) — content type for `input_message_content`
- [InlineKeyboardMarkup](/telegram/types/InlineKeyboardMarkup) — attach buttons to the sent message
