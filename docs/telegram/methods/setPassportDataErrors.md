---
title: setPassportDataErrors — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: Inform users of Telegram Passport data errors using GramIO. Block re-submission until errors are fixed. Complete PassportElementError reference with TypeScript examples.
  - - meta
    - name: keywords
      content: setPassportDataErrors, telegram bot api, telegram passport errors, gramio setPassportDataErrors, PassportElementError, telegram passport verification, setPassportDataErrors typescript, setPassportDataErrors example, passport data validation, telegram bot passport, user_id errors, passport document errors
---

# setPassportDataErrors

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns"><span class="returns-label">Returns:</span> True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setpassportdataerrors" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns *True* on success.

Use this if the data submitted by the user doesn't satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.

## Parameters

<ApiParam name="user_id" type="Integer" required description="User identifier" />

<ApiParam name="errors" type="PassportElementError[]" required description="A JSON-serialized array describing the errors" />

## Returns

On success, *True* is returned.

<!-- GENERATED:END -->

## GramIO Usage

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Report an error in a data field (e.g. invalid birthday in personal details)
await bot.api.setPassportDataErrors({
  user_id: 123456789,
  errors: [
    {
      source: "data",
      type: "personal_details",
      field_name: "birth_date",
      data_hash: "base64encodedDataHash==",
      message: "The birth date appears to be invalid. Please check and re-enter.",
    },
  ],
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Report a blurry or tampered front-side document scan
await bot.api.setPassportDataErrors({
  user_id: 123456789,
  errors: [
    {
      source: "front_side",
      type: "passport",
      file_hash: "base64encodedFileHash==",
      message: "The document scan is blurry. Please upload a clearer photo.",
    },
  ],
});
```

```ts twoslash
import { Bot } from "gramio";

const bot = new Bot("");
// ---cut---
// Report multiple errors at once across different passport elements
await bot.api.setPassportDataErrors({
  user_id: 123456789,
  errors: [
    {
      source: "data",
      type: "address",
      field_name: "city",
      data_hash: "base64encodedDataHash==",
      message: "City name contains invalid characters.",
    },
    {
      source: "selfie",
      type: "passport",
      file_hash: "base64encodedFileHash==",
      message: "The selfie does not match the document photo.",
    },
  ],
});
```

## Errors

| Code | Error | Cause |
|------|-------|-------|
| 400 | `Bad Request: user not found` | The `user_id` does not correspond to a user who has interacted with the bot |
| 400 | `Bad Request: PASSPORT_ELEMENT_HASH_INVALID` | One of the element hashes does not match the data provided by the user — re-fetch the Passport data and use the correct hash |
| 400 | `Bad Request: errors is empty` | The `errors` array must contain at least one error object |
| 429 | `Too Many Requests: retry after N` | Rate limit hit — check `retry_after`, use [auto-retry plugin](/plugins/official/auto-retry) |

## Tips & Gotchas

- **Errors block re-submission until the specific field changes.** The user cannot re-submit their Passport until the *content* of the flagged element changes — this is enforced by Telegram, not your bot. Be precise about which field has the issue.
- **Hashes must match exactly.** Each error object requires the hash of the element you're rejecting (`data_hash` for data fields, `file_hash` for files). These hashes come from the Telegram Passport data the user submitted — do not generate or guess them.
- **Multiple errors can be reported in one call.** Send all errors in a single `setPassportDataErrors` call rather than multiple calls — this gives the user a complete picture of what needs fixing.
- **Error messages are shown to the user.** Write clear, human-readable `message` values that explain *what* is wrong and *how* to fix it. Vague messages lead to repeated incorrect re-submissions.
- **Resolving errors: call again with empty array or corrected errors.** Once the user has fixed the issues and re-submitted, you may call `setPassportDataErrors` again with an empty `errors` array or updated errors if new issues are found.
- **This is part of Telegram Passport — a separate feature requiring setup.** You must configure Telegram Passport with a public key via [@BotFather](https://t.me/botfather) before receiving or validating Passport data.

## See Also

- [PassportElementError](/telegram/types/PassportElementError) — union type of all error subtypes
