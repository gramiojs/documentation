---
title: setChatStickerSet — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Set a group sticker set for a supergroup using GramIO. TypeScript examples, how to check can_set_sticker_set, error table, and tips for sticker set name format.
  - - meta
    - name: keywords
      content: setChatStickerSet, telegram bot api, set group sticker set telegram, supergroup sticker set, can_set_sticker_set, gramio setChatStickerSet, setChatStickerSet typescript, setChatStickerSet example, sticker_set_name, telegram custom sticker set group, how to set sticker set telegram bot
---

# setChatStickerSet

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setchatstickerset" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field *can\_set\_sticker\_set* optionally returned in [getChat](https://core.telegram.org/bots/api#getchat) requests to check if the bot can use this method. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

<ApiParam name="sticker_set_name" type="String" required description="Name of the sticker set to be set as the group sticker set" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set a sticker set for a supergroup
await bot.api.setChatStickerSet({
  chat_id: -1001234567890,
  sticker_set_name: "my_sticker_pack_by_mybot",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Check can_set_sticker_set before calling to avoid errors
const chat = await bot.api.getChat({ chat_id: -1001234567890 });

if (chat.can_set_sticker_set) {
  await bot.api.setChatStickerSet({
    chat_id: -1001234567890,
    sticker_set_name: "my_sticker_pack_by_mybot",
  });
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// From a message context — set sticker set for the current chat
bot.command("setstickers", async (ctx) => {
  const setName = ctx.text?.split(" ")[1];
  if (!setName) return ctx.send("Usage: /setstickers <sticker_set_name>");

  await ctx.setChatStickerSet(setName);
  await ctx.send(`Sticker set updated to: ${setName}`);
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove the group sticker set entirely
await bot.api.deleteChatStickerSet({ chat_id: -1001234567890 });
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` |
| 400 | `Bad Request: STICKERSET_INVALID` | The sticker set name doesn't exist or is not accessible |
| 400 | `Bad Request: method is available only for supergroups` | Called on a regular group, channel, or private chat — supergroups only |
| 403 | `Forbidden: not enough rights to change chat sticker set` | Bot lacks the `can_change_info` admin right |
| 403 | `Forbidden: bot is not a member of the supergroup chat` | Bot was removed from the supergroup |

## Tips & Gotchas

- **Check `can_set_sticker_set` first.** Not all supergroups allow bots to set a sticker set — the `getChat` response includes `can_set_sticker_set: true` when the bot has this privilege. If it's `false` or absent, the call will fail.
- **Supergroups only.** Regular groups, channels, and private chats all return `method is available only for supergroups`. A group must be a supergroup (usually 200+ members or explicitly upgraded) for this to work.
- **Sticker set name format.** The name is the short name of the pack as seen in `t.me/addstickers/<name>` — typically ends with `_by_<botusername>` for bot-owned sets. Use [`getStickerSet`](/telegram/methods/getStickerSet) to verify a set exists before assigning it.
- **Use `deleteChatStickerSet` to remove it.** There is no "clear" option in `setChatStickerSet` — use the dedicated `deleteChatStickerSet` method to remove the group sticker set.
- **Context shorthand is `ctx.setChatStickerSet(name)`.** Available in `MessageContext` and other contexts with `ChatControlMixin`; `chat_id` is inferred automatically.

## See Also

- [`deleteChatStickerSet`](/telegram/methods/deleteChatStickerSet) — remove the group sticker set
- [`getStickerSet`](/telegram/methods/getStickerSet) — look up a sticker set by name to verify it exists
- [`setStickerSetTitle`](/telegram/methods/setStickerSetTitle) — rename a sticker set owned by the bot
- [`getChat`](/telegram/methods/getChat) — read `can_set_sticker_set` and current sticker set info
- [`ChatFullInfo`](/telegram/types/ChatFullInfo) — type returned by `getChat` containing `sticker_set_name` and `can_set_sticker_set`
