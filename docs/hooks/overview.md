---
title: Hooks overview in GramIO - Event lifecycle management

head:
    - - meta
      - name: "description"
        content: "Learn about GramIO's hook system for Telegram bots that lets you intercept and modify the request lifecycle, handle errors, and respond to bot events."

    - - meta
      - name: "keywords"
        content: "Telegram bot, GramIO, hooks, event lifecycle, bot events, error handling, request interception, middleware, lifecycle management, onStart, onStop, onError, preRequest, onResponse, onResponseError, event handling, bot lifecycle, TypeScript, Deno, Bun, Node.js"
---

# Hooks

The hook system allows us to hook on to the lifecycle of the API request/context and somehow impact it.

Below are the hooks available in GramIO:

-   [onStart](/hooks/on-start) - called when the bot is started
-   [onStop](/hooks/on-stop) - called when the bot stops
-   [onError](/hooks/on-error) - called when an error occurs in the contexts
-   [preRequest](/hooks/pre-request) - called before sending a request to Telegram Bot API (allows us to impact the sent parameters)
-   [onResponse](/hooks/on-response) - called on API request response (only if success)
-   [onResponseError](/hooks/on-response-error) - called on API request response (only if errored)
-   onApiCall - wraps the entire API call lifecycle for instrumentation and tracing
