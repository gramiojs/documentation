import { execSync } from "child_process";
import {
	existsSync,
	readdirSync,
	readFileSync,
	renameSync,
	rmSync,
	writeFileSync,
} from "fs";
import { join } from "path";

const API_DIR = "docs/api";
const SIDEBAR_FILE = join(API_DIR, "typedoc-sidebar.json");

// Map: generated dir-name → clean slug used in URLs
// (src is relative to docs/api/, dest is the new name under docs/api/)
const MODULE_RENAME_MAP: Record<string, string> = {
	"Library-for-easily-manage-callback-data": "callback-data",
};

console.log("🔧 Generating TypeDoc API reference...");

// Clean previous output (but preserve hand-written index.md if it exists)
if (existsSync(API_DIR)) {
	const handwrittenIndex = existsSync(`${API_DIR}/index.md.bak`)
		? readFileSync(`${API_DIR}/index.md.bak`, "utf-8")
		: null;
	rmSync(API_DIR, { recursive: true, force: true });
}

// Run TypeDoc
execSync("bunx typedoc", { stdio: "inherit" });

// ─── Step 1: Flatten @gramio/xxx/dist/ → xxx/ ─────────────────────────────
const gramioDir = join(API_DIR, "@gramio");
if (existsSync(gramioDir)) {
	for (const pkg of readdirSync(gramioDir)) {
		const pkgDir = join(gramioDir, pkg);
		const distDir = join(pkgDir, "dist");
		const dest = join(API_DIR, pkg);

		if (existsSync(distDir)) {
			// Move docs/api/@gramio/contexts/dist/ → docs/api/contexts/
			if (existsSync(dest)) rmSync(dest, { recursive: true });
			renameSync(distDir, dest);
			console.log(`  ✓ @gramio/${pkg}/dist → docs/api/${pkg}`);
		} else {
			// No dist/ subfolder: move the whole pkg dir
			if (existsSync(dest)) rmSync(dest, { recursive: true });
			renameSync(pkgDir, dest);
			console.log(`  ✓ @gramio/${pkg} → docs/api/${pkg}`);
		}
	}
	rmSync(gramioDir, { recursive: true, force: true });
}

// ─── Step 2: Flatten gramio/dist/ → gramio/ ───────────────────────────────
const gramioDistDir = join(API_DIR, "gramio", "dist");
if (existsSync(gramioDistDir)) {
	const gramioDestTmp = join(API_DIR, "gramio-tmp");
	renameSync(gramioDistDir, gramioDestTmp);
	rmSync(join(API_DIR, "gramio"), { recursive: true, force: true });
	renameSync(gramioDestTmp, join(API_DIR, "gramio"));
	console.log(`  ✓ gramio/dist → docs/api/gramio`);
}

// ─── Step 3: Apply MODULE_RENAME_MAP for weird module names ───────────────
for (const [from, to] of Object.entries(MODULE_RENAME_MAP)) {
	const src = join(API_DIR, from);
	const dest = join(API_DIR, to);
	if (existsSync(src)) {
		if (existsSync(dest)) rmSync(dest, { recursive: true });
		renameSync(src, dest);
		console.log(`  ✓ ${from} → docs/api/${to}`);
	}
}

// ─── Step 4: Fix all .md file links ───────────────────────────────────────
const glob = new Bun.Glob("**/*.md");
const mdFiles = Array.from(
	glob.scanSync({ cwd: API_DIR, absolute: true }),
);

const LINK_REPLACEMENTS: [RegExp, string][] = [
	// @gramio/xxx/dist/ → xxx/
	[/\/@gramio\/(\w[\w-]*)\/dist\//g, "/$1/"],
	[/\.\.\/@gramio\/(\w[\w-]*)\/dist\//g, "../$1/"],
	[/@gramio\/(\w[\w-]*)\/dist\//g, "$1/"],
	// gramio/dist/ → gramio/
	[/\/gramio\/dist\//g, "/gramio/"],
	[/gramio\/dist\//g, "gramio/"],
	// callback-data weird name in links
	[/\/Library-for-easily-manage-callback-data\//g, "/callback-data/"],
	[/\.\.\/Library-for-easily-manage-callback-data\//g, "../callback-data/"],
];

for (const file of mdFiles) {
	let content = readFileSync(file, "utf-8");
	let changed = false;
	for (const [pattern, replacement] of LINK_REPLACEMENTS) {
		const newContent = content.replace(pattern, replacement);
		if (newContent !== content) {
			content = newContent;
			changed = true;
		}
	}
	if (changed) writeFileSync(file, content);
}
console.log(`  ✓ Fixed links in ${mdFiles.length} .md files`);

// ─── Step 5: Fix typedoc-sidebar.json ─────────────────────────────────────
if (existsSync(SIDEBAR_FILE)) {
	let content = readFileSync(SIDEBAR_FILE, "utf-8");

	// Fix paths and text entries
	const sidebarReplacements: [RegExp, string][] = [
		// links: /api/@gramio/xxx/dist/ → /api/xxx/
		[/\/api\/@gramio\/(\w[\w-]*)\/dist\//g, "/api/$1/"],
		// text: @gramio/xxx/dist → xxx
		[/"@gramio\/([\w-]+)\/dist"/g, '"$1"'],
		// links: /api/gramio/dist/ → /api/gramio/
		[/\/api\/gramio\/dist\//g, "/api/gramio/"],
		// callback-data weird name
		[/Library-for-easily-manage-callback-data/g, "callback-data"],
		// storage-redis has /ioredis sub-path: /api/storage-redis/dist/ioredis/ → /api/storage-redis/
		[/\/api\/storage-redis\/dist\/ioredis\//g, "/api/storage-redis/"],
		[/"@gramio\/storage-redis\/dist\/ioredis"/g, '"storage-redis"'],
	];

	for (const [pattern, replacement] of sidebarReplacements) {
		content = content.replace(pattern, replacement);
	}

	// Fix .md extension in links (VitePress prefers clean URLs)
	content = content.replace(/\.md"/g, '"');

	writeFileSync(SIDEBAR_FILE, content);
	console.log("  ✓ Fixed typedoc-sidebar.json");
}

// ─── Step 5b: Remove VitePress-incompatible namespace dirs ────────────────
// Dirs with `[...]` in names are interpreted as VitePress dynamic routes
const glob2 = new Bun.Glob("**/namespaces/**/index.md");
const namespaceDirs = new Set<string>();
for (const file of glob2.scanSync({ cwd: API_DIR, absolute: true })) {
	const dir = file.replace("/index.md", "");
	if (dir.includes("[") || dir.includes("]") || dir.includes("(https:")) {
		namespaceDirs.add(dir);
	}
}
for (const dir of namespaceDirs) {
	rmSync(dir, { recursive: true, force: true });
	console.log(`  ✓ Removed incompatible namespace dir: ${dir.split("/").pop()}`);
}

// ─── Step 6: Write/restore the hand-written API landing page ──────────────
writeApiIndexPage();

function writeApiIndexPage() {
	const indexPath = join(API_DIR, "index.md");
	writeFileSync(
		indexPath,
		`---
title: GramIO API Reference
description: TypeScript API reference auto-generated from source .d.ts files of all GramIO packages — classes, interfaces, types, and methods.
keywords: [gramio, api reference, typescript, typedoc, contexts, keyboards, format]
---

# GramIO API Reference

TypeScript API reference auto-generated from the \`.d.ts\` files of all GramIO packages. Browse classes, interfaces, type aliases, and their full signatures.

> **Tip:** Looking for Telegram Bot API types and method parameters? See the [Telegram API Reference](/telegram/) which documents the official Bot API from a Telegram perspective.

## Core Packages

| Package | Description |
|---------|-------------|
| [gramio](/api/gramio/) | Main \`Bot\` class and core re-exports |
| [@gramio/contexts](/api/contexts/) | All context classes (\`MessageContext\`, \`CallbackQueryContext\`, etc.) — **most important for bot development** |
| [@gramio/keyboards](/api/keyboards/) | \`Keyboard\`, \`InlineKeyboard\`, \`RemoveKeyboard\`, \`ForceReply\` builders |
| [@gramio/files](/api/files/) | \`MediaUpload\`, \`MediaInput\` — file upload helpers |
| [@gramio/format](/api/format/) | \`format\`, \`bold\`, \`italic\`, \`code\`, and other text formatting utilities |
| [@gramio/callback-data](/api/callback-data/) | \`CallbackData\` — type-safe callback data builder |
| [@gramio/composer](/api/composer/) | \`Composer\` — standalone middleware composer |

## Plugin Packages

| Package | Description |
|---------|-------------|
| [@gramio/scenes](/api/scenes/) | Scene-based conversation flows |
| [@gramio/session](/api/session/) | Session storage plugin |
| [@gramio/storage](/api/storage/) | Storage adapter interface |
| [@gramio/i18n](/api/i18n/) | Internationalization plugin |
| [@gramio/autoload](/api/autoload/) | Auto-load handlers from files |
| [@gramio/auto-retry](/api/auto-retry/) | Automatic retry on Telegram API errors |
| [@gramio/prompt](/api/prompt/) | Prompt for user input within handlers |
| [@gramio/init-data](/api/init-data/) | Telegram Mini App init data validation |

## Most-Used Classes

Quick links to the most frequently referenced types:

- [\`MessageContext\`](/api/contexts/classes/MessageContext) — handler context for incoming messages
- [\`InlineKeyboard\`](/api/keyboards/classes/InlineKeyboard) — inline keyboard builder
- [\`Keyboard\`](/api/keyboards/classes/Keyboard) — reply keyboard builder
- [\`Bot\`](/api/gramio/classes/Bot) — main bot class
- [\`format\`](/api/format/functions/format) — tagged template literal for formatting

## Generation

These pages are auto-generated by [TypeDoc](https://typedoc.org) with \`typedoc-plugin-markdown\` and \`typedoc-vitepress-theme\`.

Run locally:

\`\`\`bash
bun run gen:typedoc
\`\`\`
`,
	);
}

const count = mdFiles.length;
console.log(`✅ TypeDoc generated: ${API_DIR}/ (${count} pages)`);
