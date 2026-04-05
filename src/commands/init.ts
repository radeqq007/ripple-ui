import fs from "node:fs/promises";
import path from "node:path";
import prompts from "prompts";
import { updateCss } from "../lib/css.js";
import {
	detectCssFile,
	detectImportAlias,
	detectTailwind,
} from "../lib/detect.js";
import { die, formatError } from "../lib/errors.js";
import { installNpmDeps } from "../lib/install.js";
import { accentThemes, bases } from "../lib/themes.js";
import type { Config } from "../types.js";

export const init = async () => {
	const cwd: string = process.cwd();

	try {
		await fs.access(`${cwd}/components.json`);
		console.log("✔  components.json already exists. Skipping initialization.");
		process.exit(1);
	} catch {}

	if (await detectTailwind(cwd)) {
		console.log("✔  Validating tailwindcss.");
	} else {
		die(
			"Tailwind CSS not found in your project dependencies.",
			"Install it first: https://tailwindcss.com/docs/installation",
		);
	}

	let mainCssFile: string | null = await detectCssFile(cwd);
	if (!mainCssFile) {
		console.log("Could not find the main CSS file.");
		const response = await prompts([
			{
				type: "text",
				name: "mainCssFile",
				message: "Where is your main CSS file?",
				initial: "src/index.css",
			},
		]);
		mainCssFile = response.mainCssFile;
	}

	if (!mainCssFile) {
		die(
			"A valid CSS file path is required to continue.",
			"Re-run init and provide the path to your main CSS file.",
		);
	}

	const detectedAlias = await detectImportAlias(cwd);
	console.log(`✔  Validating import alias. Found "${detectedAlias}".`);

	const baseChoices = Object.keys(bases).map((name) => ({
		title: name.charAt(0).toUpperCase() + name.slice(1),
		value: name,
	}));

	const accentChoices = Object.keys(accentThemes).map((name) => ({
		title: name.charAt(0).toUpperCase() + name.slice(1),
		value: name,
	}));

	const { base, accent } = await prompts([
		{
			type: "select",
			name: "base",
			message:
				"Select a base color (neutral scale for backgrounds, borders, muted tones):",
			choices: baseChoices,
		},
		{
			type: "select",
			name: "accent",
			message:
				"Select an accent theme (primary/brand color and border radius):",
			choices: accentChoices,
		},
	]);

	console.log("✔  Writing components.json.");

	const config: Config = {
		aliases: {
			components: `${detectedAlias}/components`,
			utils: `${detectedAlias}/utils`,
		},
		css: mainCssFile!,
		installed: [],
		// TODO: maybe detect those instead of hardcoding the directories
		componentsDir: "src/components",
		utilsDir: "src/utils",
	};

	try {
		await fs.writeFile(
			"components.json",
			`${JSON.stringify(config, null, 2)}\n`,
		);
	} catch (e) {
		die(
			`Could not write components.json: ${formatError(e)}`,
			"Make sure you have write permission in the current directory.",
		);
	}

	await updateCss(path.join(cwd, mainCssFile as string), base, accent);
	console.log(`✔  Updating ${mainCssFile}`);

	console.log("\tInstalling dependencies...");
	await installNpmDeps(["@fontsource-variable/geist", "tw-animate-css"], cwd);

	console.log("Done.");
};
