import { readConfig, requireConfig, writeConfig } from "../lib/config.js";
import { fetchRegistry } from "../lib/registry.js";
import { installEntry } from "../lib/install.js";
import type { Config } from "../types.js";

export const add = async (component: string) => {
	const config: Config | undefined = await readConfig();
	if (!config) {
		console.error("Error reading the config.");
		process.exit(1);
	}

	requireConfig(config);

	const registry = await fetchRegistry();

	if (!registry[component]) {
		console.error(`Component "${component}" not found.`);
		process.exit(1);
	}

	const alreadyInstalled = new Set(config.installed);

	// component + its dependencies
	const toInstall: Set<string> = new Set();

	function collectDeps(name: string) {
		if (alreadyInstalled.has(name)) return;
		if (toInstall.has(name)) return;
		toInstall.add(name);
		for (const dep of registry[name]?.dependencies ?? []) {
			collectDeps(dep);
		}
	}

	collectDeps(component);

	if (toInstall.size === 0) {
		console.log(`"${component}" is already installed.`);
		return;
	}

	console.log(`Installing: ${[...toInstall].join(", ")}\n`);

	const npmDeps = new Set<string>();
	await installEntry(component, config, alreadyInstalled, npmDeps);

	config.installed = [...new Set([...config.installed, ...toInstall])];
	await writeConfig(config);

	console.log(`\nDone.`);
};
