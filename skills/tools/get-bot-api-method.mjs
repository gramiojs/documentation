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
        .slice(0, 180)
        .trim();
}

function parseMethods(content) {
    const start = content.indexOf("export interface APIMethods {");
    if (start === -1) return [];
    const body = content.slice(start);
    const end = body.indexOf("\n}\n");
    const block = end === -1 ? body : body.slice(0, end);

    const methods = [];
    const re =
        /(?<jsdoc>[ \t]*\/\*\*(?:(?!\*\/)[\s\S])*?\*\/\s*)?(?<signature>[ \t]*(?<name>\w+):\s*CallAPI\w*<[\s\S]*?>)\s*(?=\n|$)/g;
    let m;
    while ((m = re.exec(block)) !== null) {
        const { jsdoc = "", signature, name } = m.groups;
        const full = dedent(`${jsdoc}${signature}`).trim();
        methods.push({
            name,
            full,
            description: extractSummary(jsdoc),
        });
    }
    return methods;
}

const { flags, positional: query } = parseArgs();
const showAll = flags.has("--list");
const searchMode = flags.has("--search");

if (!query && !showAll) {
    console.error(
        `Usage: node ${process.argv[1]} [--list | --search] <method-name>`,
    );
    console.error();
    console.error(
        "Look up Telegram Bot API method signatures from the installed @gramio/types package.",
    );
    console.error(
        "  --list           List every method with a one-line summary",
    );
    console.error(
        "  --search <term>  Search in method names and descriptions",
    );
    console.error();
    console.error("Examples:");
    console.error("  node get-bot-api-method.mjs sendMessage");
    console.error("  node get-bot-api-method.mjs --search payment");
    console.error("  node get-bot-api-method.mjs --list");
    process.exit(1);
}

const pkgDir = requireInstalled("@gramio/types");
const dtsPath = join(pkgDir, "out", "methods.d.ts");
const content = await readFile(dtsPath, "utf8");
const methods = parseMethods(content);

if (methods.length === 0) {
    console.error(`Could not parse any methods from ${dtsPath}`);
    process.exit(1);
}

if (showAll && !query) {
    console.log(`${methods.length} Bot API methods available:`);
    console.log();
    for (const m of methods) {
        console.log(`  ${m.name}${m.description ? " — " + m.description : ""}`);
    }
    process.exit(0);
}

let matches;
if (searchMode) {
    const q = query.toLowerCase();
    matches = methods.filter(
        (m) =>
            m.name.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q),
    );
    if (matches.length === 0) {
        console.error(`No methods matching "${query}"`);
        process.exit(1);
    }
    if (matches.length > 1) {
        console.log(`${matches.length} methods matching "${query}":`);
        console.log();
        for (const m of matches) {
            console.log(
                `  ${m.name}${m.description ? " — " + m.description : ""}`,
            );
        }
        process.exit(0);
    }
} else {
    const { exact, fuzzy } = fuzzyMatch(query, methods, (m) => m.name);
    matches = exact;
    if (matches.length === 0) {
        const corrected = tryAutoCorrect(query, fuzzy);
        if (corrected) matches = [corrected];
    }
    if (matches.length === 0) {
        const q = query.toLowerCase();
        const byName = methods.filter((m) => m.name.toLowerCase().includes(q));
        const partial =
            byName.length > 0
                ? byName
                : methods.filter((m) =>
                      m.description.toLowerCase().includes(q),
                  );
        if (partial.length === 1) {
            console.error(`(assuming "${partial[0].name}" for "${query}")`);
            console.error();
            matches = partial;
        } else if (partial.length > 0) {
            autoCorrectOrFail(
                query,
                fuzzy,
                partial.map((m) => `${m.name} — ${m.description}`),
            );
        } else {
            autoCorrectOrFail(query, fuzzy, []);
        }
    }
}

for (const method of matches) {
    console.log(`--- ${method.name} (${dtsPath}) ---`);
    console.log();
    console.log(method.full);
    console.log();
    console.log(
        `  Tip: Call via bot.api.${method.name}({...}) — see https://gramio.dev/telegram/methods/${method.name}.md for examples.`,
    );
    console.log();
}
