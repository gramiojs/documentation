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
        .slice(0, 200)
        .trim();
}

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

function parseTypes(content) {
    const types = [];
    const re =
        /(?<jsdoc>\/\*\*(?:(?!\*\/)[\s\S])*?\*\/\s*)?export\s+(?:interface|type)\s+(?<name>Telegram\w+)\b/g;
    let m;
    while ((m = re.exec(content)) !== null) {
        const { jsdoc = "", name } = m.groups;
        const headerEnd = re.lastIndex;
        let body = "";
        const braceIdx = content.indexOf("{", headerEnd);
        const eqIdx = content.indexOf("=", m.index);
        if (braceIdx !== -1 && (eqIdx === -1 || braceIdx < eqIdx + 400)) {
            const close = findMatchingBrace(content, braceIdx);
            if (close !== -1) {
                body = content.slice(braceIdx, close + 1);
            }
        }
        if (!body) {
            const semi = content.indexOf("\n", headerEnd);
            body = content.slice(headerEnd, semi === -1 ? headerEnd + 200 : semi);
        }
        const header = content
            .slice(m.index, headerEnd)
            .replace(/^\s*\/\*\*[\s\S]*?\*\/\s*/, "")
            .trim();
        const full = `${jsdoc}${header} ${body}`.trim();
        types.push({
            name,
            shortName: name.replace(/^Telegram/, ""),
            full,
            description: extractSummary(jsdoc),
        });
    }
    return types;
}

const { flags, positional: query } = parseArgs();
const showAll = flags.has("--list");
const searchMode = flags.has("--search");

if (!query && !showAll) {
    console.error(
        `Usage: node ${process.argv[1]} [--list | --search] <type-name>`,
    );
    console.error();
    console.error(
        "Look up Telegram Bot API type definitions from the installed @gramio/types package.",
    );
    console.error(
        "  --list           List every type with a one-line summary",
    );
    console.error(
        "  --search <term>  Search in type names and descriptions",
    );
    console.error();
    console.error("Examples:");
    console.error("  node get-bot-api-type.mjs Message          # short name OK");
    console.error("  node get-bot-api-type.mjs TelegramUser     # full name OK");
    console.error("  node get-bot-api-type.mjs --search invoice");
    process.exit(1);
}

const pkgDir = requireInstalled("@gramio/types");
const dtsPath = join(pkgDir, "out", "objects.d.ts");
const content = await readFile(dtsPath, "utf8");
const types = parseTypes(content);

if (types.length === 0) {
    console.error(`Could not parse any types from ${dtsPath}`);
    process.exit(1);
}

if (showAll && !query) {
    console.log(`${types.length} Bot API types available:`);
    console.log();
    for (const t of types) {
        console.log(
            `  ${t.name}${t.description ? " — " + t.description : ""}`,
        );
    }
    process.exit(0);
}

const getBothNames = (t) => [t.name, t.shortName];
const normalize = (s) =>
    s.toLowerCase().startsWith("telegram") ? s : `telegram${s}`;

let matches;
if (searchMode) {
    const q = query.toLowerCase();
    matches = types.filter(
        (t) =>
            t.name.toLowerCase().includes(q) ||
            t.shortName.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q),
    );
    if (matches.length === 0) {
        console.error(`No types matching "${query}"`);
        process.exit(1);
    }
    if (matches.length > 1) {
        console.log(`${matches.length} types matching "${query}":`);
        console.log();
        for (const t of matches) {
            console.log(
                `  ${t.name}${t.description ? " — " + t.description : ""}`,
            );
        }
        process.exit(0);
    }
} else {
    const needle = normalize(query);
    const { exact, fuzzy } = fuzzyMatch(needle, types, (t) => t.name);
    matches = exact;
    if (matches.length === 0) {
        const corrected = tryAutoCorrect(needle, fuzzy);
        if (corrected) matches = [corrected];
    }
    if (matches.length === 0) {
        const q = query.toLowerCase();
        const partial = types.filter(
            (t) =>
                t.name.toLowerCase().includes(q) ||
                t.shortName.toLowerCase().includes(q),
        );
        if (partial.length === 1) {
            console.error(`(assuming "${partial[0].name}" for "${query}")`);
            console.error();
            matches = partial;
        } else if (partial.length > 0) {
            autoCorrectOrFail(
                query,
                fuzzy,
                partial.map((t) => `${t.name} — ${t.description}`),
            );
        } else {
            autoCorrectOrFail(query, fuzzy, []);
        }
    }
}

for (const t of matches) {
    console.log(`--- ${t.name} (${dtsPath}) ---`);
    console.log();
    console.log(t.full);
    console.log();
    console.log(
        `  Tip: Import with \`import type { ${t.name} } from "@gramio/types"\`. Docs: https://gramio.dev/telegram/types/${t.shortName}.md`,
    );
    console.log();
}
