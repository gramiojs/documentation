---
title: ChecklistTasksDone — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ChecklistTasksDone Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ChecklistTasksDone, telegram bot api types, gramio ChecklistTasksDone, ChecklistTasksDone object, ChecklistTasksDone typescript
---

# ChecklistTasksDone

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#checklisttasksdone" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a service message about checklist tasks marked as done or not done.

## Fields

<ApiParam name="checklist_message" type="Message" description="*Optional*. Message containing the checklist whose tasks were marked as done or not done. Note that the [Message](https://core.telegram.org/bots/api#message) object in this field will not contain the *reply\_to\_message* field even if it itself is a reply." />

<ApiParam name="marked_as_done_task_ids" type="Integer[]" description="*Optional*. Identifiers of the tasks that were marked as done" />

<ApiParam name="marked_as_not_done_task_ids" type="Integer[]" description="*Optional*. Identifiers of the tasks that were marked as not done" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
