import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";

const GRAMIO_PACKAGES = ["gramio", "@gramio/types", "@gramio/contexts"];

function levenshtein(a, b) {
    if (a === b) return 0;
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const prev = new Array(b.length + 1);
    const curr = new Array(b.length + 1);
    for (let j = 0; j <= b.length; j++) prev[j] = j;
    for (let i = 1; i <= a.length; i++) {
        curr[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
            curr[j] = Math.min(
                curr[j - 1] + 1,
                prev[j] + 1,
                prev[j - 1] + cost,
            );
        }
        for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
    }
    return prev[b.length];
}

export function fuzzyMatch(query, items, getName) {
    const q = query.toLowerCase();
    const exact = items.filter((it) => getName(it).toLowerCase() === q);
    if (exact.length > 0) return { exact, fuzzy: [] };
    const fuzzy = items
        .map((item) => {
            const name = getName(item);
            return { item, name, dist: levenshtein(q, name.toLowerCase()) };
        })
        .sort((a, b) => a.dist - b.dist);
    return { exact: [], fuzzy };
}

export function tryAutoCorrect(query, fuzzy) {
    if (fuzzy.length === 0 || fuzzy[0].dist > 2) return null;
    const best = fuzzy[0].dist;
    const tied = fuzzy.filter((f) => f.dist === best);
    if (tied.length !== 1) return null;
    console.error(`(assuming "${tied[0].name}" for "${query}")`);
    console.error();
    return tied[0].item;
}

export function autoCorrectOrFail(query, fuzzy, partialMatches) {
    if (partialMatches.length > 0) {
        console.error(`No exact match for "${query}". Similar:`);
        for (const name of partialMatches.slice(0, 20)) {
            console.error(`  ${name}`);
        }
    } else if (fuzzy.length > 0 && fuzzy[0].dist <= 5) {
        console.error(`No match for "${query}". Did you mean:`);
        for (const s of fuzzy.filter((s) => s.dist <= 5).slice(0, 10)) {
            console.error(`  ${s.name}`);
        }
    } else {
        console.error(`Nothing found matching "${query}"`);
    }
    process.exit(1);
}

export function parseArgs() {
    const args = process.argv.slice(2);
    const flags = new Set();
    const positional = [];
    for (const arg of args) {
        if (arg.startsWith("--")) flags.add(arg);
        else positional.push(arg);
    }
    return { flags, positional: positional[0], positionals: positional };
}

function findPackageRoot(req, startDir) {
    let dir = startDir;
    for (let i = 0; i < 6; i++) {
        const pj = join(dir, "package.json");
        if (existsSync(pj)) return dir;
        const parent = dirname(dir);
        if (parent === dir) break;
        dir = parent;
    }
    return startDir;
}

export function resolvePackageDir(pkg, from = process.cwd()) {
    const req = createRequire(join(from, "__stub.js"));
    try {
        const entry = req.resolve(`${pkg}/package.json`);
        return dirname(entry);
    } catch {}
    try {
        const entry = req.resolve(pkg);
        return findPackageRoot(req, dirname(entry));
    } catch {}
    let dir = from;
    for (let i = 0; i < 6; i++) {
        const candidate = join(dir, "node_modules", pkg);
        if (existsSync(join(candidate, "package.json"))) return candidate;
        const parent = dirname(dir);
        if (parent === dir) break;
        dir = parent;
    }
    return null;
}

export function requireInstalled(pkg) {
    const dir = resolvePackageDir(pkg);
    if (!dir) {
        console.error(
            `Could not find ${pkg} in node_modules. Install it first:\n  npm install ${pkg}`,
        );
        process.exit(1);
    }
    return dir;
}

export { GRAMIO_PACKAGES };
