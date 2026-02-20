---
title: repostStory — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Repost a story across business accounts using GramIO and TypeScript. Learn active_period values, can_manage_stories requirement, and business connection workflows.
  - - meta
    - name: keywords
      content: repostStory, telegram bot api, repost story business account, gramio repostStory, repostStory typescript, repostStory example, business connection story, can_manage_stories, active_period, from_chat_id, from_story_id, telegram story repost bot
---

# repostStory

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/Story">Story</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#repoststory" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Reposts a story on behalf of a business account from another business account. Both business accounts must be managed by the same bot, and the story on the source account must have been posted (or reposted) by the bot. Requires the *can\_manage\_stories* business bot right for both business accounts. Returns [Story](https://core.telegram.org/bots/api#story) on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="from_chat_id" type="Integer" required description="Unique identifier of the chat which posted the story that should be reposted" />

<ApiParam name="from_story_id" type="Integer" required description="Unique identifier of the story that should be reposted" />

<ApiParam name="active_period" type="Integer" required description="Period after which the story is moved to the archive, in seconds; must be one of `6 * 3600`, `12 * 3600`, `86400`, or `2 * 86400`" :enumValues='[21600,43200,86400,172800]' />

<ApiParam name="post_to_chat_page" type="Boolean" description="Pass *True* to keep the story accessible after it expires" />

<ApiParam name="protect_content" type="Boolean" description="Pass *True* if the content of the story must be protected from forwarding and screenshotting" />

## Returns

On success, the [Story](/telegram/types/Story) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

Repost a story from one managed business account to another (24-hour duration):

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
const story = await bot.api.repostStory({
  business_connection_id: "connection_target_account",
  from_chat_id: 987654321,
  from_story_id: 42,
  active_period: 86400, // 24 hours
});

console.log("Reposted story ID:", story.id);
```

Repost with content protection and permanent visibility:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
const story = await bot.api.repostStory({
  business_connection_id: "connection_target_account",
  from_chat_id: 987654321,
  from_story_id: 42,
  active_period: 43200, // 12 hours
  post_to_chat_page: true,   // Keep visible after expiry
  protect_content: true,     // Prevent forwarding and screenshots
});
```

Handle a business message and repost its referenced story:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.on("business_message", async (ctx) => {
  // ctx.payload contains the raw message with business_connection_id
  const businessConnectionId = ctx.payload.business_connection_id;
  if (!businessConnectionId) return;

  // If the message references a story, repost it
  const story = ctx.payload.story;
  if (!story) return;

  await bot.api.repostStory({
    business_connection_id: businessConnectionId,
    from_chat_id: story.chat.id,
    from_story_id: story.id,
    active_period: 86400,
  });
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: business connection not found` | `business_connection_id` is invalid or the business account is no longer connected |
| 400 | `Bad Request: story not found` | `from_story_id` or `from_chat_id` is invalid, or the story was deleted |
| 400 | `Bad Request: not enough rights` | The bot lacks `can_manage_stories` for either the source or target business account |
| 400 | `Bad Request: STORY_NOT_POSTED_BY_BOT` | The source story was not originally posted or reposted by this bot — only bot-managed stories can be reposted |
| 400 | `Bad Request: active_period_invalid` | `active_period` is not one of the four allowed values (21600, 43200, 86400, 172800) |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Both business accounts must be managed by the same bot.** You cannot repost from an account you don't manage — use `from_chat_id` of an account linked to your bot.
- **The source story must have been posted by your bot.** Stories created by the business account owner manually (not via the bot) cannot be reposted via this method.
- **`active_period` accepts only four values.** Pass exactly `21600` (6h), `43200` (12h), `86400` (24h), or `172800` (48h). Any other value returns an error.
- **`post_to_chat_page: true` keeps the story permanently.** Without it, the story moves to the archive after `active_period` expires. Use this for evergreen content.
- **`protect_content` prevents screenshots and forwards.** Useful for promotional content you don't want redistributed outside the business account's audience.
- **`business_connection_id` identifies the target account.** Use the connection ID of the business account *receiving* the repost, not the source account.

## See Also

- [`postStory`](/telegram/methods/postStory) — Post a new story (not a repost) on behalf of a business account
- [`editStory`](/telegram/methods/editStory) — Edit a story that was already posted
- [`deleteStory`](/telegram/methods/deleteStory) — Delete a story from a business account
- [`Story`](/telegram/types/Story) — The Story object returned on success
