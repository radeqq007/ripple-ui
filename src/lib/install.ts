import path from "path";
import fs from "fs/promises";
import { execSync } from "child_process";
import { fetchRegistry, fetchFile } from "./registry.js";
import { detectPackageManager } from "./detect.js";
import type { Registry, Config } from "../types.js";

export const resolveTargetDir = (
  name: string,
  entry: Registry[string],
  config: Config,
) => {
  // utils
  if (entry.target) return config.utilsDir ?? entry.target;
  return `${config.componentsDir}/${name}`;
};

export async function installNpmDeps(packages: string[], cwd: string) {
  if (packages.length === 0) return;
  const pm = await detectPackageManager(cwd);
  const cmd = pm === "npm" ? "npm install" : `${pm} add`;
  console.log(`\nInstalling npm packages with ${pm}: ${packages.join(", ")}`);
  execSync(`${cmd} ${packages.join(" ")}`, { cwd, stdio: "inherit" });
}

export const installEntry = async (
  name: string,
  config: Config,
  installed = new Set(),
  npmDeps = new Set<string>(),
) => {
  if (installed.has(name)) return;
  installed.add(name);

  const registry = await fetchRegistry();

  const entry = registry[name];
  if (!entry) throw new Error(`"${name}" not found in registry`);

  for (const pkg of entry.npmDependencies ?? []) {
    npmDeps.add(pkg);
  }

  for (const dep of entry.dependencies ?? []) {
    await installEntry(dep, config, installed, npmDeps);
  }

  const targetDir = resolveTargetDir(name, entry, config);
  const targetPath = path.resolve(process.cwd(), targetDir);
  await fs.mkdir(targetPath, { recursive: true });

  await Promise.all(
    entry.files.map(async (file: string) => {
      let content = await fetchFile(`${entry.path}/${file}`);
      content = updateImports(content, config);
      const dest = path.resolve(targetPath, file);
      await fs.writeFile(dest, content);
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
