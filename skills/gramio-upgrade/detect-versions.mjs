#!/usr/bin/env node
/**
 * detect-versions.mjs — list the gramio / @gramio/* packages a project depends on,
 * with their *installed* versions resolved from node_modules (not just the declared range).
 *
 * Part of the `gramio-upgrade` skill. The agent runs this as step 1 of an upgrade so it
 * knows exactly which versions the user is on before consulting MIGRATIONS.md.
 *
 * Zero dependencies. Runs on Node >=18, Bun, and Deno (all ship a native `fetch`).
 *
 * Usage:
 *   node skills/gramio-upgrade/detect-versions.mjs            # human-readable table
 *   node skills/gramio-upgrade/detect-versions.mjs --json     # JSON array
 *   node skills/gramio-upgrade/detect-versions.mjs --latest   # also fetch npm "latest" + flag upgrades
 *   node skills/gramio-upgrade/detect-versions.mjs --cwd ../my-bot --latest --json
 *
 * Flags:
 *   --json            emit a JSON array instead of a table
 *   --latest          fetch the latest published version from the npm registry per package
 *   --cwd <dir>       project directory to inspect (default: process.cwd())
 *   --timeout <ms>    per-request timeout for --latest fetches (default: 8000)
 *   --help            print this help
 *
 * Output object per package:
 *   { name, declared, installed, latest?, upgrade?, migration? }
 *   - declared  : the version range as written in package.json (e.g. "^0.9.0")
 *   - installed : the resolved version from node_modules, or null when not installed
 *   - latest    : (with --latest) the npm "latest" dist-tag, or null on fetch error
 *   - upgrade   : (with --latest) true when latest is strictly newer than installed/declared
 *   - migration : (with --latest, when upgrade) deep link to the package's section of the
 *                 upgrade guide — paste this whole JSON into the <UpgradePicker/> on that page
 *                 for a full ordered plan, or open the link for the per-package breaking changes.
 *
 * A single missing package or failed fetch never aborts the run — it's reported per-row.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const HELP = `detect-versions.mjs — resolve installed gramio/@gramio/* versions in a project.

  node detect-versions.mjs [--json] [--latest] [--cwd <dir>] [--timeout <ms>]

  --json         JSON array instead of a table
  --latest       fetch npm "latest" per package and flag available upgrades
  --cwd <dir>    project directory to inspect (default: current directory)
  --timeout <ms> per-request timeout for --latest (default: 8000)
  --help         show this help`;

function parseArgs(argv) {
	const opts = { json: false, latest: false, cwd: process.cwd(), timeout: 8000 };
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === "--json") opts.json = true;
		else if (arg === "--latest") opts.latest = true;
		else if (arg === "--help" || arg === "-h") opts.help = true;
		else if (arg === "--cwd") opts.cwd = resolve(argv[++i] ?? ".");
		else if (arg === "--timeout") opts.timeout = Number(argv[++i]) || 8000;
		else if (arg.startsWith("--cwd=")) opts.cwd = resolve(arg.slice(6));
		else if (arg.startsWith("--timeout=")) opts.timeout = Number(arg.slice(10)) || 8000;
	}
	return opts;
}

/** True for packages that belong to the GramIO ecosystem. */
function isGramioPackage(name) {
	return name === "gramio" || name === "wrappergram" || name === "create-gramio" || name.startsWith("@gramio/");
}

/** Read + parse a JSON file, returning null on any failure. */
function readJson(path) {
	try {
		return JSON.parse(readFileSync(path, "utf8"));
	} catch {
		return null;
	}
}

/** Find the project package.json: <cwd>/package.json, walking up if absent. */
function findPackageJson(startDir) {
	let dir = startDir;
	for (let depth = 0; depth < 12; depth++) {
		const candidate = join(dir, "package.json");
		if (existsSync(candidate)) return candidate;
		const parent = dirname(dir);
		if (parent === dir) break;
		dir = parent;
	}
	return null;
}

/**
 * Resolve a package's installed version by walking node_modules up the tree from the
 * project root — handles both flat (npm/yarn) and hoisted layouts. Returns null if not found.
 */
function resolveInstalled(name, projectRoot) {
	let dir = projectRoot;
	for (let depth = 0; depth < 12; depth++) {
		const pkgPath = join(dir, "node_modules", ...name.split("/"), "package.json");
		const pkg = readJson(pkgPath);
		if (pkg && typeof pkg.version === "string") return pkg.version;
		const parent = dirname(dir);
		if (parent === dir) break;
		dir = parent;
	}
	return null;
}

/** Package-level anchor on the upgrade guide. Must match scripts/build-migrations.mjs pkgAnchor(). */
function docAnchor(name) {
	return `pkg-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;
}

/** Strip a range prefix (^, ~, >=, etc.) down to a bare x.y.z core for comparison. */
function coreVersion(v) {
	if (!v) return null;
	const m = String(v).match(/(\d+)\.(\d+)\.(\d+)/);
	return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

/** Returns true when `b` is strictly newer than `a` (semver core only). */
function isNewer(a, b) {
	const ca = coreVersion(a);
	const cb = coreVersion(b);
	if (!ca || !cb) return false;
	for (let i = 0; i < 3; i++) {
		if (cb[i] > ca[i]) return true;
		if (cb[i] < ca[i]) return false;
	}
	return false;
}

async function fetchLatest(name, timeoutMs) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const res = await fetch(`https://registry.npmjs.org/${name}/latest`, {
			signal: controller.signal,
			headers: { accept: "application/json" },
		});
		if (!res.ok) return { latest: null, error: `HTTP ${res.status}` };
		const body = await res.json();
		return { latest: typeof body?.version === "string" ? body.version : null };
	} catch (err) {
		return { latest: null, error: err?.name === "AbortError" ? "timeout" : String(err?.message ?? err) };
	} finally {
		clearTimeout(timer);
	}
}

async function main() {
	const opts = parseArgs(process.argv.slice(2));
	if (opts.help) {
		console.log(HELP);
		return;
	}

	const pkgJsonPath = findPackageJson(opts.cwd);
	if (!pkgJsonPath) {
		process.stderr.write(`No package.json found at or above ${opts.cwd}\n`);
		process.exitCode = 1;
		return;
	}

	const pkgJson = readJson(pkgJsonPath);
	if (!pkgJson) {
		process.stderr.write(`Failed to parse ${pkgJsonPath}\n`);
		process.exitCode = 1;
		return;
	}

	const projectRoot = dirname(pkgJsonPath);
	const fields = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
	const declared = new Map();
	for (const field of fields) {
		const deps = pkgJson[field];
		if (!deps || typeof deps !== "object") continue;
		for (const [name, range] of Object.entries(deps)) {
			if (isGramioPackage(name) && !declared.has(name)) declared.set(name, range);
		}
	}

	const names = [...declared.keys()].sort();
	const rows = names.map((name) => ({
		name,
		declared: declared.get(name),
		installed: resolveInstalled(name, projectRoot),
	}));

	if (opts.latest) {
		const results = await Promise.all(rows.map((row) => fetchLatest(row.name, opts.timeout)));
		rows.forEach((row, i) => {
			const { latest, error } = results[i];
			row.latest = latest;
			if (error) row.latestError = error;
			const current = row.installed ?? row.declared;
			row.upgrade = latest ? isNewer(current, latest) : false;
			if (row.upgrade) row.migration = `https://gramio.dev/guides/upgrading#${docAnchor(row.name)}`;
		});
	}

	if (opts.json) {
		process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
		return;
	}

	if (rows.length === 0) {
		console.log(`No gramio / @gramio/* dependencies found in ${pkgJsonPath}`);
		return;
	}

	const header = opts.latest
		? ["package", "declared", "installed", "latest", "upgrade?"]
		: ["package", "declared", "installed"];
	const table = rows.map((row) => {
		const base = [row.name, row.declared ?? "—", row.installed ?? "(not installed)"];
		if (!opts.latest) return base;
		return [...base, row.latestError ? `err: ${row.latestError}` : row.latest ?? "—", row.upgrade ? "yes ↑" : "—"];
	});
	const widths = header.map((h, c) => Math.max(h.length, ...table.map((r) => String(r[c]).length)));
	const line = (cols) => cols.map((cell, c) => String(cell).padEnd(widths[c])).join("  ");
	console.log(line(header));
	console.log(widths.map((w) => "-".repeat(w)).join("  "));
	for (const row of table) console.log(line(row));

	const upgradable = rows.filter((r) => r.upgrade);
	if (opts.latest && upgradable.length) {
		console.log("");
		console.log("Upgrades available. Migration steps per package:");
		for (const row of upgradable) console.log(`  ${row.name.padEnd(widths[0])}  ${row.migration}`);
		console.log("");
		console.log("Tip: re-run with --json and paste the output into the <UpgradePicker/> on");
		console.log("https://gramio.dev/guides/upgrading for the full ordered plan. Offline copy:");
		console.log("skills/gramio-upgrade/MIGRATIONS.md");
	}
}

main().catch((err) => {
	process.stderr.write(`${err?.stack ?? err}\n`);
	process.exitCode = 1;
});
