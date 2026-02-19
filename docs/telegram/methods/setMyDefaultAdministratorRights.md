---
title: setMyDefaultAdministratorRights — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: setMyDefaultAdministratorRights Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: setMyDefaultAdministratorRights, telegram bot api, gramio setMyDefaultAdministratorRights, setMyDefaultAdministratorRights typescript, setMyDefaultAdministratorRights example
---

# setMyDefaultAdministratorRights

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setmydefaultadministratorrights" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are free to modify the list before adding the bot. Returns _True_ on success.

## Parameters

<ApiParam name="rights" type="ChatAdministratorRights" required description="A JSON-serialized object describing new default administrator rights. If not specified, the default administrator rights will be cleared." />

<ApiParam name="for_channels" type="Boolean" required description="Pass _True_ to change the default administrator rights of the bot in channels. Otherwise, the default administrator rights of the bot for groups and supergroups will be changed." />

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
