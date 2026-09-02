// Select the pi tools advertised by the MCP bridge.

import type { BridgeTools } from "./config.js";

export interface BridgeToolDescriptor {
	name: string;
	sourceInfo?: { source?: string };
}

const SKIP_CIRCULAR = new Set(["AskAntigravity"]);

/** Select active tools in the configured bridge surface and exclude recursion. */
export function selectBridgeTools<T extends BridgeToolDescriptor>(
	tools: T[],
	mode: BridgeTools,
	activeNames: ReadonlySet<string>,
): T[] {
	if (mode === "none") return [];
	return tools.filter((tool) => {
		if (!activeNames.has(tool.name) || SKIP_CIRCULAR.has(tool.name)) return false;
		if (mode === "all") return true;
		const source = tool.sourceInfo?.source ?? "";
		return source === "builtin" || /pi-mcp-adapter/.test(source);
	});
}
