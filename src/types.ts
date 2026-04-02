export interface RegistryEntry {
	files: string[];
	path: string;
	dependencies?: string[];
	npmDependencies?: string[];
	target?: string;
}

export interface Registry {
	[name: string]: RegistryEntry;
}

export interface Config {
	aliases: { components: string; utils: string };
	css: string;
	installed: string[];
	componentsDir: string;
	utilsDir: string;
}
