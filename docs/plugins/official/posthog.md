# PostHog

<div class="badges">

[![npm](https://img.shields.io/npm/v/@gramio/posthog?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/posthog)
[![JSR](https://jsr.io/badges/@gramio/posthog)](https://jsr.io/@gramio/posthog)
[![JSR Score](https://jsr.io/badges/@gramio/posthog/score)](https://jsr.io/@gramio/posthog)

</div>

A plugin that conveniently wraps the [PostHog](https://posthog.com/) client. Automatically catches errors (including `senderId` and `chatId` in them). Provides methods with pre-bound distinctId (as `from.id`).

### Installation

::: code-group

```bash [npm]
npm install @gramio/media-group
```

```bash [yarn]
yarn add @gramio/media-group
```

```bash [pnpm]
pnpm add @gramio/media-group
```

```bash [bun]
bun install @gramio/media-group
```

:::

### Usage

```typescript
import { PostHog } from "posthog-node";
import { posthogPlugin } from "@gramio/posthog";
import { Bot } from "gramio";

const posthog = new PostHog(process.env.POSTHOG_API_KEY!, {
    host: process.env.POSTHOG_HOST,
});

const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(posthogPlugin(posthog))
    .on("message", (context) => {
        context.capture("message", {
            text: context.message.text,
        });

        throw new Error("Will be caught by PostHog");
    });

await bot.start();
```

## Methods

### `capture(event: string, properties?: Record<string, unknown>)`

Captures events and sends them to PostHog along with `senderId`.

```typescript
context.capture("message", {
    text: context.message.text,
});
```

### Feature Flags

#### `isEnabled(feature: string, options?: IsFeatureEnabledOptions)`

Checks if a feature flag is enabled for the current user.

```typescript
const isEnabled = await context.featureFlags.isEnabled("beta-feature", {
    groups: { organization: "org_id" },
});
// Returns boolean
```

#### `getPayload(feature: string, value?: GetFeatureFlagPayloadValue, options?: GetFeatureFlagPayloadOptions)`

Gets the payload (additional data) for a feature flag.

```typescript
const payload = await context.featureFlags.getPayload("pricing-page", {
    sendEmail: true,
});
// Returns any | undefined
```

#### `get(feature: string, options?: GetFeatureFlagOptions)`

Gets complete information about a feature flag.

```typescript
const flag = await context.featureFlags.get("new-onboarding", {
    personProperties: { plan: "pro" },
});
// Returns boolean | string | number | Record<string, any>
```

#### `getAll(options?: GetAllFlagsOptions)`

Gets all feature flags for the user.

```typescript
const allFlags = await context.featureFlags.getAll({
    groups: { company: "acme" },
});
// Returns Record<string, boolean | string | number>
```

#### `getAllPayload(options?: GetAllFlagsPayloadOptions)`

Gets all flags along with their payloads.

```typescript
const flagsWithPayloads = await context.featureFlags.getAllPayload({
    personProperties: { country: "US" },
});
/* Returns:
{
  flags: Record<string, boolean | string | number>
  payloads: Record<string, any>
} */
```
