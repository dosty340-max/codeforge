// Usage: node scripts/import-agents.mjs <agency-agents checkout> <commit sha>
// Copies agent Markdown into vendor/agency-agents and writes the catalog index for the app.
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const [source, commit] = process.argv.slice(2);
if (!source || !/^[0-9a-f]{40}$/.test(commit ?? "")) {
  throw new Error("Usage: import-agents.mjs <checkout> <40-character commit sha>");
}

const target = "vendor/agency-agents";
const { divisions } = JSON.parse(readFileSync(join(source, "divisions.json"), "utf8"));

function markdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.name.endsWith(".md") ? [path] : [];
  });
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (field) fields[field[1]] = field[2].replace(/^["']|["']$/g, "").trim();
  }
  return fields;
}

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(join(source, "LICENSE"), join(target, "LICENSE"));

const agents = [];
const seen = new Set();
const skipped = [];

for (const division of Object.keys(divisions)) {
  for (const file of markdownFiles(join(source, division))) {
    const path = relative(source, file);
    const fields = parseFrontmatter(readFileSync(file, "utf8"));
    if (!fields?.name || !fields.description) {
      skipped.push(path);
      continue;
    }
    const slug = path.split("/").pop().replace(/\.md$/, "");
    if (seen.has(slug)) throw new Error(`Duplicate agent slug: ${slug}`);
    seen.add(slug);

    mkdirSync(dirname(join(target, path)), { recursive: true });
    cpSync(file, join(target, path));
    agents.push({
      slug,
      name: fields.name,
      description: fields.description,
      emoji: fields.emoji ?? "",
      vibe: fields.vibe ?? "",
      division,
      path,
    });
  }
}

agents.sort((a, b) => a.name.localeCompare(b.name));

const catalog = {
  source: "msitarzewski/agency-agents",
  commit,
  divisions: Object.fromEntries(
    Object.entries(divisions).map(([id, d]) => [
      id,
      { label: d.label, color: d.color, count: agents.filter((a) => a.division === id).length },
    ])
  ),
  agents,
};

mkdirSync("src/data", { recursive: true });
writeFileSync("src/data/agent-catalog.json", `${JSON.stringify(catalog, null, 1)}\n`);
console.log(`Imported ${agents.length} agents. Skipped ${skipped.length}: ${skipped.join(", ") || "none"}`);
