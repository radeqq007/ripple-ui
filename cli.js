#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs/promises";
import path from "path";
import registry from "../registry.json";

const program = new Command();

program
  .command("add <component>")
  .description("Add a Ripple UI component")
  .action(async (component) => {
    const entry = registry[component];
    if (!entry) {
      console.error(`Component "${component}" not found.`);
      return;
    }

    const targetPath = path.resolve(process.cwd(), "src/components", component);

    for (const file of entry.files) {
      const src = path.resolve(__dirname, "..", entry.path, file);
      const dest = path.resolve(targetPath, file);
      await fs.copy(src, dest);
    }

    console.log(`Component ${component} added to ${targetPath}`);
  });

program.parse(process.argv);
