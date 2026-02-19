---
title: ChecklistTask — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ChecklistTask Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ChecklistTask, telegram bot api types, gramio ChecklistTask, ChecklistTask object, ChecklistTask typescript
---

# ChecklistTask

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#checklisttask" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a task in a checklist.

## Fields

<ApiParam name="id" type="Integer" required description="Unique identifier of the task" />

<ApiParam name="text" type="String" required description="Text of the task" />

<ApiParam name="text_entities" type="MessageEntity[]" description="_Optional_. Special entities that appear in the task text" />

<ApiParam name="completed_by_user" type="User" description="_Optional_. User that completed the task; omitted if the task wasn't completed by a user" />

<ApiParam name="completed_by_chat" type="Chat" description="_Optional_. Chat that completed the task; omitted if the task wasn't completed by a chat" />

<ApiParam name="completion_date" type="Integer" description="_Optional_. Point in time (Unix timestamp) when the task was completed; 0 if the task wasn't completed" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
