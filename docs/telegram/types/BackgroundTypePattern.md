---
title: BackgroundTypePattern — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: BackgroundTypePattern Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: BackgroundTypePattern, telegram bot api types, gramio BackgroundTypePattern, BackgroundTypePattern object, BackgroundTypePattern typescript
---

# BackgroundTypePattern

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#backgroundtypepattern" target="_blank" rel="noopener">Official docs ↗</a>
</div>

The background is a .PNG or .TGV (gzipped subset of SVG with MIME type “application/x-tgwallpattern”) pattern to be combined with the background fill chosen by the user.

## Fields

<ApiParam name="type" type="String" required description="Type of the background, always &quot;pattern&quot;" constValue="pattern" />

<ApiParam name="document" type="Document" required description="Document with the pattern" />

<ApiParam name="fill" type="BackgroundFill" required description="The background fill that is combined with the pattern" />

<ApiParam name="intensity" type="Integer" required description="Intensity of the pattern when it is shown above the filled background; 0-100" />

<ApiParam name="is_inverted" type="True" description="*Optional*. *True*, if the background fill must be applied only to the pattern itself. All other pixels are black in this case. For dark themes only" />

<ApiParam name="is_moving" type="True" description="*Optional*. *True*, if the background moves slightly when the device is tilted" />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
