import type { Registry } from "../types.js";

const GITHUB_RAW = "https://raw.githubusercontent.com/radeqq007/ripple-ui/main";
const REGISTRY_URL = `${GITHUB_RAW}/registry.json`;

export const fetchRegistry = async (): Promise<Registry> => {
  const res = await fetch(REGISTRY_URL);
  if (!res.ok) throw new Error(`Failed to fetch registry: ${res.statusText}`);
  return res.json() as Promise<Registry>;
};

export const fetchFile = async (path: string): Promise<string> => {
  const url = `${GITHUB_RAW}/${path}`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Failed to fetch file ${path}: ${res.statusText}`);

  return res.text();
};
