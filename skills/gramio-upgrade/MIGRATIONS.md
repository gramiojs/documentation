<!-- AUTO-GENERATED from public/migrations.json — do not edit by hand. Run `bun run build:migrations`. -->

# GramIO Migration Ledger

> **Source of truth:** `public/migrations.json`. This file is generated from it.
>
> **Upgrade-focused view.** Per package, newest version first. Each `### x → y` entry shows:
>
> - **⚠️ Breaking** — you MUST change this for the upgrade to keep working (with before/after).
> - **🗑 Deprecated** — you SHOULD change this; the old way still works for now.
> - **🔧 Peer/dep bumps** — versions that must move together (peer-dependency ranges).
> - **⏭ / ⚠️ notes** — skip a known-bad release, or a version not yet on npm.
> - **✨ New** — features the version unlocks (titles only). **Not required** to bump, but after upgrading,
>   look these over and proactively tell the user which ones could help their project (offer to wire them up).
>   Pull the actual code from the linked **changelog** / `/guides/upgrading` when they say yes.
>
> A hop with nothing to do is marked _“nothing to do”_; a feature-only hop is marked _“✅ safe bump”_.
> 🐛 bug-fix notes live in the changelog, not here.
>
> Packages are ordered by dependency layer (types/composer → contexts/files/format → gramio → plugins → tooling),
> which is also the order you should bump them.

---

## `@gramio/composer`

### 0.3.3 → 0.4.1 · [changelog](/changelogs/2026-05-08)

**🗑 Deprecated**

- **commandsMeta is now unknown-valued** — The Telegram-specific shape moved into gramio core. Only matters if you read commandsMeta directly.

**✨ New** — optional — suggest the ones that fit the project

- **registeredEvents() & EventContextOf<T, E>** — registeredEvents() returns the wired-up event names (powers gramio 0.9 auto allowed_updates); EventContextOf extracts global + per-event derives for custom methods.

### 0.2.0 → 0.3.3 · [changelog](/changelogs/2026-03-02)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **EventContextOf / ContextOf / defineComposerMethods + macro system** — Type-safe custom methods that see accumulated derives, plus an Elysia-inspired macro system for declarative per-handler options.

### 0.1.x → 0.2.0 · [changelog](/changelogs/2026-02-17)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **decorate() / when() / inspect() / trace()** — decorate() (zero-overhead static context), when() (build-time conditional middleware — props typed Partial), inspect() (read-only metadata), trace() (opt-in instrumentation). createComposer({ methods }) injects typed shorthands. MaybeArray<T> widened to T | readonly T[].

## `@gramio/schema-parser`

### 1.0.1 → 1.1.0 · [changelog](/changelogs/2026-05-08)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **Shared-sibling FormattableString detection** — Promotes the lone unmarked string field to semanticType: "formattable" when an object has bare parse_mode + bare entities (e.g. InputTextMessageContent).

### → 1.0.1 · [changelog](/changelogs/2026-02-23)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **New internal schema engine** — Native TypeScript parser of the Telegram Bot API docs that powers @gramio/types (replaces the Rust tg-bot-api crate). Semantic type markers, InputFile | string detection, synthesized Currencies enum with XTR, oneOf unions.

## `@gramio/types`

### 9.6.x → 10.0.0 · [changelog](/changelogs/2026-05-31)

**⚠️ Breaking**

- **Regenerated for Bot API 10.0** — Live photos, guest messages, poll/option media, react-permissions, bot access settings. correctOptionId is now correctOptionIds (array) — update any code reading the singular field.

**✨ New** — optional — suggest the ones that fit the project

- **New structures** — LivePhotoAttachment, BotAccessSettings, SentGuestMessage, poll media / explanationMedia / membersOnly / countryCodes, sendLivePhoto + per-option sendPoll media.

### 9.5.0 → 9.6.1 · [changelog](/changelogs/2026-05-08)

> ⏭ Don't stop on an in-between version — upgrade straight to **9.6.1**.

**⚠️ Breaking**

- **Bot API 9.6** — correctOptionId → correctOptionIds (array) first appears here; managed-bot + poll structures added.

### 9.4.2 → 9.5.0 · [changelog](/changelogs/2026-03-02)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **Bot API 9.5 types** — Member tags, date_time entity, can_manage_tags.

### 9.4.1 → 9.4.2 · [changelog](/changelogs/2026-02-23)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **Migrated to @gramio/schema-parser** — Generator moved off the Rust tg-bot-api crate. Precise InputFile | string unions, semantic-typed formattable fields, a Currencies enum (incl. XTR), and the previously-missing APIResponse / APIResponseOk / APIResponseError types.

### 9.3.0 → 9.4.0 · [changelog](/changelogs/2026-02-15)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **Bot API 9.2–9.4 types** — VideoQuality, UserProfileAudios, ChatOwnerLeft, ChatOwnerChanged, UniqueGiftModelRarity, button-styling types, and methods getUserProfileAudios / setMyProfilePhoto / removeMyProfilePhoto.

## `wrappergram`

### v1 → v2 · [changelog](/changelogs/2026-05-08)

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

**✨ New** — optional — suggest the ones that fit the project

- **Single Middleware type, TelegramError, suppress** — Middleware (ctx, next) => unknown, first-class TelegramError (method/code/payload + real stack), suppress: true (return TelegramError | Result instead of throwing), per-request fetch options.

## `@gramio/callback-data`

### 0.0.11 → 0.1.0 · [changelog](/changelogs/2026-02-23)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **safeUnpack()** — Never throws on stale buttons; returns a typed discriminated union (SafeUnpackResult<T>). Use it only outside bot.callbackQuery(schema, …) (that path already unpacks into ctx.queryData).
- **Optional fields are backward-compatible** — Adding optional fields to the end of a schema is now a safe migration — old packed strings unpack with the new fields as undefined. Adding required fields, reordering, or renaming nameId are still breaking.

## `@gramio/contexts`

### 0.6.1 → 0.7.0 · [changelog](/changelogs/2026-05-31)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **Bot API 10 getters & mixins** — Message.livePhoto + sendLivePhoto; guest messages (Message.guestQueryId / guestBotCallerUser / guestBotCallerChat, MessageContext.answerGuestQuery(), User.supportsGuestQueries()); deleteReaction / deleteAllReactions, canReactToMessages; managed bot access settings.

### 0.5.x → 0.6.1 · [changelog](/changelogs/2026-05-08)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **Bot API 9.6 — managed bots & polls** — managed_bot / managed_bot_created contexts, ManagedBotCreated/Updated, User.canManageBots(), getManagedBotToken()/replaceManagedBotToken(); poll getters (Poll.allowsRevoting/description, PollOption.persistentId/addedByUser, PollAnswer.optionPersistentIds).

### 0.4.0 → 0.5.0 · [changelog](/changelogs/2026-03-02)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **Bot API 9.5 getters** — date_time entity getters on MessageEntity (unixTime, dateTimeFormat); ctx.setMemberTag() shorthand; member-tag fields.

### 0.3.1 → 0.4.0 · [changelog](/changelogs/2026-02-15)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **ctx.streamMessage(chunks)** — Live-typing drafts via sendMessageDraft, auto-finalizing at 4096 chars, AbortSignal-cancellable. Accepts Iterable/AsyncIterable<MessageDraftPiece>.
- **8 new contexts (Bot API 9.2–9.4)** — SuggestedPost*Context, GiftUpgradeSentContext, ChatOwnerLeftContext, ChatOwnerChangedContext, VideoAttachment.qualities, User.allowsUsersToCreateTopics().

### → 0.3.1 · [changelog](/changelogs/2026-02-08)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **ctx.chatId on callback-query context** — No more ctx.message?.chat?.id digging. Contributed by @n08i40k.
- **UniqueGiftInfo TON support** — lastResaleCurrency ("XTR" | "TON") + lastResaleAmount; lastResaleStarCount returns a value only when currency is "XTR".

## `@gramio/format`

### 0.7.0 → 0.8.0 · [changelog](/changelogs/2026-05-31)

**🔧 Peer/dep bumps (move together)**

- @gramio/types ^10

**✨ New** — optional — suggest the ones that fit the project

- **Regenerated for Bot API 10** — Mutators for sendLivePhoto, answerGuestQuery, explanation_media, and per-option poll media.

### 0.5.0 → 0.7.0 · [changelog](/changelogs/2026-05-08)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **formatMiddleware** — @gramio/format/middleware exports formatMiddleware for the wrappergram v2 chain (decomposes FormattableString into text+entities before each API call).

### 0.4.0 → 0.5.0 · [changelog](/changelogs/2026-03-02)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **htmlToFormattable()** — From @gramio/format/html (peer node-html-parser) — convert HTML to Telegram entities without parse_mode, degrading gracefully to plain text.
- **join() array overload** — join(items, "\n") instead of join(items, (x) => x, "\n"). Still never use native Array.join() on Formattables (it drops entity offsets).

## `@gramio/keyboards`

### 1.3.x → 1.4.0 · [changelog](/changelogs/2026-05-08)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **requestManagedBot button** — Bot API 9.6 button for picking a managed bot from a Telegram dialog.

### → 1.3.0 · [changelog](/changelogs/2026-02-15)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **Button styling** — All button methods accept an options arg: style ("danger" | "primary" | "success") and icon_custom_emoji_id. Works on InlineKeyboard and Keyboard.

## `@gramio/storage`

### 1.x → 2.0.0 · [changelog](/changelogs/2026-02-08)

**⚠️ Breaking**

- **Storage<Data> now constrains keys to keyof Data** — Value types are inferred from the key. storage.get<SomeType>("key") no longer overrides the return type — define your key→value map as the Data type parameter on the constructor instead.
  ```ts
  // Before
  const v = await storage.get<User>("user:1");
  // After
  type Data = Record<`user:${number}`, { name: string; age: number }>;
  const storage = inMemoryStorage<Data>();
  const user = await storage.get("user:1"); // ✅ { name; age } | undefined
  ```

## `@gramio/storage-redis`

### → ioredis peer dependency · [changelog](/changelogs/2026-02-08)

**⚠️ Breaking**

- **ioredis is now a peer dependency (install step)** — ioredis is no longer bundled — install it yourself. Later Bun's native RedisClient is auto-selected and the ioredis peer became optional; explicit sub-paths /ioredis and /bun were added.
  ```ts
  npm install @gramio/storage-redis ioredis
  ```

## `@gramio/storage-sqlite`

### → 1.0.0 · [changelog](/changelogs/2026-02-15)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **Node.js support (dual runtime)** — 1.0.0 adds node:sqlite (DatabaseSync) alongside Bun's bun:sqlite; the right impl is auto-selected — no code change. (Adapter first landed Bun-only.)

## `gramio`

### 0.9.0 → 0.10.0 · [changelog](/changelogs/2026-05-31)

> No call-site break — the change is the Bot API 10 dependency line; bump the peers below together.

**🔧 Peer/dep bumps (move together)**

- @gramio/types ^10, @gramio/contexts ^0.7, @gramio/files ^0.5, @gramio/format ^0.8, @gramio/test ^0.7

**✨ New** — optional — suggest the ones that fit the project

- **bot.guestQuery(trigger?, handler)** — Handle the new Bot API 10 guest_message update. Reply with ctx.answerGuestQuery(result) (a single InlineQueryResult), not ctx.send/reply.
- **bot.chosenInlineResult(callbackData, handler)** — Pass a CallbackData schema to filter on result_id and get a typed ctx.queryData (mirrors callbackQuery(schema, …)).
- **No-trigger bot.inlineQuery(handler) overload** — Matches any inline query — handy for the auth-redirect 'answer with empty results + login button' pattern.
- **Plugin-author helpers re-exported from gramio** — WithDerives, WithEventDerive, WithDecorate, WithExtend, DeriveHandler are now exported from gramio directly.

### 0.7.0 → 0.9.0 · [changelog](/changelogs/2026-05-08)

> Nothing required — existing bot.command(name, handler) and all handlers keep working. The below is opt-in or backward-compatible.

**🔧 Peer/dep bumps (move together)**

- @gramio/types 9.6.1, @gramio/contexts 0.6.1, @gramio/files 0.4.0, @gramio/format 0.7.0, @gramio/keyboards 1.4.0, @gramio/composer 0.4.1, @gramio/test 0.7.0

**✨ New** — optional — suggest the ones that fit the project

- **bot.command(name, meta, handler) + bot.syncCommands()** — Optional CommandMeta (description, locales, scopes, hide) between name and handler; syncCommands() flushes the Telegram menu (hash-cached, skips unchanged scopes).
- **Plugin shorthand methods** — command, callbackQuery, hears, reaction, inlineQuery, chosenInlineResult, startParameter now work directly on a Plugin; Plugin.extend(plugin) propagates middleware/hooks/decorators/errors.
- **AllowedUpdatesFilter — auto allowed_updates** — allowed_updates is auto-derived from registered handlers, so chat_member / message_reaction / message_reaction_count stop getting silently dropped. Strict mode via bot.start({ allowedUpdates: "strict" }).
- **onStart / onStop receive the bot instance** — bot.onStart(({ bot, info }) => …) — call bot.api.* during startup/shutdown without a closure.

### 0.5.0 → 0.7.0 · [changelog](/changelogs/2026-03-02)

**🔧 Peer/dep bumps (move together)**

- @gramio/types 9.5.0, @gramio/contexts 0.5.0, @gramio/keyboards 1.3.1

**✨ New** — optional — suggest the ones that fit the project

- **Bot API 9.5 support** — setChatMemberTag / ctx.setMemberTag(), member-tag fields on ChatMember, can_manage_tags admin right, date_time message entities.

### 0.4.x → 0.5.0 · [changelog](/changelogs/2026-02-17)

**⚠️ Breaking**

- **middleware-io engine removed (mostly internal)** — gramio now builds on @gramio/composer. If you imported internals (src/queue.ts / UpdateQueue), they're gone (UpdateQueue → EventQueue from @gramio/composer). Public Bot API is unchanged.

**🔧 Peer/dep bumps (move together)**

- @gramio/types 9.4.1, @gramio/composer 0.2.0

**✨ New** — optional — suggest the ones that fit the project

- **Shorthand methods moved into Composer** — reaction, callbackQuery, chosenInlineResult, inlineQuery, hears, command, startParameter usable on plugins and standalone composers.
- **Bot.extend(composer) / Plugin.extend(composer)** — Accept EventComposer instances (promoted to scoped — shared context without duplicate middleware), plus the new decorate()/when()/inspect()/trace() surface.

## `@gramio/auto-answer-callback-query`

### → 0.0.3 · [changelog](/changelogs/2026-05-08)

_Nothing to do — no required changes for this hop._

## `@gramio/i18n`

### → 1.5 · [changelog](/changelogs/2026-05-08)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **localesFor()** — i18n.localesFor(key) returns Record<string, string> of non-primary translations — drops straight into CommandMeta.locales for bot.syncCommands().

## `@gramio/jsx`

### → date-time element · [changelog](/changelogs/2026-05-08)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **<date-time> element** — <date-time unixTime={…} format="D" /> backed by the dateTime entity (@gramio/format 0.5+). Formats: r w d D t T wDT Dt, etc.

## `@gramio/onboarding`

### 0.1.0 → 0.2.0 · [changelog](/changelogs/2026-05-31)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **Typed build() (type-level only)** — createOnboarding({ id }).….build() threads the flow Id, so bot.extend(...) widens ctx.onboarding.<id> automatically — no augmentation or cast. No runtime change.

### → 0.1.0 · [changelog](/changelogs/2026-05-08)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **New official plugin** — Declarative tutorials with multi-flow concurrency (queue/preempt/parallel), a refusal ladder (next → skip → exit → dismiss → disableAll), scope-aware rendering (renderIn), fire-and-forget ctx.onboarding.*, pluggable @gramio/storage, optional @gramio/views integration.

## `@gramio/opentelemetry`

### → new plugin · [changelog](/changelogs/2026-02-15)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **OpenTelemetry plugin** — opentelemetryPlugin({ recordApiParams }); every update is a root span, every API call a child span. Utilities record(), getCurrentSpan(), setAttributes().

## `@gramio/rate-limit`

### → 0.0.1 · [changelog](/changelogs/2026-03-02)

**⚠️ Breaking**

- **Export & package renamed** — The plugin export is rateLimit (briefly rateLimitPlugin in the same release — the old name is gone). The npm package was renamed rate-limiter → rate-limit.

**✨ New** — optional — suggest the ones that fit the project

- **Macro-based per-handler throttling** — Sliding-window rate limiting via the macro system — no imperative if (!await ctx.rateLimit()) return. In-memory by default; swap in Redis/SQLite/Cloudflare via storage.

## `@gramio/scenes`

### 0.6.0 → 0.7.1 · [changelog](/changelogs/2026-05-31)

> ⏭ Don't stop on an in-between version — upgrade straight to **0.7.1**.

**⚠️ Breaking**

- **Scene now extends EventComposer** — The full bot-level DSL (.use/.on/.derive/.guard/.command/.callbackQuery/.hears/…) is available on every scene. The classic event-filter step form still works alongside builder steps.

**✨ New** — optional — suggest the ones that fit the project

- **Builder steps** — Each step is its own sub-composer with .enter / .exit / .fallback / .message plus the full event surface. State auto-inferred from ctx.scene.update({...}) — no .state<T>() needed.
- **Reusable step modules + onExit** — scene.extend(otherScene) pulls in a nameless Scene of steps (collisions throw, numeric steps renumber). New onExit hook fires before storage teardown; scene-level .derive() is visible inside onEnter.

### 0.4.0 → 0.6.0 · [changelog](/changelogs/2026-05-08)

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

**✨ New** — optional — suggest the ones that fit the project

- **Sub-scenes & typed enter params** — ctx.scene.enterSub(other, params) / exitSub(data) with a persisted stack and typed .exitData<T>(); scene.reenter(params); scene.enter() type-checks its params tuple.

### → 0.4.x · [changelog](/changelogs/2026-03-02)

**🔧 Peer/dep bumps (move together)**

- gramio >= 0.5.0, @gramio/storage ^2.0.0

**✨ New** — optional — suggest the ones that fit the project

- **EventComposer extend + onInvalidInput** — scene.extend() accepts EventComposer instances; bot-level plugins extended before scenes aren't re-applied inside scene chains; ask() gained an onInvalidInput option.

### → onEnter · [changelog](/changelogs/2026-02-08)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **scene.onEnter(handler)** — Run logic once when a scene is entered (awaited before the scene proceeds).

## `@gramio/sentry`

### → new plugin · [changelog](/changelogs/2026-02-15)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **Sentry plugin** — sentryPlugin({ setUser, breadcrumbs, tracing }) with ctx.sentry.captureMessage()/setTag(). Uses @sentry/core (Bun + Node). Rides on the gramio onApiCall hook.

## `@gramio/session`

### → 0.2.0 · [changelog](/changelogs/2026-02-17)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **Lazy sessions** — session({ storage, lazy: true }) defers the storage get until the first ctx.session read — cuts DB reads 50–90% for handlers that don't touch session. Write-back unchanged.

## `@gramio/views`

### 0.1.1 → 0.2.0 · [changelog](/changelogs/2026-05-08)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **Lazy globals via thunk** — buildRender accepts Globals | (() => Globals); a thunk runs per render so views see fresh session/scene/locale/onboarding state. The adapter factory re-runs per render too.

### 0.0.x → 0.1.1 · [changelog](/changelogs/2026-03-02)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **sticker / voice / video_note media** — Each with its own edit behavior (sticker/video_note are keyboard-only edits). Render methods return typed results instead of void.

### → new package · [changelog](/changelogs/2026-02-15)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **Reusable message-view system** — Automatic send/edit detection: programmatic adapters (defineAdapter), JSON-driven views (createJsonAdapter, {{key}} interpolation), filesystem loading (loadJsonViewsDir), and i18n support.

## `@gramio/test`

### 0.3.0 → 0.7.0 · [changelog](/changelogs/2026-05-08)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **lastBotMessage() bubble, payments, typed ApiCall** — env.lastBotMessage() auto-tracks edits (options { withReplyMarkup }, { where }); Telegram Payments (sendPreCheckoutQuery/sendShippingQuery/sendSuccessfulPayment); type-safe ApiCall<Method>, lastApiCall(m), filterApiCalls(m).

### 0.1.0 → 0.3.0 · [changelog](/changelogs/2026-02-23)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **9 new methods** — user.editMessage(), forwardMessage(), sendMediaGroup(), pinMessage(), on(msg).clickByText(), sendAudio()/sendAnimation()/sendVideoNote(), ChatObject.post(), env.clearApiCalls()/lastApiCall().

### 0.0.x → 0.1.0 · [changelog](/changelogs/2026-02-17)

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **Reactions, inline mode, fluent scopes** — user.react()/ReactObject (auto old_reaction), sendInlineQuery()/chooseInlineResult(), and user.in(chat).on(msg).react(). Also env.onApi()/offApi() mocking + apiError().

## `create-gramio`

### → 2.x · [changelog](/changelogs/2026-03-02)

> Affects new scaffolds, not existing projects.

✅ Safe bump — no required code changes.

**✨ New** — optional — suggest the ones that fit the project

- **Scaffold features** — Generates CLAUDE.md; optional GramIO AI Skills install; @gramio/broadcast plugin choice; full CLI args + presets (minimal/recommended/full); scoped-composer + scene step-inheritance layout (2.2.0).
