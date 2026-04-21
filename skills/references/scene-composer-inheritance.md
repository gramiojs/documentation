---
name: scene-composer-inheritance
description: Flow bot-level Composer derives into Scene step handlers with full type inference and no double-execution. Covers the canonical Scene.extend(namedScopedComposer) pattern, the recommended file split that avoids circular imports, and when to reach for this over scene.extend(plugin).
---

# Inheriting bot-level composer derives into scenes

Problem: you have a named composer (e.g. i18n, auth, database access) that every handler — bot-level *and* scene-level — needs typed access to. Calling `bot.extend(composer)` makes the runtime work, but inside a `.step(...)` handler the derived fields aren't on the context type. Reaching into `ctx as any` or redeclaring the derive inside the scene both cause problems (lost safety, double execution, divergent state).

The right answer is `Scene.extend(composer)` on a **named, `.as("scoped")`** composer that the bot also extends. GramIO's registration-time dedup ensures the derive runs exactly once per update, and the types flow into every step.

## Canonical pattern

```typescript
// base.ts — the named scoped composer (no scene imports here, see split below)
import { Composer } from "gramio";

export const baseComposer = new Composer({ name: "base" })
    .derive(() => ({
        t: (key: string) => translate(key),
    }))
    .as("scoped");
```

```typescript
// scene.ts — scene imports baseComposer and uses Scene.extend for types
import { Scene } from "@gramio/scenes";
import { baseComposer } from "./base.js";

export const demoScene = new Scene("demo")
    .extend(baseComposer)                      // flows types into onEnter + every step
    .onEnter((ctx) => ctx.send(ctx.t("hi")))   // ctx.t typed ✅
    .step("message", (ctx) => ctx.send(ctx.t("ok")));
```

```typescript
// index.ts — assembly: bot extends baseComposer (runtime) + scenes (routing)
import { Bot } from "gramio";
import { scenes, scenesDerives } from "@gramio/scenes";
import { inMemoryStorage } from "@gramio/storage";
import { baseComposer } from "./base.js";
import { demoScene } from "./scene.js";

const storage = inMemoryStorage();
const list = [demoScene];

export const bot = new Bot(process.env.BOT_TOKEN!)
    .extend(baseComposer)                                         // derive runs once per update
    .extend(scenesDerives(list, { withCurrentScene: true, storage }))
    .extend(scenes(list, { storage }))
    .command("start", (ctx) => ctx.scene.enter(demoScene));
```

### Why both `name:` and `.as("scoped")` are required

| Pick | What it buys | What happens without it |
|------|--------------|-------------------------|
| `new Composer({ name: "base" })` | Registration-time dedup key. When the bot extends it AND the scene extends it, only the first registration runs. | Without a name, every `extend()` call re-runs every middleware. The derive fires twice per update, any side effect (counters, spans, DB calls) duplicates. |
| `.as("scoped")` | Promotes the derive from the default `local` scope to `scoped`. The handler writes to the real ctx the scene engine later inspects. | Without it, the derive lands in an `Object.create(ctx)` isolation group. Types say `ctx.t` exists, runtime leaves it `undefined`. This is the one place in GramIO where types and runtime diverge — see [composer](composer.md) § "Dedup ≠ shared data". |

Together they give you: one source of truth, one runtime execution, full type flow.

### When this differs from `scene.extend(plugin)`

- **`scene.extend(plugin)`** is for plugins that *only* the scene needs. The plugin is not registered on the bot; bot-level handlers don't see it. Use this for scene-specific concerns (e.g. a feature-flagged step gate).
- **`Scene.extend(namedScopedComposer)`** is for shared infrastructure (i18n, auth, tracing) that every handler in the app touches. The composer lives at the bot level *and* is declared on each scene that needs the types.

If you're unsure which to reach for: if the derive would need to duplicate behavior across every scene and the bot, it's shared infrastructure — use the composer pattern.

## File layout: avoid the circular import

In a naive layout everything sits in one `plugins/index.ts`: the composer, the derives, and the `scenes([...])` extension. This breaks as soon as a scene file wants to `extend` that composer:

```
scene.ts → imports composer from plugins/index.ts
plugins/index.ts → imports scene.ts to pass into scenes([scene])
// circular dep; TS silently collapses the composer type to `any`
```

The scene handler's `ctx` suddenly loses all derive types — no error, no warning, just `ctx.t: any`. The fix is to split the composer off from the scene-registering assembly:

```
src/plugins/
  ├── base.ts     ← exports baseComposer (derives only, no scene imports)
  └── index.ts    ← imports baseComposer + scenes, exports the fully-assembled composer/bot
src/scenes/
  └── demo.ts     ← imports baseComposer from plugins/base.ts
```

`base.ts` has no knowledge of scenes, so scenes can freely import from it. `index.ts` imports *both* `base.ts` and the scene files, then assembles. No cycle.

A runnable version of this layout lives at [scene-composer-inheritance example](../examples/scene-composer-inheritance/) — three files matching the shape above, exercised by `tests/examples/scene-composer-inheritance.test.ts`.

## Gotcha: Scene.extend overload generic arity

The current `Scene.extend(composer)` overload signature takes an `EventComposer<any, any, any, any, UExposed, UDerives, any>` — 7 generics. GramIO's augmented `EventComposer` (from the `gramio` package) has 8 (adds `TMacros`). The overload still matches today thanks to positional `any`s in the unused slots, but the silent mismatch means any tighter future overload could fall through to the plugin variant without a compile error.

If you author a custom method/macro composer and extend it into a scene, sanity-check that the scene context surfaces your derives correctly. File an issue against `@gramio/scenes` if the mismatch starts biting; documented here so future readers know why `@ts-expect-error` on a scene `.extend` chain might be masking real drift.
