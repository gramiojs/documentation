#!/usr/bin/env node
/**
 * build-migrations.mjs — generate the human/agent-facing upgrade docs from the single
 * source of truth `public/migrations.json`.
 *
 * Outputs:
 *   - skills/gramio-upgrade/MIGRATIONS.md          (EN markdown, agent-facing — whole file)
 *   - docs/guides/upgrading.md                     (EN — only the generated block)
 *   - docs/ru/guides/upgrading.md                  (RU — only the generated block)
 *
 * The two upgrading.md pages keep their hand-written prose; only the region between
 *   <!-- BEGIN GENERATED:migrations --> … <!-- END GENERATED:migrations -->
 * is replaced. Pages that don't exist yet (or lack the markers) are skipped with a warning.
 *
 * Usage:
 *   node scripts/build-migrations.mjs          # write the files
 *   node scripts/build-migrations.mjs --check  # verify on-disk matches (CI); exit 1 on drift
 *
 * Run via `bun run build:migrations` / `bun run build:migrations -- --check`.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "public", "migrations.json");

const BEGIN = "<!-- BEGIN GENERATED:migrations -->";
const END = "<!-- END GENERATED:migrations -->";

const BUCKET_EMOJI = { breaking: "⚠️", deprecated: "🗑", new: "✨", fixes: "🐛" };
const BUCKET_ORDER = ["breaking", "deprecated", "new", "fixes"];

/** Stable slug used for heading anchors and detect-versions.mjs cross-links. */
function slug(s) {
	return String(s)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/** Package-level anchor — detect-versions.mjs builds the same string. */
function pkgAnchor(name) {
	return `pkg-${slug(name)}`;
}

/** Per-entry anchor — used for direct links and the picker. */
function entryAnchor(name, from, to) {
	return `${slug(name)}-${from ? slug(from) : "init"}-${slug(to)}`;
}

function lang(obj, l) {
	if (!obj) return "";
	return obj[l] ?? obj.en ?? "";
}

/**
 * Escape angle brackets in prose so VitePress (which renders markdown through Vue) doesn't
 * treat inline type syntax like `EventContextOf<T, E>` or `Storage<Data>` as an HTML tag.
 * Only applied to the website block; the agent-facing MIGRATIONS.md keeps raw `<`/`>`.
 * Fenced code blocks are left untouched — VitePress escapes those itself.
 */
function escapeProse(s, web) {
	if (!web) return s;
	return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderCode(item) {
	const before = item.before;
	const after = item.after;
	if (!before && !after) return "";
	const lines = ["  ```ts"];
	if (before && after) {
		lines.push(`  // Before\n  ${before.split("\n").join("\n  ")}`);
		lines.push(`  // After\n  ${after.split("\n").join("\n  ")}`);
	} else {
		const code = after ?? before;
		lines.push(`  ${code.split("\n").join("\n  ")}`);
	}
	lines.push("  ```");
	return `\n${lines.join("\n")}`;
}

function renderItem(item, l, opts) {
	// items are shaped { en: { title, desc }, ru: { title, desc }, before?, after? }
	const heading = escapeProse(item[l]?.title ?? item.en?.title ?? "", opts.web);
	const desc = escapeProse(item[l]?.desc ?? item.en?.desc ?? "", opts.web);
	const line = desc ? `- **${heading}** — ${desc}` : `- **${heading}**`;
	return opts.code === false ? line : line + renderCode(item);
}

// Full view (website) shows everything. Lean view (agent ledger) keeps the REQUIRED-to-bump
// buckets (breaking + deprecated) plus a no-code "✨ New" list so the agent can proactively
// suggest useful new features — but drops 🐛 fixes (informational, not actionable for the user).
const FULL_BUCKETS = ["breaking", "deprecated", "new", "fixes"];
const LEAN_REQUIRED_BUCKETS = ["breaking", "deprecated"];
// Lean view only keeps before/after code for breaking changes (the codemod the agent applies);
// the "✨ New" list is titles + one-line descriptions only.
const LEAN_CODE_BUCKETS = new Set(["breaking"]);

function renderEntry(name, entry, l, labels, opts) {
	const lean = opts.variant === "lean";
	const out = [];
	const from = entry.from;
	const head = `${from ? `${from} → ` : "→ "}${entry.to} · [changelog](${entry.changelog})`;
	const anchor = opts.anchors ? ` {#${entryAnchor(name, from, entry.to)}}` : "";
	out.push(`### ${head}${anchor}`);
	out.push("");

	let hasRequired = false;

	if (entry.pendingPublish) {
		out.push(l === "ru" ? "> ⚠️ Версия помечена тегом, но ещё не опубликована в npm." : "> ⚠️ Tagged but not yet published to npm.");
		out.push("");
		hasRequired = true;
	}
	if (lean && entry.upgradeStraightTo) {
		out.push(
			l === "ru"
				? `> ⏭ Не останавливайтесь на промежуточной версии — обновляйтесь сразу до **${entry.upgradeStraightTo}**.`
				: `> ⏭ Don't stop on an in-between version — upgrade straight to **${entry.upgradeStraightTo}**.`,
		);
		out.push("");
		hasRequired = true;
	}
	for (const note of entry.notes ?? []) {
		out.push(`> ${escapeProse(lang(note, l), opts.web)}`);
		out.push("");
	}

	// Required buckets (full: all four; lean: breaking + deprecated, rendered in the loop).
	for (const bucket of lean ? LEAN_REQUIRED_BUCKETS : FULL_BUCKETS) {
		const items = entry[bucket];
		if (!items || items.length === 0) continue;
		const code = lean && !LEAN_CODE_BUCKETS.has(bucket) ? false : true;
		out.push(`**${BUCKET_EMOJI[bucket]} ${labels[bucket][l]}**`);
		out.push("");
		for (const item of items) out.push(renderItem(item, l, { web: opts.web, code }));
		out.push("");
		hasRequired = true;
	}

	if (entry.peerBumps && entry.peerBumps.length) {
		out.push(`**🔧 ${labels.peerBumps[l]}**`);
		out.push("");
		out.push(`- ${escapeProse(entry.peerBumps.join(", "), opts.web)}`);
		out.push("");
		hasRequired = true;
	}

	// Lean view: surface new features (no code) so the agent can suggest the useful ones,
	// and explicitly mark a hop as a safe no-op when nothing is required.
	if (lean) {
		const news = entry.new ?? [];
		if (!hasRequired && news.length === 0) {
			out.push(
				l === "ru"
					? "_Ничего делать не нужно — для этого перехода нет обязательных изменений._"
					: "_Nothing to do — no required changes for this hop._",
			);
		} else {
			if (!hasRequired) {
				out.push(l === "ru" ? "✅ Безопасный бамп — обязательных изменений в коде нет." : "✅ Safe bump — no required code changes.");
				out.push("");
			}
			if (news.length) {
				const hint = l === "ru" ? "опционально — предложите пользователю то, что пригодится проекту" : "optional — suggest the ones that fit the project";
				out.push(`**${BUCKET_EMOJI.new} ${labels.new[l]}** — ${hint}`);
				out.push("");
				for (const item of news) out.push(renderItem(item, l, { web: opts.web, code: false }));
				out.push("");
			}
		}
	}

	return out.join("\n").trimEnd();
}

function renderLedgerBody(data, l, opts) {
	const labels = data.labels;
	const names = Object.keys(data.packages).sort((a, b) => {
		const la = data.packages[a].layer ?? 99;
		const lb = data.packages[b].layer ?? 99;
		if (la !== lb) return la - lb;
		return a.localeCompare(b);
	});

	const sections = [];
	for (const name of names) {
		const pkg = data.packages[name];
		const anchor = opts.anchors ? ` {#${pkgAnchor(name)}}` : "";
		const block = [`## \`${name}\`${anchor}`, ""];
		for (const entry of pkg.entries) {
			block.push(renderEntry(name, entry, l, labels, opts));
			block.push("");
		}
		sections.push(block.join("\n").trimEnd());
	}
	return sections.join("\n\n");
}

function renderMigrationsMd(data) {
	const intro = [
		"<!-- AUTO-GENERATED from public/migrations.json — do not edit by hand. Run `bun run build:migrations`. -->",
		"",
		"# GramIO Migration Ledger",
		"",
		"> **Source of truth:** `public/migrations.json`. This file is generated from it.",
		">",
		"> **Upgrade-focused view.** Per package, newest version first. Each `### x → y` entry shows:",
		">",
		"> - **⚠️ Breaking** — you MUST change this for the upgrade to keep working (with before/after).",
		"> - **🗑 Deprecated** — you SHOULD change this; the old way still works for now.",
		"> - **🔧 Peer/dep bumps** — versions that must move together (peer-dependency ranges).",
		"> - **⏭ / ⚠️ notes** — skip a known-bad release, or a version not yet on npm.",
		"> - **✨ New** — features the version unlocks (titles only). **Not required** to bump, but after upgrading,",
		">   look these over and proactively tell the user which ones could help their project (offer to wire them up).",
		">   Pull the actual code from the linked **changelog** / `/guides/upgrading` when they say yes.",
		">",
		"> A hop with nothing to do is marked _“nothing to do”_; a feature-only hop is marked _“✅ safe bump”_.",
		"> 🐛 bug-fix notes live in the changelog, not here.",
		">",
		"> Packages are ordered by dependency layer (types/composer → contexts/files/format → gramio → plugins → tooling),",
		"> which is also the order you should bump them.",
		"",
		"---",
		"",
	].join("\n");
	return `${intro}\n${renderLedgerBody(data, "en", { web: false, anchors: false, variant: "lean" })}\n`;
}

function replaceBlock(filePath, l, data) {
	if (!existsSync(filePath)) {
		return { path: filePath, status: "missing" };
	}
	const original = readFileSync(filePath, "utf8");
	const bi = original.indexOf(BEGIN);
	const ei = original.indexOf(END);
	if (bi === -1 || ei === -1 || ei < bi) {
		return { path: filePath, status: "no-markers" };
	}
	const generated = `${BEGIN}\n\n${renderLedgerBody(data, l, { web: true, anchors: true, variant: "full" })}\n\n${END}`;
	const next = original.slice(0, bi) + generated + original.slice(ei + END.length);
	return { path: filePath, status: "ok", original, next };
}

function main() {
	const check = process.argv.includes("--check");
	const data = JSON.parse(readFileSync(SOURCE, "utf8"));

	const targets = [
		{ path: join(ROOT, "skills", "gramio-upgrade", "MIGRATIONS.md"), content: renderMigrationsMd(data) },
	];

	const blockTargets = [
		{ path: join(ROOT, "docs", "guides", "upgrading.md"), lang: "en" },
		{ path: join(ROOT, "docs", "ru", "guides", "upgrading.md"), lang: "ru" },
	];

	let drift = false;
	const writes = [];

	for (const t of targets) {
		const onDisk = existsSync(t.path) ? readFileSync(t.path, "utf8") : null;
		if (onDisk === t.content) continue;
		if (check) {
			drift = true;
			console.error(`drift: ${t.path}`);
		} else {
			writes.push([t.path, t.content]);
		}
	}

	for (const bt of blockTargets) {
		const res = replaceBlock(bt.path, bt.lang, data);
		if (res.status === "missing") {
			console.warn(`skip (not found yet): ${bt.path}`);
			continue;
		}
		if (res.status === "no-markers") {
			console.warn(`skip (no GENERATED markers): ${bt.path}`);
			continue;
		}
		if (res.original === res.next) continue;
		if (check) {
			drift = true;
			console.error(`drift: ${bt.path}`);
		} else {
			writes.push([bt.path, res.next]);
		}
	}

	if (check) {
		if (drift) {
			console.error("\nGenerated files are out of sync with public/migrations.json. Run `bun run build:migrations`.");
			process.exitCode = 1;
		} else {
			console.log("migrations: generated files are in sync ✓");
		}
		return;
	}

	for (const [path, content] of writes) {
		writeFileSync(path, content);
		console.log(`wrote ${path}`);
	}
	if (writes.length === 0) console.log("migrations: nothing to write (already up to date)");
}

main();
