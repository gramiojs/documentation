---
title: setChatMemberTag — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Set a custom tag for a group or supergroup member using GramIO and TypeScript. Requires can_manage_tags admin right. Complete parameter reference with examples.
  - - meta
    - name: keywords
      content: setChatMemberTag, telegram bot api, gramio setChatMemberTag, setChatMemberTag typescript, setChatMemberTag example, set member tag telegram, telegram member tag bot, can_manage_tags, chat member tag, how to tag telegram group member, tag group member bot, supergroup member tag
---

# setChatMemberTag

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setchatmembertag" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to set a tag for a regular member in a group or a supergroup. The bot must be an administrator in the chat for this to work and must have the *can\_manage\_tags* administrator right. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="tag" type="String" description="New tag for the member; 0-16 characters, emoji are not allowed" :minLen="0" :maxLen="16" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

Use the `ctx.setMemberTag()` shorthand to tag the sender of the current message:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  await ctx.setMemberTag("VIP");
});
```

Remove a tag by passing `undefined`:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  await ctx.setMemberTag(undefined);
});
```

`/tag <label>` command — reply to a message to tag its author, `/tag` alone to remove it:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("tag", async (ctx) => {
  if (!ctx.replyToMessage) return ctx.send("Reply to a message to tag its author.");

  const parts = ctx.text?.split(" ") ?? [];
  const tag = parts.slice(1).join(" ").trim() || undefined;

  await ctx.replyToMessage.setMemberTag(tag);

  await ctx.send(tag ? `Tag "${tag}" set.` : "Tag removed.");
});
```

Direct API call when you have `chat_id` and `user_id` explicitly:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
async function ensureTag(chatId: number, userId: number, tag: string) {
  const member = await bot.api.getChatMember({ chat_id: chatId, user_id: userId });

  if (member.status === "member" && member.tag === tag) return; // already set

  await bot.api.setChatMemberTag({ chat_id: chatId, user_id: userId, tag });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | The `chat_id` is invalid or the bot is not a member of the chat. |
| 400 | `Bad Request: user not found` | The `user_id` does not correspond to a known Telegram user. |
| 400 | `Bad Request: participant not found` | The target user is not in the specified chat — they must join first. |
| 400 | `Bad Request: method is available for supergroup and channel chats only` | `setChatMemberTag` works only in groups and supergroups, not in private chats or channels. |
| 400 | `Bad Request: TAG_INVALID` | The `tag` contains emoji or is longer than 16 characters — validate input before calling. |
| 403 | `Forbidden: not enough rights` | The bot is not an administrator or lacks the `can_manage_tags` right — grant it via [promoteChatMember](/telegram/methods/promoteChatMember). |
| 429 | `Too Many Requests: retry after N` | Flood control triggered. Check `retry_after` and wait before retrying. |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Pass an empty string to remove a tag.** There is no separate delete method — call `setChatMemberTag` with `tag: ""` (or omit the `tag` field) to clear an existing tag.
- **Groups and supergroups only.** The method is not available in channels or private chats. Calling it there returns a 400 error.
- **The `can_manage_tags` right is required.** Ensure your bot has been promoted with this right via [`promoteChatMember`](/telegram/methods/promoteChatMember). Without it, every call will fail with a 403.
- **Tags are capped at 16 characters and must not contain emoji.** Validate user-supplied tag values before passing them, or wrap the call in a try/catch.
- **`tag` is exposed on `ChatMemberMember` and `ChatMemberRestricted`.** After setting a tag you can verify it by calling [`getChatMember`](/telegram/methods/getChatMember) and reading the `tag` field on the returned object.
- **`can_edit_tag` controls self-editing.** The `ChatMemberRestricted` type has a `can_edit_tag` boolean that determines whether the restricted user may change their own tag. Manage this via [`restrictChatMember`](/telegram/methods/restrictChatMember).

## See Also

- [promoteChatMember](/telegram/methods/promoteChatMember) — Grant a user the `can_manage_tags` right
- [restrictChatMember](/telegram/methods/restrictChatMember) — Restrict permissions including `can_edit_tag`
- [getChatMember](/telegram/methods/getChatMember) — Read the current member info including their `tag`
- [ChatMemberMember](/telegram/types/ChatMemberMember) — Type for regular members (has `tag` field)
- [ChatMemberRestricted](/telegram/types/ChatMemberRestricted) — Type for restricted members (has `tag` and `can_edit_tag` fields)
- [ChatAdministratorRights](/telegram/types/ChatAdministratorRights) — Full admin rights object including `can_manage_tags`
