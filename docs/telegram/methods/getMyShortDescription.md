---
title: getMyShortDescription — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Read the bot's current short description for a given language using GramIO. TypeScript examples for getMyShortDescription — locale-aware retrieval, default fallback, and setMyShortDescription workflow.
  - - meta
    - name: keywords
      content: getMyShortDescription, telegram bot api, gramio getMyShortDescription, getMyShortDescription typescript, telegram bot short description, BotShortDescription, language_code, localized bot short description, bot profile page, setMyShortDescription, getMyShortDescription example, how to get bot short description telegram
---

# getMyShortDescription

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/BotShortDescription">BotShortDescription</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getmyshortdescription" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get the current bot short description for the given user language. Returns [BotShortDescription](https://core.telegram.org/bots/api#botshortdescription) on success.

## Parameters

<ApiParam name="language_code" type="String" description="A two-letter ISO 639-1 language code or an empty string" />

## Returns

On success, the [BotShortDescription](/telegram/types/BotShortDescription) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get the bot's default short description (no language filter)
const result = await bot.api.getMyShortDescription({});
console.log(result.short_description);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get the short description localised for Russian-speaking users
const ruResult = await bot.api.getMyShortDescription({ language_code: "ru" });
console.log("RU short description:", ruResult.short_description);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Read short descriptions for several locales in parallel
const [defaultShort, enShort, ruShort] = await Promise.all([
  bot.api.getMyShortDescription({}),
  bot.api.getMyShortDescription({ language_code: "en" }),
  bot.api.getMyShortDescription({ language_code: "ru" }),
]);

console.log("Default:", defaultShort.short_description);
console.log("EN:     ", enShort.short_description);
console.log("RU:     ", ruShort.short_description);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Audit short description coverage across supported locales
async function auditShortDescriptions(locales: string[]) {
  for (const lang of locales) {
    const { short_description } = await bot.api.getMyShortDescription({
      language_code: lang,
    });
    const status = short_description ? "OK" : "MISSING";
    console.log(`[${lang}] ${status}: ${short_description}`);
  }
}

await auditShortDescriptions(["en", "ru", "de", "fr"]);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 401 | `Unauthorized: invalid token specified` | Bot token is wrong or revoked — check the `BOT_TOKEN` environment variable |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Both parameters are optional — pass an empty object `{}` for the default.** Omitting `language_code` (or passing an empty string) returns the language-agnostic fallback short description shown to users whose language has no dedicated override.
- **The short description is distinct from the full description.** The short description (up to 120 characters) appears on the bot's profile page and in forwarded links. The full description (up to 512 characters) appears in the empty chat screen. Manage them independently via `getMyDescription` / `setMyDescription`.
- **Returns an empty string when no locale-specific short description is set.** If only a default short description exists and you request a specific language, `short_description` will be `""`. Call `getMyShortDescription({})` separately to read the fallback.
- **Language codes must be ISO 639-1.** Valid examples: `"en"`, `"ru"`, `"de"`. An empty string `""` reads the language-agnostic default.
- **Locale resolution is one level deep.** There is no cascading — if a locale-specific short description is not set, you get `""` rather than the default.
- **Use `setMyShortDescription` to update it.** Read with `getMyShortDescription` first if you want to diff before writing.

## See Also

- [BotShortDescription](/telegram/types/BotShortDescription) — return type containing the `short_description` field
- [setMyShortDescription](/telegram/methods/setMyShortDescription) — update the bot's short description for a locale
- [getMyDescription](/telegram/methods/getMyDescription) — get the bot's full description shown in the empty chat screen
- [getMyName](/telegram/methods/getMyName) — get the bot's display name
- [getMe](/telegram/methods/getMe) — get the bot's identity and capability flags
