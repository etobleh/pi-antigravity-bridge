import { test } from "vitest";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { installPiAgent } from "../src/agent-config.js";

const EXPECTED = `---
name: pi
description: Pi coding agent
tools: []
mainAgent: true
---
`;

test("agent config: installs the bundled pi agent into a new config directory", () => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "agy-agent-"));
	const destination = path.join(root, ".gemini", "config", "agents", "pi.md");
	try {
		installPiAgent({ destinationPath: destination });
		assert.equal(fs.readFileSync(destination, "utf8"), EXPECTED);
	} finally {
		fs.rmSync(root, { recursive: true, force: true });
	}
});

test("agent config: replaces a stale definition", () => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "agy-agent-"));
	const destination = path.join(root, "agents", "pi.md");
	try {
		fs.mkdirSync(path.dirname(destination), { recursive: true });
		fs.writeFileSync(destination, "stale");
		installPiAgent({ destinationPath: destination });
		assert.equal(fs.readFileSync(destination, "utf8"), EXPECTED);
	} finally {
		fs.rmSync(root, { recursive: true, force: true });
	}
});
