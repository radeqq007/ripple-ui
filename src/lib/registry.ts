import type { Registry } from "../types.js";
import { die, formatError, isNetworkError } from "./errors.js";

const GITHUB_RAW = "https://raw.githubusercontent.com/radeqq007/ripple-ui/main";
const REGISTRY_URL = `${GITHUB_RAW}/registry.json`;

export const fetchRegistry = async (): Promise<Registry> => {
	let res: Response | undefined;
	try {
		res = await fetch(REGISTRY_URL);
	} catch (e) {
		if (isNetworkError(e)) {
			die(
				"Could not reach the ripple-ui registry.",
				"Check your internet connection and try again.",
			);
		}
		die(`Failed to fetch registry: ${formatError(e)}`);
	}

	if (!res!.ok) {
		if (res!.status === 404)
			die(
				"Registry not found (404).",
				"The registry URL may have changed. Please update rippleui-cli.",
			);

		if (res!.status >= 500)
			die(
				`Registry server error (${res!.status}).`,
				"GitHub may be experiencing issues. Try again in a moment.",
			);

		die(`Failed to fetch registry: HTTP ${res!.status} ${res!.statusText}`);
	}

	try {
		return res!.json() as Promise<Registry>;
	} catch {
		die(
			"Registry response was not valid JSON.",
			"This may be a temporary issue - please try again.",
		);
		process.exit(1);
	}
};

export const fetchFile = async (filePath: string): Promise<string> => {
	const url = `${GITHUB_RAW}/${filePath}`;
	let res: Response | undefined;

	try {
		res = await fetch(url);
	} catch (e) {
		if (isNetworkError(e)) {
			die(
				"Lost connection while downloading component files.",
				"Check your internet connection and try again.",
			);
		}
		die(`Failed to fetch file "${filePath}": ${formatError(e)}`);
	}

	// Typescript doesn't detect the never type from die()
	// This check is always false, it's there to make typescript shut up
	if (!res) process.exit(1);

	if (!res.ok) {
		if (res.status === 404) {
			die(
				`Component file not found: ${filePath}`,
				"The registry may be out of sync. Try updating rippleui-cli.",
			);
		}

		die(
			`Failed to fetch file "${filePath}": HTTP ${res.status} ${res.statusText}`,
		);
	}

	try {
		return await res.text();
	} catch (err) {
		die(`Failed to read file content for "${filePath}": ${formatError(err)}`);
		process.exit(1);
	}
};
