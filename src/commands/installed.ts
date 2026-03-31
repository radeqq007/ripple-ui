import { readConfig } from "../lib/config.js";

export const installed = async () => {
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
};
