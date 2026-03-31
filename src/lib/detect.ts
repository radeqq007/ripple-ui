import fs from "fs/promises";
import path from "path";

export const detectPackageManager = async (cwd: string): Promise<string> => {
  try {
    const raw = await fs.readFile(path.join(cwd, "package.json"), "utf-8");
    const pkg = JSON.parse(raw);
    if (pkg.packageManager) {
      // e.g. "pnpm@10.32.1" → "pnpm"
      return pkg.packageManager.split("@")[0];
    }
  } catch {}
  return "npm";
};

export const detectTailwind = async (cwd: string) => {
  try {
    const raw = await fs.readFile(path.join(cwd, "package.json"), "utf-8");
    const pkg = JSON.parse(raw);
    const deps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };
    return "tailwindcss" in deps;
  } catch (e) {
    return false;
  }
};

export const detectCssFile = async (cwd: string) => {
  const paths = ["src/index.css", "src/main.css", "src/styles.css"];

  for (const relPath of paths) {
    const fullPath = path.resolve(cwd, relPath);
    try {
      await fs.access(fullPath);
      console.log(`✔  Found main CSS file: ${relPath}`);
      return relPath;
    } catch {}
  }

  return null;
};

export const detectImportAlias = async (cwd: string): Promise<string> => {
  const viteConfigNames = [
    "vite.config.ts",
    "vite.config.js",
    "vite.config.mts",
    "vite.config.mjs",
  ];

  for (const configName of viteConfigNames) {
    const fullPath = path.join(cwd, configName);
    try {
      const raw = await fs.readFile(fullPath, "utf-8");

      const objectAliasMatch = raw.match(/alias\s*:\s*\{([^}]+)\}/s);
      if (objectAliasMatch?.[1]) {
        const entryMatch = objectAliasMatch[1].match(
          /['"]?(@[^'":/\s]+|[^'":/\s]+)['"]?\s*:/,
        );
        if (entryMatch?.[1]) {
          return entryMatch[1];
        }
      }

      const arrayFindMatch = raw.match(/find\s*:\s*['"]([^'"]+)['"]/);
      if (arrayFindMatch?.[1]) {
        return arrayFindMatch[1];
      }
    } catch {}
  }

  // Fall back to tsconfig.json
  try {
    const raw = await fs.readFile(path.join(cwd, "tsconfig.json"), "utf-8");
    const tsconfig = JSON.parse(raw);
    const paths: Record<string, unknown> =
      tsconfig.compilerOptions?.paths ?? {};

    for (const alias of Object.keys(paths)) {
      return alias.replace(/\/\*$/, "");
    }
  } catch {}

  console.error("No import alias found.");
  process.exit(1);
};
