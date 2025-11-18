import solidPlugin from "./node_modules/@opentui/solid/scripts/solid-plugin"

const result = await Bun.build({
  entrypoints: ["./src/app.tsx"],
  target: "bun",
  outdir: "./dist",
  plugins: [solidPlugin],
  external: ["bun:sqlite"],
  minify: false,
  sourcemap: "external",
})

if (!result.success) {
  console.error("Build failed:")
  for (const log of result.logs) {
    console.error(log)
  }
  process.exit(1)
}

console.log("Build complete!")
