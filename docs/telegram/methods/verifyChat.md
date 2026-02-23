---
title: verifyChat — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Verify a Telegram chat on behalf of your organization using GramIO with TypeScript. Add third-party verification badges to groups and channels via bot API.
  - - meta
    - name: keywords
      content: verifyChat, telegram bot api, verify chat telegram bot, gramio verifyChat, verifyChat typescript, verifyChat example, chat_id, custom_description, third-party verification, telegram verification badge, removeChatVerification, how to verify chat telegram bot
---

# verifyChat

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#verifychat" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Verifies a chat [on behalf of the organization](https://telegram.org/verify#third-party-verification) which is represented by the bot. Returns *True* on success.

## Parameters

<ApiParam name="chat_id" type="Integer | String" required description="Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). Channel direct messages chats can't be verified." />

<ApiParam name="custom_description" type="String" description="Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description." :minLen="0" :maxLen="70" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Verify a chat by numeric ID
await bot.api.verifyChat({
  chat_id: -1001234567890,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Verify a public channel by username with a custom description
await bot.api.verifyChat({
  chat_id: "@mychannel",
  custom_description: "Official channel",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Update the verification description (call verifyChat again with new text)
await bot.api.verifyChat({
  chat_id: -1001234567890,
  custom_description: "Updated official description",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove chat verification
await bot.api.removeChatVerification({
  chat_id: -1001234567890,
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: chat not found` | `chat_id` is invalid or the bot has no access to the chat |
| 400 | `Bad Request: PEER_ID_INVALID` | Invalid `chat_id` format — check that the ID is a valid integer or `@username` |
| 400 | `Bad Request: chat can't be verified` | Chat type doesn't support verification — channel direct messages chats are explicitly excluded |
| 400 | `Bad Request: custom description not allowed` | Your organization isn't authorized to provide custom verification descriptions — pass an empty string or omit the field |
| 403 | `Forbidden: not enough rights` | The bot hasn't been granted third-party verification permissions by Telegram |

## Tips & Gotchas

- **Only bots with explicit Telegram approval can use this method.** Third-party verification is not available to arbitrary bots — your organization must apply at [telegram.org/verify](https://telegram.org/verify#third-party-verification).
- **Channel direct messages chats cannot be verified.** Only groups, supergroups, and regular broadcast channels are supported.
- **`custom_description` is 0–70 characters.** If your organization is not permitted to set custom descriptions, pass an empty string or omit the field entirely — otherwise the call returns an error.
- **To update the description, call `verifyChat` again.** There's no separate "update" method — re-calling with a new description replaces it atomically.
- **To remove the badge, call `removeChatVerification`.** Verification is not permanent; it can be revoked at any time.

## See Also

- [removeChatVerification](/telegram/methods/removeChatVerification)
- [verifyUser](/telegram/methods/verifyUser)
- [removeUserVerification](/telegram/methods/removeUserVerification)
