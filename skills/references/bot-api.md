---
name: bot-api
description: Calling Telegram Bot API methods, error suppression, retry utilities, type helpers, and declaration merging for custom methods.
---

# Bot API

## Calling API Methods

```typescript
// Via bot.api — direct API access
const response = await bot.api.sendMessage({
    chat_id: "@channel_name",
    text: "Hello!",
});

// Via context — shorthand (auto-fills chat_id)
bot.on("message", (context) => context.send("Reply to current chat"));
```

## Ephemeral send parameters (Bot API 10.3)

All send methods use the nested object. Top-level aliases are intentionally unsupported.

```typescript
await bot.api.sendMessage({
    chat_id: chatId,
    text: "Private result",
    ephemeral_message_parameters: {
        receiver_user_id: userId,
        callback_query_id: callbackQueryId,
        replace_callback_query_message: true,
    },
});
```

`bot.api.*` stays one-to-one with Telegram method names and raw parameter shapes. GramIO convenience belongs in contexts/builders/middleware, not extra raw API methods.

## Error Suppression (`suppress: true`)

Returns `TelegramError` on failure instead of throwing — no try/catch needed:

```typescript
const result = await bot.api.sendMessage({
    chat_id: "@nonexistent",
    text: "test",
    suppress: true,
});

if (result instanceof TelegramError) {
    console.error("Failed:", result.message);
} else {
    console.log("Sent message:", result.message_id);
}
```

## Rate Limit Handling: `withRetries`

```typescript
import { withRetries } from "gramio/utils";

const response = await withRetries(() =>
    bot.api.sendMessage({ chat_id: chatId, text: "Hello!" })
);
```

Automatically handles 429 (Too Many Requests) errors by waiting `retry_after` and retrying. Works with both thrown and suppressed errors.

## Type Helpers

```typescript
import type {
    APIMethodParams,
    APIMethodReturn,
    SuppressedAPIMethodParams,
    SuppressedAPIMethodReturn,
} from "gramio";

type SendMessageParams = APIMethodParams<"sendMessage">;
type GetMeReturn = APIMethodReturn<"getMe">; // TelegramUser
type SuppressedSendParams = SuppressedAPIMethodParams<"sendMessage">; // includes suppress
type SuppressedSendReturn = SuppressedAPIMethodReturn<"sendMessage">; // TelegramMessage | TelegramError
```

## Declaration Merging for Custom Methods

For custom Telegram Bot API server methods not in `@gramio/types`:

```typescript
declare module "@gramio/types" {
    export interface APIMethods {
        myCustomMethod: {
            params: { chat_id: string; text: string };
            return: string;
        };
    }
}

// Now bot.api.myCustomMethod() is typed
```

Also override `@gramio/types` version via package.json `"overrides"` for newer Bot API versions.

<!--
Source: https://gramio.dev/bot-api
-->
