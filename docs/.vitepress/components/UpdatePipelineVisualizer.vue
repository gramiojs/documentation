<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

// ── Reactive toggles ──────────────────────────────────────────────────
type UpdateKind = 'message' | 'callback_query'
const updateType = ref<UpdateKind>('message')
const debugMode = ref(false)
const stepIdx = ref(-1)
const isPlaying = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

// ── Step colors ───────────────────────────────────────────────────────
const COLORS: Record<string, string> = {
  use: '#3b82f6',
  on: '#64748b',
  derive: '#8b5cf6',
  when: '#f97316',
  handler: '#10b981',
}
const SHADOWS: Record<string, string> = {
  use: 'rgba(59,130,246,.15)',
  on: 'rgba(100,116,139,.15)',
  derive: 'rgba(139,92,246,.15)',
  when: 'rgba(249,115,22,.15)',
  handler: 'rgba(16,185,129,.15)',
}

// ── Step definitions ──────────────────────────────────────────────────
interface Step {
  id: string
  type: 'use' | 'on' | 'derive' | 'when' | 'handler'
  badge: string
  name: string
  desc: string
  code: string
  addedKeys?: string[]
  getAdded?: () => Record<string, unknown>
  /** false → step is skipped (on type mismatch), chain continues */
  runFor?: () => boolean
  skipReason?: string
  /** false → step not registered at startup (when()) */
  isRegistered?: () => boolean
  notRegisteredLabel?: string
  /** response when handler runs */
  getResponse?: () => string
}

const STEPS = computed<Step[]>(() => [
  {
    id: 'use-logger',
    type: 'use',
    badge: 'use',
    name: 'logger',
    desc: 'Runs for every update — logs the type, then calls next() to continue.',
    code: `bot.use(async (ctx, next) => {\n  console.log(ctx.updateType)\n  await next()\n})`,
  },
  {
    id: 'on-message',
    type: 'on',
    badge: 'on',
    name: '"message"',
    desc: 'Executes handler only when the update is a text message. Chain continues regardless.',
    code: `bot.on("message", (ctx) => {\n  // Only for messages\n  console.log("text:", ctx.text)\n})`,
    runFor: () => updateType.value === 'message',
    skipReason: 'Not a "message" update — handler skipped, chain continues',
  },
  {
    id: 'on-callback',
    type: 'on',
    badge: 'on',
    name: '"callback_query"',
    desc: 'Executes handler only for inline button presses. Skips for plain messages.',
    code: `bot.on("callback_query", (ctx) => {\n  // Only for button clicks\n  ctx.answerCallbackQuery("Clicked!")\n})`,
    runFor: () => updateType.value === 'callback_query',
    skipReason: 'Not a "callback_query" — handler skipped, chain continues',
  },
  {
    id: 'derive-user',
    type: 'derive',
    badge: 'derive',
    name: 'fetchUser',
    desc: 'Runs for all updates. Merges { user } into ctx — all downstream handlers receive it.',
    code: `bot.derive(async () => {\n  const user = await db.getUser(userId)\n  return { user }\n})`,
    addedKeys: ['user'],
    getAdded: () => ({ user: { name: 'Alice', premium: true } }),
  },
  {
    id: 'when-debug',
    type: 'when',
    badge: 'when',
    name: 'debugMode',
    desc: 'Registered at startup only if debugMode is true. Not part of the pipeline otherwise.',
    code: `new Composer().when(debugMode, (c) =>\n  c.use(async (ctx, next) => {\n    const t = Date.now()\n    await next()\n    console.log(ctx.updateType, Date.now() - t, "ms")\n  })\n)`,
    isRegistered: () => debugMode.value,
    notRegisteredLabel: 'Not registered — debugMode=false at startup',
  },
  {
    id: 'handler',
    type: 'handler',
    badge: updateType.value === 'message' ? 'command' : 'callbackQuery',
    name: updateType.value === 'message' ? '"start"' : '"panel"',
    desc: updateType.value === 'message'
      ? 'Handles the /start command. ctx.user is available because derive() ran first.'
      : 'Handles the "panel" button callback. ctx.user is available because derive() ran first.',
    code: updateType.value === 'message'
      ? `bot.command("start", (ctx) => {\n  ctx.send(\`Hello \${ctx.user.name}! 👋\`)\n})`
      : `bot.callbackQuery("panel", (ctx) => {\n  ctx.answerCallbackQuery(\`Hi \${ctx.user.name}! 👋\`)\n})`,
    getResponse: () => updateType.value === 'message'
      ? `Hello Alice! 👋`
      : `Hi Alice! 👋`,
  },
])

// ── Status per step ───────────────────────────────────────────────────
type Status = 'pending' | 'active' | 'passed' | 'skipped' | 'not-registered'

const statuses = computed<Status[]>(() =>
  STEPS.value.map((step, i) => {
    // when() not registered — always show as not-registered
    if (step.isRegistered && !step.isRegistered()) return 'not-registered'
    if (i > stepIdx.value) return 'pending'
    if (i < stepIdx.value) {
      // Check if this step was skipped when it was active
      if (step.runFor && !step.runFor()) return 'skipped'
      return 'passed'
    }
    // i === stepIdx.value
    if (step.runFor && !step.runFor()) return 'skipped'
    return 'active'
  })
)

// Chain is never blocked — on() and when() just skip, they don't stop
const canAdvance = computed(() => stepIdx.value < STEPS.value.length - 1)

// ── Context snapshot ──────────────────────────────────────────────────
const ctxBase = computed<Record<string, unknown>>(() => ({
  updateType: updateType.value,
  ...(updateType.value === 'message'
    ? { text: '/start', from: { id: 42 } }
    : { data: 'panel', from: { id: 42 } }),
}))

const ctxSnapshot = computed<Record<string, unknown>>(() => {
  const ctx: Record<string, unknown> = { ...ctxBase.value }
  for (let i = 0; i <= stepIdx.value; i++) {
    const s = STEPS.value[i]
    if (s?.type === 'derive' && s.getAdded) {
      Object.assign(ctx, s.getAdded())
    }
  }
  return ctx
})

const freshKeys = computed<Set<string>>(() => {
  if (stepIdx.value < 0) return new Set()
  const s = STEPS.value[stepIdx.value]
  if (s?.type === 'derive' && s.addedKeys) return new Set(s.addedKeys)
  return new Set()
})

const currentResponse = computed<string | null>(() => {
  if (stepIdx.value < 0) return null
  const s = STEPS.value[stepIdx.value]
  if (s?.type === 'handler' && statuses.value[stepIdx.value] === 'active') {
    return s.getResponse?.() ?? null
  }
  return null
})

// ── Controls ──────────────────────────────────────────────────────────
function advance() {
  if (stepIdx.value < 0) { stepIdx.value = 0; return }
  if (canAdvance.value) stepIdx.value++
}

function reset() {
  if (timer) { clearInterval(timer); timer = null }
  isPlaying.value = false
  stepIdx.value = -1
}

function autoPlay() {
  reset()
  isPlaying.value = true
  advance()
  timer = setInterval(() => {
    if (!canAdvance.value) {
      clearInterval(timer!); timer = null; isPlaying.value = false
    } else {
      advance()
    }
  }, 1000)
}

onUnmounted(() => { if (timer) clearInterval(timer) })

// ── Context lines renderer ────────────────────────────────────────────
interface CtxLine { text: string; depth: number; fresh: boolean }

const ctxLines = computed<CtxLine[]>(() => {
  const lines: CtxLine[] = []
  const entries = Object.entries(ctxSnapshot.value)

  entries.forEach(([k, v], i) => {
    const isFresh = freshKeys.value.has(k)
    const trail = i < entries.length - 1 ? ',' : ''

    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      lines.push({ text: `${k}: {`, depth: 1, fresh: isFresh })
      const nested = Object.entries(v as Record<string, unknown>)
      nested.forEach(([k2, v2], j) => {
        lines.push({ text: `${k2}: ${JSON.stringify(v2)}${j < nested.length - 1 ? ',' : ''}`, depth: 2, fresh: isFresh })
      })
      lines.push({ text: `}${trail}`, depth: 1, fresh: false })
    } else {
      lines.push({ text: `${k}: ${JSON.stringify(v)}${trail}`, depth: 1, fresh: isFresh })
    }
  })

  return lines
})
</script>

<template>
  <div class="upv">
    <!-- ── Top controls ── -->
    <div class="upv-top">
      <!-- Update type selector -->
      <div class="upv-toggle-group">
        <span class="upv-toggle-label">Update:</span>
        <div class="upv-seg">
          <button
            :class="['upv-seg-btn', { active: updateType === 'message' }]"
            @click="updateType = 'message'; reset()"
          >📝 Message</button>
          <button
            :class="['upv-seg-btn', { active: updateType === 'callback_query' }]"
            @click="updateType = 'callback_query'; reset()"
          >🔘 Button click</button>
        </div>
      </div>

      <!-- Debug mode toggle -->
      <div class="upv-toggle-group">
        <span class="upv-toggle-label">debugMode</span>
        <button
          :class="['upv-toggle', { 'is-on': debugMode }]"
          @click="debugMode = !debugMode; reset()"
          :aria-pressed="debugMode"
        >
          <span class="upv-toggle-thumb" />
        </button>
        <code :class="['upv-toggle-val', debugMode ? 'val-true' : 'val-false']">{{ debugMode }}</code>
      </div>

      <!-- Action buttons -->
      <div class="upv-btns">
        <button class="upv-btn is-primary" @click="autoPlay" :disabled="isPlaying">
          {{ isPlaying ? '⏳ Playing…' : '▶ Auto Play' }}
        </button>
        <button class="upv-btn" @click="advance" :disabled="isPlaying || (stepIdx >= 0 && !canAdvance)">
          {{ stepIdx < 0 ? '→ Start' : 'Next Step →' }}
        </button>
        <button class="upv-btn is-ghost" @click="reset">↺ Reset</button>
      </div>
    </div>

    <!-- ── Body: pipeline + context ── -->
    <div class="upv-body">
      <!-- LEFT: pipeline -->
      <div class="upv-pipeline">
        <!-- Incoming update card -->
        <div class="upv-incoming">
          <span class="upv-badge" :style="{ background: updateType === 'message' ? '#0ea5e9' : '#8b5cf6' }">
            {{ updateType === 'message' ? 'message' : 'callback_query' }}
          </span>
          <div class="upv-incoming-text">
            <div class="upv-incoming-title">Incoming Update</div>
            <code class="upv-incoming-code">
              {{ updateType === 'message' ? '{ text: "/start", from: { id: 42 } }' : '{ data: "panel", from: { id: 42 } }' }}
            </code>
          </div>
        </div>

        <template v-for="(step, i) in STEPS" :key="step.id">
          <!-- Arrow connector — never dimmed (on() doesn't stop the chain) -->
          <div class="upv-arrow">
            <div class="upv-arrow-line" />
            <div class="upv-arrow-tip">▼</div>
          </div>

          <!-- Step card -->
          <div
            :class="['upv-card', `is-${statuses[i]}`]"
            :style="statuses[i] !== 'pending' && statuses[i] !== 'not-registered'
              ? ({ '--cc': COLORS[step.type], '--cs': SHADOWS[step.type] } as any)
              : {}"
          >
            <div class="upv-card-row">
              <span class="upv-badge" :style="{ background: COLORS[step.type] }">{{ step.badge }}</span>
              <span class="upv-card-name">{{ step.name }}</span>
              <span v-if="statuses[i] === 'passed'"        class="upv-status-icon is-pass">✓</span>
              <span v-else-if="statuses[i] === 'skipped'"  class="upv-status-icon is-skip">⏭</span>
              <span v-else-if="statuses[i] === 'not-registered'" class="upv-status-icon is-off">○</span>
            </div>

            <p class="upv-card-desc">{{ step.desc }}</p>

            <!-- Code (revealed when active or past, dimmed for not-registered) -->
            <Transition name="upv-slide">
              <div
                v-if="statuses[i] !== 'pending'"
                :class="['upv-card-code', { 'is-dimmed': statuses[i] === 'not-registered' }]"
              >
                <pre>{{ step.code }}</pre>
              </div>
            </Transition>

            <!-- Inline result messages -->
            <div v-if="statuses[i] === 'skipped'" class="upv-result is-off">
              ○ {{ step.skipReason }}
            </div>
            <div v-if="statuses[i] === 'not-registered'" class="upv-result is-off">
              ○ {{ step.notRegisteredLabel }}
            </div>
            <div
              v-if="step.type === 'on' && (statuses[i] === 'active' || statuses[i] === 'passed')"
              class="upv-result is-ok"
            >
              ✓ Matches "{{ step.name.replace(/"/g, '') }}" — handler runs
            </div>
            <div
              v-if="step.type === 'when' && statuses[i] === 'active'"
              class="upv-result is-ok"
            >
              ✓ Registered (debugMode=true) — middleware in pipeline
            </div>

            <!-- Handler response -->
            <div
              v-if="step.type === 'handler' && statuses[i] === 'active' && currentResponse"
              class="upv-response"
            >
              <span class="upv-response-label">
                {{ updateType === 'message' ? 'ctx.send()' : 'ctx.answerCallbackQuery()' }}
              </span>
              <span class="upv-response-val">{{ currentResponse }}</span>
            </div>
          </div>
        </template>
      </div>

      <!-- RIGHT: context panel -->
      <div class="upv-ctx">
        <div class="upv-ctx-head">
          <span class="upv-ctx-title">ctx</span>
          <span class="upv-ctx-sub">context snapshot</span>
        </div>

        <div class="upv-ctx-code">
          <span class="upv-c-brace">{</span>
          <template v-if="stepIdx >= 0">
            <div
              v-for="(line, li) in ctxLines"
              :key="li"
              :class="['upv-c-line', { 'is-fresh': line.fresh }]"
              :style="{ paddingLeft: line.depth * 14 + 'px' }"
            >{{ line.text }}</div>
          </template>
          <template v-else>
            <div class="upv-c-line upv-c-dim" style="padding-left:14px">updateType: "{{ updateType }}",</div>
            <div class="upv-c-line upv-c-dim" style="padding-left:14px">
              {{ updateType === 'message' ? 'text: "/start",' : 'data: "panel",' }}
            </div>
            <div class="upv-c-line upv-c-dim" style="padding-left:14px">from: { id: 42 }</div>
          </template>
          <span class="upv-c-brace">}</span>
        </div>

        <!-- Response bubble -->
        <Transition name="upv-pop">
          <div v-if="currentResponse" class="upv-bubble">
            <div class="upv-bubble-label">🤖 Bot</div>
            <div class="upv-bubble-text">{{ currentResponse }}</div>
          </div>
        </Transition>

        <!-- Hint -->
        <p v-if="stepIdx < 0" class="upv-ctx-hint">
          Press <strong>Start</strong> or <strong>Auto Play</strong><br>
          Try different update types &amp; debug mode!
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Container ─────────────────────────────────────────────────── */
.upv {
  margin: 24px 0;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  font-size: 13px;
}

/* ── Top bar ───────────────────────────────────────────────────── */
.upv-top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
}

.upv-toggle-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.upv-toggle-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  font-family: monospace;
  white-space: nowrap;
}

/* Segmented button */
.upv-seg {
  display: flex;
  border: 1px solid var(--vp-c-border);
  border-radius: 7px;
  overflow: hidden;
}
.upv-seg-btn {
  padding: 5px 12px;
  border: none;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.15s;
}
.upv-seg-btn + .upv-seg-btn {
  border-left: 1px solid var(--vp-c-border);
}
.upv-seg-btn.active {
  background: var(--vp-c-brand-1);
  color: #fff;
}
.upv-seg-btn:not(.active):hover { color: var(--vp-c-brand-1); }

/* Toggle switch */
.upv-toggle {
  width: 38px;
  height: 21px;
  border-radius: 11px;
  background: var(--vp-c-border);
  border: none;
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
  padding: 0;
}
.upv-toggle.is-on { background: #10b981; }
.upv-toggle-thumb {
  position: absolute;
  top: 2.5px;
  left: 2.5px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: left 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,.2);
}
.upv-toggle.is-on .upv-toggle-thumb { left: 19.5px; }
.upv-toggle-val { font-size: 12px; font-weight: 700; }
.val-true { color: #10b981; }
.val-false { color: var(--vp-c-text-3); }

/* Action buttons */
.upv-btns { display: flex; gap: 6px; flex-wrap: wrap; margin-left: auto; }
.upv-btn {
  padding: 6px 13px;
  border: 1px solid var(--vp-c-border);
  border-radius: 7px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.15s;
  white-space: nowrap;
}
.upv-btn:hover:not(:disabled) { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.upv-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.upv-btn.is-primary {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}
.upv-btn.is-primary:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
  color: #fff;
}
.upv-btn.is-ghost { color: var(--vp-c-text-3); }

/* ── Body layout ───────────────────────────────────────────────── */
.upv-body { display: grid; grid-template-columns: 1fr 240px; }
@media (max-width: 640px) { .upv-body { grid-template-columns: 1fr; } }

/* ── Pipeline (left) ───────────────────────────────────────────── */
.upv-pipeline {
  padding: 18px;
  border-right: 1px solid var(--vp-c-border);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.upv-incoming {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
}
.upv-incoming-text { display: flex; flex-direction: column; gap: 2px; }
.upv-incoming-title { font-size: 12px; font-weight: 700; color: var(--vp-c-text-1); }
.upv-incoming-code { font-size: 10px; color: var(--vp-c-text-3); }

.upv-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  font-family: monospace;
  white-space: nowrap;
  flex-shrink: 0;
}

.upv-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 22px;
}
.upv-arrow-line { width: 2px; flex: 1; background: var(--vp-c-border); }
.upv-arrow-tip { font-size: 9px; color: var(--vp-c-text-3); line-height: 1; }

/* Step cards */
.upv-card {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 10px 12px;
  background: var(--vp-c-bg);
  transition: border-color 0.2s, box-shadow 0.2s, opacity 0.2s;
}
.upv-card.is-pending { opacity: 0.4; }
.upv-card.is-active { border-color: var(--cc); box-shadow: 0 0 0 3px var(--cs); }
.upv-card.is-passed  { border-color: var(--vp-c-border); opacity: 0.85; }
.upv-card.is-skipped {
  border-color: var(--vp-c-border);
  border-style: dashed;
  opacity: 0.75;
}
.upv-card.is-not-registered {
  border-color: var(--vp-c-border);
  opacity: 0.4;
  background: var(--vp-c-bg-soft);
}

.upv-card-row { display: flex; align-items: center; gap: 7px; margin-bottom: 5px; }
.upv-card-name { font-size: 12px; font-weight: 700; color: var(--vp-c-text-1); font-family: monospace; flex: 1; }
.upv-status-icon { font-size: 12px; font-weight: 900; flex-shrink: 0; }
.upv-status-icon.is-pass { color: #10b981; }
.upv-status-icon.is-skip { color: #64748b; }
.upv-status-icon.is-off  { color: var(--vp-c-text-3); }

.upv-card-desc { font-size: 11.5px; color: var(--vp-c-text-2); line-height: 1.45; margin: 0; }

.upv-card-code {
  margin-top: 8px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  padding: 7px 10px;
  overflow-x: auto;
}
.upv-card-code.is-dimmed { opacity: 0.45; }
.upv-card-code pre {
  margin: 0;
  font-size: 10.5px;
  font-family: monospace;
  color: var(--vp-c-text-1);
  line-height: 1.55;
  white-space: pre;
}

.upv-result {
  margin-top: 7px;
  padding: 5px 9px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.4;
}
.upv-result.is-ok   { background: rgba(16,185,129,.07); border: 1px solid rgba(16,185,129,.2); color: #059669; }
.upv-result.is-skip { background: rgba(100,116,139,.07); border: 1px solid rgba(100,116,139,.2); color: var(--vp-c-text-2); }
.upv-result.is-off  { background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-border); color: var(--vp-c-text-3); }

.upv-response {
  margin-top: 7px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 9px;
  background: rgba(16,185,129,.07);
  border: 1px solid rgba(16,185,129,.2);
  border-radius: 6px;
}
.upv-response-label { font-size: 9px; font-weight: 700; font-family: monospace; color: #10b981; white-space: nowrap; }
.upv-response-val { font-size: 12px; color: var(--vp-c-text-1); font-style: italic; }

/* ── Context panel (right) ─────────────────────────────────────── */
.upv-ctx {
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--vp-c-bg-soft);
}
.upv-ctx-head { display: flex; align-items: baseline; gap: 7px; }
.upv-ctx-title { font-size: 14px; font-weight: 700; font-family: monospace; color: var(--vp-c-text-1); }
.upv-ctx-sub { font-size: 10px; color: var(--vp-c-text-3); text-transform: uppercase; letter-spacing: .3px; }

.upv-ctx-code {
  background: #0d1117;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 9px 11px;
  font-family: monospace;
  font-size: 11px;
  line-height: 1.7;
  display: flex;
  flex-direction: column;
}
.upv-c-brace { color: #8b949e; }
.upv-c-line { color: #c9d1d9; white-space: pre; }
.upv-c-dim  { color: #3d4451; }
.upv-c-line.is-fresh { color: #56d364; animation: upv-fresh .4s ease-out; }
@keyframes upv-fresh { from { background: rgba(86,211,100,.18); } to { background: transparent; } }

.upv-bubble {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px 8px 8px 2px;
  padding: 9px 11px;
}
.upv-bubble-label { font-size: 9px; font-weight: 700; color: var(--vp-c-brand-1); margin-bottom: 3px; text-transform: uppercase; letter-spacing: .3px; }
.upv-bubble-text  { font-size: 13px; color: var(--vp-c-text-1); line-height: 1.4; }

.upv-ctx-hint { font-size: 11px; color: var(--vp-c-text-3); line-height: 1.6; text-align: center; font-style: italic; margin: auto 0; }

/* ── Transitions ───────────────────────────────────────────────── */
.upv-slide-enter-active { transition: all .2s ease-out; }
.upv-slide-leave-active { transition: all .15s ease-in; }
.upv-slide-enter-from   { opacity: 0; transform: translateY(-5px); }
.upv-slide-leave-to     { opacity: 0; }

.upv-pop-enter-active { animation: upv-pop-in .25s cubic-bezier(.175,.885,.32,1.275); }
.upv-pop-leave-active { transition: opacity .16s; }
.upv-pop-leave-to     { opacity: 0; }
@keyframes upv-pop-in {
  from { opacity: 0; transform: scale(.87); }
  to   { opacity: 1; transform: scale(1); }
}
</style>
