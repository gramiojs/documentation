---
name: hooks
description: Complete hook system — onStart, onStop, onError, preRequest, onResponse, onResponseError, onApiCall — with scoping, custom error types, and lifecycle order.
---

# Hooks

Lifecycle order: onStart → (updates processing with onError) → onStop.
API call order: preRequest → onApiCall → (API call) → onResponse / onResponseError.

## onStart

Fires when bot starts. Parameters: `plugins`, `info`, `updatesFrom`.

```typescript
bot.onStart(({ plugins, info, updatesFrom }) => {
    console.log(`@${info.username} started via ${updatesFrom}`);
    // updatesFrom: "webhook" | "long-polling"
    console.log("Plugins:", plugins); // string[]
});
```

## onStop

Fires when bot stops.

```typescript
bot.onStop(({ plugins, info }) => {
    console.log(`@${info.username} stopped`);
});
```

## onError

Global or scoped error handler.

```typescript
// Global — all contexts
bot.onError(({ context, kind, error }) => {
    console.error(`[${kind}]`, error);
});

// Scoped to specific update type
bot.onError("message", ({ context, kind, error }) => {
    if (context.is("message")) {
        return context.send(`Error: ${error.message}`);
    }
});

// Multi-scoped
bot.onError(["message", "callback_query"], handler);
```

### Error Kinds

| Kind | Description | Extra Properties |
|------|-------------|-----------------|
| `"TELEGRAM"` | Failed API request | `error.method`, `error.params` |
| `"UNKNOWN"` | Any unregistered Error | — |
| Custom kinds | Registered via `.error()` | Type-safe error class |

### Custom Error Types

Convention: SCREAMING_SNAKE_CASE for kind names.

```typescript
class NoRightsError extends Error {
    needRole: "admin" | "moderator" = "admin";
}

bot.error("NO_RIGHTS", NoRightsError)
    .onError("message", ({ kind, error }) => {
        if (kind === "NO_RIGHTS") {
            // error is typed as NoRightsError
            console.log("Need role:", error.needRole);
        }
    });

// Throw in handler:
bot.command("admin", (context) => {
    throw new NoRightsError();
});
```

## preRequest

Fires before every API call. **Must return context**.

```typescript
// Global — all methods
bot.preRequest((context) => {
    console.log(`Calling ${context.method}`, context.params);
    return context; // MUST return
});

// Scoped to specific API method
bot.preRequest("sendMessage", (context) => {
    context.params.text = `[BOT] ${context.params.text}`;
    return context;
});

// Multi-scoped
bot.preRequest(["sendMessage", "sendPhoto"], handler);
```

## onResponse

Fires after successful API response.

```typescript
bot.onResponse((context) => {
    console.log(`${context.method} →`, context.response);
});

// Scoped
bot.onResponse("sendMessage", (context) => {
    console.log("Sent message:", context.response.message_id);
});
```

## onResponseError

Fires on API error. Parameter is `TelegramError`.

```typescript
bot.onResponseError((context) => {
    console.error(`${context.method} failed:`, context.message);
});

// Scoped
bot.onResponseError("sendMessage", handler);
```

## onApiCall

Wraps the entire API call lifecycle for instrumentation, tracing, and metrics. Used by `@gramio/opentelemetry` and `@gramio/sentry` plugins.

```typescript
bot.onApiCall("sendMessage", async (context, next) => {
    const start = Date.now();
    const result = await next();
    console.log(`sendMessage took ${Date.now() - start}ms`);
    return result;
});

// Global — all methods
bot.onApiCall(async (context, next) => {
    return next();
});
```

<!--
Source: https://gramio.dev/hooks/
-->
