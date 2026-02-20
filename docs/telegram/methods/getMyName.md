---
title: getMyName — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Read the bot's current display name for a given language using GramIO. TypeScript examples for getMyName — locale-aware name retrieval, default fallback, and setMyName workflow.
  - - meta
    - name: keywords
      content: getMyName, telegram bot api, gramio getMyName, getMyName typescript, telegram bot name, BotName, language_code, localized bot name, bot display name, setMyName, getMyName example, how to get bot name telegram
---

# getMyName

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/BotName">BotName</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getmyname" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get the current bot name for the given user language. Returns [BotName](https://core.telegram.org/bots/api#botname) on success.

## Parameters

<ApiParam name="language_code" type="String" description="A two-letter ISO 639-1 language code or an empty string" />

## Returns

On success, the [BotName](/telegram/types/BotName) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get the bot's default display name (no language filter)
const result = await bot.api.getMyName({});
console.log(result.name);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get the display name localised for Russian-speaking users
const ruResult = await bot.api.getMyName({ language_code: "ru" });
console.log("RU name:", ruResult.name);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Read names for several locales in parallel
const [defaultName, enName, ruName] = await Promise.all([
  bot.api.getMyName({}),
  bot.api.getMyName({ language_code: "en" }),
  bot.api.getMyName({ language_code: "ru" }),
]);

console.log("Default:", defaultName.name);
console.log("EN:     ", enName.name);
console.log("RU:     ", ruName.name);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Audit name coverage across supported locales
async function auditNames(locales: string[]) {
  for (const lang of locales) {
    const { name } = await bot.api.getMyName({ language_code: lang });
    const status = name ? "OK" : "MISSING";
    console.log(`[${lang}] ${status}: ${name}`);
  }
}

await auditNames(["en", "ru", "de", "fr"]);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 401 | `Unauthorized: invalid token specified` | Bot token is wrong or revoked — check the `BOT_TOKEN` environment variable |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Both parameters are optional — pass an empty object `{}` for the default.** Omitting `language_code` (or passing an empty string) returns the language-agnostic fallback name shown to users whose language has no dedicated override.
- **The name differs from the username.** `getMyName` returns the human-readable display name (e.g. "My Awesome Bot"), not the `@username` handle. The `@username` is always fixed and accessible via `getMe`.
- **Returns an empty string when no locale-specific name is set.** If only a default name exists and you request a specific language, the `name` field will be `""` (the default is not automatically surfaced). Call `getMyName({})` separately to read the fallback.
- **Language codes must be ISO 639-1.** Valid examples: `"en"`, `"ru"`, `"de"`. An empty string `""` reads the language-agnostic default.
- **Locale resolution is one level deep.** There is no cascading — if a Russian name is not set and you request `language_code: "ru"`, you receive `""` rather than the default name.
- **Use `setMyName` to update it.** Read with `getMyName` first if you want to diff before writing.

## See Also

- [BotName](/telegram/types/BotName) — return type containing the `name` field
- [setMyName](/telegram/methods/setMyName) — update the bot's display name for a locale
- [getMyDescription](/telegram/methods/getMyDescription) — get the bot's description
- [getMyShortDescription](/telegram/methods/getMyShortDescription) — get the bot's short description shown on the profile page
- [getMe](/telegram/methods/getMe) — get the bot's identity and capability flags including `@username`
