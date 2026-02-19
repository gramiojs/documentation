---
title: InputChecklistTask — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: InputChecklistTask Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: InputChecklistTask, telegram bot api types, gramio InputChecklistTask, InputChecklistTask object, InputChecklistTask typescript
---

# InputChecklistTask

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#inputchecklisttask" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Describes a task to add to a checklist.

## Fields

<ApiParam name="id" type="Integer" required description="Unique identifier of the task; must be positive and unique among all task identifiers currently present in the checklist" />

<ApiParam name="text" type="String" required description="Text of the task; 1-100 characters after entities parsing" />

<ApiParam name="parse_mode" type="String" description="_Optional_. Mode for parsing entities in the text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details." />

<ApiParam name="text_entities" type="MessageEntity[]" description="_Optional_. List of special entities that appear in the text, which can be specified instead of parse\_mode. Currently, only _bold_, _italic_, _underline_, _strikethrough_, _spoiler_, and _custom\_emoji_ entities are allowed." />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
