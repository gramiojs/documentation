---
title: Checklist — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: Checklist Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: Checklist, telegram bot api types, gramio Checklist, Checklist object, Checklist typescript
---

# Checklist

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#checklist" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a checklist.

## Fields

<ApiParam name="title" type="String" required description="Title of the checklist" />

<ApiParam name="title_entities" type="MessageEntity[]" description="_Optional_. Special entities that appear in the checklist title" />

<ApiParam name="tasks" type="ChecklistTask[]" required description="List of tasks in the checklist" />

<ApiParam name="others_can_add_tasks" type="Boolean" description="_Optional_. _True_, if users other than the creator of the list can add tasks to the list" />

<ApiParam name="others_can_mark_tasks_as_done" type="Boolean" description="_Optional_. _True_, if users other than the creator of the list can mark tasks as done or not done" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
