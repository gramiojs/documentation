# Hooks

The hook system allows us to hook on to the lifecycle of the API request/context and somehow impact it.

Below are the hooks available in GramIO:

-   [onStart](/hooks/on-start) - called when the bot is started
-   [onError](/hooks/on-error) - called when an error occurs in the contexts
-   [preRequest](/hooks/pre-request) - called before sending a request to Telegram Bot API (allows us to impact the sent parameters)
