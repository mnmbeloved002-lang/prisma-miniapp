import fs from "node:fs";

const cov = JSON.parse(fs.readFileSync("coverage/coverage-final.json", "utf8"));
const file = Object.keys(cov).find((p) =>
	p.endsWith("src/application/bookmarks.ts"),
);
if (!file) {
	console.error("bookmarks.ts not found in coverage");
	process.exit(1);
}

const { branchMap, b } = cov[file];
console.log("FILE:", file);
for (const [id, meta] of Object.entries(branchMap)) {
	const hits = b[id]; // массив счётчиков по вариантам ветки
	const zeros = hits
		.map((n, i) => ({ i, n }))
		.filter((x) => x.n === 0)
		.map((x) => x.i);
	const loc = `${meta.loc.start.line}:${meta.loc.start.column}–${meta.loc.end.line}:${meta.loc.end.column}`;
	const type = meta.type;
	console.log(`#${id} ${type} @ ${loc} hits=[${hits.join(",")}]`);
	if (zeros.length) {
		console.log("  UNHIT indexes:", zeros.join(","));
		if (meta.locations) {
			for (const [k, L] of meta.locations.entries?.() ??
				Object.entries(meta.locations)) {
				console.log(
					`   • arm[${k}] @ ${L.start.line}:${L.start.column}–${L.end.line}:${L.end.column}`,
				);
			}
		}
	}
}
