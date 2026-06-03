---
name: gramio-upgrade
description: Upgrade an existing GramIO project to newer gramio / @gramio/* versions. Detects the installed versions, looks up the breaking changes, deprecations, and new features between current and target in MIGRATIONS.md, presents an ordered migration plan with before/after code, applies the edits, verifies, and then proactively suggests the new features the upgrade unlocks that could help the project. Use whenever the user says "upgrade gramio", "update gramio to latest", "обнови грамио до последней", "what breaks if I update gramio", "migrate to gramio 0.10", "почему перестало работать после обновления", "bump @gramio/* versions".
allowed-tools: Bash, Read, Edit, Write, Grep, Glob
---

# Upgrade a GramIO project

You upgrade a user's GramIO project **safely, one change at a time** — never a blind `bump everything` followed by hoping it compiles. You know exactly which versions they're on, exactly what changed between those versions and the target, and you apply the matching code edits as you bump. Then you do the part most upgrades skip: you tell the user which **new features** the bump unlocked that could actually help their project (Step 6).

This skill is for **GramIO version → version** upgrades. For users coming **from another framework** (grammY, Telegraf, puregram, node-telegram-bot-api) reach for the `migration-from-*` references instead (see [See also](#see-also)).

## Arguments

Free-form. Examples:

- `/gramio-upgrade` — everything to latest.
- `/gramio-upgrade gramio to 0.10` — one package to a named target.
- `/gramio-upgrade @gramio/scenes` — just the scenes plugin.
- `/gramio-upgrade что сломается если обновиться` — dry-run / impact report, no edits yet.

If the user only says "upgrade", default to upgrading every gramio/@gramio package to its latest published version — but still **walk the plan and confirm before editing**.

## The ledger: `MIGRATIONS.md`

This skill ships with **`MIGRATIONS.md`** in its own directory — a per-package, version-descending log with two parts per `### x → y` entry:

- **What you must act on to bump safely** — breaking changes (with before/after), deprecations, peer-dependency bumps that move together, and pins around known-bad / not-yet-published releases. A hop with none of these is marked *"✅ Safe bump"* or *"nothing to do"*.
- **✨ New** — the features that version unlocks, as titles + one-line descriptions (no code). These are **not** required to bump, but they're there so you can spot *"huh, this could help this project"* and tell the user (see Step 6).

**Read it as the source of upgrade truth.** If a package or version range isn't in it, say so and point the user at the linked `/changelogs/` pages rather than guessing.

> The ledger lists new-feature **titles** without code, to stay light. When you (or the user) want the actual usage code for a feature, follow the `[changelog]` link on the entry, or the website guide `/guides/upgrading` which renders the full view (breaking + deprecated + new **with code** + fixes).

> `MIGRATIONS.md` is **generated** from `public/migrations.json` (the docs repo's structured source of truth) by `/generate-changelog` + `bun run build:migrations`. Don't hand-edit it — it's overwritten. The same JSON powers the website's `/guides/upgrading` page and its `<UpgradePicker/>`, so the CLI, this skill, and the website all agree.

---

## Step 1 — Detect current versions

Run the bundled script from the **user's project directory** (the one with their `package.json`). It resolves the *installed* version from `node_modules` (the real resolved version, not the `^range` in `package.json`):

```bash
node skills/gramio-upgrade/detect-versions.mjs --json
# or, if the skill is installed elsewhere / cwd differs:
node skills/gramio-upgrade/detect-versions.mjs --cwd . --json
```

It prints one row per gramio/@gramio dependency: `{ name, declared, installed }`. The script never aborts on a single missing package — a not-installed dep shows `installed: null`.

If you can't run the script (no Node, odd layout), fall back to reading `package.json` + `node_modules/<pkg>/package.json` directly with Read.

## Step 2 — Determine the target

- If the user named a target version, use it.
- Otherwise add `--latest` to fetch the npm `latest` dist-tag per package and flag which have upgrades:

  ```bash
  node skills/gramio-upgrade/detect-versions.mjs --latest --json
  ```

- **Pending-publish caveat:** a version may be tagged in a changelog but not yet on npm. `--latest` reflects what's actually installable. Don't plan an upgrade to a version `npm` doesn't return.

## Step 3 — Build the migration plan from `MIGRATIONS.md`

1. Read `MIGRATIONS.md`.
2. For each package being upgraded, select the entries strictly **between the installed version (exclusive) and the target (inclusive)** — every hop, not just the endpoints. (E.g. gramio `0.7.0 → 0.10.0` pulls the `0.7→0.9` **and** `0.9→0.10` entries.)
3. Order the work by **dependency layer**, because peer ranges must move together:

   `@gramio/types` → `@gramio/contexts` / `@gramio/files` / `@gramio/format` → `gramio` → plugins (`scenes`, `session`, `views`, `onboarding`, `rate-limit`, …) → tooling (`@gramio/test`).

4. Present an ordered checklist. For **each** breaking change:
   - the before/after snippet from the ledger,
   - the **files in the user's project that are likely affected** — find them with Grep (e.g. `storage.get<`, `new Telegram(`, `rateLimitPlugin`, `correctOptionId`, `passthrough`).
   Then list deprecations (should-fix) and any peer-bump / "upgrade straight to" notes. An entry that says *"no required changes"* needs nothing — just the version bump. (The ledger intentionally omits the new-feature catalog; only pull that from the entry's `[changelog]` link if the user actually asks "what's new".)

   Always show the plan and let the user confirm before you edit — especially when a step is a behavior change (e.g. scenes `passthrough` default) rather than a pure API rename.

## Step 4 — Apply

- Bump the versions in the user's `package.json` (match their existing range style — `^`, `~`, or pinned).
- Run their package manager's install. Detect it from the lockfile (`bun.lockb` → `bun install`, `pnpm-lock.yaml` → `pnpm install`, `yarn.lock` → `yarn`, else `npm install`). **Offer to run it** rather than assuming; some users want to review the diff first.
- Apply each breaking-change edit in dependency order, using the ledger's before/after as the codemod template and Grep to find every call site. Don't stop at the first match.
- Leave **deprecations** as `// TODO(gramio-upgrade):` comments unless the user asked to fix them now.
- Don't auto-rewrite working code to use new features here — that's Step 6, and it's the user's call.

## Step 5 — Verify

- Typecheck: the project's check script if it has one (`bun run typecheck` / `tsc --noEmit`), else `npx tsc --noEmit`.
- If a test setup exists, run it.
- Report: what bumped, what code changed, what's left as a TODO, and anything that needs a human decision (e.g. a behavior change you couldn't safely automate).

## Step 6 — Suggest new features worth adopting

A successful bump isn't the finish line — the point of upgrading is often the new capabilities. Once the project compiles on the new versions:

1. Go through the **✨ New** items across every hop you just crossed.
2. Match them against **what this project actually does** (look at the user's handlers, plugins, and pain points you noticed while editing). For each feature that genuinely fits, tell the user — concretely, one line each:
   - *"You're now on `@gramio/scenes` 0.7 — your multi-step `checkout` flow could use **builder steps** (per-step `.enter`/`.fallback`) and **`onExit`** for the cleanup you're doing manually."*
   - *"`gramio` 0.10 adds **`bot.guestQuery()`** — relevant if you want to handle Bot API 10 guest messages."*
3. Skip features that don't apply — don't dump the whole list. Two or three well-targeted suggestions beat a catalog.
4. **Offer to wire up** the ones the user wants. When they say yes, fetch the actual usage code from the entry's `[changelog]` link or `/guides/upgrading` (the ledger only has titles), then implement.

The goal: the user leaves not just on the latest version, but knowing the two or three new things that will actually make their bot better.

---

## Rules / anti-patterns

- **Never bump without applying the matching breaking-change edits.** A green install is not a green upgrade.
- **Respect dependency order.** Bumping `gramio` without its `@gramio/types`/`contexts`/`format` peers (or vice versa) produces confusing type errors. Move a Bot-API line as a unit.
- **Don't skip intermediate hops in the ledger.** Breaking changes accumulate across versions; a `0.5 → 0.10` jump must account for every entry in between.
- **Behavior changes are not silent renames.** Flag things like scenes `passthrough: true` becoming the default, or `@gramio/storage` v2 typed keys — these change runtime/typing behavior, so the user should sign off.
- **Don't invent migration steps.** If `MIGRATIONS.md` doesn't cover a package/version, say so and link the relevant `/changelogs/` page. Better to under-promise than to hallucinate an API.
- **`ctx` getters are camelCase.** When writing or editing example/handler code, use `ctx.from`, `ctx.chatId`, `ctx.messageId` — never the raw snake_case `ctx.payload`.
- **Pin around known-bad releases.** Some entries say "upgrade straight to X" (e.g. `@gramio/scenes` 0.7.1, `@gramio/types` 9.6.1) — honor those; don't land on the bad version.

## See also

- **Coming from another framework?** Use the framework-migration references, not this skill:
  `skills/references/migration-from-grammy.md`, `migration-from-telegraf.md`, `migration-from-puregram.md`, `migration-from-ntba.md`.
- **The full narrative** for any version is at the changelog page linked from each `MIGRATIONS.md` entry (`/changelogs/YYYY-MM-DD`).
- **API introspection** while editing: the core `gramio` skill's `tools/` scripts (`get-bot-api-method.mjs`, `get-context-getter.mjs`, `get-plugin.mjs`) resolve current signatures from the user's installed packages.
