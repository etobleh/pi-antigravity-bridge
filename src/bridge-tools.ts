// Select the pi tools advertised by the MCP bridge.

import type { BridgeTools } from "./config.js";

export interface BridgeToolDescriptor {
	name: string;
	sourceInfo?: { source?: string };
}

const SKIP_CIRCULAR = new Set(["AskAntigravity"]);

/** Apply the configured bridge surface while always excluding recursive calls. */
export function selectBridgeTools<T extends BridgeToolDescriptor>(
	tools: T[],
	mode: BridgeTools,
): T[] {
	if (mode === "none") return [];
	return tools.filter((tool) => {
		if (SKIP_CIRCULAR.has(tool.name)) return false;
		if (mode === "all") return true;
		const source = tool.sourceInfo?.source ?? "";
		return source === "builtin" || /pi-mcp-adapter/.test(source);
	});
}
