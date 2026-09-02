import { test } from "vitest";
import assert from "node:assert/strict";
import { buildAgyArgs, type DriverTurnRequest } from "../src/driver.js";

const request: DriverTurnRequest = {
	cwd: "/workspace",
	model: "gemini-test",
	effort: "medium",
	mode: "accept-edits",
	skipPermissions: true,
	conversationId: "conversation-1",
	prompt: "hello",
};

test("driver args: selects the bundled pi agent exactly once", () => {
	const args = buildAgyArgs(request, false);
	const positions = args.flatMap((arg, index) => arg === "--agent" ? [index] : []);
	assert.deepEqual(positions, [2]);
	assert.equal(args[positions[0] + 1], "pi");
});

test("driver args: preserves stream-json and turn profile flags", () => {
	const args = buildAgyArgs(request, false);
	assert.deepEqual(args.slice(0, 6), ["--add-dir", "/workspace", "--agent", "pi", "--model", "gemini-test"]);
	assert.ok(args.includes("--input-format"));
	assert.ok(args.includes("--output-format"));
	assert.ok(args.includes("--conversation"));
	assert.ok(args.includes("--dangerously-skip-permissions"));
});
