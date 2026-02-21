---
title: getMyDefaultAdministratorRights — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Read the bot's default administrator rights for groups or channels using GramIO. TypeScript examples for getMyDefaultAdministratorRights with ChatAdministratorRights inspection and setMyDefaultAdministratorRights workflow.
  - - meta
    - name: keywords
      content: getMyDefaultAdministratorRights, telegram bot api, gramio getMyDefaultAdministratorRights, telegram bot admin rights, ChatAdministratorRights, for_channels, bot default rights, setMyDefaultAdministratorRights, telegram bot administrator permissions, getMyDefaultAdministratorRights typescript, getMyDefaultAdministratorRights example
---

# getMyDefaultAdministratorRights

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/ChatAdministratorRights">ChatAdministratorRights</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getmydefaultadministratorrights" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get the current default administrator rights of the bot. Returns [ChatAdministratorRights](https://core.telegram.org/bots/api#chatadministratorrights) on success.

## Parameters

<ApiParam name="for_channels" type="Boolean" description="Pass *True* to get default administrator rights of the bot in channels. Otherwise, default administrator rights of the bot for groups and supergroups will be returned." />

## Returns

On success, the [ChatAdministratorRights](/telegram/types/ChatAdministratorRights) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get default admin rights for groups and supergroups
const groupRights = await bot.api.getMyDefaultAdministratorRights({});

console.log(`Can delete messages: ${groupRights.can_delete_messages}`);
console.log(`Can restrict members: ${groupRights.can_restrict_members}`);
console.log(`Can manage video chats: ${groupRights.can_manage_video_chats}`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get default admin rights for channels
const channelRights = await bot.api.getMyDefaultAdministratorRights({
  for_channels: true,
});

console.log(`Can post messages: ${channelRights.can_post_messages}`);
console.log(`Can edit messages: ${channelRights.can_edit_messages}`);
console.log(`Can delete messages: ${channelRights.can_delete_messages}`);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Read and compare rights for both contexts
const [groupRights, channelRights] = await Promise.all([
  bot.api.getMyDefaultAdministratorRights({}),
  bot.api.getMyDefaultAdministratorRights({ for_channels: true }),
]);

console.log("Group rights:  ", groupRights);
console.log("Channel rights:", channelRights);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Verify required rights are configured before starting
const rights = await bot.api.getMyDefaultAdministratorRights({});

if (!rights.can_delete_messages) {
  console.warn(
    "Warning: bot does not have can_delete_messages by default. " +
    "Call setMyDefaultAdministratorRights to update."
  );
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **`for_channels` selects the context.** Pass `true` to read channel rights; omit it (or pass `false`) to read group/supergroup rights. The two are configured independently via `setMyDefaultAdministratorRights`.
- **Default rights apply when the bot is promoted without explicit rights.** If an admin promotes the bot without specifying individual permissions, Telegram uses these defaults. Setting good defaults avoids needing to re-configure every group manually.
- **Channel-only fields are only meaningful when `for_channels: true`.** Fields like `can_post_messages` and `can_edit_messages` are channel-specific and will be absent or `false` in the group rights response.
- **These are defaults, not actual rights in any specific chat.** To check what rights the bot has in a particular chat, use `getChatMember` on the bot's own `user_id` in that chat.
- **Rights changes require re-promotion.** Changing defaults with `setMyDefaultAdministratorRights` does not retroactively update the bot's permissions in existing chats — existing admin promotions are unaffected.

## See Also

- [ChatAdministratorRights](/telegram/types/ChatAdministratorRights) — return type with all permission fields
- [setMyDefaultAdministratorRights](/telegram/methods/setMyDefaultAdministratorRights) — update the bot's default admin rights
- [getMe](/telegram/methods/getMe) — get the bot's identity and capability flags
- [getChatMember](/telegram/methods/getChatMember) — check actual rights in a specific chat
- [getChatAdministrators](/telegram/methods/getChatAdministrators) — list all admins in a chat
