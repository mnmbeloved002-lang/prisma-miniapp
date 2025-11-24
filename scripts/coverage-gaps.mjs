#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const argv = new Set(process.argv.slice(2));
const SHOW_CONTEXT = argv.has("-c") || argv.has("--context");
const JSON_OUT = argv.has("--json");
const CANDIDATES = [
	"coverage/coverage-final.json",
	"coverage/tmp/coverage-final.json",
];

function loadCoverage() {
	for (const p of CANDIDATES) {
		if (fs.existsSync(p))
			return { data: JSON.parse(fs.readFileSync(p, "utf8")), path: p };
	}
	console.error(
		"❌ coverage-final.json не найден. Сначала запусти: pnpm vitest run --coverage",
	);
	process.exit(2);
}
function addRangeLines(set, loc) {
	if (!loc || !loc.start || !loc.end) return;
	for (let l = loc.start.line; l <= loc.end.line; l++) set.add(l);
}
function compressRanges(lines) {
	const out = [];
	let s = null,
		p = null;
	for (const l of lines) {
		if (s === null) {
			s = p = l;
			continue;
		}
		if (l === p + 1) {
			p = l;
			continue;
		}
		out.push([s, p]);
		s = p = l;
	}
	if (s !== null) out.push([s, p]);
	return out;
}
function uncoveredForFile(e) {
	const {
		s = {},
		statementMap = {},
		b = {},
		branchMap = {},
		f = {},
		fnMap = {},
	} = e;
	const lines = new Set();
	for (const id of Object.keys(s))
		if (s[id] === 0) addRangeLines(lines, statementMap[id]);
	for (const id of Object.keys(b)) {
		const counts = b[id] || [];
		const locs = (branchMap[id] && branchMap[id].locations) || [];
		counts.forEach((cnt, i) => {
			if (cnt === 0) addRangeLines(lines, locs[i]);
		});
	}
	for (const id of Object.keys(f))
		if (f[id] === 0) {
			const fm = fnMap[id] || {};
			addRangeLines(lines, fm.loc || fm.decl || fm);
		}
	return compressRanges([...lines].sort((a, b) => a - b));
}
function formatRange([a, b]) {
	return a === b ? String(a) : `${a}-${b}`;
}
function printContext(file, ranges) {
	if (!fs.existsSync(file)) return;
	const src = fs.readFileSync(file, "utf8").split("\n");
	const take = (i) => (i >= 1 && i <= src.length ? src[i - 1] : "");
	for (const [a, b] of ranges) {
		const from = Math.max(1, a - 3),
			to = Math.min(src.length, b + 3);
		console.log(`\n  ── контекст ${file}:${a}${a !== b ? "-" + b : ""}`);
		for (let i = from; i <= to; i++) {
			const mark = i >= a && i <= b ? ">" : " ";
			const num = String(i).padStart(String(to).length, " ");
			console.log(`  ${mark} ${num} | ${take(i)}`);
		}
	}
}
const { data, covPath } = (() => {
	const x = loadCoverage();
	return { data: x.data, covPath: x.path };
})();
const results = [];
for (const [file, entry] of Object.entries(data)) {
	const ranges = uncoveredForFile(entry);
	if (ranges.length) {
		const s = entry.s || {};
		results.push({
			file,
			ranges,
			statements: {
				covered: Object.values(s).filter((x) => x > 0).length,
				total: Object.values(s).length || 0,
			},
		});
	}
}
if (JSON_OUT) {
	console.log(
		JSON.stringify({ coverageFile: covPath, files: results }, null, 2),
	);
	process.exit(0);
}
if (!results.length) {
	console.log("✅ Нет незакрытых строк: 100% покрытие достигнуто.");
	process.exit(0);
}
console.log(`📄 Источник покрытия: ${covPath}`);
for (const r of results) {
	const list = r.ranges.map(formatRange).join(", ");
	const base = path.relative(process.cwd(), r.file);
	console.log(`\n• ${base}`);
	console.log(`  строки: ${list}`);
	if (SHOW_CONTEXT) printContext(base, r.ranges.slice(0, 8));
}
console.log(
	"\nℹ️ Флаги: -c/--context — показать контекст; --json — машинный вывод.",
);
