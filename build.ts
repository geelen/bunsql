import solidPlugin from "./node_modules/@opentui/solid/scripts/solid-plugin"

await Bun.build({
  entrypoints: ["./src/app.tsx"],
  target: "bun",
  outdir: "./dist",
  plugins: [solidPlugin],
  external: ["bun:sqlite", "@opentui/solid", "@opentui/core", "solid-js"],
})

console.log("Build complete!")
