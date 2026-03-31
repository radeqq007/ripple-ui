import path from "path";
import fs from "fs/promises";
import type { Config } from "../types.js";

const configPath = path.resolve(process.cwd(), "components.json");
export const readConfig = async (): Promise<Config | undefined> => {
  try {
    const raw = await fs.readFile(configPath, "utf-8");
    return JSON.parse(raw);
  } catch {}
};

export const writeConfig = async (config: Config) => {
  await fs.writeFile(configPath, JSON.stringify(config, null, 2) + "\n");
};

export const requireConfig = (config: Config) => {
  if (!config) {
    console.error('No components.json found. Run "ripple-ui init" first.');
    process.exit(1);
  }
};
