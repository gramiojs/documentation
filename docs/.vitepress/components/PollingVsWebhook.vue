<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const mode = ref<'polling' | 'webhook'>('polling')

// Polling state
const pollingPhase = ref<'request' | 'wait' | 'response'>('request')
const pollingEnvelopeX = ref(0)
const pollingResponseLabel = ref('[]')

// Webhook state
const webhookActive = ref(false)
const webhookEnvelopeX = ref(100)
const webhookEvent = ref(false)

let pollingTimer: ReturnType<typeof setTimeout> | null = null
let webhookTimer: ReturnType<typeof setTimeout> | null = null

function startPolling() {
  stopAllTimers()
  pollingPhase.value = 'request'
  pollingEnvelopeX.value = 0
  runPollingCycle()
}

function runPollingCycle() {
  // Phase 1: Request flies right
  pollingPhase.value = 'request'
  pollingEnvelopeX.value = 0

  pollingTimer = setTimeout(() => {
    pollingEnvelopeX.value = 100
  }, 50)

  // Phase 2: Waiting at Telegram
  pollingTimer = setTimeout(() => {
    pollingPhase.value = 'wait'
  }, 1100)

  // Phase 3: Response flies back
  pollingTimer = setTimeout(() => {
    pollingResponseLabel.value = Math.random() > 0.5 ? '[update]' : '[]'
    pollingPhase.value = 'response'
    pollingEnvelopeX.value = 100
    setTimeout(() => {
      pollingEnvelopeX.value = 0
    }, 50)
  }, 2600)

  // Restart cycle
  pollingTimer = setTimeout(() => {
    if (mode.value === 'polling') {
      runPollingCycle()
    }
  }, 4200)
}

function startWebhook() {
  stopAllTimers()
  webhookActive.value = false
  webhookEvent.value = false
  runWebhookCycle()
}

function runWebhookCycle() {
  // Idle period
  webhookActive.value = false
  webhookEvent.value = false

  // User event appears
  webhookTimer = setTimeout(() => {
    webhookEvent.value = true
  }, 1500)

  // Telegram pushes update
  webhookTimer = setTimeout(() => {
    webhookActive.value = true
    webhookEnvelopeX.value = 100
    setTimeout(() => {
      webhookEnvelopeX.value = 0
    }, 50)
  }, 2200)

  // Processing done, back to idle
  webhookTimer = setTimeout(() => {
    webhookActive.value = false
    webhookEvent.value = false
  }, 3800)

  // Restart cycle
  webhookTimer = setTimeout(() => {
    if (mode.value === 'webhook') {
      runWebhookCycle()
    }
  }, 5000)
}

function stopAllTimers() {
  if (pollingTimer) clearTimeout(pollingTimer)
  if (webhookTimer) clearTimeout(webhookTimer)
}

function switchMode(newMode: 'polling' | 'webhook') {
  mode.value = newMode
  if (newMode === 'polling') {
    startPolling()
  } else {
    startWebhook()
  }
}

onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  stopAllTimers()
})
</script>

<template>
  <div class="pvw-container">
    <div class="pvw-tabs">
      <button
        :class="['pvw-tab', { active: mode === 'polling' }]"
        @click="switchMode('polling')"
      >
        Long Polling
      </button>
      <button
        :class="['pvw-tab', { active: mode === 'webhook' }]"
        @click="switchMode('webhook')"
      >
        Webhook
      </button>
    </div>

    <div class="pvw-stage">
      <!-- Bot side -->
      <div class="pvw-node pvw-bot">
        <div class="pvw-icon">🤖</div>
        <div class="pvw-label">Your Bot</div>
      </div>

      <!-- Animation area -->
      <div class="pvw-track">
        <!-- Polling mode -->
        <template v-if="mode === 'polling'">
          <!-- Request envelope flying right -->
          <div
            v-if="pollingPhase === 'request'"
            class="pvw-envelope pvw-fly-right"
            :class="{ 'pvw-at-end': pollingEnvelopeX === 100 }"
          >
            <span class="pvw-emoji">📤</span>
            <span class="pvw-msg-label">getUpdates</span>
          </div>

          <!-- Waiting dots -->
          <div v-if="pollingPhase === 'wait'" class="pvw-waiting">
            <span class="pvw-dots">⏳</span>
          </div>

          <!-- Response envelope flying left -->
          <div
            v-if="pollingPhase === 'response'"
            class="pvw-envelope pvw-fly-left"
            :class="{ 'pvw-at-start': pollingEnvelopeX === 0 }"
          >
            <span class="pvw-emoji">📩</span>
            <span class="pvw-msg-label">{{ pollingResponseLabel }}</span>
          </div>
        </template>

        <!-- Webhook mode -->
        <template v-if="mode === 'webhook'">
          <div v-if="!webhookActive && !webhookEvent" class="pvw-idle">
            <span class="pvw-idle-text">idle — no traffic</span>
          </div>

          <div v-if="webhookEvent && !webhookActive" class="pvw-event-bubble">
            <span>💬 User sent message</span>
          </div>

          <div
            v-if="webhookActive"
            class="pvw-envelope pvw-fly-left"
            :class="{ 'pvw-at-start': webhookEnvelopeX === 0 }"
          >
            <span class="pvw-emoji">📨</span>
            <span class="pvw-msg-label">POST update</span>
          </div>
        </template>

        <!-- Connection line -->
        <div class="pvw-line" />
      </div>

      <!-- Telegram side -->
      <div class="pvw-node pvw-tg">
        <div class="pvw-icon">✈️</div>
        <div class="pvw-label">Telegram</div>
      </div>
    </div>

    <div class="pvw-caption">
      <template v-if="mode === 'polling'">
        Bot constantly asks Telegram: "Any new updates?" — even if there are none.
      </template>
      <template v-else>
        No traffic when idle. Telegram instantly pushes updates when they arrive.
      </template>
    </div>
  </div>
</template>

<style scoped>
.pvw-container {
  margin: 24px 0;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 20px;
  background: var(--vp-c-bg-soft);
}

.pvw-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  justify-content: center;
}

.pvw-tab {
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

.pvw-tab:hover {
  border-color: var(--vp-c-brand-1);
}

.pvw-tab.active {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  border-color: var(--vp-c-brand-1);
}

.pvw-stage {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 100px;
}

.pvw-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 80px;
  flex-shrink: 0;
}

.pvw-icon {
  font-size: 36px;
  line-height: 1;
}

.pvw-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-align: center;
}

.pvw-track {
  flex: 1;
  position: relative;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.pvw-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--vp-c-border);
  border-radius: 1px;
  z-index: 0;
}

.pvw-envelope {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  z-index: 1;
  transition: left 1s ease-in-out;
}

.pvw-fly-right {
  left: 0;
}

.pvw-fly-right.pvw-at-end {
  left: calc(100% - 40px);
}

.pvw-fly-left {
  left: calc(100% - 40px);
}

.pvw-fly-left.pvw-at-start {
  left: 0;
}

.pvw-emoji {
  font-size: 24px;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.pvw-msg-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  background: var(--vp-c-bg);
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-border);
}

.pvw-waiting {
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  animation: pvw-pulse 1s ease-in-out infinite;
}

.pvw-dots {
  font-size: 24px;
}

@keyframes pvw-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.pvw-idle {
  z-index: 1;
}

.pvw-idle-text {
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-style: italic;
}

.pvw-event-bubble {
  z-index: 1;
  position: absolute;
  right: 10px;
  top: -4px;
  animation: pvw-pop 0.3s ease-out;
}

.pvw-event-bubble span {
  font-size: 12px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 500;
  white-space: nowrap;
}

@keyframes pvw-pop {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.pvw-caption {
  text-align: center;
  margin-top: 16px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-style: italic;
}
</style>
