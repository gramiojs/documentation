---
title: "Troubleshooting GramIO — Common Errors and Fixes"
head:
    - - meta
      - name: "description"
        content: "Symptom-driven troubleshooting for GramIO Telegram bots — 409 polling conflict, broken formatting (parse_mode with format, native .join, .toString), prompt lost on restart, callback spinner hangs, missing opt-in updates, scenes without session, snake_case context access, un-awaited MediaUpload, webhook not firing."
    - - meta
      - name: "keywords"
        content: "gramio troubleshooting, telegram bot 409 conflict, terminated by other getUpdates, parse_mode not working, format entities lost, callback query spinner, scene not working, webhook not firing, bot not receiving updates"
---

# Troubleshooting

Organized by **symptom**: what you see → why it happens → how to fix it.

## Bot starts but receives no updates

- **`409 Conflict: terminated by other getUpdates request`** — two processes are long-polling the same token (a second `bot.start()`, an old container still running, or polling while a webhook is set). Run exactly one instance. If you previously set a webhook, call `bot.api.deleteWebhook()` before polling.
- **A webhook is set, so polling gets nothing.** Webhook and long-polling are mutually exclusive. Call `deleteWebhook` to go back to polling, or keep the webhook and don't call plain `bot.start()`.
- **Opt-in updates never arrive** (`chat_member`, `message_reaction`, `chat_join_request`, business updates). Telegram excludes these from the default `allowed_updates`. Pass them explicitly:
  ```ts
  bot.start({ allowedUpdates: ["message", "chat_member", "message_reaction"] });
  ```
  See [Updates](/updates/overview).
- **In groups the bot only sees commands and @mentions.** Privacy mode is on by default. Disable it via `/setprivacy` in [@BotFather](https://t.me/BotFather) — only if the bot must read all group messages.

## 401 / 404 from the API

- **`401 Unauthorized`** — bad or empty token. `new Bot(process.env.BOT_TOKEN as string)` silently becomes `undefined` if the env var is missing. Make sure the token is loaded (e.g. `node --env-file=.env`, dotenv, or your host's secrets) before constructing the bot.
- **`404 Not Found` on every method** — usually a wrong API base URL (custom / [local Bot API](/bot-api/local) typo) or a token with a stray space or newline.

## Formatting is broken (literal tags, no bold, double escaping)

These are the most common GramIO mistakes — full rules in [Formatting](/formatting).

- **You see literal `<b>` / `*` / backslashes in the message.** You passed `parse_mode` together with a `format` template. **Never** combine them — `format` already produces real entities. Drop `parse_mode` entirely.
- **Entities vanish when joining an array of formattables.** Native `Array.prototype.join()` stringifies and strips entities. Use the `join` helper from `gramio` instead.
- **Entities vanish when reusing a `FormattableString`.** Plain template interpolation (`` `${myFormattable}` ``) strips entities; never call `.toString()` on it either. Always wrap reused formattables in an outer ``format`...` ``.
- **Caption formatting ignored on media.** Pass the `format` value as the `caption` — and again, no `parse_mode`.

## Callback buttons feel broken / spinner hangs

- **An inline button shows a loading spinner for ~15s.** The handler never called `answerCallbackQuery`. Make `await ctx.answer()` the **first line** of every `callbackQuery` handler (an empty answer is fine), or install [`@gramio/auto-answer-callback-query`](/plugins/official/auto-answer-callback-query). See [UX Patterns §7](/guides/ux-patterns).
- **The `callbackQuery` handler never fires.** The button's `callback_data` doesn't match the handler's matcher. Prefer a typed `CallbackData` schema and pass the same instance to both `.pack()` and `bot.callbackQuery(schema, …)`. See [Inline Keyboard](/keyboards/inline-keyboard).
- **`BUTTON_DATA_INVALID`.** `callback_data` exceeds 64 bytes. Shorten the schema / pack fewer fields.

## Scenes / multi-step flows

- **`ctx.scene` is undefined / scenes do nothing.** `scenes()` requires `session()` installed **first**: `.extend(session()).extend(scenes([...]))`. See [Scenes](/plugins/official/scenes).
- **A flow silently resets after a deploy or restart.** You used [`@gramio/prompt`](/plugins/official/prompt) (in-memory) for a multi-step flow. The awaited promise dies with the process. Use Scenes `.ask()` (persists step + answers via storage) for anything that must survive restarts.

## Context access

- **`ctx.payload` / snake_case fields are `undefined` or untyped.** Don't read the raw payload. Every Telegram field is a camelCase getter on the context: `ctx.from.firstName`, `ctx.chatId`, `ctx.messageId`.
- **A getter you expected is `undefined`.** It's only present on the relevant update kind — narrow first with `ctx.is("message")` or a [filter](/guides/filters), then access.

## File uploads

- **`sendPhoto` throws or sends the literal path string.** `MediaUpload.path` / `url` / `buffer` is **async** — you must `await` it:
  ```ts
  await ctx.sendPhoto(await MediaUpload.path("./p.jpg"));
  ```
  An already-uploaded `file_id` is passed directly (no `MediaUpload`). See [Files](/files/overview).

## Webhook doesn't fire

- **Telegram never hits your endpoint.** `bot.start({ webhook: { url } })` calls `setWebhook` but does **not** start an HTTP server — you must mount `webhookHandler(bot, "<framework>")` yourself and expose it over HTTPS. Verify with `bot.api.getWebhookInfo()` (check `last_error_message`). See [Webhook](/updates/webhook).
- **Local dev: Telegram can't reach `localhost`.** Use a tunnel (cloudflared / ngrok) and set the webhook to the public HTTPS URL.

## Mini App (TMA) auth fails

- **`initData` validation fails.** Clock skew, the wrong bot token in the validator, or you're validating the already-parsed object instead of the raw `initData` string. Validate the raw string with the correct token. See [Mini Apps](/tma/overview).

## Types / build

- **A custom `ctx.foo` is `any` or errors.** Don't augment with `declare module`. Add it via `.derive(ctx => ({ foo }))` (per-update) or `.decorate({ foo })` (static) so the type flows automatically.

## Still stuck?

- Search the [Telegram Bot API method reference](/telegram/) for the exact method and its error table.
- Ask in the [GramIO chat](https://t.me/gramio_forum).
