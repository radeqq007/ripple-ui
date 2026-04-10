import fs from "node:fs/promises";
import path from "node:path";
import type { Config } from "../types.js";
import { die, formatError } from "./errors.js";

const configPath = path.resolve(process.cwd(), "components.json");

export const readConfig = async (): Promise<Config> | never => {
	let raw: string;
	try {
		raw = await fs.readFile(configPath, "utf-8");
	} catch (e) {
		die(`Could not read components.json: ${formatError(e)}`);
	}

	try {
		return JSON.parse(raw!) as Config;
	} catch {
		die(
			"components.json contains invalid JSON.",
			`Fix or delete ${configPath} and run "rippleui-cli init" again.`,
		);

		// die() already exits but typescript doesn't detect the never type for whatever reason
		process.exit(1);
	}
};

export const writeConfig = async (config: Config) => {
	await fs.writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`);
};
