---
title: setMyDefaultAdministratorRights — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Set default administrator rights for your Telegram bot using GramIO. Configure permissions for groups/supergroups and channels with TypeScript examples.
  - - meta
    - name: keywords
      content: setMyDefaultAdministratorRights, telegram bot api, telegram bot default admin rights, gramio setMyDefaultAdministratorRights, set bot administrator rights, ChatAdministratorRights, telegram bot permissions, setMyDefaultAdministratorRights typescript, setMyDefaultAdministratorRights example, telegram bot admin, for_channels, rights
---

# setMyDefaultAdministratorRights

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setmydefaultadministratorrights" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are free to modify the list before adding the bot. Returns *True* on success.

## Parameters

<ApiParam name="rights" type="ChatAdministratorRights" description="A JSON-serialized object describing new default administrator rights. If not specified, the default administrator rights will be cleared." />

<ApiParam name="for_channels" type="Boolean" description="Pass *True* to change the default administrator rights of the bot in channels. Otherwise, the default administrator rights of the bot for groups and supergroups will be changed." />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set default admin rights for groups/supergroups
await bot.api.setMyDefaultAdministratorRights({
  rights: {
    can_manage_chat: true,
    can_delete_messages: true,
    can_restrict_members: true,
    can_promote_members: false,
    can_change_info: true,
    can_invite_users: true,
    can_pin_messages: true,
    is_anonymous: false,
    can_manage_video_chats: false,
    can_post_stories: false,
    can_edit_stories: false,
    can_delete_stories: false,
  },
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set default admin rights for channels (different from groups)
await bot.api.setMyDefaultAdministratorRights({
  for_channels: true,
  rights: {
    can_manage_chat: true,
    can_post_messages: true,
    can_edit_messages: true,
    can_delete_messages: true,
    can_promote_members: false,
    can_change_info: true,
    can_invite_users: true,
    is_anonymous: false,
    can_manage_video_chats: false,
    can_post_stories: false,
    can_edit_stories: false,
    can_delete_stories: false,
  },
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Clear all default admin rights for groups
await bot.api.setMyDefaultAdministratorRights({});

// Clear all default admin rights for channels
await bot.api.setMyDefaultAdministratorRights({ for_channels: true });
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: not enough rights` | The `rights` object contains flags the bot itself doesn't have — only request rights the bot can actually exercise |
| 400 | `Bad Request: RIGHTS_NOT_MODIFIED` | The new rights are identical to the current defaults — no change was made |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **These are suggestions, not enforced rights.** When a user adds your bot as an admin, Telegram pre-fills the permission checkboxes with these defaults — but the user can freely modify them before confirming. Never assume your bot has all requested rights.
- **Groups and channels have separate defaults.** Call this method twice — once without `for_channels` for groups/supergroups, once with `for_channels: true` for channels — since their permission sets differ (e.g., `can_post_messages` is channel-only).
- **Passing no `rights` clears the defaults.** Calling with an empty object (or omitting `rights`) resets the suggestion to no permissions, so users must manually grant rights.
- **Read back with `getMyDefaultAdministratorRights`.** After updating, verify the new defaults were saved correctly using [getMyDefaultAdministratorRights](/telegram/methods/getMyDefaultAdministratorRights).
- **Bot API 6.0+ feature.** This method was added in Bot API 6.0 — ensure your integration targets that version or later.

## See Also

- [getMyDefaultAdministratorRights](/telegram/methods/getMyDefaultAdministratorRights) — read the current default admin rights
- [ChatAdministratorRights](/telegram/types/ChatAdministratorRights) — the rights object structure
- [promoteChatMember](/telegram/methods/promoteChatMember) — grant admin rights to a specific chat member
