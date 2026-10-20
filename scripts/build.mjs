// Copia /public para /dist e compila o TypeScript para /dist/js.
import { cpSync, rmSync, watch } from "node:fs";
import { spawn, spawnSync } from "node:child_process";

const isWatch = process.argv.includes("--watch");

rmSync("dist", { recursive: true, force: true });
cpSync("public", "dist", { recursive: true });

if (isWatch) {
  watch("public", { recursive: true }, () => cpSync("public", "dist", { recursive: true }));
  spawn("npx", ["tsc", "--watch", "--preserveWatchOutput"], { stdio: "inherit" });
} else {
  const r = spawnSync("npx", ["tsc"], { stdio: "inherit" });
  process.exit(r.status ?? 1);
}
