// Copia /public para /dist, compila o TypeScript para /dist/js e já escreve o catálogo
// de furos dentro do index.html (o site funciona e aparece no Google mesmo sem JavaScript).
import { cpSync, readFileSync, rmSync, watch, writeFileSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const isWatch = process.argv.includes("--watch");

async function inject() {
  // Query string evita o cache de módulos do Node no modo watch
  const url = pathToFileURL(resolve("dist/js/catalog/render.js")).href + `?t=${Date.now()}`;
  const r = await import(url);
  const { findPiercing } = r;
  const slots = {
    total: String(r.total()),
    chips: r.regionChips(),
    datalist: r.datalist(),
    cards: r.cards(),
    gallery: r.galleryShots(),
    detail: r.detail(findPiercing("helix")),
    map: [r.mapView("orelha", "orelha", true), r.mapView("rosto", "rosto", false), r.mapView("corpo", "corpo", false)].join("\n"),
  };
  const file = "dist/index.html";
  let html = readFileSync("public/index.html", "utf8");
  for (const [name, value] of Object.entries(slots)) html = html.replaceAll(`<!--@${name}-->`, value);
  writeFileSync(file, html);
}

rmSync("dist", { recursive: true, force: true });
cpSync("public", "dist", { recursive: true });

if (isWatch) {
  let timer;
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cpSync("public", "dist", { recursive: true });
      inject().catch((e) => console.error(e.message));
    }, 150);
  };
  watch("public", { recursive: true }, rebuild);
  spawn("npx", ["tsc", "--watch", "--preserveWatchOutput"], { stdio: "inherit" });
  watch("dist/js", { recursive: true }, rebuild);
} else {
  const r = spawnSync("npx", ["tsc"], { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
  await inject();
}
