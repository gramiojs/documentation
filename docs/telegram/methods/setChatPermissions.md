---
title: setChatPermissions — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: setChatPermissions Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: setChatPermissions, telegram bot api, gramio setChatPermissions, setChatPermissions typescript, setChatPermissions example
---

# setChatPermissions

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setchatpermissions" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the _can\_restrict\_members_ administrator rights. Returns _True_ on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

<ApiParam name="permissions" type="ChatPermissions" required description="A JSON-serialized object for new default chat permissions" />

<ApiParam name="use_independent_chat_permissions" type="Boolean" required description="Pass _True_ if chat permissions are set independently. Otherwise, the _can\_send\_other\_messages_ and _can\_add\_web\_page\_previews_ permissions will imply the _can\_send\_messages_, _can\_send\_audios_, _can\_send\_documents_, _can\_send\_photos_, _can\_send\_videos_, _can\_send\_video\_notes_, and _can\_send\_voice\_notes_ permissions; the _can\_send\_polls_ permission will imply the _can\_send\_messages_ permission." />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
