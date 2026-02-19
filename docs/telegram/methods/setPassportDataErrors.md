---
title: setPassportDataErrors — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: setPassportDataErrors Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: setPassportDataErrors, telegram bot api, gramio setPassportDataErrors, setPassportDataErrors typescript, setPassportDataErrors example
---

# setPassportDataErrors

<!-- GENERATED:START -->
<div class="api-badge-row">
  <span class="api-badge returns">Returns: True</span>
  <a class="api-badge official" href="https://core.telegram.org/bots/api#setpassportdataerrors" target="_blank" rel="noopener">Official docs ↗</a>
</div>

Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns _True_ on success.

Use this if the data submitted by the user doesn't satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.

## Parameters

<ApiParam name="user_id" type="Integer" required description="User identifier" />

<ApiParam name="errors" type="PassportElementError[]" required description="A JSON-serialized array describing the errors" />

## Returns

On success, *True* is returned.
<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
