<script setup lang="ts">
const props = defineProps<{
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string | number;
  min?: number | string;
  max?: number | string;
}>();

// Split union types like "Integer | String" into separate badges
const typeList = props.type.split(" | ").map((t) => t.trim());

function typeClass(t: string): string {
  if (t === "String") return "type-string";
  if (t === "Integer" || t === "Float") return "type-number";
  if (t === "Boolean") return "type-boolean";
  if (t.endsWith("[]") || t.startsWith("Array")) return "type-array";
  // Capitalized = Telegram type reference object
  if (t.length > 0 && t[0] === t[0].toUpperCase() && t[0] !== t[0].toLowerCase()) return "type-object";
  return "type-other";
}
</script>

<template>
  <div class="api-param" :class="required ? 'is-required' : 'is-optional'">
    <div class="api-param-header">
      <code class="api-param-name">{{ name }}</code>
      <span class="api-param-types">
        <span
          v-for="t in typeList"
          :key="t"
          class="api-param-type"
          :class="typeClass(t)"
        >{{ t }}</span>
      </span>
      <span class="api-param-badge" :class="required ? 'badge-required' : 'badge-optional'">
        {{ required ? "Required" : "Optional" }}
      </span>
      <span class="api-param-default" v-if="defaultValue !== undefined">
        Default: <code>{{ defaultValue }}</code>
      </span>
      <span class="api-param-constraints" v-if="min !== undefined || max !== undefined">
        <span v-if="min !== undefined">min {{ min }}</span>
        <span v-if="max !== undefined">max {{ max }}</span>
      </span>
    </div>
    <div class="api-param-desc">
      <slot />
    </div>
  </div>
</template>
