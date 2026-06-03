---
title: Upgrading GramIO
head:
    - - meta
      - name: "description"
        content: "Upgrade an existing GramIO project across gramio and @gramio/* versions. See the breaking changes, deprecations, and new features between your version and the latest, in dependency order, with before/after code."
    - - meta
      - name: "keywords"
        content: "gramio upgrade, update gramio, breaking changes, migration, version bump, @gramio upgrade guide, what breaks, dependency order"
---

# Upgrading GramIO

This is the **version-to-version** upgrade guide — what changes when you bump `gramio` and `@gramio/*` to a newer release. (Coming **from another framework**? See the [migration guides](/guides/migration-from-grammy) instead.)

## How upgrades work

GramIO is a family of packages that move together. A few rules make upgrades painless:

1. **Find out what you're on.** From your project root:

   ```bash
   npx gramio-detect-versions --latest
   # or, if you installed the AI skills:
   node skills/gramio-upgrade/detect-versions.mjs --latest
   ```

   It lists every `gramio` / `@gramio/*` dependency with its installed version, the latest on npm, and a deep link into this page for each one with an upgrade available.

2. **Bump in dependency order.** Move the low-level packages first, then the ones that depend on them:

   `@gramio/types` · `@gramio/composer` → `@gramio/contexts` · `@gramio/files` · `@gramio/format` → `gramio` → plugins (`scenes`, `session`, `views`, …) → tooling (`@gramio/test`).

   A Bot API line (e.g. `@gramio/types`, `contexts`, `files`, `format`, `gramio`) should move as **one unit** — their peer ranges depend on each other.

3. **Don't skip the intermediate hops.** Breaking changes accumulate. Going `0.5 → 0.10` means reading every entry in between, not just the endpoints.

4. **Pin around known-bad releases.** Where an entry says *"upgrade straight to X"*, do exactly that.

::: tip Let your AI assistant do it
If you use the [GramIO AI skills](/guides/ai-skills), the **`gramio-upgrade`** skill automates all of this — it detects your versions, builds the ordered plan from the data below, applies the code edits, and typechecks. Just ask it to "upgrade gramio".
:::

## Find your upgrade

Pick a package and your current/target versions — or paste the JSON from `gramio-detect-versions --latest --json` to get the full plan for your whole project at once.

<UpgradePicker />

## All migrations

Everything below is generated from the same data the picker and the CLI use, ordered by dependency layer. Each entry links to the full changelog for that cycle.

<!-- BEGIN GENERATED:migrations -->

## `@gramio/composer` {#pkg-gramio-composer}

### 0.3.3 → 0.4.1 · [changelog](/changelogs/2026-05-08) {#gramio-composer-0-3-3-0-4-1}

**🗑 Deprecated**

- **commandsMeta is now unknown-valued** — The Telegram-specific shape moved into gramio core. Only matters if you read commandsMeta directly.

**✨ New**

- **registeredEvents() &amp; EventContextOf&lt;T, E&gt;** — registeredEvents() returns the wired-up event names (powers gramio 0.9 auto allowed_updates); EventContextOf extracts global + per-event derives for custom methods.

**🐛 Fixes**

- **guard() ctx no longer collapses to any** — Predicate ctx keeps its type after derive().

### 0.2.0 → 0.3.3 · [changelog](/changelogs/2026-03-02) {#gramio-composer-0-2-0-0-3-3}

**✨ New**

- **EventContextOf / ContextOf / defineComposerMethods + macro system** — Type-safe custom methods that see accumulated derives, plus an Elysia-inspired macro system for declarative per-handler options.
  ```ts
  bot.macro("adminOnly", {
      preHandler: async (ctx, next) =>
          ctx.from?.id !== ADMIN_ID ? ctx.reply("Admins only") : next(),
  });
  bot.command("ban", banHandler, { adminOnly: true });
  ```

**🐛 Fixes**

- **WeakMap-backed getters in isolation groups** — group()/extend() isolation switched from Object.create(ctx) to snapshot/restore, fixing lazy getters (ctx.text, ctx.from) inside isolation groups.

### 0.1.x → 0.2.0 · [changelog](/changelogs/2026-02-17) {#gramio-composer-0-1-x-0-2-0}

**✨ New**

- **decorate() / when() / inspect() / trace()** — decorate() (zero-overhead static context), when() (build-time conditional middleware — props typed Partial), inspect() (read-only metadata), trace() (opt-in instrumentation). createComposer({ methods }) injects typed shorthands. MaybeArray&lt;T&gt; widened to T | readonly T[].

## `@gramio/schema-parser` {#pkg-gramio-schema-parser}

### 1.0.1 → 1.1.0 · [changelog](/changelogs/2026-05-08) {#gramio-schema-parser-1-0-1-1-1-0}

**✨ New**

- **Shared-sibling FormattableString detection** — Promotes the lone unmarked string field to semanticType: "formattable" when an object has bare parse_mode + bare entities (e.g. InputTextMessageContent).

### → 1.0.1 · [changelog](/changelogs/2026-02-23) {#gramio-schema-parser-init-1-0-1}

**✨ New**

- **New internal schema engine** — Native TypeScript parser of the Telegram Bot API docs that powers @gramio/types (replaces the Rust tg-bot-api crate). Semantic type markers, InputFile | string detection, synthesized Currencies enum with XTR, oneOf unions.

## `@gramio/types` {#pkg-gramio-types}

### 9.6.x → 10.0.0 · [changelog](/changelogs/2026-05-31) {#gramio-types-9-6-x-10-0-0}

**⚠️ Breaking**

- **Regenerated for Bot API 10.0** — Live photos, guest messages, poll/option media, react-permissions, bot access settings. correctOptionId is now correctOptionIds (array) — update any code reading the singular field.

**✨ New**

- **New structures** — LivePhotoAttachment, BotAccessSettings, SentGuestMessage, poll media / explanationMedia / membersOnly / countryCodes, sendLivePhoto + per-option sendPoll media.

### 9.5.0 → 9.6.1 · [changelog](/changelogs/2026-05-08) {#gramio-types-9-5-0-9-6-1}

**⚠️ Breaking**

- **Bot API 9.6** — correctOptionId → correctOptionIds (array) first appears here; managed-bot + poll structures added.

**🐛 Fixes**

- **Mojibake SendDiceEmoji fixed in 9.6.1** — 9.6.0 briefly shipped corrupted emoji values; 9.6.1 throws on the bad byte sequence and ships clean unicode. Pin ^9.6.1, not 9.6.0.

### 9.4.2 → 9.5.0 · [changelog](/changelogs/2026-03-02) {#gramio-types-9-4-2-9-5-0}

**✨ New**

- **Bot API 9.5 types** — Member tags, date_time entity, can_manage_tags.

### 9.4.1 → 9.4.2 · [changelog](/changelogs/2026-02-23) {#gramio-types-9-4-1-9-4-2}

**✨ New**

- **Migrated to @gramio/schema-parser** — Generator moved off the Rust tg-bot-api crate. Precise InputFile | string unions, semantic-typed formattable fields, a Currencies enum (incl. XTR), and the previously-missing APIResponse / APIResponseOk / APIResponseError types.

### 9.3.0 → 9.4.0 · [changelog](/changelogs/2026-02-15) {#gramio-types-9-3-0-9-4-0}

**✨ New**

- **Bot API 9.2–9.4 types** — VideoQuality, UserProfileAudios, ChatOwnerLeft, ChatOwnerChanged, UniqueGiftModelRarity, button-styling types, and methods getUserProfileAudios / setMyProfilePhoto / removeMyProfilePhoto.

## `wrappergram` {#pkg-wrappergram}

### v1 → v2 · [changelog](/changelogs/2026-05-08) {#wrappergram-v1-v2}

> Only affects you if you use wrappergram directly — gramio users get bot.api and are unaffected.

**⚠️ Breaking**

- **Telegram class → Wrappergram, middleware chain** — The hardcoded pipeline is now a middleware chain. @gramio/files is no longer a hard dependency — opt in via @gramio/files/middleware (and @gramio/format/middleware).
  ```ts
  // Before
  import { Telegram } from "wrappergram";
  const tg = new Telegram(token);
  // After
  import { Wrappergram, TelegramError } from "wrappergram";
  import { filesMiddleware } from "@gramio/files/middleware";
  const tg = new Wrappergram({ token, middlewares: [filesMiddleware] });
  
  const result = await tg.sendMessage({ chat_id, text }, { suppress: true });
  if (result instanceof TelegramError) console.error(result.code, result.payload);
  ```

**✨ New**

- **Single Middleware type, TelegramError, suppress** — Middleware (ctx, next) =&gt; unknown, first-class TelegramError (method/code/payload + real stack), suppress: true (return TelegramError | Result instead of throwing), per-request fetch options.

## `@gramio/callback-data` {#pkg-gramio-callback-data}

### 0.0.11 → 0.1.0 · [changelog](/changelogs/2026-02-23) {#gramio-callback-data-0-0-11-0-1-0}

**✨ New**

- **safeUnpack()** — Never throws on stale buttons; returns a typed discriminated union (SafeUnpackResult&lt;T&gt;). Use it only outside bot.callbackQuery(schema, …) (that path already unpacks into ctx.queryData).
  ```ts
  const result = data.safeUnpack(ctx.data ?? "");
  if (!result.success) return ctx.answerCallbackQuery({ text: "This button is outdated!" });
  ```
- **Optional fields are backward-compatible** — Adding optional fields to the end of a schema is now a safe migration — old packed strings unpack with the new fields as undefined. Adding required fields, reordering, or renaming nameId are still breaking.

## `@gramio/contexts` {#pkg-gramio-contexts}

### 0.6.1 → 0.7.0 · [changelog](/changelogs/2026-05-31) {#gramio-contexts-0-6-1-0-7-0}

**✨ New**

- **Bot API 10 getters &amp; mixins** — Message.livePhoto + sendLivePhoto; guest messages (Message.guestQueryId / guestBotCallerUser / guestBotCallerChat, MessageContext.answerGuestQuery(), User.supportsGuestQueries()); deleteReaction / deleteAllReactions, canReactToMessages; managed bot access settings.

### 0.5.x → 0.6.1 · [changelog](/changelogs/2026-05-08) {#gramio-contexts-0-5-x-0-6-1}

**✨ New**

- **Bot API 9.6 — managed bots &amp; polls** — managed_bot / managed_bot_created contexts, ManagedBotCreated/Updated, User.canManageBots(), getManagedBotToken()/replaceManagedBotToken(); poll getters (Poll.allowsRevoting/description, PollOption.persistentId/addedByUser, PollAnswer.optionPersistentIds).

**🐛 Fixes**

- **0.5.1: AnyBot narrowing** — ctx.isPM()/isGroup()/isChannel() no longer collapse to never through AnyBot (contributed by @ttempaa).

### 0.4.0 → 0.5.0 · [changelog](/changelogs/2026-03-02) {#gramio-contexts-0-4-0-0-5-0}

**✨ New**

- **Bot API 9.5 getters** — date_time entity getters on MessageEntity (unixTime, dateTimeFormat); ctx.setMemberTag() shorthand; member-tag fields.

### 0.3.1 → 0.4.0 · [changelog](/changelogs/2026-02-15) {#gramio-contexts-0-3-1-0-4-0}

**✨ New**

- **ctx.streamMessage(chunks)** — Live-typing drafts via sendMessageDraft, auto-finalizing at 4096 chars, AbortSignal-cancellable. Accepts Iterable/AsyncIterable&lt;MessageDraftPiece&gt;.
  ```ts
  bot.command("stream", async (ctx) => {
      await ctx.streamMessage(generateTextChunks());
  });
  ```
- **8 new contexts (Bot API 9.2–9.4)** — SuggestedPost*Context, GiftUpgradeSentContext, ChatOwnerLeftContext, ChatOwnerChangedContext, VideoAttachment.qualities, User.allowsUsersToCreateTopics().

### → 0.3.1 · [changelog](/changelogs/2026-02-08) {#gramio-contexts-init-0-3-1}

**✨ New**

- **ctx.chatId on callback-query context** — No more ctx.message?.chat?.id digging. Contributed by @n08i40k.
- **UniqueGiftInfo TON support** — lastResaleCurrency ("XTR" | "TON") + lastResaleAmount; lastResaleStarCount returns a value only when currency is "XTR".

## `@gramio/format` {#pkg-gramio-format}

### 0.7.0 → 0.8.0 · [changelog](/changelogs/2026-05-31) {#gramio-format-0-7-0-0-8-0}

**✨ New**

- **Regenerated for Bot API 10** — Mutators for sendLivePhoto, answerGuestQuery, explanation_media, and per-option poll media.

**🔧 Peer/dep bumps (move together)**

- @gramio/types ^10

### 0.5.0 → 0.7.0 · [changelog](/changelogs/2026-05-08) {#gramio-format-0-5-0-0-7-0}

**✨ New**

- **formatMiddleware** — @gramio/format/middleware exports formatMiddleware for the wrappergram v2 chain (decomposes FormattableString into text+entities before each API call).

**🐛 Fixes**

- **Markdown block separators preserved** — Adjacent blocks (paragraph+list, +blockquote, +code, heading+anything) no longer glue together. Important for LLM-generated content.

### 0.4.0 → 0.5.0 · [changelog](/changelogs/2026-03-02) {#gramio-format-0-4-0-0-5-0}

**✨ New**

- **htmlToFormattable()** — From @gramio/format/html (peer node-html-parser) — convert HTML to Telegram entities without parse_mode, degrading gracefully to plain text.
  ```ts
  import { htmlToFormattable } from "@gramio/format/html";
  ctx.send(htmlToFormattable("<b>Bold</b> and <i>italic</i>"));
  ```
- **join() array overload** — join(items, "\n") instead of join(items, (x) =&gt; x, "\n"). Still never use native Array.join() on Formattables (it drops entity offsets).

## `@gramio/keyboards` {#pkg-gramio-keyboards}

### 1.3.x → 1.4.0 · [changelog](/changelogs/2026-05-08) {#gramio-keyboards-1-3-x-1-4-0}

**✨ New**

- **requestManagedBot button** — Bot API 9.6 button for picking a managed bot from a Telegram dialog.

### → 1.3.0 · [changelog](/changelogs/2026-02-15) {#gramio-keyboards-init-1-3-0}

**✨ New**

- **Button styling** — All button methods accept an options arg: style ("danger" | "primary" | "success") and icon_custom_emoji_id. Works on InlineKeyboard and Keyboard.
  ```ts
  new InlineKeyboard()
      .text("Delete", "delete", { style: "danger" })
      .text("Confirm", "confirm", { style: "success" });
  ```

## `@gramio/storage` {#pkg-gramio-storage}

### 1.x → 2.0.0 · [changelog](/changelogs/2026-02-08) {#gramio-storage-1-x-2-0-0}

**⚠️ Breaking**

- **Storage&lt;Data&gt; now constrains keys to keyof Data** — Value types are inferred from the key. storage.get&lt;SomeType&gt;("key") no longer overrides the return type — define your key→value map as the Data type parameter on the constructor instead.
  ```ts
  // Before
  const v = await storage.get<User>("user:1");
  // After
  type Data = Record<`user:${number}`, { name: string; age: number }>;
  const storage = inMemoryStorage<Data>();
  const user = await storage.get("user:1"); // ✅ { name; age } | undefined
  ```

**🐛 Fixes**

- **inMemoryStorage&lt;Data&gt;() generic flows through** — No more implicit any from a dropped generic.

## `@gramio/storage-redis` {#pkg-gramio-storage-redis}

### → ioredis peer dependency · [changelog](/changelogs/2026-02-08) {#gramio-storage-redis-init-ioredis-peer-dependency}

**⚠️ Breaking**

- **ioredis is now a peer dependency (install step)** — ioredis is no longer bundled — install it yourself. Later Bun's native RedisClient is auto-selected and the ioredis peer became optional; explicit sub-paths /ioredis and /bun were added.
  ```ts
  npm install @gramio/storage-redis ioredis
  ```

## `@gramio/storage-sqlite` {#pkg-gramio-storage-sqlite}

### → 1.0.0 · [changelog](/changelogs/2026-02-15) {#gramio-storage-sqlite-init-1-0-0}

**✨ New**

- **Node.js support (dual runtime)** — 1.0.0 adds node:sqlite (DatabaseSync) alongside Bun's bun:sqlite; the right impl is auto-selected — no code change. (Adapter first landed Bun-only.)

## `gramio` {#pkg-gramio}

### 0.9.0 → 0.10.0 · [changelog](/changelogs/2026-05-31) {#gramio-0-9-0-0-10-0}

> No call-site break — the change is the Bot API 10 dependency line; bump the peers below together.

**✨ New**

- **bot.guestQuery(trigger?, handler)** — Handle the new Bot API 10 guest_message update. Reply with ctx.answerGuestQuery(result) (a single InlineQueryResult), not ctx.send/reply.
  ```ts
  import { InlineQueryResult, InputMessageContent } from "gramio";
  
  bot.guestQuery(/^help/i, (ctx) =>
      ctx.answerGuestQuery(
          InlineQueryResult.article("help", "Help", InputMessageContent.text("How can I help?")),
      ),
  );
  ```
- **bot.chosenInlineResult(callbackData, handler)** — Pass a CallbackData schema to filter on result_id and get a typed ctx.queryData (mirrors callbackQuery(schema, …)).
  ```ts
  import { CallbackData } from "gramio";
  
  const card = new CallbackData("card").number("id");
  bot.chosenInlineResult(card, (ctx) => {
      ctx.queryData.id; // ✅ typed as number
  });
  ```
- **No-trigger bot.inlineQuery(handler) overload** — Matches any inline query — handy for the auth-redirect 'answer with empty results + login button' pattern.
- **Plugin-author helpers re-exported from gramio** — WithDerives, WithEventDerive, WithDecorate, WithExtend, DeriveHandler are now exported from gramio directly.

**🐛 Fixes**

- **No lost updates when stopping mid-batch** — bot.stop() landing mid-getUpdates no longer advances the offset on a dropped batch — Telegram re-delivers it.
- **Typed bots assignable to webhookHandler** — Bots with derives/plugins/macros no longer need `as any` to pass to webhookHandler.

**🔧 Peer/dep bumps (move together)**

- @gramio/types ^10, @gramio/contexts ^0.7, @gramio/files ^0.5, @gramio/format ^0.8, @gramio/test ^0.7

### 0.7.0 → 0.9.0 · [changelog](/changelogs/2026-05-08) {#gramio-0-7-0-0-9-0}

> Nothing required — existing bot.command(name, handler) and all handlers keep working. The below is opt-in or backward-compatible.

**✨ New**

- **bot.command(name, meta, handler) + bot.syncCommands()** — Optional CommandMeta (description, locales, scopes, hide) between name and handler; syncCommands() flushes the Telegram menu (hash-cached, skips unchanged scopes).
  ```ts
  const bot = new Bot(process.env.BOT_TOKEN!)
      .command("help", { description: "Show help", locales: { ru: "Помощь" } }, helpHandler)
      .command("debug", { hide: true }, debugHandler);
  
  bot.onStart(() => bot.syncCommands());
  ```
- **Plugin shorthand methods** — command, callbackQuery, hears, reaction, inlineQuery, chosenInlineResult, startParameter now work directly on a Plugin; Plugin.extend(plugin) propagates middleware/hooks/decorators/errors.
- **AllowedUpdatesFilter — auto allowed_updates** — allowed_updates is auto-derived from registered handlers, so chat_member / message_reaction / message_reaction_count stop getting silently dropped. Strict mode via bot.start({ allowedUpdates: "strict" }).
  ```ts
  await bot.start({
      allowedUpdates: AllowedUpdatesFilter.default.add("chat_member").except("poll"),
  });
  ```
- **onStart / onStop receive the bot instance** — bot.onStart(({ bot, info }) =&gt; …) — call bot.api.* during startup/shutdown without a closure.

**🐛 Fixes**

- **ctx.isPM()/isGroup()/isChannel() no longer narrow to never** — Fixed on AnyBot handlers (contexts 0.5.1, pulled in from 0.8.3+).

**🔧 Peer/dep bumps (move together)**

- @gramio/types 9.6.1, @gramio/contexts 0.6.1, @gramio/files 0.4.0, @gramio/format 0.7.0, @gramio/keyboards 1.4.0, @gramio/composer 0.4.1, @gramio/test 0.7.0

### 0.5.0 → 0.7.0 · [changelog](/changelogs/2026-03-02) {#gramio-0-5-0-0-7-0}

**✨ New**

- **Bot API 9.5 support** — setChatMemberTag / ctx.setMemberTag(), member-tag fields on ChatMember, can_manage_tags admin right, date_time message entities.

**🔧 Peer/dep bumps (move together)**

- @gramio/types 9.5.0, @gramio/contexts 0.5.0, @gramio/keyboards 1.3.1

### 0.4.x → 0.5.0 · [changelog](/changelogs/2026-02-17) {#gramio-0-4-x-0-5-0}

**⚠️ Breaking**

- **middleware-io engine removed (mostly internal)** — gramio now builds on @gramio/composer. If you imported internals (src/queue.ts / UpdateQueue), they're gone (UpdateQueue → EventQueue from @gramio/composer). Public Bot API is unchanged.

**✨ New**

- **Shorthand methods moved into Composer** — reaction, callbackQuery, chosenInlineResult, inlineQuery, hears, command, startParameter usable on plugins and standalone composers.
- **Bot.extend(composer) / Plugin.extend(composer)** — Accept EventComposer instances (promoted to scoped — shared context without duplicate middleware), plus the new decorate()/when()/inspect()/trace() surface.

**🔧 Peer/dep bumps (move together)**

- @gramio/types 9.4.1, @gramio/composer 0.2.0

## `@gramio/auto-answer-callback-query` {#pkg-gramio-auto-answer-callback-query}

### → 0.0.3 · [changelog](/changelogs/2026-05-08) {#gramio-auto-answer-callback-query-init-0-0-3}

**🐛 Fixes**

- **Answers even when the handler throws** — The middleware now wraps the handler in try/finally, so answerCallbackQuery always runs — no more stuck spinner.

## `@gramio/i18n` {#pkg-gramio-i18n}

### → 1.5 · [changelog](/changelogs/2026-05-08) {#gramio-i18n-init-1-5}

**✨ New**

- **localesFor()** — i18n.localesFor(key) returns Record&lt;string, string&gt; of non-primary translations — drops straight into CommandMeta.locales for bot.syncCommands().
  ```ts
  bot.command("help", { description: i18n.t("en", "cmd.help"), locales: i18n.localesFor("cmd.help") }, helpHandler);
  ```

## `@gramio/jsx` {#pkg-gramio-jsx}

### → date-time element · [changelog](/changelogs/2026-05-08) {#gramio-jsx-init-date-time-element}

**✨ New**

- **&lt;date-time&gt; element** — &lt;date-time unixTime={…} format="D" /&gt; backed by the dateTime entity (@gramio/format 0.5+). Formats: r w d D t T wDT Dt, etc.

## `@gramio/onboarding` {#pkg-gramio-onboarding}

### 0.1.0 → 0.2.0 · [changelog](/changelogs/2026-05-31) {#gramio-onboarding-0-1-0-0-2-0}

**✨ New**

- **Typed build() (type-level only)** — createOnboarding({ id }).….build() threads the flow Id, so bot.extend(...) widens ctx.onboarding.&lt;id&gt; automatically — no augmentation or cast. No runtime change.
  ```ts
  bot.command("start", (ctx) => {
      ctx.onboarding.welcome.start(); // ✅ typed, no augmentation
      return ctx.send("Let's go!");
  });
  ```

### → 0.1.0 · [changelog](/changelogs/2026-05-08) {#gramio-onboarding-init-0-1-0}

**✨ New**

- **New official plugin** — Declarative tutorials with multi-flow concurrency (queue/preempt/parallel), a refusal ladder (next → skip → exit → dismiss → disableAll), scope-aware rendering (renderIn), fire-and-forget ctx.onboarding.*, pluggable @gramio/storage, optional @gramio/views integration.

## `@gramio/opentelemetry` {#pkg-gramio-opentelemetry}

### → new plugin · [changelog](/changelogs/2026-02-15) {#gramio-opentelemetry-init-new-plugin}

**✨ New**

- **OpenTelemetry plugin** — opentelemetryPlugin({ recordApiParams }); every update is a root span, every API call a child span. Utilities record(), getCurrentSpan(), setAttributes().

## `@gramio/rate-limit` {#pkg-gramio-rate-limit}

### → 0.0.1 · [changelog](/changelogs/2026-03-02) {#gramio-rate-limit-init-0-0-1}

**⚠️ Breaking**

- **Export &amp; package renamed** — The plugin export is rateLimit (briefly rateLimitPlugin in the same release — the old name is gone). The npm package was renamed rate-limiter → rate-limit.

**✨ New**

- **Macro-based per-handler throttling** — Sliding-window rate limiting via the macro system — no imperative if (!await ctx.rateLimit()) return. In-memory by default; swap in Redis/SQLite/Cloudflare via storage.
  ```ts
  import { rateLimit } from "@gramio/rate-limit";
  const bot = new Bot(token).extend(rateLimit({ onLimitExceeded: (ctx) => ctx.is("message") && ctx.reply("Slow down!") }));
  bot.command("pay", payHandler, { rateLimit: { limit: 3, window: 60 } });
  ```

## `@gramio/scenes` {#pkg-gramio-scenes}

### 0.6.0 → 0.7.1 · [changelog](/changelogs/2026-05-31) {#gramio-scenes-0-6-0-0-7-1}

**⚠️ Breaking**

- **Scene now extends EventComposer** — The full bot-level DSL (.use/.on/.derive/.guard/.command/.callbackQuery/.hears/…) is available on every scene. The classic event-filter step form still works alongside builder steps.

**✨ New**

- **Builder steps** — Each step is its own sub-composer with .enter / .exit / .fallback / .message plus the full event surface. State auto-inferred from ctx.scene.update({...}) — no .state&lt;T&gt;() needed.
  ```ts
  import { Scene } from "@gramio/scenes";
  
  const checkout = new Scene("checkout")
      .step("ask-name", (c) =>
          c.message("What's your name?").on("message", (ctx) => ctx.scene.update({ name: ctx.text })),
      )
      .step("confirm", (c) =>
          c.enter((ctx) => ctx.send(`${ctx.scene.state.name}, confirm? (yes/no)`)).hears("yes", (ctx) => ctx.scene.exit()),
      );
  ```
- **Reusable step modules + onExit** — scene.extend(otherScene) pulls in a nameless Scene of steps (collisions throw, numeric steps renumber). New onExit hook fires before storage teardown; scene-level .derive() is visible inside onEnter.

**🐛 Fixes**

- **Upgrade straight to 0.7.1** — 0.7.0 could run an onEnter-consumed .derive() twice on entry. 0.7.1 restores exactly-once-per-update. If your derive has side effects (counters, spans, DB writes), do not stop at 0.7.0.

### 0.4.0 → 0.6.0 · [changelog](/changelogs/2026-05-08) {#gramio-scenes-0-4-0-0-6-0}

**⚠️ Breaking**

- **Passthrough is now the default (behavior change)** — Updates that don't match the current step propagate to outer handlers, so a global /cancel or /help fires mid-scene; the scene keeps its firstTime state. Restore the old greedy behavior with passthrough: false.
  ```ts
  // Before
  // before: non-matching updates were silently swallowed inside a scene
  // After
  const bot = new Bot(token)
      .extend(scenes([signupScene])) // passthrough: true by default
      .command("cancel", (ctx) => ctx.scene?.exit()); // now actually fires
  ```

**✨ New**

- **Sub-scenes &amp; typed enter params** — ctx.scene.enterSub(other, params) / exitSub(data) with a persisted stack and typed .exitData&lt;T&gt;(); scene.reenter(params); scene.enter() type-checks its params tuple.

### → 0.4.x · [changelog](/changelogs/2026-03-02) {#gramio-scenes-init-0-4-x}

**✨ New**

- **EventComposer extend + onInvalidInput** — scene.extend() accepts EventComposer instances; bot-level plugins extended before scenes aren't re-applied inside scene chains; ask() gained an onInvalidInput option.

**🔧 Peer/dep bumps (move together)**

- gramio &gt;= 0.5.0, @gramio/storage ^2.0.0

### → onEnter · [changelog](/changelogs/2026-02-08) {#gramio-scenes-init-onenter}

**✨ New**

- **scene.onEnter(handler)** — Run logic once when a scene is entered (awaited before the scene proceeds).

## `@gramio/sentry` {#pkg-gramio-sentry}

### → new plugin · [changelog](/changelogs/2026-02-15) {#gramio-sentry-init-new-plugin}

**✨ New**

- **Sentry plugin** — sentryPlugin({ setUser, breadcrumbs, tracing }) with ctx.sentry.captureMessage()/setTag(). Uses @sentry/core (Bun + Node). Rides on the gramio onApiCall hook.

## `@gramio/session` {#pkg-gramio-session}

### → 0.2.0 · [changelog](/changelogs/2026-02-17) {#gramio-session-init-0-2-0}

**✨ New**

- **Lazy sessions** — session({ storage, lazy: true }) defers the storage get until the first ctx.session read — cuts DB reads 50–90% for handlers that don't touch session. Write-back unchanged.

## `@gramio/views` {#pkg-gramio-views}

### 0.1.1 → 0.2.0 · [changelog](/changelogs/2026-05-08) {#gramio-views-0-1-1-0-2-0}

**✨ New**

- **Lazy globals via thunk** — buildRender accepts Globals | (() =&gt; Globals); a thunk runs per render so views see fresh session/scene/locale/onboarding state. The adapter factory re-runs per render too.

### 0.0.x → 0.1.1 · [changelog](/changelogs/2026-03-02) {#gramio-views-0-0-x-0-1-1}

**✨ New**

- **sticker / voice / video_note media** — Each with its own edit behavior (sticker/video_note are keyboard-only edits). Render methods return typed results instead of void.

### → new package · [changelog](/changelogs/2026-02-15) {#gramio-views-init-new-package}

**✨ New**

- **Reusable message-view system** — Automatic send/edit detection: programmatic adapters (defineAdapter), JSON-driven views (createJsonAdapter, {{key}} interpolation), filesystem loading (loadJsonViewsDir), and i18n support.

## `@gramio/test` {#pkg-gramio-test}

### 0.3.0 → 0.7.0 · [changelog](/changelogs/2026-05-08) {#gramio-test-0-3-0-0-7-0}

**✨ New**

- **lastBotMessage() bubble, payments, typed ApiCall** — env.lastBotMessage() auto-tracks edits (options { withReplyMarkup }, { where }); Telegram Payments (sendPreCheckoutQuery/sendShippingQuery/sendSuccessfulPayment); type-safe ApiCall&lt;Method&gt;, lastApiCall(m), filterApiCalls(m).

### 0.1.0 → 0.3.0 · [changelog](/changelogs/2026-02-23) {#gramio-test-0-1-0-0-3-0}

**✨ New**

- **9 new methods** — user.editMessage(), forwardMessage(), sendMediaGroup(), pinMessage(), on(msg).clickByText(), sendAudio()/sendAnimation()/sendVideoNote(), ChatObject.post(), env.clearApiCalls()/lastApiCall().

### 0.0.x → 0.1.0 · [changelog](/changelogs/2026-02-17) {#gramio-test-0-0-x-0-1-0}

**✨ New**

- **Reactions, inline mode, fluent scopes** — user.react()/ReactObject (auto old_reaction), sendInlineQuery()/chooseInlineResult(), and user.in(chat).on(msg).react(). Also env.onApi()/offApi() mocking + apiError().

## `create-gramio` {#pkg-create-gramio}

### → 2.x · [changelog](/changelogs/2026-03-02) {#create-gramio-init-2-x}

> Affects new scaffolds, not existing projects.

**✨ New**

- **Scaffold features** — Generates CLAUDE.md; optional GramIO AI Skills install; @gramio/broadcast plugin choice; full CLI args + presets (minimal/recommended/full); scoped-composer + scene step-inheritance layout (2.2.0).

<!-- END GENERATED:migrations -->
