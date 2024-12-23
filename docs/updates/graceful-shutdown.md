# Graceful shutdown

Graceful shutdown - pattern which helps to stop the application without losing data or killing running processes (for example, response to `/start`).

> What are your last words?

### Signals

-   `SIGINT` (Signal Interrupt)

This signal sended when user presses Ctrl+C.

-   `SIGTERM` (Signal Terminate)

This signal is often sent by process managers (like Docker, Kubernetes, or systemd) when they need to terminate a process.

so we want to handle both.

### Example

Imagine you have a **bot** on **webhooks** with **analytics** usage.

```ts
import { app } from "./webhook";
import { bot } from "./bot";
import { posthog } from "./analytics";

const signals = ["SIGINT", "SIGTERM"];

for (const signal of signals) {
    process.on(signal, async () => {
        console.log(`Received ${signal}. Initiating graceful shutdown...`);
        await app.stop();
        await bot.stop();
        await posthog.shutdown();
        process.exit(0);
    });
}
```

For first, we should stop receiving updates - gracefully stop our backend API framework (for example, Elysia).

For second, we should stop receiving updates - gracefully stop our bot with `bot.stop` method.

and last, we should call `posthog.shutdown()` which send captured analytics to our PostHog instance.

then we exit our process with 0 status code and it all!

this example shows how to gracefully shutdown your bot in right order for most applications.
