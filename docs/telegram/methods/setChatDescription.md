---
title: setChatDescription — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Change the description of a group, supergroup, or channel using GramIO. TypeScript examples, parameter reference, error table, and tips for clearing vs. updating descriptions.
  - - meta
    - name: keywords
      content: setChatDescription, telegram bot api, set chat description telegram, change group description, gramio setChatDescription, setChatDescription typescript, setChatDescription example, chat_id, description, telegram channel description, how to set chat description telegram bot
---

# setChatDescription

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setchatdescription" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`)" />

<ApiParam name="description" type="String" description="New chat description, 0-255 characters" :minLen="0" :maxLen="255" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set a description for a channel or supergroup
await bot.api.setChatDescription({
  chat_id: "@mychannel",
  description: "The official GramIO community — TypeScript Telegram bot framework.",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Clear the description by omitting the field (or passing an empty string)
await bot.api.setChatDescription({
  chat_id: -1001234567890,
  // description omitted → clears existing description
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// From a message context — update the current chat's description
bot.command("setdesc", async (ctx) => {
  const newDesc = ctx.text?.split(" ").slice(1).join(" ") ?? "";
  await ctx.setChatDescription(newDesc);
  await ctx.send("Description updated!");
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` |
| 400 | `Bad Request: chat description is not modified` | The new description is identical to the current one |
| 400 | `Bad Request: CHAT_ABOUT_TOO_LONG` | `description` exceeds 255 characters |
| 403 | `Forbidden: not enough rights to change chat description` | Bot lacks the `can_change_info` admin right |
| 403 | `Forbidden: bot is not a member of the channel chat` | Bot was removed from the channel |

## Tips & Gotchas

- **`can_change_info` right is required.** The bot must be an admin with the `can_change_info` flag set to `true`. Without it, the call returns `403 not enough rights`.
- **Groups, supergroups, and channels only.** Private chats do not support a description field; this method will error on them.
- **Omitting `description` clears it.** Passing `description: ""` or simply not including the parameter removes the current description — useful for resetting it.
- **255-character limit.** Anything longer returns `CHAT_ABOUT_TOO_LONG`. Trim before calling if the source is user-provided text.
- **Context shorthand is `ctx.setChatDescription(description)`.** Available in `MessageContext` and other contexts with `ChatControlMixin`; `chat_id` is inferred automatically.

## See Also

- [`setChatTitle`](/telegram/methods/setChatTitle) — change the chat name
- [`setChatPhoto`](/telegram/methods/setChatPhoto) — change the chat photo
- [`getChat`](/telegram/methods/getChat) — read current description and other chat info
- [`ChatFullInfo`](/telegram/types/ChatFullInfo) — type returned by `getChat` containing the `description` field
