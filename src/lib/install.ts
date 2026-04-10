import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import type { Config, Registry, RegistryEntry } from "../types.js";
import { detectPackageManager } from "./detect.js";
import { die } from "./errors.js";
import { fetchFile, fetchRegistry } from "./registry.js";

export const resolveTargetDir = (
	name: string,
	entry: Registry[string],
	config: Config,
) => {
	// utils
	if (entry.target) return config.directories.utils ?? entry.target;
	return `${config.directories.components}/${name}`;
};

export async function installNpmDeps(packages: string[], cwd: string) {
	if (packages.length === 0) return;
	const pm = await detectPackageManager(cwd);
	const cmd = pm === "npm" ? "npm install" : `${pm} add`;
	console.log(`\nInstalling npm packages with ${pm}: ${packages.join(", ")}`);
	try {
		execSync(`${cmd} ${packages.join(" ")}`, { cwd, stdio: "inherit" });
	} catch {
		die(
			`Failed to install npm packages: ${packages.join(", ")}`,
			`Try running "${cmd} ${packages.join(" ")}" manually, then re-run this command.`,
		);
	}
}

export const installEntry = async (
	name: string,
	config: Config,
	installed = new Set(),
	npmDeps = new Set<string>(),
	registry?: Registry,
) => {
	if (installed.has(name)) return;
	installed.add(name);

	if (!registry) {
		registry = await fetchRegistry();
	}
		
	const entry: RegistryEntry | undefined = registry[name];
	if (!entry)
		die(
			`"${name}" not found in registry`,
			'Run "rippleui-cli list" to see all available components.',
		);

	for (const pkg of entry!.npmDependencies ?? []) {
		npmDeps.add(pkg);
	}

	for (const dep of entry!.dependencies ?? []) {
		await installEntry(dep, config, installed, npmDeps, registry);
	}

	const targetDir = resolveTargetDir(name, entry!, config);
	const targetPath = path.resolve(process.cwd(), targetDir);

	try {
		await fs.mkdir(targetPath, { recursive: true });
	} catch {
		die(
			`Could not create directory: ${targetPath}`,
			`Check that you have write permission here: ${path.dirname(targetPath)}`,
		);
	}

	await Promise.all(
		entry!.files.map(async (file: string) => {
			let content = await fetchFile(`${entry!.path}/${file}`);
			content = updateImports(content, config);
			const dest = path.resolve(targetPath, file);

			try {
				await fs.writeFile(dest, content);
			} catch {
				die(
					`Could not write file: ${dest}`,
					`Check that you have write permission in: ${targetPath}`,
				);
			}
		}),
	);

	console.log(`✔  Installed: ${name} → ${targetPath}`);

	if (npmDeps.size > 0) {
		await installNpmDeps([...npmDeps], process.cwd());
		npmDeps.clear();
	}
};

export const updateImports = (content: string, config: Config): string => {
	return content
		.replace(/@\/components/g, config.aliases.components)
		.replace(/@\/lib/g, config.aliases.utils)
		.replace(/@\/utils/g, config.aliases.utils);
};
