#!/usr/bin/env node
import { program } from "commander";
import fs from "fs/promises";
import path from "path";

const registryUrl = "https://raw.githubusercontent.com/radeqq007/ripple-ui/main/registry.json"

program
  .name("ripple-ui")
  .description("shadcn/ui inspired components library for Ripple TS")
  .argument("<component>", "Component to add (e.g. button)")
  .action(async (component) => {
    const registry = await fetch(registryUrl).then(r => r.json())
    const item = registry.items.find(i => i.name === component.toLowerCase())
    const targetDir = path.join(process.cwd(), "src/components/ui")

    if (!item) {
      console.error(`Component "${component}" not found.`)
      process.exit(1)
    }

    await fs.mkdir(targetDir, { recursive: true })

    for (const file of item.files) {
      const dest = path.join(targetDir, file.path)
      await fs.writeFile(dest, file.content)
      console.log(`Added ${file.path}`)
    }
  })

program.parse()

