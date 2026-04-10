import { readConfig, writeConfig } from "../lib/config.js";
import { die } from "../lib/errors.js";
import { installEntry } from "../lib/install.js";
import { fetchRegistry } from "../lib/registry.js";
import type { Config } from "../types.js";

export const add = async (components: string[]) => {
	const config: Config | undefined = await readConfig();

	const registry = await fetchRegistry();

	for (const component of components) {
		if (!registry[component] || component.startsWith("$")) {
			die(
				`Component "${component}" not found in the registry.`,
				`use 'npx rippleui-cli list' to see aviable components.`,
			);
		}
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

	for (const component of components) {
		collectDeps(component);
	}

	if (toInstall.size === 0) {
		console.log(`✔  ${components.join(", ")} already installed.`);
		return;
	}

	console.log(`Installing: ${[...toInstall].join(", ")}\n`);

	const npmDeps = new Set<string>();
	for (const component of components) {	
		await installEntry(component, config, alreadyInstalled, npmDeps);
	}
		
	config.installed = [...new Set([...config.installed, ...toInstall])];
	await writeConfig(config);

	console.log(`\nDone.`);
};
