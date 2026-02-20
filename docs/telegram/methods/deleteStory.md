---
title: deleteStory — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Delete a Telegram story on behalf of a business account using GramIO. TypeScript examples, can_manage_stories rights, business connection usage, and error reference.
  - - meta
    - name: keywords
      content: deleteStory, telegram bot api, delete telegram story bot, gramio deleteStory, deleteStory typescript, business_connection_id, story_id, can_manage_stories, telegram business bot story, deleteStory example
---

# deleteStory

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#deletestory" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Deletes a story previously posted by the bot on behalf of a managed business account. Requires the _can\_manage\_stories_ business bot right. Returns _True_ on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="story_id" type="Integer" required description="Unique identifier of the story to delete" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete a story by business connection ID and story ID
await bot.api.deleteStory({
  business_connection_id: "abc123businessconnectionid",
  story_id: 42,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete a story using IDs stored from a previous postStory response
const businessConnectionId = "abc123businessconnectionid";
const postedStoryId = 7; // story_id returned by postStory

await bot.api.deleteStory({
  business_connection_id: businessConnectionId,
  story_id: postedStoryId,
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Delete multiple stories for a business account
const businessConnectionId = "abc123businessconnectionid";
const storyIdsToDelete = [10, 11, 12];

for (const storyId of storyIdsToDelete) {
  await bot.api.deleteStory({
    business_connection_id: businessConnectionId,
    story_id: storyId,
  });
}
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: business connection not found` | `business_connection_id` is invalid or the business connection no longer exists |
| 400 | `Bad Request: STORY_NOT_FOUND` | The `story_id` doesn't exist for this business account, or was already deleted |
| 403 | `Forbidden: not enough rights` | Bot lacks the `can_manage_stories` right for this business connection |
| 403 | `Forbidden: business connection revoked` | The business account has revoked the bot's access — handle with re-auth flow |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **Requires `can_manage_stories` business right.** This specific permission must be granted by the business account owner. General business bot access is not sufficient — verify your business bot rights if you get a 403 error.
- **`business_connection_id` is account-specific, not global.** Each connected business account has its own connection ID. Store it when you receive business connection updates and use it consistently.
- **Only stories posted by the bot can be deleted.** You can only delete stories that were originally posted by your bot on behalf of this business account — not stories posted by the business owner directly.
- **`story_id` is an integer, not a file_id.** Story IDs are simple sequential integers scoped to the business account, distinct from file identifiers.
- **Handle revoked connections gracefully.** Business accounts can disconnect bots at any time. Wrap calls in try/catch and remove the connection from your database on 403 errors.

## See Also

- [postStory](/telegram/methods/postStory) — post a story on behalf of a business account
- [editStory](/telegram/methods/editStory) — edit an existing story
- [repostStory](/telegram/methods/repostStory) — repost a story to the bot's own stories
- [Story](/telegram/types/Story) — story object reference
