---
title: editMessageChecklist — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Edit checklist messages via connected business accounts using GramIO with TypeScript. Update tasks, title, and inline keyboard on business-sent checklists.
  - - meta
    - name: keywords
      content: editMessageChecklist, telegram bot api, telegram business checklist, edit checklist telegram bot, gramio editMessageChecklist, editMessageChecklist typescript, editMessageChecklist example, business_connection_id, InputChecklist, InputChecklistTask, telegram business bot, checklist tasks, how to edit checklist telegram bot
---

# editMessageChecklist

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/Message">Message</a></span>
  <a class="api-badge multipart" href="/files/media-upload">📎 Accepts files</a>
  <a class="api-badge markup" href="/keyboards/overview">⌨️ Keyboards</a>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#editmessagechecklist" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to edit a checklist on behalf of a connected business account. On success, the edited [Message](https://core.telegram.org/bots/api#message) is returned.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection on behalf of which the message will be sent" />

<ApiParam name="chat_id" type="Integer" required description="Unique identifier for the target chat" />

<ApiParam name="message_id" type="Integer" required description="Unique identifier for the target message" />

<ApiParam name="checklist" type="InputChecklist" required description="A JSON-serialized object for the new checklist" />

<ApiParam name="reply_markup" type="InlineKeyboardMarkup" description="A JSON-serialized object for the new [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) for the message" docsLink="/keyboards/overview" />

## Returns

On success, the [Message](/telegram/types/Message) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Replace a checklist with an updated task list
const message = await bot.api.editMessageChecklist({
  business_connection_id: "biz-conn-id",
  chat_id: 123456789,
  message_id: 100,
  checklist: {
    title: "Sprint Tasks",
    tasks: [
      { id: 1, text: "Review pull requests" },
      { id: 2, text: "Deploy to staging" },
      { id: 3, text: "Update documentation" },
    ],
  },
});
```

```ts twoslash
import { Bot, InlineKeyboard } from "gramio";

const bot = new Bot("");
// ---cut---
// Edit a checklist and attach an inline keyboard
const message = await bot.api.editMessageChecklist({
  business_connection_id: "biz-conn-id",
  chat_id: 123456789,
  message_id: 100,
  checklist: {
    title: "Shopping List",
    tasks: [
      { id: 1, text: "Milk" },
      { id: 2, text: "Eggs" },
      { id: 3, text: "Bread" },
    ],
    others_can_mark_tasks_as_done: true,
  },
  reply_markup: new InlineKeyboard().text("Mark all done", "checklist_done"),
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Allow other users to add and complete tasks
const message = await bot.api.editMessageChecklist({
  business_connection_id: "biz-conn-id",
  chat_id: 123456789,
  message_id: 100,
  checklist: {
    title: "Team Tasks",
    tasks: [{ id: 1, text: "Assign tickets" }, { id: 2, text: "Set deadline" }],
    others_can_add_tasks: true,
    others_can_mark_tasks_as_done: true,
  },
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | Invalid or inaccessible `chat_id` |
| 400 | `Bad Request: message not found` | `message_id` doesn't exist in the target chat |
| 400 | `Bad Request: BUSINESS_CONNECTION_NOT_FOUND` | `business_connection_id` is invalid or the connection was revoked |
| 400 | `Bad Request: message is not modified` | The new checklist content is identical to the current one |
| 400 | `Bad Request: message can't be edited` | Message was not sent by this bot's business connection or is too old |
| 400 | `Bad Request: not enough rights` | The bot's business connection doesn't have permission to edit this message |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Requires an active business connection.** This method only works for bots connected to a Telegram Business account — the `business_connection_id` identifies that connection.
- **`chat_id` is an integer only.** Unlike most methods, subscription-based business chats don't support `@username` strings here — use the numeric chat ID.
- **The entire checklist is replaced.** Editing sends a completely new `InputChecklist` object; any previously checked tasks lose their completion state unless you re-send them as completed.
- **Tasks support 1–30 items.** The `tasks` array in `InputChecklist` must contain between 1 and 30 `InputChecklistTask` entries.
- **`checklist.title` allows formatting entities.** Use `title_entities` (not `parse_mode`) alongside GramIO's `format` helper for styled titles.
- **`others_can_add_tasks` and `others_can_mark_tasks_as_done` are independent flags.** You can allow participants to mark tasks done without letting them add new ones, or vice versa.

## See Also

- [`sendChecklist`](/telegram/methods/sendChecklist) — Send a new checklist via a business account
- [`InputChecklist`](/telegram/types/InputChecklist) — The checklist input type with title, tasks, and permission flags
- [keyboards overview](/keyboards/overview) — Guide to building inline keyboards for `reply_markup`
