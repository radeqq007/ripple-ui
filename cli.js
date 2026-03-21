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
    return { installed: [] };
  }
}

async function writeConfig(config) {
  await fs.writeFile(configPath, JSON.stringify(config, null, 2) + "\n");
}

async function installComponent(name, registry, installed = new Set()) {
  if (installed.has(name)) return;
  installed.add(name);

  const entry = registry[name];
  if (!entry) throw new Error(`"${name}" not found in registry`);

  for (const dep of entry.dependencies ?? []) {
    await installComponent(dep, registry, installed);
  }

  const targetDir = entry.target ?? `src/components/${name}`;
  const targetPath = path.resolve(process.cwd(), targetDir);
  await fs.mkdir(targetPath, { recursive: true });

  await Promise.all(
    entry.files.map(async (file) => {
      const src = path.resolve(__dirname, entry.path, file);
      const dest = path.resolve(targetPath, file);
      await fs.copyFile(src, dest);
    }),
  );

  console.log(`✔ Installed: ${name} → ${targetPath}`);
}

const program = new Command();

program
  .command("add <component>")
  .description("Add a Ripple UI component")
  .action(async (component) => {
    if (!registry[component]) {
      console.error(`Component "${component}" not found.`);
      process.exit(1);
    }

    const config = await readConfig();
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

    await installComponent(component, alreadyInstalled);

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
    const answers = await prompts([
      {
        type: "text",
        name: "componentsDir",
        message: "Where are your components?",
        initial: "src/components",
      },
      {
        type: "text",
        name: "utilsDir",
        message: "Where are your utilities?",
        initial: "src/lib",
      },
      {
        type: "text",
        name: "componentsAlias",
        message: "Components path alias?",
        initial: "@/components",
      },
      {
        type: "text",
        name: "utilsAlias",
        message: "Utils path alias?",
        initial: "@/lib/utils",
      },
    ]);

    await fs.writeFile(
      "components.json",
      JSON.stringify(answers, null, 2) + "\n",
    );
  });

program.parse(process.argv);
