<script setup lang="ts">
import { ref, onMounted } from 'vue'

const stars = ref<string | null>(null)
const downloads = ref<string | null>(null)

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return n.toString()
}

onMounted(async () => {
  try {
    const res = await fetch('https://api.github.com/repos/gramiojs/gramio')
    if (res.ok) {
      const data = await res.json()
      stars.value = formatNumber(data.stargazers_count)
    }
  } catch {}

  try {
    const res = await fetch('https://api.npmjs.org/downloads/point/last-month/gramio')
    if (res.ok) {
      const data = await res.json()
      downloads.value = formatNumber(data.downloads)
    }
  } catch {}
})
</script>

<template>
  <div class="hero-badges">
    <a
      v-if="stars !== null"
      href="https://github.com/gramiojs/gramio"
      target="_blank"
      rel="noopener"
      class="hero-badge"
    >
      <span class="hero-badge-icon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
      </span>
      <span class="hero-badge-label">Stars</span>
      <span class="hero-badge-value">{{ stars }}</span>
    </a>
    <a
      v-if="downloads !== null"
      href="https://www.npmjs.com/package/gramio"
      target="_blank"
      rel="noopener"
      class="hero-badge"
    >
      <span class="hero-badge-icon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M0 0v16h16V0H0zm13 13H8v-2H5v2H3V3h10v10z"/>
          <path d="M5 5h2v4H5zm3 0h2v4H8z" fill="var(--vp-c-bg)"/>
        </svg>
      </span>
      <span class="hero-badge-label">Downloads/mo</span>
      <span class="hero-badge-value">{{ downloads }}</span>
    </a>
  </div>
</template>

<style scoped>
.hero-badges {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: var(--vp-c-default-soft);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  transition: border-color 0.25s, color 0.25s;
  line-height: 1;
}

.hero-badge:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.hero-badge-icon {
  display: flex;
  align-items: center;
  opacity: 0.7;
}

.hero-badge-label {
  opacity: 0.7;
}

.hero-badge-value {
  font-weight: 700;
  color: var(--vp-c-text-1);
}
</style>
