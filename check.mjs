// Sprawdza gotowość do publikacji. Na produkcji (Vercel) blokuje wdrożenie, jeśli czegoś brakuje.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
const root = new URL("../public/", import.meta.url).pathname;
const isProd = process.env.VERCEL_ENV === "production" || process.env.STRICT === "1";
const problems = [], todo = [];

const walk = d => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk(root).filter(f => f.endsWith(".html"));

for (const f of pages) {
  const html = readFileSync(f, "utf8"), rel = f.replace(root, "/");
  // lokalne linki i obrazy
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)) {
    let p = m[1]; if (p === "/") continue;
    const ok = existsSync(join(root, p)) || existsSync(join(root, p, "index.html")) || existsSync(join(root, p + ".html"));
    if (!ok) problems.push(`${rel}: brak pliku dla ${p}`);
  }
  // placeholdery widoczne dla klienta
  const text = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, "").replace(/<[^>]+>/g, " ");
  for (const m of text.matchAll(/\[[A-ZĄĆĘŁŃÓŚŹŻ][A-ZĄĆĘŁŃÓŚŹŻ0-9 :,.\-ĄĆĘŁŃÓŚŹŻ]*\]/g)) todo.push(`${rel}: ${m[0]}`);
  if (html.includes("DOKUMENT_DO_UZUPELNIENIA")) todo.push(`${rel}: brak treści dokumentu`);
  if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${rel}: brak <title>`);
  if (!/<h1[ >]/.test(html) && !html.includes("noindex")) problems.push(`${rel}: brak H1`);
}
const win = {}; new Function("window", readFileSync(join(root, "product-config.js"), "utf8"))(win);
const vs = win.PRODUCT.variants, keys = new Set();
if (vs.length !== 8) problems.push(`product-config.js: oczekiwano 8 wariantów, jest ${vs.length}`);
for (const v of vs) {
  const k = `${v.size}-${v.finish}-${v.type}`;
  if (keys.has(k) || v.id !== k) problems.push(`product-config.js: zły lub zduplikowany wariant ${v.id}`);
  keys.add(k);
  if (!(v.price > 0) || !Number.isInteger(v.stock)) problems.push(`product-config.js: zła cena/stan w ${v.id}`);
  if (v.stock > 0 && !/^https:\/\/([a-z0-9-]+\.)?allegro\.pl\//i.test(v.allegroUrl || "")) todo.push(`product-config.js: allegroUrl dla ${v.id}`);
}
problems.forEach(p => console.error("BŁĄD  " + p));
[...new Set(todo)].forEach(t => console.warn("DO UZUPEŁNIENIA  " + t));
console.log(`Sprawdzono ${pages.length} stron. Błędy: ${problems.length}. Do uzupełnienia: ${new Set(todo).size}.`);
if (problems.length || (isProd && todo.length)) { console.error(isProd ? "Wdrożenie produkcyjne zablokowane." : "Są błędy."); process.exit(1); }
