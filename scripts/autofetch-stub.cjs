#!/usr/bin/env node
const fs = require("fs");
const p = "public/news.json";
let arr = [];
try {
	arr = JSON.parse(fs.readFileSync(p, "utf8"));
} catch (_) {
	arr = [];
}
if (!Array.isArray(arr)) arr = [];
// сортировку держим для идемпотентности (но она уже DESC)
arr.sort((a, b) => new Date(b?.date || 0) - new Date(a?.date || 0));
const out = JSON.stringify(arr, null, 2) + "\n";
const prev = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
if (prev !== out) {
	fs.writeFileSync(p, out, "utf8");
	console.log("[autofetch-stub] normalized output written (changed)");
} else {
	console.log("[autofetch-stub] no changes");
}
