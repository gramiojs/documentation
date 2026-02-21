---
title: convertGiftToStars — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Convert a regular Telegram gift to Stars using GramIO business bots. Requires can_convert_gifts_to_stars business bot right. TypeScript examples and error reference included.
  - - meta
    - name: keywords
      content: convertGiftToStars, telegram bot api, convert gift stars, telegram stars gifts, gramio convertGiftToStars, business bot gifts, owned_gift_id, business_connection_id, can_convert_gifts_to_stars, convertGiftToStars typescript, convertGiftToStars example
---

# convertGiftToStars

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#convertgifttostars" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Converts a given regular gift to Telegram Stars. Requires the *can\_convert\_gifts\_to\_stars* business bot right. Returns *True* on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="owned_gift_id" type="String" required description="Unique identifier of the regular gift that should be converted to Telegram Stars" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Convert a specific owned gift to Stars via a business connection
await bot.api.convertGiftToStars({
  business_connection_id: "bc_123456789",
  owned_gift_id: "gift_abc123",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Retrieve gifts and convert the first available regular gift to Stars
async function convertFirstGift(businessConnectionId: string) {
  const gifts = await bot.api.getBusinessAccountGifts({
    business_connection_id: businessConnectionId,
  });

  const regularGift = gifts.gifts.find((g) => g.type === "regular");

  if (!regularGift || !regularGift.owned_gift_id) {
    console.log("No convertible regular gift found.");
    return;
  }

  await bot.api.convertGiftToStars({
    business_connection_id: businessConnectionId,
    owned_gift_id: regularGift.owned_gift_id,
  });

  console.log(`Converted gift ${regularGift.owned_gift_id} to Stars.`);
}
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Handle a business message event — convert a gift sent to the business account
bot.on("business_message", async (ctx) => {
  const connectionId = ctx.businessConnectionId;

  if (connectionId) {
    await bot.api.convertGiftToStars({
      business_connection_id: connectionId,
      owned_gift_id: "gift_xyz789",
    });
  }
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: BUSINESS_CONNECTION_INVALID` | `business_connection_id` is invalid or the connection has been revoked |
| 400 | `Bad Request: GIFT_NOT_FOUND` | `owned_gift_id` does not correspond to a gift owned by this business account |
| 403 | `Forbidden: not enough rights` | Business bot lacks the `can_convert_gifts_to_stars` right — check the business connection permissions |
| 400 | `Bad Request: GIFT_CONVERT_IMPOSSIBLE` | The gift is a unique (limited) gift and cannot be converted to Stars; only regular gifts are eligible |

## Tips & Gotchas

- **Only regular gifts can be converted.** Unique (limited edition) gifts cannot be turned into Stars — only standard regular gifts are eligible. Attempting to convert a unique gift returns an error.
- **Business bot right is required.** The business connection must grant your bot the `can_convert_gifts_to_stars` right. Verify this via [`getBusinessConnection`](/telegram/methods/getBusinessConnection) before attempting conversion.
- **`owned_gift_id` comes from gift lists.** Retrieve the ID by calling [`getBusinessAccountGifts`](/telegram/methods/getBusinessAccountGifts) — it is not the same as the gift type ID.
- **Conversion is irreversible.** Once converted to Stars, the gift cannot be restored. Confirm intent before calling this method, especially in automated flows.
- **Business connection scope.** This method operates within a business connection context and is not available for regular bot usage outside of Telegram Business integrations.

## See Also

- [`getBusinessConnection`](/telegram/methods/getBusinessConnection) — retrieve and verify business connection details and bot rights
- [`getUserGifts`](/telegram/methods/getUserGifts) — get gifts of a regular user (not business)
- [`sendGift`](/telegram/methods/sendGift) — send a gift to a user
- [`OwnedGift`](/telegram/types/OwnedGift) — the OwnedGift type representing a gift owned by a business account
