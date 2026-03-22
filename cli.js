#!/usr/bin/env node
import { Command } from "commander";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import fs from "fs/promises";
import path from "path";
import prompts from "prompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const registry = JSON.parse(
  readFileSync(
    fileURLToPath(new URL("./registry.json", import.meta.url)),
    "utf-8",
  ),
);

const configPath = path.resolve(process.cwd(), "components.json");
async function readConfig() {
  try {
    const raw = await fs.readFile(configPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeConfig(config) {
  await fs.writeFile(configPath, JSON.stringify(config, null, 2) + "\n");
}

function requireConfig(config) {
  if (!config) {
    console.error('No components.json found. Run "ripple-ui init" first.');
    process.exit(1);
  }
}

function resolveTargetDir(name, config) {
  const entry = registry[name];

  // utils
  if (entry.target) {
    return config.utilsDir ?? entry.target;
  }

  return `${config.componentsDir}/${name}`;
}

async function installEntry(name, config, installed = new Set()) {
  if (installed.has(name)) return;
  installed.add(name);

  const entry = registry[name];
  if (!entry) throw new Error(`"${name}" not found in registry`);

  for (const dep of entry.dependencies ?? []) {
    await installEntry(dep, config, installed);
  }

  const targetDir = resolveTargetDir(name, config);
  const targetPath = path.resolve(process.cwd(), targetDir);
  await fs.mkdir(targetPath, { recursive: true });

  await Promise.all(
    entry.files.map(async (file) => {
      const src = path.resolve(__dirname, entry.path, file);
      const dest = path.resolve(targetPath, file);
      await fs.copyFile(src, dest);
    }),
  );

  console.log(`✔  Installed: ${name} → ${targetPath}`);
}

const program = new Command();

program
  .command("add <component>")
  .description("Add a Ripple UI component")
  .action(async (component) => {
    const config = await readConfig();
    requireConfig(config);

    if (!registry[component]) {
      console.error(`Component "${component}" not found.`);
      process.exit(1);
    }

    const alreadyInstalled = new Set(config.installed);

    // component + its dependencies
    const toInstall = new Set();

    function collectDeps(name) {
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
  .action(() => {
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
    const cwd = process.cwd()

    if (await detectTailwind(cwd)) {
      console.log("✔  Validating tailwindcss.")
    } else {
      console.error("✖  Tailwind CSS not detected. Please install it first: https://tailwindcss.com/docs/installation")
      process.exit(1)
    }
  

    let mainCssFile = await detectCssFile(cwd);
    if (mainCssFile === null) {
      console.log("Could not find the main ");
      mainCssFile = await prompts([
        {
          type: "text",
          name: "mainCssFile",
          message: "Where is your main css file?",
          initial: "src/index.css",
        },
      ]);
    }

    const detectedAlias = await detectImportAlias(cwd);
    console.log(`✔  Validating import alias. Found "${detectedAlias}".`);

    console.log("✔  Writing components.json.");
    await fs.writeFile(
      "components.json",
      JSON.stringify(
        {
          aliases: {
            components: `${detectedAlias}/components`,
            utils: `${detectedAlias}/utils`,
          },
          css: mainCssFile,
          installed: [],
        },
        null,
        2,
      ) + "\n",
    );

    console.log("Done.");
  });

async function detectTailwind(cwd) {
  try {
    const raw = await fs.readFile(path.join(cwd, "package.json"), "utf-8")
    const pkg = JSON.parse(raw)
    const deps = {
      ...pkg.dependencies,
      ...pkg.devDependencies
    }
    return "tailwindcss" in deps
  } catch (e) {
    return false
  }
}

async function detectCssFile(cwd) {
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

async function detectImportAlias(cwd) {
  const name = "tsconfig.json";

  try {
    const raw = await fs.readFile(path.join(cwd, name), "utf-8");
    const tsconfig = JSON.parse(raw);
    const paths = tsconfig.compilerOptions?.paths ?? {};

    for (const alias of Object.keys(paths)) {
      return alias.replace(/\/\*$/, "");
    }
  } catch (e) {
    console.error(e);
  }

  console.error("No import alias found.");
  process.exit(1);
}

program.parse(process.argv);
