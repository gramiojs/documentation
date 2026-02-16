<script setup lang="ts">
import { ref, onUnmounted, reactive, nextTick } from 'vue'

type Mode = 'no-delay' | 'with-delay'

const mode = ref<Mode>('no-delay')

interface UserState {
  emoji: string
  status: 'idle' | 'sending' | 'delivered' | 'blocked'
}

const users = reactive<UserState[]>([
  { emoji: '👤', status: 'idle' },
  { emoji: '👩', status: 'idle' },
  { emoji: '👨', status: 'idle' },
  { emoji: '👩‍💻', status: 'idle' },
  { emoji: '🧑', status: 'idle' },
  { emoji: '👱', status: 'idle' },
  { emoji: '👩‍🦰', status: 'idle' },
  { emoji: '🧔', status: 'idle' },
  { emoji: '👦', status: 'idle' },
  { emoji: '👧', status: 'idle' },
])

interface LogEntry {
  id: number
  text: string
  type: 'info' | 'success' | 'error' | 'warning'
}

const logs = ref<LogEntry[]>([])
const rateBarWidth = ref(0)
const rateBarColor = ref('#38a169')
const isRunning = ref(false)
const isDone = ref(false)
const rateLimitActive = ref(false)
const deliveredCount = ref(0)
const blockedCount = ref(0)

let logId = 0
let timers: ReturnType<typeof setTimeout>[] = []

function addLog(text: string, type: LogEntry['type'] = 'info') {
  logs.value.push({ id: ++logId, text, type })
  // Auto-scroll log
  nextTick(() => {
    const el = document.querySelector('.bv-log-list')
    if (el) el.scrollTop = el.scrollHeight
  })
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    const t = setTimeout(resolve, ms)
    timers.push(t)
  })
}

function reset() {
  timers.forEach(clearTimeout)
  timers = []
  for (const u of users) {
    u.status = 'idle'
  }
  logs.value = []
  rateBarWidth.value = 0
  rateBarColor.value = '#38a169'
  isRunning.value = false
  isDone.value = false
  rateLimitActive.value = false
  deliveredCount.value = 0
  blockedCount.value = 0
  logId = 0
}

function switchMode(m: Mode) {
  mode.value = m
  reset()
}

async function startDemo() {
  reset()
  isRunning.value = true

  if (mode.value === 'no-delay') {
    await runNoDelay()
  } else {
    await runWithDelay()
  }
}

async function runNoDelay() {
  addLog('Starting broadcast to 10 users...', 'info')
  addLog('for (const chatId of chatIds) {', 'info')
  addLog('  bot.api.sendMessage({ chat_id: chatId, text })', 'info')
  addLog('  // no delay!', 'warning')
  addLog('}', 'info')
  await delay(600)

  // Burst all messages rapidly
  for (let i = 0; i < users.length; i++) {
    if (!isRunning.value) return

    users[i].status = 'sending'
    rateBarWidth.value = Math.min(((i + 1) / users.length) * 150, 150)

    if (i < 5) {
      // First 5 succeed but rate is climbing
      rateBarColor.value = i < 3 ? '#38a169' : '#dd6b20'
      await delay(80)
      users[i].status = 'delivered'
      deliveredCount.value++
      addLog(`sendMessage → user ${i + 1} — 200 OK`, 'success')
    } else {
      // Rest get 429
      rateBarColor.value = '#e53e3e'
      await delay(80)
      users[i].status = 'blocked'
      blockedCount.value++
      if (i === 5) {
        addLog(`sendMessage → user ${i + 1} — 429 Too Many Requests`, 'error')
        addLog(`Error: "retry_after": 35`, 'error')
      } else {
        addLog(`sendMessage → user ${i + 1} — 429 blocked`, 'error')
      }
    }
  }

  await delay(300)
  rateLimitActive.value = true
  addLog('', 'error')
  addLog('Bot is BLOCKED for 35 seconds!', 'error')
  addLog('All API calls will fail during this time.', 'error')
  addLog('5 users never received the message.', 'warning')

  await delay(2000)
  isDone.value = true
  isRunning.value = false
}

async function runWithDelay() {
  addLog('Starting broadcast to 10 users...', 'info')
  addLog('for (const chatId of chatIds) {', 'info')
  addLog('  await withRetries(() =>', 'info')
  addLog('    bot.api.sendMessage({ chat_id: chatId, text })', 'info')
  addLog('  )', 'info')
  addLog('  await scheduler.wait(100) // delay', 'success')
  addLog('}', 'info')
  await delay(600)

  for (let i = 0; i < users.length; i++) {
    if (!isRunning.value) return

    users[i].status = 'sending'
    rateBarWidth.value = ((i + 1) / users.length) * 80
    rateBarColor.value = '#38a169'

    await delay(250)

    users[i].status = 'delivered'
    deliveredCount.value++
    addLog(`sendMessage → user ${i + 1} — 200 OK`, 'success')

    // Show delay indicator
    if (i < users.length - 1) {
      addLog("  waiting 100ms...", 'info')
      await delay(250)
    }
  }

  await delay(300)
  addLog('', 'success')
  addLog('All 10 messages delivered successfully!', 'success')

  isDone.value = true
  isRunning.value = false
}

onUnmounted(() => {
  timers.forEach(clearTimeout)
})
</script>

<template>
  <div class="bv-container">
    <!-- Mode tabs -->
    <div class="bv-tabs">
      <button
        :class="['bv-tab', { active: mode === 'no-delay' }]"
        @click="switchMode('no-delay')"
      >
        Without delays
      </button>
      <button
        :class="['bv-tab', { active: mode === 'with-delay' }]"
        @click="switchMode('with-delay')"
      >
        With delays
      </button>
    </div>

    <div class="bv-main">
      <!-- Left: Bot + Rate bar -->
      <div class="bv-left-panel">
        <div class="bv-bot">
          <div class="bv-bot-icon">🤖</div>
          <div class="bv-bot-label">Your Bot</div>
        </div>

        <!-- Rate meter -->
        <div class="bv-meter">
          <div class="bv-meter-label">req/sec</div>
          <div class="bv-meter-track">
            <div
              class="bv-meter-fill"
              :style="{
                width: Math.min(rateBarWidth, 100) + '%',
                background: rateBarColor,
              }"
            />
            <div class="bv-meter-limit" />
          </div>
          <div class="bv-meter-marks">
            <span>0</span>
            <span class="bv-meter-mark-limit">30</span>
          </div>
        </div>

        <!-- Rate limit alert -->
        <div v-if="rateLimitActive" class="bv-alert">
          <span class="bv-alert-badge">429</span>
          <span class="bv-alert-msg">Blocked for 35s!</span>
        </div>
      </div>

      <!-- Center: Users grid -->
      <div class="bv-users-grid">
        <div class="bv-users-title">Users (10)</div>
        <div class="bv-users">
          <div
            v-for="(user, idx) in users"
            :key="idx"
            :class="[
              'bv-user',
              'bv-user-' + user.status,
            ]"
          >
            <span class="bv-user-emoji">{{ user.emoji }}</span>
            <span v-if="user.status === 'delivered'" class="bv-user-badge bv-badge-ok">&#10003;</span>
            <span v-if="user.status === 'blocked'" class="bv-user-badge bv-badge-err">&#10005;</span>
            <span v-if="user.status === 'sending'" class="bv-user-badge bv-badge-send">&#8226;</span>
          </div>
        </div>
        <!-- Stats -->
        <div class="bv-stats" v-if="deliveredCount > 0 || blockedCount > 0">
          <span v-if="deliveredCount > 0" class="bv-stat-ok">{{ deliveredCount }} delivered</span>
          <span v-if="blockedCount > 0" class="bv-stat-err">{{ blockedCount }} blocked</span>
        </div>
      </div>

      <!-- Right: Log -->
      <div class="bv-log">
        <div class="bv-log-header">Console</div>
        <div class="bv-log-list">
          <div
            v-for="entry in logs"
            :key="entry.id"
            :class="['bv-log-entry', 'bv-log-' + entry.type]"
          >{{ entry.text }}</div>
          <div v-if="logs.length === 0" class="bv-log-empty">Press "Start broadcast" to begin</div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="bv-controls">
      <button
        class="bv-start-btn"
        @click="startDemo"
        :disabled="isRunning"
      >
        {{ isRunning ? 'Sending...' : (isDone ? 'Restart' : 'Start broadcast') }}
      </button>
    </div>

    <!-- Caption -->
    <div class="bv-caption">
      <template v-if="mode === 'no-delay'">
        A simple <code>for...of</code> loop without any delays fires requests as fast as possible. After ~30 messages per second, Telegram responds with <strong>429 Too Many Requests</strong> and blocks your bot entirely.
      </template>
      <template v-else>
        Adding <code>await scheduler.wait(100)</code> between requests combined with <code>withRetries()</code> for safety keeps your rate well under the limit.
      </template>
    </div>
  </div>
</template>

<style scoped>
.bv-container {
  margin: 24px 0;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 20px;
  background: var(--vp-c-bg-soft);
}

/* Tabs */
.bv-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  justify-content: center;
}

.bv-tab {
  padding: 8px 20px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.bv-tab:hover {
  border-color: var(--vp-c-brand-1);
}

.bv-tab.active {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  border-color: var(--vp-c-brand-1);
}

/* Main layout */
.bv-main {
  display: grid;
  grid-template-columns: 140px 1fr 1fr;
  gap: 16px;
  min-height: 200px;
}

@media (max-width: 768px) {
  .bv-main {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }
}

/* Left panel - Bot + meter */
.bv-left-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.bv-bot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.bv-bot-icon {
  font-size: 40px;
  line-height: 1;
}

.bv-bot-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

/* Rate meter */
.bv-meter {
  width: 100%;
}

.bv-meter-label {
  font-size: 10px;
  color: var(--vp-c-text-3);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  text-align: center;
}

.bv-meter-track {
  height: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.bv-meter-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.2s, background 0.3s;
}

.bv-meter-limit {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 66%;
  width: 2px;
  background: #e53e3e;
  opacity: 0.6;
}

.bv-meter-marks {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: var(--vp-c-text-3);
  margin-top: 2px;
  padding: 0 2px;
}

.bv-meter-mark-limit {
  color: #e53e3e;
  font-weight: 600;
}

/* Rate limit alert */
.bv-alert {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(229, 62, 62, 0.1);
  border: 1px solid rgba(229, 62, 62, 0.3);
  border-radius: 6px;
  animation: bv-shake 0.4s ease-in-out;
}

.bv-alert-badge {
  background: #e53e3e;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.bv-alert-msg {
  font-size: 11px;
  color: #e53e3e;
  font-weight: 600;
}

@keyframes bv-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  50% { transform: translateX(3px); }
  75% { transform: translateX(-2px); }
}

/* Users grid */
.bv-users-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bv-users-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bv-users {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.bv-user {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-border);
  transition: all 0.3s;
}

.bv-user-emoji {
  font-size: 20px;
  line-height: 1;
}

.bv-user-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  line-height: 1;
}

.bv-badge-ok {
  background: #38a169;
  color: white;
}

.bv-badge-err {
  background: #e53e3e;
  color: white;
}

.bv-badge-send {
  background: var(--vp-c-brand-1);
  color: white;
  animation: bv-pulse 0.6s ease-in-out infinite;
}

.bv-user-idle {
  opacity: 0.6;
}

.bv-user-sending {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px rgba(var(--vp-c-brand-1-rgb, 100, 108, 255), 0.2);
  transform: scale(1.05);
}

.bv-user-delivered {
  border-color: #38a169;
  opacity: 1;
}

.bv-user-blocked {
  border-color: #e53e3e;
  opacity: 0.7;
}

/* Stats */
.bv-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  font-weight: 600;
}

.bv-stat-ok {
  color: #38a169;
}

.bv-stat-err {
  color: #e53e3e;
}

/* Log panel */
.bv-log {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
}

.bv-log-header {
  font-size: 11px;
  font-weight: 600;
  color: #888;
  padding: 6px 10px;
  background: #12121f;
  border-bottom: 1px solid #2a2a3e;
  font-family: monospace;
}

.bv-log-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 10px;
  max-height: 200px;
  min-height: 160px;
}

.bv-log-entry {
  font-family: monospace;
  font-size: 11px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.bv-log-info {
  color: #a0aec0;
}

.bv-log-success {
  color: #68d391;
}

.bv-log-error {
  color: #fc8181;
}

.bv-log-warning {
  color: #fbd38d;
}

.bv-log-empty {
  color: #4a5568;
  font-family: monospace;
  font-size: 11px;
  font-style: italic;
}

@keyframes bv-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

/* Controls */
.bv-controls {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.bv-start-btn {
  padding: 10px 28px;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.bv-start-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.bv-start-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Caption */
.bv-caption {
  text-align: center;
  margin-top: 16px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-style: italic;
  line-height: 1.5;
}

.bv-caption code {
  font-style: normal;
  font-size: 12px;
  padding: 1px 4px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
}
</style>
