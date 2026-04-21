#!/usr/bin/env node
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import {
    autoCorrectOrFail,
    fuzzyMatch,
    parseArgs,
    resolvePackageDir,
    tryAutoCorrect,
} from "./_utils.mjs";

const KNOWN_PLUGINS = [
    "session",
    "scenes",
    "i18n",
    "autoload",
    "prompt",
    "callback-data",
    "auto-retry",
    "auto-answer-callback-query",
    "media-cache",
    "media-group",
    "split",
    "files",
    "format",
    "keyboards",
    "views",
    "jsx",
    "pagination",
    "init-data",
    "posthog",
    "opentelemetry",
    "sentry",
    "storage",
    "storage-redis",
    "test",
    "types",
    "contexts",
];

function findMatchingBrace(content, openIdx, open = "{", close = "}") {
    let depth = 0;
    for (let i = openIdx; i < content.length; i++) {
        const ch = content[i];
        if (ch === open) depth++;
        else if (ch === close) {
            depth--;
            if (depth === 0) return i;
        }
    }
    return -1;
}

function dedent(text) {
    const lines = text.split("\n");
    let min = Infinity;
    for (const l of lines) {
        if (l.trim().length === 0) continue;
        const indent = l.search(/\S/);
        if (indent >= 0 && indent < min) min = indent;
    }
    if (!Number.isFinite(min) || min === 0) return text;
    return lines.map((l) => l.slice(min)).join("\n");
}

function extractSummary(jsdoc) {
    if (!jsdoc) return "";
    const body = jsdoc
        .replace(/^\s*\/\*\*/, "")
        .replace(/\*\/\s*$/, "")
        .split("\n")
        .map((l) => l.replace(/^\s*\*\s?/, ""))
        .join("\n")
        .trim();
    const first = body.split(/\n\s*\n/)[0].replace(/\s+/g, " ");
    return first
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .slice(0, 220)
        .trim();
}

function parseExports(content) {
    const exported = new Set();
    const reNamed = /export\s*\{([^}]+)\}/g;
    let m;
    while ((m = reNamed.exec(content)) !== null) {
        for (const token of m[1].split(",")) {
            const name = token.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0];
            if (name) exported.add(name.trim());
        }
    }
    const reDirect = /export\s+(?:declare\s+)?(?:function|class|const|let|var|interface|type|enum)\s+(\w+)/g;
    while ((m = reDirect.exec(content)) !== null) {
        exported.add(m[1]);
    }
    return exported;
}

function parseTopLevelFunctions(content) {
    const fns = [];
    const re =
        /(?<jsdoc>\/\*\*(?:(?!\*\/)[\s\S])*?\*\/\s*)?declare\s+function\s+(?<name>\w+)\s*(?<generics><[^>]*>)?\s*\(/g;
    let m;
    while ((m = re.exec(content)) !== null) {
        const { jsdoc = "", name } = m.groups;
        const openParen = m.index + m[0].length - 1;
        const closeParen = findMatchingBrace(content, openParen, "(", ")");
        if (closeParen === -1) continue;
        let depthAngle = 0;
        let depthBrace = 0;
        let depthParen = 0;
        let endIdx = -1;
        for (let i = closeParen + 1; i < content.length; i++) {
            const ch = content[i];
            if (ch === "<") depthAngle++;
            else if (ch === ">") depthAngle = Math.max(0, depthAngle - 1);
            else if (ch === "{") depthBrace++;
            else if (ch === "}") depthBrace = Math.max(0, depthBrace - 1);
            else if (ch === "(") depthParen++;
            else if (ch === ")") depthParen = Math.max(0, depthParen - 1);
            else if (ch === ";" && depthAngle === 0 && depthBrace === 0 && depthParen === 0) {
                endIdx = i;
                break;
            }
        }
        if (endIdx === -1) continue;
        const returnType = content.slice(closeParen + 1, endIdx).trim();
        const fullSig = content.slice(
            m.index + (jsdoc?.length ?? 0),
            endIdx + 1,
        );
        fns.push({
            name,
            jsdoc,
            summary: extractSummary(jsdoc),
            signature: dedent(fullSig).trim(),
            returnType,
        });
    }
    return fns;
}

function summarizeDerive(returnType) {
    const m = returnType.match(/Plugin<[^,]*,\s*([\s\S]*?)(?:,\s*[^,]*)?>\s*;?$/);
    if (!m) return null;
    return m[1].trim().replace(/\s+/g, " ").slice(0, 600);
}

async function findPluginDir(name) {
    const candidates = [
        `@gramio/${name}`,
        `gramio-${name}`,
        name,
    ];
    for (const c of candidates) {
        const dir = resolvePackageDir(c);
        if (dir) return { dir, pkg: c };
    }
    return null;
}

async function listInstalledPlugins() {
    const out = [];
    const gramioNsPath = join(process.cwd(), "node_modules", "@gramio");
    if (existsSync(gramioNsPath)) {
        const names = await readdir(gramioNsPath);
        for (const n of names) {
            const dir = join(gramioNsPath, n);
            if (existsSync(join(dir, "package.json"))) {
                out.push({ name: n, pkg: `@gramio/${n}`, dir });
            }
        }
    }
    return out;
}

async function findEntryDts(dir) {
    const pkg = JSON.parse(
        await readFile(join(dir, "package.json"), "utf8"),
    );
    const candidates = [
        pkg.types,
        pkg.typings,
        pkg.exports?.["."]?.types,
        pkg.exports?.["."]?.import?.types,
        pkg.exports?.["."]?.default?.types,
        "./dist/index.d.ts",
        "./out/index.d.ts",
        "./index.d.ts",
    ].filter(Boolean);
    for (const c of candidates) {
        const p = c.startsWith(".") ? join(dir, c) : join(dir, c);
        if (existsSync(p)) return p;
    }
    return null;
}

const { flags, positional: query } = parseArgs();
const showAll = flags.has("--list");

if (!query && !showAll) {
    console.error(
        `Usage: node ${process.argv[1]} [--list] <plugin-name>`,
    );
    console.error();
    console.error(
        "Inspect an installed @gramio/* plugin: export summary, main function signature, derive shape.",
    );
    console.error(
        "  <plugin-name>  Short (session) or full (@gramio/session) name",
    );
    console.error(
        "  --list         List all installed @gramio/* packages",
    );
    console.error();
    console.error("Examples:");
    console.error("  node get-plugin.mjs session");
    console.error("  node get-plugin.mjs scenes");
    console.error("  node get-plugin.mjs --list");
    process.exit(1);
}

if (showAll && !query) {
    const installed = await listInstalledPlugins();
    if (installed.length === 0) {
        console.log("No @gramio/* packages installed.");
        console.log();
        console.log("Known plugins you can install:");
        for (const n of KNOWN_PLUGINS) {
            console.log(`  npm install @gramio/${n}`);
        }
        process.exit(0);
    }
    console.log(`${installed.length} @gramio/* packages installed:`);
    console.log();
    for (const p of installed) {
        console.log(`  ${p.pkg}`);
    }
    process.exit(0);
}

const short = query.replace(/^@gramio\//, "");
const hit = await findPluginDir(short);
if (hit) {
    await runOnDir(hit.dir, hit.pkg);
} else {
    const installed = await listInstalledPlugins();
    const { exact, fuzzy } = fuzzyMatch(short, installed, (p) => p.name);
    if (exact.length > 0) {
        await runOnDir(exact[0].dir, exact[0].pkg);
    } else {
        const corrected = tryAutoCorrect(short, fuzzy);
        if (corrected) {
            await runOnDir(corrected.dir, corrected.pkg);
        } else {
            const { fuzzy: fuzzyKnown } = fuzzyMatch(
                short,
                KNOWN_PLUGINS.map((n) => ({ name: n })),
                (p) => p.name,
            );
            console.error(
                `Plugin "${query}" is not installed and no close match was found.`,
            );
            if (fuzzyKnown.length > 0 && fuzzyKnown[0].dist <= 4) {
                console.error();
                console.error("Did you mean one of these known plugins?");
                for (const f of fuzzyKnown.filter((f) => f.dist <= 4).slice(0, 5)) {
                    console.error(`  npm install @gramio/${f.name}`);
                }
            }
            process.exit(1);
        }
    }
}

async function runOnDir(dir, pkg) {
    const dts = await findEntryDts(dir);
    if (!dts) {
        console.error(`No .d.ts entry found in ${dir}`);
        process.exit(1);
    }
    const content = await readFile(dts, "utf8");
    const exports = parseExports(content);
    const fns = parseTopLevelFunctions(content).filter((f) => exports.has(f.name));

    const pkgJson = JSON.parse(
        await readFile(join(dir, "package.json"), "utf8"),
    );

    console.log(`--- ${pkg} (v${pkgJson.version}) ---`);
    console.log(`  Entry: ${dts}`);
    if (pkgJson.description) console.log(`  ${pkgJson.description}`);
    console.log();

    if (exports.size > 0) {
        console.log(`### Exports (${exports.size})`);
        console.log(`  ${[...exports].sort().join(", ")}`);
        console.log();
    }

    if (fns.length > 0) {
        console.log(`### Functions (${fns.length})`);
        for (const f of fns) {
            console.log();
            console.log(`--- ${f.name}() ---`);
            if (f.summary) console.log(`${f.summary}`);
            console.log();
            console.log(f.signature);
            const derive = summarizeDerive(f.returnType);
            if (derive) {
                console.log();
                console.log(`  Derives onto context: ${derive}`);
            }
        }
        console.log();
    }

    if (fns.length > 0) {
        console.log(
            `  Tip: Register with \`bot.extend(${fns[0].name}(options))\`.`,
        );
    }
    if (pkg.startsWith("@gramio/")) {
        console.log(
            `  Docs: https://gramio.dev/plugins/official/${pkg.slice("@gramio/".length)}.md`,
        );
    }
}
