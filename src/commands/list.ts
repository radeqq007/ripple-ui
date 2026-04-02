import { fetchRegistry } from "../lib/registry.js";

export const list = async () => {
	const registry = await fetchRegistry();
	const names = Object.keys(registry);
	console.log("Available components:");
	for (const name of names) {
		console.log(`  ${name}`);
	}
};
