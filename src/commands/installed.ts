import { readConfig } from "../lib/config.js";
import { die } from "../lib/errors.js";

export const installed = async () => {
	const config = await readConfig();
	if (!config) {
		die(
			"No components.json found.",
			'Run "npx rippleui-cli init" first to set up your project.',
		);
	}

	if (config!.installed.length === 0) {
		console.log("No components installed yet.");
	} else {
		console.log("Installed:\n");
		for (const name of config!.installed) {
			console.log(`  ✔ ${name}`);
		}
	}
};
