---
name: troubleshooting
description: Symptom → cause → fix for the most common GramIO footguns — 409 polling conflict, broken formatting (parse_mode with format, native .join, .toString), prompt lost on restart, callback spinner hangs, missing opt-in updates, scenes without session, snake_case ctx access, un-awaited MediaUpload, webhook not firing. Load when a bot "doesn't work" and the user describes a symptom rather than a feature.
---

# Troubleshooting

Organized by **symptom**. Each entry: what you see → why → fix. For deeper API detail follow the linked reference.

## Bot starts but receives no updates

- **`409 Conflict: terminated by other getUpdates request`** — two processes are long-polling the same token (a second `bot.start()`, an old container still running, or polling while a webhook is set). Run one instance. If you previously set a webhook, call `bot.api.deleteWebhook()` (or `bot.start()` without `webhook` after deleting) before polling.
- **A webhook is set, so polling gets nothing.** Webhook and long-polling are mutually exclusive. `deleteWebhook` to go back to polling, or keep the webhook and don't call plain `bot.start()`.
- **Opt-in updates never arrive** (`chat_member`, `message_reaction`, `chat_join_request`, business updates). Telegram excludes these from the default `allowed_updates`. Pass them explicitly: `bot.start({ allowedUpdates: ["message", "chat_member", "message_reaction"] })`. See updates.md.
- **In groups the bot only sees commands/@mentions.** Privacy mode is on by default. Disable it via `/setprivacy` in @BotFather **only if** the bot must read all group messages.

## 401 / 404 from the API

- **`401 Unauthorized`** — bad or empty token. `new Bot(process.env.BOT_TOKEN as string)` silently becomes `undefined` if the env var is missing. Verify the token is loaded (dotenv/`--env-file`) before constructing the bot. See bot-configuration.md.
- **`404 Not Found` on every method** — usually a wrong `apiBaseUrl` / local Bot API base URL typo, or token with a stray space/newline.

## Formatting is broken (literal tags, no bold, double escaping)

These are the most common GramIO mistakes — all in formatting.md.

- **You see literal `<b>` / `*` / backslashes in the message.** You passed `parse_mode` together with a `format` template. **Never** combine them — `format` already produces real entities. Drop `parse_mode` entirely.
- **Entities vanish when joining an array of formattables.** Native `Array.prototype.join()` stringifies and strips entities. Use the `join` helper from `gramio` instead.
- **Entities vanish when reusing a `FormattableString`.** Plain template interpolation (`` `${myFormattable}` ``) strips entities; never call `.toString()` on it either. Always wrap reused formattables in an outer ``format`...` ``.
- **Caption formatting ignored on media.** Pass the `format` value as the `caption`, not in the text — and again, no `parse_mode`.

## Rich Messages

- **A rich helper result is sent as plain text.** Import helpers from `gramio/rich` and pass the returned `RichString` directly to `ctx.send()`; do not call `.toString()`.
- **A file in `sendRichMessageDraft` is not uploaded.** This is deliberate: Telegram forbids direct uploads in rich drafts. Use a pre-existing `file_id`, then finalize with `sendRichMessage`.
- **Stop button appears but the handler never runs.** Register `bot.on("stopped_message_generation", ...)`. The update is in the default set, but an explicit custom `allowedUpdates` array must still include it.

## Ephemeral sends fail after Bot API 10.3

- **TypeScript rejects top-level `receiver_user_id` / `callback_query_id`.** Move them into `ephemeral_message_parameters`. There is no legacy alias.
- **A callback result should replace the original message.** Set `ephemeral_message_parameters.replace_callback_query_message: true`; do not use it for callbacks from an already-ephemeral message.

## Callback buttons feel broken / spinner hangs

- **Inline button shows a loading spinner for ~15s.** The handler never called `answerCallbackQuery`. Make `await ctx.answer()` the **first line** of every `callbackQuery` handler (empty answer is fine). Or install `@gramio/auto-answer-callback-query` so it's automatic. See ux-patterns.md §7.
- **`callbackQuery` handler never fires.** The button's `callback_data` doesn't match the handler's matcher. Prefer a typed `CallbackData` schema and pass the same instance to both `.pack()` and `bot.callbackQuery(schema, …)`. See callback-data.md.
- **`BUTTON_DATA_INVALID`.** `callback_data` exceeds 64 bytes. Shorten the schema / pack fewer fields.

## Scenes / multi-step flows

- **`ctx.scene` is undefined / scenes do nothing.** `scenes()` requires `session()` installed **first**: `.extend(session()).extend(scenes([...]))`. See scenes.md.
- **Flow silently resets after a deploy/restart.** You used `@gramio/prompt` (in-memory) for a multi-step flow. The awaited promise dies with the process. Use Scenes `.ask()` (persists step + answers via storage) for anything that must survive restarts. See prompt.md / scenes.md.

## Context access

- **`ctx.payload` / snake_case fields are `undefined` or untyped.** Don't read the raw payload. Every Telegram field is a camelCase getter on the context: `ctx.from.firstName`, `ctx.chatId`, `ctx.messageId`. See context.md.
- **A getter is `undefined` you expected to exist.** It's only present on the relevant update kind — narrow first with `ctx.is("message")` / a filter (filters.md), then access.

## File uploads

- **`sendPhoto` throws or sends the literal path string.** `MediaUpload.path/url/buffer` is **async** — you must `await` it: `await ctx.sendPhoto(await MediaUpload.path("./p.jpg"))`. An already-uploaded `file_id` is passed directly (no `MediaUpload`). See files.md.

## Webhook doesn't fire

- **Telegram never hits your endpoint.** `bot.start({ webhook: { url } })` calls `setWebhook` but does **not** start an HTTP server — you must mount `webhookHandler(bot, "<framework>")` yourself and expose it over HTTPS. Verify with `bot.api.getWebhookInfo()` (check `last_error_message`). See webhook.md.
- **Local dev: Telegram can't reach localhost.** Use a tunnel (cloudflared/ngrok) and set the webhook to the public HTTPS URL.

## Mini App (TMA) auth fails

- **`initData` validation fails.** Clock skew or wrong bot token in the validator, or you're validating the already-parsed object instead of the raw `initData` string. Use `@gramio/init-data` against the raw string with the correct token. See tma.md.

## Types / build

- **Custom `ctx.foo` is `any` or errors.** Don't augment with `declare module`. Add it via `.derive(ctx => ({ foo }))` (per-update) or `.decorate({ foo })` (static) so the type flows automatically. See context.md / types.md.

## See also
- formatting.md · rich-messages.md · context.md · scenes.md · prompt.md · callback-data.md · webhook.md · files.md · updates.md
