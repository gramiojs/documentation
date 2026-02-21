---
title: removeBusinessAccountProfilePhoto — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Remove the profile photo of a managed Telegram business account using GramIO and TypeScript. Learn is_public flag, can_edit_profile_photo right, and fallback behavior.
  - - meta
    - name: keywords
      content: removeBusinessAccountProfilePhoto, telegram bot api, gramio removeBusinessAccountProfilePhoto, removeBusinessAccountProfilePhoto typescript, removeBusinessAccountProfilePhoto example, remove business profile photo, is_public, can_edit_profile_photo, business connection photo
---

# removeBusinessAccountProfilePhoto

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#removebusinessaccountprofilephoto" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Removes the current profile photo of a managed business account. Requires the *can\_edit\_profile\_photo* business bot right. Returns *True* on success.

## Parameters

<ApiParam name="business_connection_id" type="String" required description="Unique identifier of the business connection" />

<ApiParam name="is_public" type="Boolean" description="Pass *True* to remove the public photo, which is visible even if the main photo is hidden by the business account's privacy settings. After the main photo is removed, the previous profile photo (if present) becomes the main photo." />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

Remove the main (private) profile photo of a managed business account:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
async function removeMainPhoto(businessConnectionId: string) {
  const success = await bot.api.removeBusinessAccountProfilePhoto({
    business_connection_id: businessConnectionId,
  });

  console.log("Main photo removed:", success);
}
```

Remove the public profile photo that is visible despite privacy restrictions:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
async function removePublicPhoto(businessConnectionId: string) {
  await bot.api.removeBusinessAccountProfilePhoto({
    business_connection_id: businessConnectionId,
    is_public: true,
  });
}
```

Remove both photos in sequence — public first, then main:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
async function clearAllPhotos(businessConnectionId: string) {
  // Remove the publicly visible photo
  await bot.api.removeBusinessAccountProfilePhoto({
    business_connection_id: businessConnectionId,
    is_public: true,
  });

  // Remove the main photo
  await bot.api.removeBusinessAccountProfilePhoto({
    business_connection_id: businessConnectionId,
    is_public: false,
  });
}
```

Listen for a command and reset the business account photo on demand:

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
bot.command("reset_photo", async (ctx) => {
  const connectionId = "your_business_connection_id";

  await bot.api.removeBusinessAccountProfilePhoto({
    business_connection_id: connectionId,
  });

  await ctx.send("Business profile photo has been removed.");
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: business connection not found` | The `business_connection_id` is invalid or the connection has been revoked. |
| 400 | `Bad Request: not enough rights` | The business bot connection does not have the `can_edit_profile_photo` right. Enable it in BotFather's business bot settings. |
| 400 | `Bad Request: no profile photo` | There is no profile photo of the specified type (main or public) to remove. |
| 403 | `Forbidden: not enough rights` | The bot is not authorized to manage this business account's profile. |
| 429 | `Too Many Requests: retry after N` | Flood control triggered. Wait `N` seconds before retrying. |

## Tips & Gotchas

- **Two independent photo slots.** A business account can have a "main" photo and a separate "public" photo. The main photo is shown based on the account's privacy settings; the public photo is always visible. Pass `is_public: true` to remove the public slot, omit it (or pass `false`) for the main slot.
- **Removing the main photo reveals the previous one.** If the business account had multiple photos uploaded, deleting the current main photo promotes the previous photo in the history to become the new main. To fully clear the profile you may need multiple calls.
- **`can_edit_profile_photo` is a business-specific right.** It is separate from all other business bot rights. Verify it is granted by inspecting `getBusinessConnection` before calling this method in production.
- **No undo.** There is no method to "restore" a removed photo from the API. Ensure you have a copy of any important profile images before removing them programmatically.
- **Pair with `setBusinessAccountProfilePhoto`.** Typical workflows remove the old photo and then upload a new one via `setBusinessAccountProfilePhoto`. Both require `can_edit_profile_photo`.

## See Also

- [setBusinessAccountProfilePhoto](/telegram/methods/setBusinessAccountProfilePhoto) — Upload a new profile photo for the business account
- [getBusinessConnection](/telegram/methods/getBusinessConnection) — Inspect business connection rights
- [setBusinessAccountName](/telegram/methods/setBusinessAccountName) — Update the display name of the business account
- [setBusinessAccountBio](/telegram/methods/setBusinessAccountBio) — Update the bio of the business account
