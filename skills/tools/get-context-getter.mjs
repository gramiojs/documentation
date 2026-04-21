#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
    autoCorrectOrFail,
    fuzzyMatch,
    parseArgs,
    requireInstalled,
    tryAutoCorrect,
} from "./_utils.mjs";

function findMatchingBrace(content, openIdx) {
    let depth = 0;
    for (let i = openIdx; i < content.length; i++) {
        const ch = content[i];
        if (ch === "{") depth++;
        else if (ch === "}") {
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

/**
 * Parse both `declare class X ... {}` and `interface X ... {}` blocks.
 * Merges class + interface pairs (context classes + their mixin-merge interfaces).
 */
function parseDeclarations(content) {
    const decls = new Map();
    const headerRe =
        /(?<jsdoc>\/\*\*(?:(?!\*\/)[\s\S])*?\*\/\s*)?(?<kind>declare\s+class|interface)\s+(?<name>[A-Z]\w+)(?<generics><[^{]*?>)?(?:\s+extends\s+(?<extends>[^{]+?))?\s*\{/g;
    let m;
    while ((m = headerRe.exec(content)) !== null) {
        const { name, kind, extends: ext } = m.groups;
        if (name.startsWith("Telegram")) continue;
        const openBrace = m.index + m[0].length - 1;
        const close = findMatchingBrace(content, openBrace);
        if (close === -1) continue;
        const body = content.slice(openBrace + 1, close);
        const prev = decls.get(name) ?? {
            name,
            kinds: [],
            extends: [],
            members: [],
        };
        prev.kinds.push(kind === "interface" ? "interface" : "class");
        if (ext) {
            const parts = ext
                .split(/,(?![^<]*>)/)
                .map((p) => p.trim().replace(/<.*/, ""))
                .filter((p) => p && p !== "Constructor");
            for (const p of parts) {
                if (!prev.extends.includes(p)) prev.extends.push(p);
            }
        }
        const members = parseMembers(body);
        prev.members.push(...members);
        decls.set(name, prev);
    }
    return decls;
}

function parseMembers(body) {
    const jsdocBlocks = [];
    const jsdocRe = /\/\*\*(?:(?!\*\/)[\s\S])*?\*\//g;
    let jm;
    while ((jm = jsdocRe.exec(body)) !== null) {
        jsdocBlocks.push({ start: jm.index, end: jm.index + jm[0].length, text: jm[0] });
    }
    const stripped = body.replace(jsdocRe, (match) => " ".repeat(match.length));
    const findPrecedingJsdoc = (memberStart) => {
        for (let i = jsdocBlocks.length - 1; i >= 0; i--) {
            const b = jsdocBlocks[i];
            if (b.end <= memberStart) {
                const gap = stripped.slice(b.end, memberStart);
                if (/^\s*$/.test(gap)) return b.text;
                return "";
            }
        }
        return "";
    };

    const members = [];
    const seenGetters = new Set();
    const re =
        /^[ \t]*(?<kw>get|set|static|public|protected|private|readonly|declare|async|#private|\b)\s*(?<name>[a-zA-Z_$][\w$]*)\s*(?<generics><[^;>]*(?:<[^>]*>[^;>]*)*>)?\s*(?<rest>\([^;]*?\)\s*:\s*[^;{]+?|:\s*[^;{]+?|\([^;]*?\))\s*;/gm;
    let m;
    while ((m = re.exec(stripped)) !== null) {
        const { kw, name, rest } = m.groups;
        if (name === "constructor" || name === "private") continue;
        if (name.startsWith("Symbol") || name.startsWith("_")) continue;
        const isGetSet = kw === "get" || kw === "set";
        if (isGetSet) {
            if (seenGetters.has(name)) continue;
            seenGetters.add(name);
        }
        const jsdoc = findPrecedingJsdoc(m.index);
        const sigRaw = m[0];
        const trimmedSig = dedent(sigRaw).trim();
        const kind = isGetSet
            ? "getter"
            : rest.startsWith("(")
              ? "method"
              : "property";
        members.push({
            name,
            kind,
            jsdoc: dedent(jsdoc.trim()),
            signature: trimmedSig,
            summary: extractSummary(jsdoc),
        });
    }
    return members;
}

function extractSummary(jsdoc) {
    if (!jsdoc) return "";
    const body = jsdoc
        .replace(/^\s*\/\*\*/, "")
        .replace(/\*\/\s*$/, "")
        .split("\n")
        .map((l) => l.replace(/^\s*\*\s?/, ""))
        .join(" ")
        .trim();
    const first = body.split(/\.\s/)[0];
    return first
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/\s+/g, " ")
        .slice(0, 160)
        .trim();
}

/** Gather all members from a declaration, recursively pulling in extends chain. */
function collectAllMembers(name, decls, seen = new Set()) {
    if (seen.has(name)) return [];
    seen.add(name);
    const d = decls.get(name);
    if (!d) return [];
    const out = d.members.map((m) => ({ ...m, via: name }));
    for (const parent of d.extends) {
        out.push(...collectAllMembers(parent, decls, seen));
    }
    return out;
}

function dedupeMembers(members) {
    const seen = new Map();
    for (const m of members) {
        const key = `${m.kind === "getter" ? "field" : m.kind}:${m.name}`;
        if (!seen.has(key)) seen.set(key, m);
    }
    return [...seen.values()];
}

const { flags, positional: query } = parseArgs();
const showAll = flags.has("--list");
const searchMode = flags.has("--search");
const deep = flags.has("--deep");

if (!query && !showAll) {
    console.error(
        `Usage: node ${process.argv[1]} [--list | --search | --deep] <ClassName | getter>`,
    );
    console.error();
    console.error(
        "Inspect @gramio/contexts classes, mixins, and wrapper types.",
    );
    console.error(
        "  <ClassName>      Show direct members of a class or interface (e.g. MessageContext, User)",
    );
    console.error(
        "  --deep           With ClassName: recursively include mixed-in / extended members",
    );
    console.error(
        "  --search <name>  Find every class/mixin exposing a getter or method with this name",
    );
    console.error(
        "  --list           List every class/interface in @gramio/contexts",
    );
    console.error();
    console.error("Examples:");
    console.error("  node get-context-getter.mjs MessageContext");
    console.error("  node get-context-getter.mjs MessageContext --deep");
    console.error("  node get-context-getter.mjs User");
    console.error("  node get-context-getter.mjs --search firstName");
    process.exit(1);
}

const pkgDir = requireInstalled("@gramio/contexts");
const dtsPath = join(pkgDir, "dist", "index.d.ts");
const content = await readFile(dtsPath, "utf8");
const decls = parseDeclarations(content);
const allDecls = [...decls.values()];

if (showAll && !query) {
    const contexts = allDecls.filter((d) => d.name.endsWith("Context"));
    const mixins = allDecls.filter((d) => d.name.endsWith("Mixin"));
    const rest = allDecls.filter(
        (d) => !d.name.endsWith("Context") && !d.name.endsWith("Mixin"),
    );
    console.log(`${contexts.length} Context classes:`);
    for (const d of contexts) console.log(`  ${d.name}`);
    console.log();
    console.log(`${mixins.length} Mixins:`);
    for (const d of mixins) console.log(`  ${d.name}`);
    console.log();
    console.log(`${rest.length} Data wrappers (User, Chat, Message, etc.):`);
    for (const d of rest) console.log(`  ${d.name}`);
    process.exit(0);
}

if (searchMode) {
    const q = query.toLowerCase();
    const hits = [];
    for (const d of allDecls) {
        for (const m of d.members) {
            if (m.name.toLowerCase() === q) {
                hits.push({ decl: d.name, member: m });
            }
        }
    }
    if (hits.length === 0) {
        const partial = [];
        for (const d of allDecls) {
            for (const m of d.members) {
                if (m.name.toLowerCase().includes(q)) {
                    partial.push({ decl: d.name, member: m });
                }
            }
        }
        if (partial.length === 0) {
            console.error(`No getter/method named "${query}"`);
            process.exit(1);
        }
        console.log(
            `${partial.length} members partially matching "${query}":`,
        );
        console.log();
        for (const h of partial.slice(0, 30)) {
            console.log(
                `  ${h.decl}.${h.member.name} (${h.member.kind})${h.member.summary ? " — " + h.member.summary : ""}`,
            );
        }
        if (partial.length > 30) console.log(`  …and ${partial.length - 30} more`);
        process.exit(0);
    }
    console.log(
        `"${query}" — found on ${hits.length} class${hits.length === 1 ? "" : "es"}/mixin${hits.length === 1 ? "" : "s"}:`,
    );
    console.log();
    for (const h of hits) {
        console.log(`--- ${h.decl}.${h.member.name} ---`);
        if (h.member.jsdoc) console.log(h.member.jsdoc);
        console.log(h.member.signature);
        console.log();
    }
    process.exit(0);
}

const { exact, fuzzy } = fuzzyMatch(query, allDecls, (d) => d.name);
let target = exact[0];
if (!target) target = tryAutoCorrect(query, fuzzy);
if (!target) {
    autoCorrectOrFail(
        query,
        fuzzy,
        allDecls
            .filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
            .map((d) => d.name),
    );
}

const members = deep
    ? dedupeMembers(collectAllMembers(target.name, decls))
    : target.members.map((m) => ({ ...m, via: target.name }));

console.log(`--- ${target.name} (${dtsPath}) ---`);
if (target.extends.length > 0) {
    console.log(`  extends / mixes: ${target.extends.join(", ")}`);
}
console.log(
    `  kinds: ${[...new Set(target.kinds)].join(", ")} · ${members.length} member${members.length === 1 ? "" : "s"}${deep ? " (recursive)" : " (direct only — pass --deep for inherited)"}`,
);
console.log();

const byKind = { getter: [], method: [], property: [] };
for (const m of members) {
    byKind[m.kind === "getter" ? "getter" : m.kind === "property" ? "property" : "method"].push(m);
}

function printSection(title, items) {
    if (items.length === 0) return;
    console.log(`### ${title} (${items.length})`);
    for (const m of items) {
        const viaNote = deep && m.via !== target.name ? `  [via ${m.via}]` : "";
        console.log(
            `  ${m.name}${m.summary ? " — " + m.summary : ""}${viaNote}`,
        );
    }
    console.log();
}

printSection("Getters / properties", [...byKind.getter, ...byKind.property]);
printSection("Methods", byKind.method);

if (!deep && target.extends.length > 0) {
    console.log(
        `  Pass --deep to also include members from: ${target.extends.join(", ")}`,
    );
}
