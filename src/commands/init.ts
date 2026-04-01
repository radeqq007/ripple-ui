import prompts from "prompts";
import fs from "fs/promises";
import path from "path";
import {
  detectTailwind,
  detectCssFile,
  detectImportAlias,
} from "../lib/detect.js";
import { updateCss } from "../lib/css.js";
import type { Config } from "../types.js";
import { installNpmDeps } from "../lib/install.js";

export const init = async () => {
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

  await fs.writeFile("components.json", JSON.stringify(config, null, 2) + "\n");

  await updateCss(path.join(cwd, mainCssFile as string));
  console.log(`✔  Updating ${mainCssFile}`);

  console.log("\tInstalling dependencies...")
  await installNpmDeps(["@fontsource-variable/geist", "tw-animate-css"], cwd)

  console.log("Done.");
};
