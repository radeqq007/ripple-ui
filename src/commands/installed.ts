import { readConfig } from "../lib/config.js";
import type { Config } from "../types.js";

export const installed = async () => {
	const config: Config = await readConfig();

	if (config!.installed.length === 0) {
		console.log("No components installed yet.");
	} else {
		console.log("Installed:\n");
		for (const name of config!.installed) {
			console.log(`  ✔ ${name}`);
		}
	}
};
