---
title: InputChecklist — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputChecklist Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputChecklist, telegram bot api types, gramio InputChecklist, InputChecklist object, InputChecklist typescript
---

# InputChecklist

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputchecklist" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a checklist to create.

## Fields

<ApiParam name="title" type="String" required description="Title of the checklist; 1-255 characters after entities parsing" :minLen="1" :maxLen="255" semanticType="formattable" docsLink="/formatting" />

<ApiParam name="parse_mode" type="String" description="*Optional*. Mode for parsing entities in the title. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="title_entities" type="MessageEntity[]" description="*Optional*. List of special entities that appear in the title, which can be specified instead of parse\_mode. Currently, only *bold*, *italic*, *underline*, *strikethrough*, *spoiler*, and *custom\_emoji* entities are allowed." />

<ApiParam name="tasks" type="InputChecklistTask[]" required description="List of 1-30 tasks in the checklist" />

<ApiParam name="others_can_add_tasks" type="Boolean" description="*Optional*. Pass *True* if other users can add tasks to the checklist" />

<ApiParam name="others_can_mark_tasks_as_done" type="Boolean" description="*Optional*. Pass *True* if other users can mark tasks as done or not done in the checklist" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
