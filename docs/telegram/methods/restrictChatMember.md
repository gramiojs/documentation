---
title: restrictChatMember — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: restrictChatMember Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: restrictChatMember, telegram bot api, gramio restrictChatMember, restrictChatMember typescript, restrictChatMember example
---

# restrictChatMember

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#restrictchatmember" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass _True_ for all permissions to lift restrictions from a user. Returns _True_ on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`)" />

<ApiParam name="user_id" type="Integer" required description="Unique identifier of the target user" />

<ApiParam name="permissions" type="ChatPermissions" required description="A JSON-serialized object for new user permissions" />

<ApiParam name="use_independent_chat_permissions" type="Boolean" required description="Pass _True_ if chat permissions are set independently. Otherwise, the _can\_send\_other\_messages_ and _can\_add\_web\_page\_previews_ permissions will imply the _can\_send\_messages_, _can\_send\_audios_, _can\_send\_documents_, _can\_send\_photos_, _can\_send\_videos_, _can\_send\_video\_notes_, and _can\_send\_voice\_notes_ permissions; the _can\_send\_polls_ permission will imply the _can\_send\_messages_ permission." />

<ApiParam name="until_date" type="Integer" required description="Date when restrictions will be lifted for the user; Unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever" />

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
