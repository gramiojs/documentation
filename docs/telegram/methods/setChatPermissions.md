---
title: setChatPermissions — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Set default chat permissions for all members in a group or supergroup using GramIO. TypeScript examples, ChatPermissions fields, use_independent_chat_permissions behavior, and error reference.
  - - meta
    - name: keywords
      content: setChatPermissions, telegram bot api, set chat permissions telegram, restrict group members, ChatPermissions, use_independent_chat_permissions, gramio setChatPermissions, setChatPermissions typescript, setChatPermissions example, can_send_messages, can_send_media_messages, telegram group restrictions, how to restrict chat telegram bot
---

# setChatPermissions

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setchatpermissions" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the *can\_restrict\_members* administrator rights. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

<ApiParam name="permissions" type="ChatPermissions" required description="A JSON-serialized object for new default chat permissions" />

<ApiParam name="use_independent_chat_permissions" type="Boolean" description="Pass *True* if chat permissions are set independently. Otherwise, the *can\_send\_other\_messages* and *can\_add\_web\_page\_previews* permissions will imply the *can\_send\_messages*, *can\_send\_audios*, *can\_send\_documents*, *can\_send\_photos*, *can\_send\_videos*, *can\_send\_video\_notes*, and *can\_send\_voice\_notes* permissions; the *can\_send\_polls* permission will imply the *can\_send\_messages* permission." />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Lock down a group: only allow reading, no messages allowed
await bot.api.setChatPermissions({
  chat_id: -1001234567890,
  permissions: {
    can_send_messages: false,
    can_send_polls: false,
    can_send_other_messages: false,
    can_add_web_page_previews: false,
    can_change_info: false,
    can_invite_users: false,
    can_pin_messages: false,
  },
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Open up all standard permissions (typical group configuration)
await bot.api.setChatPermissions({
  chat_id: -1001234567890,
  permissions: {
    can_send_messages: true,
    can_send_audios: true,
    can_send_documents: true,
    can_send_photos: true,
    can_send_videos: true,
    can_send_voice_notes: true,
    can_send_video_notes: true,
    can_send_polls: true,
    can_send_other_messages: true,
    can_add_web_page_previews: true,
  },
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Use independent permissions — set each flag individually
// Without this flag, some permissions cascade from others
await bot.api.setChatPermissions({
  chat_id: "@mysupergroup",
  permissions: {
    can_send_messages: true,
    can_send_polls: false,
    can_send_other_messages: true,
  },
  use_independent_chat_permissions: true,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// From a message context — update the current chat's permissions
bot.command("lockdown", async (ctx) => {
  await ctx.setChatDefaultPermissions({ can_send_messages: false });
  await ctx.send("Chat is now in read-only mode.");
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` |
| 400 | `Bad Request: can't change chat permissions` | Method called on a channel or private chat — groups/supergroups only |
| 403 | `Forbidden: not enough rights to restrict/unrestrict chat member` | Bot lacks the `can_restrict_members` admin right |
| 403 | `Forbidden: bot is not a member of the supergroup chat` | Bot was removed from the chat |

::: tip
To restrict or un-restrict a **specific user** rather than the whole group, use [`restrictChatMember`](/telegram/methods/restrictChatMember) instead.
:::

## Tips & Gotchas

- **`can_restrict_members` right is required.** This is separate from `can_change_info` — make sure the bot's admin role has both if you manage general chat settings.
- **Groups and supergroups only.** Channels don't have member-level permissions; calling this on a channel returns an error.
- **`use_independent_chat_permissions` changes cascading behavior.** Without it (legacy mode), setting `can_send_other_messages: true` automatically implies `can_send_messages`, `can_send_audios`, `can_send_documents`, `can_send_photos`, `can_send_videos`, `can_send_video_notes`, and `can_send_voice_notes`. With it set to `true`, every permission is evaluated independently.
- **Omitted flags default to `false`.** Any `ChatPermissions` field you don't include in the object is treated as `false`. Always explicitly set every permission you want enabled.
- **Context shorthand is `ctx.setChatDefaultPermissions(permissions)`.** Available in `MessageContext` and other contexts with `ChatControlMixin`.
- **Per-user overrides via `restrictChatMember`.** Default chat permissions apply to all members, but individual users can still have stricter (or looser, for supergroups) restrictions set via `restrictChatMember`.

## See Also

- [`restrictChatMember`](/telegram/methods/restrictChatMember) — restrict a specific user's permissions
- [`promoteChatMember`](/telegram/methods/promoteChatMember) — grant admin rights to a user
- [`ChatPermissions`](/telegram/types/ChatPermissions) — the `permissions` object type with all boolean fields
- [`getChat`](/telegram/methods/getChat) — read current default permissions via `ChatFullInfo.permissions`
