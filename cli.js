#!/usr/bin/env node
import { Command } from "commander";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import fs from "fs/promises";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const registry = JSON.parse(
  readFileSync(
    fileURLToPath(new URL("./registry.json", import.meta.url)),
    "utf-8",
  ),
);

const program = new Command();

program
  .command("add <component>")
  .description("Add a Ripple UI component")
  .action(async (component) => {
    const entry = registry[component];
    if (!entry) {
      console.error(`Component "${component}" not found.`);
      process.exit(1);
    }

    const targetPath = path.resolve(process.cwd(), "src/components", component);

    try {
      await fs.mkdir(targetPath, { recursive: true });
      await Promise.all(
        entry.files.map(async (file) => {
          const src = path.resolve(__dirname, entry.path, file);
          const dest = path.resolve(targetPath, file);
          await fs.copyFile(src, dest);
        }),
      );
      console.log(`Component ${component} added to ${targetPath}`);
    } catch (e) {
      console.error(`Failed to add "${component}": ${e.message}`);
    }
  });

program.parse(process.argv);
