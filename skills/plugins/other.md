---
name: other-plugins
description: Quick reference for auto-retry, media-cache, media-group, auto-answer-callback-query, split, and posthog plugins.
---

# Other Official Plugins

## Auto Retry (`@gramio/auto-retry`)

Automatically retries API calls that fail with HTTP 429 (Too Many Requests). Reads the `retry_after` value from Telegram's response and waits exactly that long before retrying. Works transparently — no changes needed in handler code.

```typescript
import { autoRetry } from "@gramio/auto-retry";
bot.extend(autoRetry());
```

## Media Cache (`@gramio/media-cache`)

Caches `file_id` values returned by Telegram after uploading media. On subsequent sends of the same file, reuses the cached `file_id` instead of re-uploading — significantly faster and avoids bandwidth costs.

```typescript
import { mediaCache } from "@gramio/media-cache";
bot.extend(mediaCache());
```

**Limitation:** `sendMediaGroup` is not cached — only individual media sends benefit from caching.

## Media Group (`@gramio/media-group`)

Telegram sends album messages as individual updates. This plugin collects them into a single array by buffering updates within a delay window. The `context.mediaGroup` property is an array of `MessageContext` objects — access each item's `.photo`, `.video`, etc.

```typescript
import { mediaGroup } from "@gramio/media-group";

bot.extend(mediaGroup(150)) // delay in ms to wait for album, default 150
   .on("message", (context) => {
       if (!context.mediaGroup) return;
       console.log(`Album with ${context.mediaGroup.length} items`);
       // context.mediaGroup[0].photo — first photo in album
   });
```

## Auto Answer Callback Query (`@gramio/auto-answer-callback-query`)

Automatically calls `answerCallbackQuery` after a callback handler finishes — if the handler didn't already answer. Prevents the loading spinner from staying visible. Set `show_alert: true` to display a modal popup instead of a brief toast notification.

```typescript
import { autoAnswerCallbackQuery } from "@gramio/auto-answer-callback-query";

bot.extend(autoAnswerCallbackQuery({
    text: "Processed!",       // optional default text
    show_alert: false,        // false = toast, true = modal alert popup
}));
```

## Split (`@gramio/split`)

Splits long formatted text across multiple messages, respecting Telegram's 4096-character limit for messages (or 1024 for captions). Preserves formatting entities across split boundaries — bold, italic, code, and other entities are properly closed and reopened in each chunk.

```typescript
import { splitMessage } from "@gramio/split";

const messages = await splitMessage(
    format`${bold("a".repeat(8192))}`,
    (text) => context.send(text)
);

// Custom limit (e.g., 1024 for captions):
await splitMessage(formattedText, handler, 1024);
```

## PostHog (`@gramio/posthog`)

Analytics and feature flags for Telegram bots. Captures events with `context.capture()` and provides feature flag evaluation via `context.featureFlags`. Errors in handlers are also captured automatically. Uses `from.id` as the distinct user ID.

```typescript
import { posthogPlugin } from "@gramio/posthog";
import { PostHog } from "posthog-node";

const posthog = new PostHog("phc_...");
bot.extend(posthogPlugin(posthog));

// In handlers:
context.capture("event_name", { text: context.text });

// Feature flags:
const enabled = await context.featureFlags.isEnabled("beta-feature");
const value = await context.featureFlags.get("experiment");
const all = await context.featureFlags.getAll();
const payload = await context.featureFlags.getPayload("pricing");
```

| Method | Returns | Purpose |
|--------|---------|---------|
| `context.capture(event, props?)` | `void` | Capture an analytics event |
| `context.featureFlags.isEnabled(key)` | `Promise<boolean>` | Check if a feature flag is enabled |
| `context.featureFlags.get(key)` | `Promise<string \| boolean>` | Get feature flag value |
| `context.featureFlags.getAll()` | `Promise<Record>` | Get all feature flags |
| `context.featureFlags.getPayload(key)` | `Promise<JsonType>` | Get feature flag payload |
