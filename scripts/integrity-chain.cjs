const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function computeHash() {
	const newsPath = path.join(__dirname, "..", "public", "news.json");
	const data = fs.readFileSync(newsPath, "utf8");
	return crypto.createHash("sha256").update(data).digest("hex");
}

function recordIntegrity(commitHash) {
	const hash = computeHash();
	const timestamp = new Date().toISOString();
	const entry = `${hash} ${timestamp} ${commitHash}\n`;

	const chainLogPath = path.join(
		__dirname,
		"..",
		"docs",
		"checksums",
		"chain.log",
	);
	fs.appendFileSync(chainLogPath, entry);

	console.log(`✅ Запись целостности: ${hash}`);
	return hash;
}

function verifyIntegrity() {
	const currentHash = computeHash();
	const chainLogPath = path.join(
		__dirname,
		"..",
		"docs",
		"checksums",
		"chain.log",
	);

	if (!fs.existsSync(chainLogPath)) {
		console.log("❌ Файл целостности не найден");
		return false;
	}

	const chainContent = fs.readFileSync(chainLogPath, "utf8");
	const lines = chainContent.trim().split("\n");
	const lastLine = lines[lines.length - 1];
	const lastHash = lastLine.split(" ")[0];

	if (currentHash === lastHash) {
		console.log("✅ Целостность подтверждена");
		return true;
	} else {
		console.log("❌ Нарушение целостности");
		return false;
	}
}

if (require.main === module) {
	const args = process.argv.slice(2);

	if (args[0] === "--record" && args[1]) {
		recordIntegrity(args[1]);
	} else if (args[0] === "--verify") {
		verifyIntegrity();
	}
}

module.exports = { computeHash, recordIntegrity, verifyIntegrity };
