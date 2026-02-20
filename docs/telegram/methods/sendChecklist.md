---
title: sendChecklist — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Send interactive checklists on behalf of a business account with GramIO in TypeScript. sendChecklist reference with InputChecklist structure, task limits, and examples.
  - - meta
    - name: keywords
      content: sendChecklist, telegram bot api, gramio sendChecklist, sendChecklist typescript, sendChecklist example, telegram checklist bot, InputChecklist, InputChecklistTask, business connection, checklist tasks, others_can_add_tasks
---

# sendChecklist

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Message">Message</a></span>
  <span class="api-badge multipart">📎 Accepts files</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#sendchecklist" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to send a checklist on behalf of a connected business account. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer" required description="Unique identifier for the target chat" />

<ApiParam name="checklist" type="InputChecklist" required description="A JSON-serialized object for the checklist to send" />

<ApiParam name="disable_notification" type="Boolean" description="Sends the message silently. Users will receive a notification with no sound." />

<ApiParam name="protect_content" type="Boolean" description="Protects the contents of the sent message from forwarding and saving" />

<ApiParam name="message_effect_id" type="String" description="Unique identifier of the message effect to be added to the message" />

<ApiParam name="reply_parameters" type="ReplyParameters" description="A JSON-serialized object for description of the message to reply to" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards)" />

## Returns

On success, the [Message](/telegram/types/Message) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

Send a simple checklist with three tasks on behalf of a business connection:

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  await ctx.sendChecklist({
    business_connection_id: "bc_id_from_business_connection_update",
    checklist: {
      title: "Shopping List",
      tasks: [
        { id: 1, text: "Milk" },
        { id: 2, text: "Eggs" },
        { id: 3, text: "Bread" },
      ],
    },
  });
});
```

Allow other users to add tasks and mark them done:

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
bot.on("message", async (ctx) => {
  await ctx.sendChecklist({
    business_connection_id: "bc_id_from_business_connection_update",
    checklist: {
      title: "Team Tasks for Monday",
      tasks: [
        { id: 1, text: "Review PR #42" },
        { id: 2, text: "Deploy staging build" },
        { id: 3, text: "Update release notes" },
      ],
      others_can_add_tasks: true,
      others_can_mark_tasks_as_done: true,
    },
  });
});
```

Direct API call with `bot.api.sendChecklist` (useful outside message handlers):

```ts twoslash
import { Bot } from "gramio";
const bot = new Bot("");
// ---cut---
const msg = await bot.api.sendChecklist({
  business_connection_id: "bc_id_from_business_connection_update",
  chat_id: 123456789,
  checklist: {
    title: "Onboarding Steps",
    tasks: [
      { id: 1, text: "Set up your profile" },
      { id: 2, text: "Read the getting started guide" },
      { id: 3, text: "Join the community channel" },
    ],
    others_can_add_tasks: false,
    others_can_mark_tasks_as_done: true,
  },
  protect_content: true,
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | The `chat_id` is invalid or the bot has no access to that chat via the business connection. |
| 400 | `Bad Request: business_connection_id not found` | The business connection ID is invalid or expired. Obtain a valid ID from a `business_connection` update. |
| 400 | `Bad Request: CHECKLIST_TASKS_EMPTY` | The `tasks` array is empty. At least 1 task is required. |
| 400 | `Bad Request: CHECKLIST_TITLE_EMPTY` | The `title` field is missing or empty. A non-empty title (1–255 chars) is required. |
| 403 | `Forbidden: bot was blocked by the user` | The user blocked the bot. Remove them from your active user list. |
| 429 | `Too Many Requests: retry after N` | Flood control triggered. Back off for the specified number of seconds. |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Business connection is mandatory.** Unlike most send methods, `business_connection_id` is required. You must have a valid connection from a `business_connection` update before calling this method.
- **`chat_id` is integer only.** Unlike most send methods that accept `Integer | String`, `sendChecklist` only accepts a numeric chat ID — usernames are not supported.
- **Task IDs must be unique positive integers.** Each task's `id` must be a unique positive integer within the checklist. IDs are used to identify tasks in future edit operations.
- **1–30 tasks per checklist.** You cannot send an empty checklist or one with more than 30 tasks. Plan the task list before sending.
- **Title limit is 255 characters.** Longer titles are rejected. Keep titles short and descriptive.
- **`others_can_add_tasks` and `others_can_mark_tasks_as_done` default to false.** Explicitly set these to `true` for collaborative checklists.

## See Also

- [InputChecklist type](/telegram/types/InputChecklist) — structure of the checklist input object
- [Checklist type](/telegram/types/Checklist) — structure of a received checklist
- [Keyboards overview](/keyboards/overview) — attaching inline keyboards
- [Message type](/telegram/types/Message) — full structure of the returned message
- [auto-retry plugin](/plugins/official/auto-retry) — handle rate limits automatically
