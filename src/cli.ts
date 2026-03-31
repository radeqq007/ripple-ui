#!/usr/bin/env node
import { Command } from "commander";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import path from "path";
import prompts from "prompts";
import type { Config, Registry } from "./types.js";
import { execSync } from "child_process";

const GITHUB_RAW = "https://raw.githubusercontent.com/radeqq007/ripple-ui/main";
const REGISTRY_URL = `${GITHUB_RAW}/registry.json`;

const __filename = fileURLToPath(import.meta.url);

const configPath = path.resolve(process.cwd(), "components.json");
async function readConfig(): Promise<Config | undefined> {
  try {
    const raw = await fs.readFile(configPath, "utf-8");
    return JSON.parse(raw);
  } catch {}
}

async function fetchRegistry(): Promise<Registry> {
  const res = await fetch(REGISTRY_URL);
  if (!res.ok) throw new Error(`Failed to fetch registry: ${res.statusText}`);
  return res.json() as Promise<Registry>;
}

async function fetchFile(path: string): Promise<string> {
  const url = `${GITHUB_RAW}/${path}`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Failed to fetch file ${path}: ${res.statusText}`);

  return res.text();
}

async function writeConfig(config: Config) {
  await fs.writeFile(configPath, JSON.stringify(config, null, 2) + "\n");
}

function requireConfig(config: Config) {
  if (!config) {
    console.error('No components.json found. Run "ripple-ui init" first.');
    process.exit(1);
  }
}

function resolveTargetDir(
  name: string,
  entry: Registry[string],
  config: Config,
) {
  // utils
  if (entry.target) return config.utilsDir ?? entry.target;
  return `${config.componentsDir}/${name}`;
}

async function detectPackageManager(cwd: string): Promise<string> {
  try {
    const raw = await fs.readFile(path.join(cwd, "package.json"), "utf-8");
    const pkg = JSON.parse(raw);
    if (pkg.packageManager) {
      // e.g. "pnpm@10.32.1" → "pnpm"
      return pkg.packageManager.split("@")[0];
    }
  } catch {}
  return "npm";
}

async function installNpmDeps(packages: string[], cwd: string) {
  if (packages.length === 0) return;
  const pm = await detectPackageManager(cwd);
  const cmd = pm === "npm" ? "npm install" : `${pm} add`;
  console.log(`\nInstalling npm packages with ${pm}: ${packages.join(", ")}`);
  execSync(`${cmd} ${packages.join(" ")}`, { cwd, stdio: "inherit" });
}

async function installEntry(
  name: string,
  config: Config,
  installed = new Set(),
  npmDeps = new Set<string>(),
) {
  if (installed.has(name)) return;
  installed.add(name);

  const registry = await fetchRegistry();

  const entry = registry[name];
  if (!entry) throw new Error(`"${name}" not found in registry`);

  for (const pkg of entry.npmDependencies ?? []) {
    npmDeps.add(pkg);
  }

  for (const dep of entry.dependencies ?? []) {
    await installEntry(dep, config, installed);
  }


  const targetDir = resolveTargetDir(name, entry, config);
  const targetPath = path.resolve(process.cwd(), targetDir);
  await fs.mkdir(targetPath, { recursive: true });

  await Promise.all(
    entry.files.map(async (file) => {
      let content = await fetchFile(`${entry.path}/${file}`);
      content = updateImports(content, config)
      const dest = path.resolve(targetPath, file);
      await fs.writeFile(dest, content);
    }),
  );

  console.log(`✔  Installed: ${name} → ${targetPath}`);

  if (npmDeps.size > 0) {
    await installNpmDeps([...npmDeps], process.cwd());
    npmDeps.clear();
  }
}

const program = new Command();

program
  .command("add <component>")
  .description("Add a Ripple UI component")
  .action(async (component) => {
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

    await installEntry(component, config, alreadyInstalled);

    config.installed = [...new Set([...config.installed, ...toInstall])];
    await writeConfig(config);

    console.log(`\nDone.`);
  });

program
  .command("list")
  .description("List available components")
  .action(async () => {
    const registry = await fetchRegistry();
    const names = Object.keys(registry);
    console.log("Available components:");
    for (const name of names) {
      console.log(`  ${name}`);
    }
  });

program
  .command("installed")
  .description("List installed components")
  .action(async () => {
    const config = await readConfig();
    if (!config) {
      console.error("Could not read the components.json file.");
      process.exit(1);
    }

    if (config.installed.length === 0) {
      console.log("No components installed yet.");
    } else {
      console.log("Installed:\n");
      for (const name of config.installed) {
        console.log(`  ✔ ${name}`);
      }
    }
  });

program
  .command("init")
  .description("Creates components.json")
  .action(async () => {
    const cwd: string = process.cwd();

    if (await detectTailwind(cwd)) {
      console.log("✔  Validating tailwindcss.");
    } else {
      console.error(
        "✖  Tailwind CSS not detected. Please install it first: https://tailwindcss.com/docs/installation",
      );
      process.exit(1);
    }

    let mainCssFile = await detectCssFile(cwd);
    if (mainCssFile === null) {
      console.log("Could not find the main ");
      const response = await prompts([
        {
          type: "text",
          name: "mainCssFile",
          message: "Where is your main css file?",
          initial: "src/index.css",
        },
      ]);
      mainCssFile = response.mainCssFile;
    }

    const detectedAlias = await detectImportAlias(cwd);
    console.log(`✔  Validating import alias. Found "${detectedAlias}".`);

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

    await fs.writeFile(
      "components.json",
      JSON.stringify(config, null, 2) + "\n",
    );

    await updateCss(path.join(cwd, mainCssFile as string));
    console.log(`✔  Updating ${mainCssFile}`);

    console.log("Done.");
  });

async function detectTailwind(cwd: string) {
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
}

async function detectCssFile(cwd: string) {
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
}

async function detectImportAlias(cwd: string): Promise<string> {
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
}

async function updateCss(cssPath: string) {
  // TODO: add more themes instead of just one hardcoded theme
  const content = `/* Ripple UI Theme - Tailwind v4 + OKLCH colors */
@import "tailwindcss";
@import "tw-animate-css";
@import "@fontsource-variable/geist";

@custom-variant dark (&:is(.dark *));

@theme inline {
    --font-heading: var(--font-sans);
    --font-sans: 'Geist Variable', sans-serif;
    --color-sidebar-ring: var(--sidebar-ring);
    --color-sidebar-border: var(--sidebar-border);
    --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
    --color-sidebar-accent: var(--sidebar-accent);
    --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
    --color-sidebar-primary: var(--sidebar-primary);
    --color-sidebar-foreground: var(--sidebar-foreground);
    --color-sidebar: var(--sidebar);
    --color-chart-5: var(--chart-5);
    --color-chart-4: var(--chart-4);
    --color-chart-3: var(--chart-3);
    --color-chart-2: var(--chart-2);
    --color-chart-1: var(--chart-1);
    --color-ring: var(--ring);
    --color-input: var(--input);
    --color-border: var(--border);
    --color-destructive: var(--destructive);
    --color-accent-foreground: var(--accent-foreground);
    --color-accent: var(--accent);
    --color-muted-foreground: var(--muted-foreground);
    --color-muted: var(--muted);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-secondary: var(--secondary);
    --color-primary-foreground: var(--primary-foreground);
    --color-primary: var(--primary);
    --color-popover-foreground: var(--popover-foreground);
    --color-popover: var(--popover);
    --color-card-foreground: var(--card-foreground);
    --color-card: var(--card);
    --color-foreground: var(--foreground);
    --color-background: var(--background);
    --radius-sm: calc(var(--radius) * 0.6);
    --radius-md: calc(var(--radius) * 0.8);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) * 1.4);
    --radius-2xl: calc(var(--radius) * 1.8);
    --radius-3xl: calc(var(--radius) * 2.2);
    --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.97 0 0);
    --secondary-foreground: oklch(0.205 0 0);
    --muted: oklch(0.97 0 0);
    --muted-foreground: oklch(0.556 0 0);
    --accent: oklch(0.97 0 0);
    --accent-foreground: oklch(0.205 0 0);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(0.922 0 0);
    --input: oklch(0.922 0 0);
    --ring: oklch(0.708 0 0);
    --chart-1: oklch(0.87 0 0);
    --chart-2: oklch(0.556 0 0);
    --chart-3: oklch(0.439 0 0);
    --chart-4: oklch(0.371 0 0);
    --chart-5: oklch(0.269 0 0);
    --radius: 0.625rem;
    --sidebar: oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.145 0 0);
    --sidebar-primary: oklch(0.205 0 0);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.97 0 0);
    --sidebar-accent-foreground: oklch(0.205 0 0);
    --sidebar-border: oklch(0.922 0 0);
    --sidebar-ring: oklch(0.708 0 0);
}

.dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.205 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.205 0 0);
    --popover-foreground: oklch(0.985 0 0);
    --primary: oklch(0.922 0 0);
    --primary-foreground: oklch(0.205 0 0);
    --secondary: oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.269 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.704 0.191 22.216);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: oklch(0.556 0 0);
    --chart-1: oklch(0.87 0 0);
    --chart-2: oklch(0.556 0 0);
    --chart-3: oklch(0.439 0 0);
    --chart-4: oklch(0.371 0 0);
    --chart-5: oklch(0.269 0 0);
    --sidebar: oklch(0.205 0 0);
    --sidebar-foreground: oklch(0.985 0 0);
    --sidebar-primary: oklch(0.488 0.243 264.376);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.269 0 0);
    --sidebar-accent-foreground: oklch(0.985 0 0);
    --sidebar-border: oklch(1 0 0 / 10%);
    --sidebar-ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
`;

  // TODO: update the css file instead of just appending to it
  const existingContent = await fs.readFile(cssPath, "utf-8");
  const newContent = existingContent + "\n" + content;
  await fs.writeFile(cssPath, newContent);
}

function updateImports(content: string, config: Config): string {
  return content
    .replace(/@\/components/g, config.aliases.components)
    .replace(/@\/lib/g, config.aliases.utils)
    .replace(/@\/utils/g, config.aliases.utils);
}

program.parse(process.argv);
