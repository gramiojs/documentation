---
title: savePreparedKeyboardButton — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: savePreparedKeyboardButton Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: savePreparedKeyboardButton, telegram bot api, gramio savePreparedKeyboardButton, savePreparedKeyboardButton typescript, savePreparedKeyboardButton example
---

# savePreparedKeyboardButton

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> <a href="/telegram/types/PreparedKeyboardButton">PreparedKeyboardButton</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#savepreparedkeyboardbutton" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Stores a keyboard button that can be used by a user within a Mini App. Returns a [PreparedKeyboardButton](https://core.telegram.org/bots/api#preparedkeyboardbutton) object.

## Parameters

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user that can use the button" />

<ApiParam name="button" type="KeyboardButton" required description="A JSON-serialized object describing the button to be saved. The button must be of the type *request\_users*, *request\_chat*, or *request\_managed\_bot*." />

## Returns

On success, the [PreparedKeyboardButton](/telegram/types/PreparedKeyboardButton) object is returned.

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
