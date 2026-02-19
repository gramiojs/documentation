<script setup lang="ts">
const PRIMITIVES = new Set([
  "String", "Integer", "Float", "Boolean", "True", "False", "Int",
]);

const props = defineProps<{
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string | number;
  min?: number | string;
  max?: number | string;
}>();

interface TypeSegment {
  label: string;
  url: string | null;
  cssClass: string;
}

function cssClass(raw: string): string {
  const base = raw.replace(/\[\]$/, "").trim();
  if (base === "String") return "type-string";
  if (base === "Integer" || base === "Float" || base === "Int") return "type-number";
  if (base === "Boolean" || base === "True" || base === "False") return "type-boolean";
  if (raw.endsWith("[]") || raw.startsWith("Array")) return "type-array";
  if (base.length > 0 && /^[A-Z]/.test(base)) return "type-object";
  return "type-other";
}

function parseSegment(raw: string): TypeSegment {
  const trimmed = raw.trim();
  const base = trimmed.replace(/\[\]$/, "").trim();
  const isRef = /^[A-Z]/.test(base) && !PRIMITIVES.has(base);
  return {
    label: trimmed,
    url: isRef ? `/telegram/types/${base}` : null,
    cssClass: cssClass(trimmed),
  };
}

const segments = props.type.split(" | ").map(parseSegment);
</script>

<template>
  <div class="api-param" :class="required ? 'is-required' : 'is-optional'">
    <div class="api-param-header">
      <code class="api-param-name">{{ name }}</code>
      <span class="api-param-types">
        <a
          v-for="seg in segments.filter(s => s.url)"
          :key="seg.label + '_hidden'"
          style="display:none"
          :href="seg.url!"
        />
        <template v-for="seg in segments" :key="seg.label">
          <a
            v-if="seg.url"
            :href="seg.url"
            class="api-param-type"
            :class="seg.cssClass"
          >{{ seg.label }}</a>
          <span
            v-else
            class="api-param-type"
            :class="seg.cssClass"
          >{{ seg.label }}</span>
        </template>
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
