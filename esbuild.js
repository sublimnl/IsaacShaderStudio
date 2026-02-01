#!/usr/bin/env node
const watchFlag = process.argv.indexOf('--watch') > -1;

require("esbuild")
    .build({
        entryPoints: ["src/demo/main.ts"],
        bundle: true,
        minify: false,
        outdir: "public",
        watch: watchFlag,
    })
    .catch(() => process.exit(1));