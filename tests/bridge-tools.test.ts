import { test } from "vitest";
import assert from "node:assert/strict";
import { selectBridgeTools } from "../src/bridge-tools.js";

const tools = [
	{ name: "read", sourceInfo: { source: "builtin" } },
	{ name: "bash", sourceInfo: { source: "builtin" } },
	{ name: "memory_search", sourceInfo: { source: "npm:pi-mcp-adapter" } },
	{ name: "AskClaude", sourceInfo: { source: "extension" } },
	{ name: "AskAntigravity", sourceInfo: { source: "extension" } },
];

const names = (mode: "none" | "mcp" | "all") => selectBridgeTools(tools, mode).map((tool) => tool.name);

test("bridge tools: mcp includes builtins and adapter tools", () => {
	assert.deepEqual(names("mcp"), ["read", "bash", "memory_search"]);
});

test("bridge tools: all includes builtins and extensions except recursive delegation", () => {
	assert.deepEqual(names("all"), ["read", "bash", "memory_search", "AskClaude"]);
});

test("bridge tools: none exposes nothing", () => {
	assert.deepEqual(names("none"), []);
});
