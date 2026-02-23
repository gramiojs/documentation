---
title: setMyName — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Change your Telegram bot's display name using GramIO. Supports per-language names with ISO 639-1 codes. TypeScript examples and full parameter reference.
  - - meta
    - name: keywords
      content: setMyName, telegram bot api, telegram bot name, gramio setMyName, change bot name, set bot display name, setMyName typescript, setMyName example, language_code, how to change telegram bot name, bot name localization
---

# setMyName

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setmyname" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Use this method to change the bot's name. Returns *True* on success.

## Parameters

<ApiParam name="name" type="String" description="New bot name; 0-64 characters. Pass an empty string to remove the dedicated name for the given language." :minLen="0" :maxLen="64" />

<ApiParam name="language_code" type="String" description="A two-letter ISO 639-1 language code. If empty, the name will be shown to all users for whose language there is no dedicated name." />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set the default bot name (shown to users without a localized name)
await bot.api.setMyName({ name: "My Awesome Bot" });
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Set a localized name for Russian-speaking users
await bot.api.setMyName({
  name: "Мой Бот",
  language_code: "ru",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Remove the localized name (falls back to the default)
await bot.api.setMyName({
  name: "",
  language_code: "ru",
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Read back the name to confirm it was saved
const result = await bot.api.getMyName({ language_code: "ru" });
console.log(result.name);
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: name is too long` | `name` exceeds 64 characters — shorten the name |
| 400 | `Bad Request: LANGUAGE_CODE_INVALID` | `language_code` is not a valid ISO 639-1 two-letter code |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

::: tip
Use GramIO's [auto-retry plugin](/plugins/official/auto-retry) to handle `429` errors automatically.
:::

## Tips & Gotchas

- **64 character limit.** Bot names are displayed in many compact UI contexts (chat list, search results) — shorter names render better across all Telegram clients.
- **Language fallback applies.** Users see the localized name matching their Telegram language setting; if none exists, they see the default name (set without `language_code`). Always set a default first.
- **Empty string removes the localized name.** Passing `name: ""` with a `language_code` removes that translation; passing it without a code resets the default.
- **Different from the @username.** The bot's display name set here is separate from its Telegram username (e.g., `@mybot`). The username can only be changed via [@BotFather](https://t.me/botfather).
- **Rate limit applies.** Telegram limits how frequently you can update bot metadata — avoid calling this in response to user messages.

## See Also

- [getMyName](/telegram/methods/getMyName) — read the current bot name
- [setMyDescription](/telegram/methods/setMyDescription) — change the bot's description
- [setMyShortDescription](/telegram/methods/setMyShortDescription) — change the short description shown on profile page
- [BotName](/telegram/types/BotName) — the return type of getMyName
