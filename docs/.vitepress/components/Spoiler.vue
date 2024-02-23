<script lang="ts">
import { ref } from 'vue'

export default {
  setup() {
    const hide = ref<HTMLDivElement>()

    return {
      hide,
    }
  },
  mounted() {
    const slot = this.$slots.default!()[0]

    const textLength = slot.children?.length as number || 10
    const dotCount = textLength * 35

    // for (let i = 0; i < this.hide!.offsetHeight; i++) {
    //   for (let j = 0; j < this.hide!.offsetWidth; j++) {
    //     if (Math.random() > 0.5) continue;
    //
    //     let dot = document.createElement('div')
    //     dot.classList.add('dot')
    //
    //     dot.style.top = i + 'px'
    //     dot.style.left = j + 'px'
    //
    //     let size = Math.random() * 0.5
    //
    //     dot.style.height = size + 'mm'
    //     dot.style.width = size + 'mm'
    //
    //     this.hide!.appendChild(dot)
    //   }
    // }

    for (let i = 0; i < dotCount; i++) {
      let dot = document.createElement('div')
      dot.classList.add('dot')

      dot.style.top = this.hide!.offsetHeight * Math.random() + 'px'
      dot.style.left = this.hide!.offsetWidth * Math.random() + 'px'

      let size = Math.random() * 0.5

      dot.style.height = size + 'mm'
      dot.style.width = size + 'mm'

      this.hide!.appendChild(dot)
    }
  },
}
</script>

<template>
  <div class="spoiler">
    <slot></slot>
    <div ref="hide" class="hide"></div>
  </div>
</template>

<style>
.spoiler {
  width: fit-content;
  height: fit-content;
  position: relative;
}

.spoiler:hover .hide {
  opacity: 0;
}

.hide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--vp-c-bg);
  max-width: 400px;
  overflow: hidden;
  animation: move;
  opacity: 1;
  transition: opacity 0.3s ease-in;
}

.dot {
  position: absolute;
  border-radius: 50%;
  background: white;
  animation: move 2s linear infinite;
}

@keyframes move {
  0% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(100%, 100%);
  }

  100% {
    transform: translate(0, 0);
  }
}
</style>