---
title: sendMessageDraft — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Stream partial messages to users while generating content using GramIO. Complete sendMessageDraft reference with TypeScript examples, draft_id usage, and LLM streaming via streamMessage.
  - - meta
    - name: keywords
      content: sendMessageDraft, telegram bot api, stream message telegram bot, telegram live typing, gramio sendMessageDraft, sendMessageDraft typescript, sendMessageDraft example, draft_id, streamMessage, LLM streaming telegram, how to stream message telegram bot, partial message telegram
---

# sendMessageDraft

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendmessagedraft" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to stream a partial message to a user while the message is being generated; supported only for bots with forum topic mode enabled. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer" required description="Unique identifier for the target private chat" />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread" />

<ApiParam name="draft_id" type="Integer" required description="Unique identifier of the message draft; must be non-zero. Changes of drafts with the same identifier are animated" />

<ApiParam name="text" type="String" required description="Text of the message to be sent, 1-4096 characters after entities parsing" :minLen="1" :maxLen="4096" />

<ApiParam name="parse_mode" type="String" description="Mode for parsing entities in the message text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="entities" type="MessageEntity[]" description="A JSON-serialized list of special entities that appear in message text, which can be specified instead of *parse\_mode*" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Stream a draft that updates in place with animation
bot.on("message", async (ctx) => {
  // Show the initial partial content
  await ctx.sendMessageDraft({ draft_id: 1, text: "Thinking..." });

  // Simulate generating a response
  await new Promise((r) => setTimeout(r, 1000));

  // Update the same draft — animates the change
  await ctx.sendMessageDraft({
    draft_id: 1,
    text: "Thinking... done! Here is your answer.",
  });
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// High-level: stream an AsyncIterable (e.g., LLM output) as live typing previews
bot.on("message", async (ctx) => {
  async function* generateResponse() {
    yield "Hello";
    yield ", world";
    yield "!";
  }

  // streamMessage handles draft_id management, batching, and finalization
  const messages = await ctx.streamMessage(generateResponse());
  console.log(`Finalized into ${messages.length} message(s)`);
});
```

```ts twoslash
import { Bot, InlineKeyboard } from "gramio";

const bot = new Bot("");
// ---cut---
// Pass finalParams to streamMessage to attach a keyboard after streaming
bot.on("message", async (ctx) => {
  async function* llmStream() {
    yield "Processing your request";
    yield "... here is the result!";
  }

  await ctx.streamMessage(llmStream(), {
    messageParams: {
      reply_markup: new InlineKeyboard().text("Done", "ack"),
    },
  });
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Direct API call — update an existing draft
await bot.api.sendMessageDraft({
  chat_id: 123456789,
  draft_id: 42,
  text: "Loading data...",
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot has no private chat history with that user |
| 400 | `Bad Request: not enough rights` | Bot does not have forum topic mode enabled — configure it via @BotFather |
| 400 | `Bad Request: can't parse entities` | Malformed `entities` array or wrong `parse_mode` markup |
| 403 | `Forbidden: bot was blocked by the user` | User blocked the bot — catch and mark as inactive |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Private chats only.** `chat_id` must be the numeric ID of a private chat. Groups, supergroups, and channels are not supported. Username strings (`@username`) are also not accepted.
- **Bot must have forum topic mode enabled.** This method only works for bots with forum topic mode enabled in @BotFather. Enable it under *Bot Settings → Group Privacy → Forum Topic Mode*.
- **Same `draft_id` = animated update.** Sending a draft with the same non-zero `draft_id` updates the existing draft in place with a smooth animation — ideal for streaming token-by-token output.
- **`draft_id` must be non-zero.** A `draft_id` of `0` is explicitly forbidden.
- **Use `ctx.streamMessage()` for LLM output.** The high-level `ctx.streamMessage(asyncIterable, options?)` method handles `draft_id` management, batching up to 4096 chars, and calling `sendMessage` to finalize. Avoid managing `sendMessageDraft` calls manually for streaming use cases.
- **`parse_mode` and `entities` are mutually exclusive.** GramIO's `format` helper produces `entities` — never pass `parse_mode` alongside it.

## See Also

- [sendMessage](/telegram/methods/sendMessage) — Finalize and send a complete text message
- [Formatting guide](/formatting) — `format` helper, HTML, MarkdownV2
- [auto-retry plugin](/plugins/official/auto-retry) — Handle rate limits automatically
