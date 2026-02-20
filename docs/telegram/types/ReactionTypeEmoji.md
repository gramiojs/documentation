---
title: ReactionTypeEmoji — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ReactionTypeEmoji Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ReactionTypeEmoji, telegram bot api types, gramio ReactionTypeEmoji, ReactionTypeEmoji object, ReactionTypeEmoji typescript
---

# ReactionTypeEmoji

<!-- GENERATED:START -->
<div class="api-badge-row">
  <a class="api-badge official" href="https://core.telegram.org/bots/api#reactiontypeemoji" target="_blank" rel="noopener">Official docs ↗</a>
</div>

The reaction is based on an emoji.

## Fields

<ApiParam name="type" type="String" description="Type of the reaction, always “emoji”" defaultValue="emoji" />

<ApiParam name="emoji" type="String" required description="Reaction emoji. Currently, it can be one of &quot;![❤](//telegram.org/img/emoji/40/E29DA4.png)&quot;, &quot;![👍](//telegram.org/img/emoji/40/F09F918D.png)&quot;, &quot;![👎](//telegram.org/img/emoji/40/F09F918E.png)&quot;, &quot;![🔥](//telegram.org/img/emoji/40/F09F94A5.png)&quot;, &quot;![🥰](//telegram.org/img/emoji/40/F09FA5B0.png)&quot;, &quot;![👏](//telegram.org/img/emoji/40/F09F918F.png)&quot;, &quot;![😁](//telegram.org/img/emoji/40/F09F9881.png)&quot;, &quot;![🤔](//telegram.org/img/emoji/40/F09FA494.png)&quot;, &quot;![🤯](//telegram.org/img/emoji/40/F09FA4AF.png)&quot;, &quot;![😱](//telegram.org/img/emoji/40/F09F98B1.png)&quot;, &quot;![🤬](//telegram.org/img/emoji/40/F09FA4AC.png)&quot;, &quot;![😢](//telegram.org/img/emoji/40/F09F98A2.png)&quot;, &quot;![🎉](//telegram.org/img/emoji/40/F09F8E89.png)&quot;, &quot;![🤩](//telegram.org/img/emoji/40/F09FA4A9.png)&quot;, &quot;![🤮](//telegram.org/img/emoji/40/F09FA4AE.png)&quot;, &quot;![💩](//telegram.org/img/emoji/40/F09F92A9.png)&quot;, &quot;![🙏](//telegram.org/img/emoji/40/F09F998F.png)&quot;, &quot;![👌](//telegram.org/img/emoji/40/F09F918C.png)&quot;, &quot;![🕊](//telegram.org/img/emoji/40/F09F958A.png)&quot;, &quot;![🤡](//telegram.org/img/emoji/40/F09FA4A1.png)&quot;, &quot;![🥱](//telegram.org/img/emoji/40/F09FA5B1.png)&quot;, &quot;![🥴](//telegram.org/img/emoji/40/F09FA5B4.png)&quot;, &quot;![😍](//telegram.org/img/emoji/40/F09F988D.png)&quot;, &quot;![🐳](//telegram.org/img/emoji/40/F09F90B3.png)&quot;, &quot;![❤‍🔥](//telegram.org/img/emoji/40/E29DA4E2808DF09F94A5.png)&quot;, &quot;![🌚](//telegram.org/img/emoji/40/F09F8C9A.png)&quot;, &quot;![🌭](//telegram.org/img/emoji/40/F09F8CAD.png)&quot;, &quot;![💯](//telegram.org/img/emoji/40/F09F92AF.png)&quot;, &quot;![🤣](//telegram.org/img/emoji/40/F09FA4A3.png)&quot;, &quot;![⚡](//telegram.org/img/emoji/40/E29AA1.png)&quot;, &quot;![🍌](//telegram.org/img/emoji/40/F09F8D8C.png)&quot;, &quot;![🏆](//telegram.org/img/emoji/40/F09F8F86.png)&quot;, &quot;![💔](//telegram.org/img/emoji/40/F09F9294.png)&quot;, &quot;![🤨](//telegram.org/img/emoji/40/F09FA4A8.png)&quot;, &quot;![😐](//telegram.org/img/emoji/40/F09F9890.png)&quot;, &quot;![🍓](//telegram.org/img/emoji/40/F09F8D93.png)&quot;, &quot;![🍾](//telegram.org/img/emoji/40/F09F8DBE.png)&quot;, &quot;![💋](//telegram.org/img/emoji/40/F09F928B.png)&quot;, &quot;![🖕](//telegram.org/img/emoji/40/F09F9695.png)&quot;, &quot;![😈](//telegram.org/img/emoji/40/F09F9888.png)&quot;, &quot;![😴](//telegram.org/img/emoji/40/F09F98B4.png)&quot;, &quot;![😭](//telegram.org/img/emoji/40/F09F98AD.png)&quot;, &quot;![🤓](//telegram.org/img/emoji/40/F09FA493.png)&quot;, &quot;![👻](//telegram.org/img/emoji/40/F09F91BB.png)&quot;, &quot;![👨‍💻](//telegram.org/img/emoji/40/F09F91A8E2808DF09F92BB.png)&quot;, &quot;![👀](//telegram.org/img/emoji/40/F09F9180.png)&quot;, &quot;![🎃](//telegram.org/img/emoji/40/F09F8E83.png)&quot;, &quot;![🙈](//telegram.org/img/emoji/40/F09F9988.png)&quot;, &quot;![😇](//telegram.org/img/emoji/40/F09F9887.png)&quot;, &quot;![😨](//telegram.org/img/emoji/40/F09F98A8.png)&quot;, &quot;![🤝](//telegram.org/img/emoji/40/F09FA49D.png)&quot;, &quot;![✍](//telegram.org/img/emoji/40/E29C8D.png)&quot;, &quot;![🤗](//telegram.org/img/emoji/40/F09FA497.png)&quot;, &quot;![🫡](//telegram.org/img/emoji/40/F09FABA1.png)&quot;, &quot;![🎅](//telegram.org/img/emoji/40/F09F8E85.png)&quot;, &quot;![🎄](//telegram.org/img/emoji/40/F09F8E84.png)&quot;, &quot;![☃](//telegram.org/img/emoji/40/E29883.png)&quot;, &quot;![💅](//telegram.org/img/emoji/40/F09F9285.png)&quot;, &quot;![🤪](//telegram.org/img/emoji/40/F09FA4AA.png)&quot;, &quot;![🗿](//telegram.org/img/emoji/40/F09F97BF.png)&quot;, &quot;![🆒](//telegram.org/img/emoji/40/F09F8692.png)&quot;, &quot;![💘](//telegram.org/img/emoji/40/F09F9298.png)&quot;, &quot;![🙉](//telegram.org/img/emoji/40/F09F9989.png)&quot;, &quot;![🦄](//telegram.org/img/emoji/40/F09FA684.png)&quot;, &quot;![😘](//telegram.org/img/emoji/40/F09F9898.png)&quot;, &quot;![💊](//telegram.org/img/emoji/40/F09F928A.png)&quot;, &quot;![🙊](//telegram.org/img/emoji/40/F09F998A.png)&quot;, &quot;![😎](//telegram.org/img/emoji/40/F09F988E.png)&quot;, &quot;![👾](//telegram.org/img/emoji/40/F09F91BE.png)&quot;, &quot;![🤷‍♂](//telegram.org/img/emoji/40/F09FA4B7E2808DE29982.png)&quot;, &quot;![🤷](//telegram.org/img/emoji/40/F09FA4B7.png)&quot;, &quot;![🤷‍♀](//telegram.org/img/emoji/40/F09FA4B7E2808DE29980.png)&quot;, &quot;![😡](//telegram.org/img/emoji/40/F09F98A1.png)&quot;" :enumValues='["❤","👍","👎","🔥","🥰","👏","😁","🤔","🤯","😱","🤬","😢","🎉","🤩","🤮","💩","🙏","👌","🕊","🤡","🥱","🥴","😍","🐳","❤‍🔥","🌚","🌭","💯","🤣","⚡","🍌","🏆","💔","🤨","😐","🍓","🍾","💋","🖕","😈","😴","😭","🤓","👻","👨‍💻","👀","🎃","🙈","😇","😨","🤝","✍","🤗","🫡","🎅","🎄","☃","💅","🤪","🗿","🆒","💘","🙉","🦄","😘","💊","🙊","😎","👾","🤷‍♂","🤷","🤷‍♀","😡"]' />

<!-- GENERATED:END -->

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
