---
title: getMyDescription — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Read the bot's current description for a given language using GramIO. TypeScript examples for getMyDescription — locale-aware description retrieval, default fallback, and setMyDescription workflow.
  - - meta
    - name: keywords
      content: getMyDescription, telegram bot api, gramio getMyDescription, getMyDescription typescript, telegram bot description, BotDescription, language_code, localized bot description, bot profile text, setMyDescription, getMyDescription example, how to get bot description telegram
---

# getMyDescription

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: <a href="/telegram/types/BotDescription">BotDescription</a></span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#getmydescription" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to get the current bot description for the given user language. Returns [BotDescription](https://core.telegram.org/bots/api#botdescription) on success.

## Parameters

<ApiParam name="language_code" type="String" description="A two-letter ISO 639-1 language code or an empty string" />

## Returns

On success, the [BotDescription](/telegram/types/BotDescription) object is returned.
<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get the bot's default description (no language filter)
const result = await bot.api.getMyDescription({});
console.log(result.description);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Get the description localised for Russian-speaking users
const ruResult = await bot.api.getMyDescription({ language_code: "ru" });
console.log("RU description:", ruResult.description);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Read descriptions for several locales in parallel
const [defaultDesc, enDesc, ruDesc] = await Promise.all([
  bot.api.getMyDescription({}),
  bot.api.getMyDescription({ language_code: "en" }),
  bot.api.getMyDescription({ language_code: "ru" }),
]);

console.log("Default:", defaultDesc.description);
console.log("EN:     ", enDesc.description);
console.log("RU:     ", ruDesc.description);
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Audit description coverage before deployment
async function auditDescriptions(locales: string[]) {
  for (const lang of locales) {
    const { description } = await bot.api.getMyDescription({
      language_code: lang,
    });
    const status = description ? "OK" : "MISSING";
    console.log(`[${lang}] ${status}: ${description}`);
  }
}

await auditDescriptions(["en", "ru", "de", "fr"]);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 401 | `Unauthorized: invalid token specified` | Bot token is wrong or revoked — check the `BOT_TOKEN` environment variable |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use the [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Both parameters are optional — pass an empty object `{}` for the default.** Omitting `language_code` (or passing an empty string) returns the language-agnostic fallback description shown to users whose language has no dedicated override.
- **Returns an empty string, not `null`, when no description is set.** If neither a locale-specific nor a default description has been configured with `setMyDescription`, `description` is `""`. Always check for this before displaying the value.
- **Locale resolution is one level deep.** Telegram stores each locale independently — there is no cascading. If you set only a Russian description and call `getMyDescription({ language_code: "ru" })`, you get it. Any other language code returns the default (or `""` if the default is also unset).
- **Language codes must be ISO 639-1.** Valid examples: `"en"`, `"ru"`, `"de"`. An empty string `""` reads the language-agnostic default.
- **Descriptions are shown in the empty chat screen.** The text appears in the Telegram UI when a user opens a chat with the bot for the first time and no messages have been sent yet.
- **Use `setMyDescription` to update it.** Read it first with `getMyDescription` if you want to diff before writing.

## See Also

- [BotDescription](/telegram/types/BotDescription) — return type containing the `description` field
- [setMyDescription](/telegram/methods/setMyDescription) — update the bot's description for a locale
- [getMyName](/telegram/methods/getMyName) — get the bot's display name
- [getMyShortDescription](/telegram/methods/getMyShortDescription) — get the bot's short description shown on the profile page
- [getMe](/telegram/methods/getMe) — get the bot's identity and capability flags
