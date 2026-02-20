<script setup lang="ts">
const PRIMITIVES = new Set([
  "String", "Integer", "Float", "Boolean", "True", "False", "Int",
]);

const props = defineProps<{
  name: string;
  type: string;
  description: string;
  required?: boolean;
  defaultValue?: string | number;
  constValue?: string;
  min?: number | string;
  max?: number | string;
  minLen?: number;
  maxLen?: number;
  enumValues?: (string | number)[];
}>();

const hasConstraints =
  props.min !== undefined ||
  props.max !== undefined ||
  props.minLen !== undefined ||
  props.maxLen !== undefined;

interface TypeSegment {
  label: string;
  url: string | null;
  cssClass: string;
}

function getClass(raw: string): string {
  const base = raw.replace(/(\[\])+$/, "").trim();
  if (base === "String") return "type-string";
  if (base === "Integer" || base === "Float" || base === "Int") return "type-number";
  if (base === "Boolean" || base === "True" || base === "False") return "type-boolean";
  if (raw.endsWith("[]") || raw.startsWith("Array")) return "type-array";
  if (/^[A-Z]/.test(base)) return "type-object";
  return "type-other";
}

function parseSegment(raw: string): TypeSegment {
  const trimmed = raw.trim();
  const base = trimmed.replace(/(\[\])+$/, "").trim();
  const isRef = /^[A-Z]/.test(base) && !PRIMITIVES.has(base);
  return {
    label: trimmed,
    url: isRef ? `/telegram/types/${base}` : null,
    cssClass: getClass(trimmed),
  };
}

const segments = props.type.split(" | ").map(parseSegment);

// Inline markdown → HTML: `code`, [text](url), **bold**, _italic_, *italic*
function renderMd(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}
</script>

<template>
  <div class="api-param" :class="required ? 'is-required' : 'is-optional'">
    <div class="api-param-header">
      <code class="api-param-name">{{ name }}</code>
      <span class="api-param-types">
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
      <span class="api-param-const" v-if="constValue !== undefined">
        = <code>{{ constValue }}</code>
      </span>
      <span class="api-param-badge" :class="required ? 'badge-required' : 'badge-optional'">
        {{ required ? "Required" : "Optional" }}
      </span>
      <span class="api-param-default" v-if="defaultValue !== undefined">
        Default: <code>{{ defaultValue }}</code>
      </span>
      <span class="api-param-constraints" v-if="hasConstraints">
        <span v-if="min !== undefined">min {{ min }}</span>
        <span v-if="max !== undefined">max {{ max }}</span>
        <span v-if="minLen !== undefined">minLen {{ minLen }}</span>
        <span v-if="maxLen !== undefined">maxLen {{ maxLen }}</span>
      </span>
    </div>
    <div class="api-param-enum" v-if="enumValues && enumValues.length > 0">
      <span class="api-param-enum-label">Values:</span>
      <code v-for="val in enumValues" :key="String(val)" class="api-param-enum-value">{{ val }}</code>
    </div>
    <div class="api-param-desc" v-html="renderMd(description)" />
  </div>
</template>
