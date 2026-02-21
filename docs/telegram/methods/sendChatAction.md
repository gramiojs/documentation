---
title: sendChatAction — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Show typing, uploading, or recording indicators in Telegram chats with GramIO in TypeScript. sendChatAction reference with all valid action values and usage examples.
  - - meta
    - name: keywords
      content: sendChatAction, telegram bot api, gramio sendChatAction, sendChatAction typescript, sendChatAction example, telegram typing indicator, telegram upload photo, record video indicator, chat action loop, upload_document, choose_sticker, find_location
---

# sendChatAction

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendchataction" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns *True* on success.

> Example: The [ImageBot](https://t.me/imagebot) needs some time to process a request and upload the image. Instead of sending a text message along the lines of “Retrieving image, please wait…”, the bot may use [sendChatAction](https://core.telegram.org/bots/api#sendchataction) with *action* = *upload\_photo*. The user will see a “sending photo” status for the bot.

We only recommend using this method when a response from the bot will take a **noticeable** amount of time to arrive.

## Parameters

<ApiParam name="business_connection_id" type="String" description="Unique identifier of the business connection on behalf of which the action will be sent" />

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`). Channel chats and channel direct messages chats aren't supported." />

<ApiParam name="message_thread_id" type="Integer" description="Unique identifier for the target message thread or topic of a forum; for supergroups and private chats of bots with forum topic mode enabled only" />

<ApiParam name="action" type="String" required description="Type of action to broadcast. Choose one, depending on what the user is about to receive: *typing* for [text messages](https://core.telegram.org/bots/api#sendmessage), *upload\_photo* for [photos](https://core.telegram.org/bots/api#sendphoto), *record\_video* or *upload\_video* for [videos](https://core.telegram.org/bots/api#sendvideo), *record\_voice* or *upload\_voice* for [voice notes](https://core.telegram.org/bots/api#sendvoice), *upload\_document* for [general files](https://core.telegram.org/bots/api#senddocument), *choose\_sticker* for [stickers](https://core.telegram.org/bots/api#sendsticker), *find\_location* for [location data](https://core.telegram.org/bots/api#sendlocation), *record\_video\_note* or *upload\_video\_note* for [video notes](https://core.telegram.org/bots/api#sendvideonote)." :enumValues='["typing","upload_photo","record_video","upload_video","record_voice","upload_voice","upload_document","choose_sticker","find_location","record_video_note","upload_video_note"]' />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

Show a "typing..." indicator before sending a slow response:

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  await ctx.sendChatAction("typing");

  // Simulate a slow operation
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await ctx.send("Here is your answer after processing!");
});
```

Show `upload_document` while preparing a file to send:

```ts twoslash
import { Bot, MediaUpload } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  await ctx.sendChatAction("upload_document");

  const file = await MediaUpload.path("./reports/report.pdf");
  await ctx.sendDocument(file, { caption: "Your report is ready." });
});
```

Repeat the action every 4 seconds for a long-running task using a loop:

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  // sendChatAction expires after ~5 s; refresh it periodically
  const interval = setInterval(
    () => ctx.sendChatAction("typing").catch(() => {}),
    4000
  );

  try {
    // Long operation (e.g., external API call)
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await ctx.send("Done!");
  } finally {
    clearInterval(interval);
  }
});
```

Direct API call with `bot.api.sendChatAction` (useful outside message handlers):

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
await bot.api.sendChatAction({
  chat_id: 123456789,
  action: "upload_photo",
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | The `chat_id` is invalid, the bot has never interacted with the user, or the chat does not exist. |
| 400 | `Bad Request: not enough rights` | The bot lacks permission to send messages in the target group or channel. |
| 403 | `Forbidden: bot was blocked by the user` | The user blocked the bot. Remove them from your active user list. |
| 403 | `Forbidden: bot is not a member of the channel chat` | The bot is not a member of the target channel. |
| 429 | `Too Many Requests: retry after N` | Flood control triggered. Back off for the specified number of seconds. |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **The indicator lasts at most 5 seconds.** Once your bot sends any message, Telegram immediately clears the indicator. For operations longer than 5 seconds, call `sendChatAction` in a loop every ~4 seconds.
- **Choose the matching action.** Pick the action that corresponds to what you are about to send — `upload_document` for files, `upload_photo` for images, `record_video` for video processing, etc. Using `typing` for everything is misleading to users.
- **Channels are not supported.** The `chat_id` must be a private chat, group, or supergroup. Channel chat IDs will return an error.
- **Errors in the loop should be swallowed.** If you run `sendChatAction` in an interval, wrap each call in `.catch(() => {})` so a transient error does not kill the loop.
- **Use `message_thread_id` for forum topics.** In supergroups with topics enabled, pass `message_thread_id` to show the indicator inside the correct topic thread.

## See Also

- [sendMessage](/telegram/methods/sendMessage) — send text after showing `typing`
- [sendPhoto](/telegram/methods/sendPhoto) — send photo after showing `upload_photo`
- [sendVideo](/telegram/methods/sendVideo) — send video after showing `upload_video`
- [sendDocument](/telegram/methods/sendDocument) — send file after showing `upload_document`
- [sendVoice](/telegram/methods/sendVoice) — send voice after showing `record_voice`
- [auto-retry plugin](/plugins/official/auto-retry) — handle rate limits automatically
