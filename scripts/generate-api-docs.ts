#!/usr/bin/env bun
/**
 * Generate Telegram Bot API reference pages from @gramio/schema-parser
 *
 * Behavior:
 *   New page     → creates full template with empty user-maintained sections
 *   Existing page → only replaces content between <!-- GENERATED:START/END --> markers
 *                   (all user content outside the block is preserved)
 *
 * Usage:
 *   bun run gen:api           — fetch fresh schema and generate all pages
 *   bun run gen:api --dry-run — print stats without writing files
 */

import { getCustomSchema } from "@gramio/schema-parser";
import type {
	Field,
	FieldArray,
	FieldBoolean,
	FieldFloat,
	FieldInteger,
	FieldOneOf,
	FieldReference,
	FieldString,
	Method,
} from "@gramio/schema-parser";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// ── Paths ────────────────────────────────────────────────────────────────────

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DOCS = join(ROOT, "docs");
const METHODS_DIR = join(DOCS, "telegram", "methods");
const TYPES_DIR = join(DOCS, "telegram", "types");
const EN_LOCALE = join(DOCS, ".vitepress", "config", "locales", "en.locale.ts");

const DRY_RUN = process.argv.includes("--dry-run");

mkdirSync(METHODS_DIR, { recursive: true });
mkdirSync(TYPES_DIR, { recursive: true });

// ── Type utilities ────────────────────────────────────────────────────────────

/**
 * Distribute Omit<_, "key"> over the union so TypeScript keeps the
 * discriminated-union narrowing inside switch/if on `.type`.
 */
type FieldNoKey =
	| Omit<FieldInteger, "key">
	| Omit<FieldFloat, "key">
	| Omit<FieldString, "key">
	| Omit<FieldBoolean, "key">
	| Omit<FieldArray, "key">
	| Omit<FieldReference, "key">
	| Omit<FieldOneOf, "key">;

/** Converts a schema field type to the display string used in <ApiParam type="..."> */
function typeStr(f: FieldNoKey): string {
	switch (f.type) {
		case "string":
			return "String";
		case "integer":
			return "Integer";
		case "float":
			return "Float";
		case "boolean":
			// const: true → "True", const: false → "False" (literal types)
			if (f.const !== undefined) return f.const ? "True" : "False";
			return "Boolean";
		case "reference":
			return f.reference.name;
		case "array":
			return `${typeStr(f.arrayOf)}[]`;
		case "one_of":
			return f.variants.map(typeStr).join(" | ");
	}
}

const TG_BASE = "https://core.telegram.org";
const TG_API = `${TG_BASE}/bots/api`;

/**
 * Converts relative Telegram docs links in descriptions to absolute URLs.
 * The schema-parser preserves these as relative paths (e.g. /bots/features, #message)
 * which VitePress would treat as broken internal links.
 */
function fixTelegramLinks(s: string): string {
	return (
		s
			// #anchor → full Bot API URL (e.g. [Message](#message) → full link)
			.replace(/\]\(#([a-zA-Z0-9_-]+)\)/g, `](${TG_API}#$1)`)
			// Any relative Telegram path: /bots/... /passport#... /widgets/... etc.
			.replace(
				/\]\(\/((?:bots|widgets|payments|api|telegram|passport|support|apps)[^)]*)\)/g,
				`](${TG_BASE}/$1)`,
			)
	);
}

/** Escapes a string for use in an HTML attribute value (double-quoted) */
function escAttr(s: string): string {
	return fixTelegramLinks(s)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/\n/g, " ")
		.trim();
}

/** Converts a Field to an <ApiParam .../> component line */
function toApiParam(field: Field): string {
	const type = typeStr(field);

	const attrs: string[] = [`name="${field.key}"`, `type="${type}"`];
	if (field.required) attrs.push("required");
	if (field.description) attrs.push(`description="${escAttr(field.description)}"`);

	if (field.type === "integer" || field.type === "float") {
		if (field.min !== undefined) attrs.push(`:min="${field.min}"`);
		if (field.max !== undefined) attrs.push(`:max="${field.max}"`);
		if (field.default !== undefined) attrs.push(`:defaultValue="${field.default}"`);
		if (field.enum && field.enum.length > 0)
			attrs.push(`:enumValues='${JSON.stringify(field.enum)}'`);
	}

	if (field.type === "string") {
		if (field.minLen !== undefined) attrs.push(`:minLen="${field.minLen}"`);
		if (field.maxLen !== undefined) attrs.push(`:maxLen="${field.maxLen}"`);
		if (field.default !== undefined) attrs.push(`defaultValue="${escAttr(field.default)}"`);
		if (field.const !== undefined) attrs.push(`constValue="${escAttr(field.const)}"`);
		if (field.enum && field.enum.length > 0)
			attrs.push(`:enumValues='${JSON.stringify(field.enum)}'`);
	}

	return `<ApiParam ${attrs.join(" ")} />`;
}

// ── Returns type helpers ──────────────────────────────────────────────────────

/** Produces the HTML for the "Returns:" badge — links Telegram type references */
function returnBadge(f: FieldNoKey): string {
	switch (f.type) {
		case "reference":
			return `<a href="/telegram/types/${f.reference.name}">${f.reference.name}</a>`;
		case "array": {
			// Unwrap nested arrays to find the innermost reference (e.g. KeyboardButton[][])
			let inner: FieldNoKey = f.arrayOf;
			let depth = 1;
			while (inner.type === "array") {
				inner = inner.arrayOf;
				depth++;
			}
			if (inner.type === "reference") {
				const n = inner.reference.name;
				const brackets = "[]".repeat(depth);
				return `<a href="/telegram/types/${n}">${n}${brackets}</a>`;
			}
			return typeStr(f);
		}
		case "one_of":
			// Render all variants with links (e.g. "Message | True")
			return f.variants.map(returnBadge).join(" | ");
		case "boolean":
			return "True";
		default:
			return typeStr(f);
	}
}

/** Produces the prose "On success, …" returns description line */
function returnDesc(f: FieldNoKey): string {
	switch (f.type) {
		case "reference":
			return `On success, the [${f.reference.name}](/telegram/types/${f.reference.name}) object is returned.`;
		case "array":
			if (f.arrayOf.type === "reference") {
				const n = f.arrayOf.reference.name;
				return `On success, an array of [${n}](/telegram/types/${n}) objects is returned.`;
			}
			return "On success, an array is returned.";
		case "boolean":
			return "On success, *True* is returned.";
		default:
			return `On success, ${typeStr(f)} is returned.`;
	}
}

// ── GENERATED block builders ──────────────────────────────────────────────────

const GEN_START = "<!-- GENERATED:START -->";
const GEN_END = "<!-- GENERATED:END -->";

function buildMethodBlock(method: Method): string {
	// The library types Method.returns as Omit<Field,"key"> (non-distributed),
	// cast to our distributed FieldNoKey so switch narrowing works inside helpers.
	const returns = method.returns as FieldNoKey;
	const officialUrl = `https://core.telegram.org/bots/api${method.anchor}`;
	const params = method.parameters.map(toApiParam).join("\n\n");
	const paramsSection =
		method.parameters.length > 0 ? `## Parameters\n\n${params}\n\n` : "";
	const description = method.description ? fixTelegramLinks(method.description) : "";
	const multipartBadge = method.hasMultipart
		? `\n  <span class="api-badge multipart">📎 Accepts files</span>`
		: "";

	return `${GEN_START}
<div class="api-badge-row">
  <span class="api-badge returns">Returns: ${returnBadge(returns)}</span>${multipartBadge}
  <a class="api-badge official" href="${officialUrl}" target="_blank" rel="noopener">Official docs ↗</a>
</div>

${description}

${paramsSection}## Returns

${returnDesc(returns)}
${GEN_END}`;
}

function buildObjectBlock(obj: {
	name: string;
	anchor: string;
	description?: string;
	fields?: Field[];
	oneOf?: FieldNoKey[];
}): string {
	const officialUrl = `https://core.telegram.org/bots/api${obj.anchor}`;
	const description = obj.description ? fixTelegramLinks(obj.description) : "";

	let fieldsSection = "";
	if (obj.fields && obj.fields.length > 0) {
		fieldsSection = `## Fields\n\n${obj.fields.map(toApiParam).join("\n\n")}\n`;
	} else if (obj.oneOf && obj.oneOf.length > 0) {
		const variants = obj.oneOf
			.map((v) => {
				const name = typeStr(v).replace(/\[\]$/, "");
				return `- [${typeStr(v)}](/telegram/types/${name})`;
			})
			.join("\n");
		fieldsSection = `## Variants\n\nThis type is one of the following:\n\n${variants}\n`;
	}

	return `${GEN_START}
<div class="api-badge-row">
  <a class="api-badge official" href="${officialUrl}" target="_blank" rel="noopener">Official docs ↗</a>
</div>

${description}

${fieldsSection}
${GEN_END}`;
}

// ── Merge strategy ────────────────────────────────────────────────────────────

/**
 * Replaces only the content between GENERATED markers in an existing file.
 * Everything outside the markers (frontmatter, user sections) is untouched.
 */
function applyGeneratedBlock(existing: string, newBlock: string): string {
	const startIdx = existing.indexOf(GEN_START);
	const endIdx = existing.indexOf(GEN_END);

	if (startIdx === -1 || endIdx === -1) {
		console.warn("    ⚠️  GENERATED markers not found — skipping update");
		return existing;
	}

	return (
		existing.slice(0, startIdx) + newBlock + existing.slice(endIdx + GEN_END.length)
	);
}

// ── Page templates (for new files only) ──────────────────────────────────────

function methodTemplate(name: string, block: string): string {
	return `---
title: ${name} — Telegram Bot API | GramIO
head:
  - - meta
    - name: description
      content: ${name} Telegram Bot API method with GramIO TypeScript examples. Complete parameter reference and usage guide.
  - - meta
    - name: keywords
      content: ${name}, telegram bot api, gramio ${name}, ${name} typescript, ${name} example
---

# ${name}

${block}

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## Errors

<!-- TODO: Add common errors table -->

## Tips & Gotchas

<!-- TODO: Add tips and gotchas -->

## See Also

<!-- TODO: Add related methods and links -->
`;
}

function typeTemplate(name: string, block: string): string {
	return `---
title: ${name} — Telegram Bot API Types | GramIO
head:
  - - meta
    - name: description
      content: ${name} Telegram Bot API type reference. All fields with TypeScript types and GramIO usage examples.
  - - meta
    - name: keywords
      content: ${name}, telegram bot api types, gramio ${name}, ${name} object, ${name} typescript
---

# ${name}

${block}

## GramIO Usage

<!-- TODO: Add TypeScript examples using GramIO -->

## See Also

<!-- TODO: Add related types and methods -->
`;
}

// ── Skills index ─────────────────────────────────────────────────────────────

const SKILLS_INDEX = join(ROOT, "skills", "references", "telegram-api-index.md");

/**
 * Extracts the first sentence from a markdown description.
 * Strips inline markdown links, keeps plain text.
 */
function firstSentence(desc?: string): string {
	if (!desc) return "";
	// Remove markdown links: [text](url) → text
	const plain = desc.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
	// Take up to first period+space or end of string, max 120 chars
	const match = plain.match(/^(.+?\.)\s/);
	const sentence = match ? match[1] : plain.split("\n")[0];
	return sentence.slice(0, 120).trim();
}

function buildSkillsIndex(
	methods: { name: string; description?: string }[],
	objects: { name: string; description?: string }[],
	version: { major: number; minor: number },
): string {
	const methodLines = methods
		.map((m) => {
			const desc = firstSentence(m.description);
			return `| [${m.name}](/telegram/methods/${m.name}) | ${desc} |`;
		})
		.join("\n");

	return `# Telegram Bot API Methods Index

> Auto-generated from Bot API v${version.major}.${version.minor}. Full docs at **https://gramio.dev/telegram/**

When a user asks about a specific Telegram Bot API method, reference the GramIO doc page.
Each method page has: full parameter reference with types, GramIO TypeScript examples, common errors, and tips.

To look up a **type/object** (e.g. \`Message\`, \`User\`, \`InlineKeyboardMarkup\`):
→ https://gramio.dev/telegram/types/{TypeName}
→ Full types index: https://gramio.dev/telegram/ (scroll to Types section)
→ Key type: [Update](/telegram/types/Update) — the root object for all incoming updates

## Methods (${methods.length})

| Method | Description |
|--------|-------------|
${methodLines}
`;
}

function writeSkillsIndex(
	methods: { name: string; description?: string }[],
	objects: { name: string; description?: string }[],
	version: { major: number; minor: number },
): void {
	const content = buildSkillsIndex(methods, objects, version);
	if (!DRY_RUN) {
		writeFileSync(SKILLS_INDEX, content, "utf-8");
	}
	console.log(
		`✅ ${DRY_RUN ? "[dry-run] Would write" : "Written"} skills index → skills/references/telegram-api-index.md`,
	);
}

// ── Sidebar update ────────────────────────────────────────────────────────────

const SIDEBAR_START_MARKER = "// BEGIN:TELEGRAM-SIDEBAR";
const SIDEBAR_END_MARKER = "// END:TELEGRAM-SIDEBAR";

function buildSidebarEntry(name: string, path: string): string {
	return `\t\t\t\t\t\t\t\t{ text: "${name}", link: "${path}" }`;
}

function buildSidebarBlock(methods: string[], types: string[]): string {
	const methodItems = methods
		.map((n) => buildSidebarEntry(n, `/telegram/methods/${n}`))
		.join(",\n");
	const typeItems = types
		.map((n) => buildSidebarEntry(n, `/telegram/types/${n}`))
		.join(",\n");

	return `${SIDEBAR_START_MARKER}
				"/telegram/": [
					{
						text: "Telegram API Reference",
						link: "/telegram/",
						items: [
							{
								text: "Methods",
								collapsed: true,
								items: [
${methodItems},
								],
							},
							{
								text: "Types",
								collapsed: true,
								items: [
${typeItems},
								],
							},
						],
					},
				],
				${SIDEBAR_END_MARKER}`;
}

function updateSidebar(methods: string[], types: string[]): void {
	let content = readFileSync(EN_LOCALE, "utf-8");
	const newBlock = buildSidebarBlock(methods, types);

	if (content.includes(SIDEBAR_START_MARKER)) {
		// Replace between existing markers
		const start = content.indexOf(SIDEBAR_START_MARKER);
		const end = content.indexOf(SIDEBAR_END_MARKER) + SIDEBAR_END_MARKER.length;
		content = content.slice(0, start) + newBlock + content.slice(end);
	} else {
		// First run: find existing "/telegram/": [ block and replace it using bracket counting
		const key = `"/telegram/": [`;
		const keyIdx = content.indexOf(key);
		if (keyIdx === -1) {
			console.warn("⚠️  Could not find /telegram/ in en.locale.ts sidebar");
			return;
		}

		// Walk forward counting brackets to find the matching ]
		let depth = 0;
		let i = keyIdx + key.length - 1; // start at the opening [
		while (i < content.length) {
			if (content[i] === "[") depth++;
			else if (content[i] === "]") {
				depth--;
				if (depth === 0) {
					let end = i + 1;
					if (content[end] === ",") end++; // include trailing comma
					content = content.slice(0, keyIdx) + newBlock + "," + content.slice(end);
					break;
				}
			}
			i++;
		}
	}

	if (!DRY_RUN) {
		writeFileSync(EN_LOCALE, content, "utf-8");
	}
	console.log(`✅ ${DRY_RUN ? "[dry-run] Would update" : "Updated"} sidebar in en.locale.ts`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

if (DRY_RUN) console.log("🔍 DRY RUN — no files will be written\n");

console.log("⏳ Fetching Telegram Bot API schema...");
const schema = await getCustomSchema();
console.log(
	`✅ Schema v${schema.version.major}.${schema.version.minor} ` +
		`(${schema.methods.length} methods, ${schema.objects.length} types)\n`,
);

let created = 0;
let updated = 0;
let skipped = 0;

// ── Methods ───────────────────────────────────────────────────────────────────
console.log("📋 Methods:");
for (const method of schema.methods) {
	const filePath = join(METHODS_DIR, `${method.name}.md`);
	const block = buildMethodBlock(method);

	if (existsSync(filePath)) {
		const existing = readFileSync(filePath, "utf-8");
		const next = applyGeneratedBlock(existing, block);
		if (next !== existing) {
			if (!DRY_RUN) writeFileSync(filePath, next, "utf-8");
			updated++;
			console.log(`  🔄 ${method.name}`);
		} else {
			skipped++;
		}
	} else {
		if (!DRY_RUN) writeFileSync(filePath, methodTemplate(method.name, block), "utf-8");
		created++;
		console.log(`  ✨ ${method.name}`);
	}
}

// ── Types / Objects ───────────────────────────────────────────────────────────
console.log("\n📦 Types:");
for (const obj of schema.objects) {
	const filePath = join(TYPES_DIR, `${obj.name}.md`);
	const block = buildObjectBlock(obj as any);

	if (existsSync(filePath)) {
		const existing = readFileSync(filePath, "utf-8");
		const next = applyGeneratedBlock(existing, block);
		if (next !== existing) {
			if (!DRY_RUN) writeFileSync(filePath, next, "utf-8");
			updated++;
			console.log(`  🔄 ${obj.name}`);
		} else {
			skipped++;
		}
	} else {
		if (!DRY_RUN) writeFileSync(filePath, typeTemplate(obj.name, block), "utf-8");
		created++;
		console.log(`  ✨ ${obj.name}`);
	}
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
console.log("");
const methodNames = schema.methods.map((m) => m.name).sort((a, b) => a.localeCompare(b));
const typeNames = schema.objects.map((o) => o.name).sort((a, b) => a.localeCompare(b));
updateSidebar(methodNames, typeNames);

// ── Skills index ──────────────────────────────────────────────────────────────
writeSkillsIndex(schema.methods, schema.objects, schema.version);

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(
	`\n📊 Summary: ✨ created ${created}  🔄 updated ${updated}  ⏭️  skipped ${skipped}`,
);
console.log(
	`   Total: ${schema.methods.length} methods + ${schema.objects.length} types = ${schema.methods.length + schema.objects.length} pages`,
);
