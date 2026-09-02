// Install the extension-owned agy agent selected by the provider driver.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PI_AGENT_NAME = "pi";

const BUNDLED_AGENT_PATH = fileURLToPath(new URL("../agents/pi.md", import.meta.url));
const GLOBAL_AGENT_PATH = path.join(os.homedir(), ".gemini", "config", "agents", "pi.md");

export interface InstallPiAgentOptions {
	sourcePath?: string;
	destinationPath?: string;
}

/** Atomically install the bundled agent definition before agy resolves it. */
export function installPiAgent(opts: InstallPiAgentOptions = {}): void {
	const source = opts.sourcePath ?? BUNDLED_AGENT_PATH;
	const destination = opts.destinationPath ?? GLOBAL_AGENT_PATH;
	const content = fs.readFileSync(source);
	fs.mkdirSync(path.dirname(destination), { recursive: true, mode: 0o700 });
	const tmp = `${destination}.${process.pid}.tmp`;
	try {
		fs.writeFileSync(tmp, content, { mode: 0o600 });
		fs.renameSync(tmp, destination);
	} catch (err) {
		try {
			fs.unlinkSync(tmp);
		} catch {
			/* nothing to clean */
		}
		throw err;
	}
}
