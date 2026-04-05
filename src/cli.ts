#!/usr/bin/env node
import { Command } from "commander";
import { add } from "./commands/add.js";
import { init } from "./commands/init.js";
import { installed } from "./commands/installed.js";
import { list } from "./commands/list.js";

process.on("unhandledRejection", (reason: unknown) => {
	const msg =
		reason instanceof Error ? reason.message : String(reason ?? "Unkown error");
	console.error(`✖  Unexpected error: ${msg}`);
	console.error(
		"   If this keeps happening, please open an issue at https://github.com/radeqq007/ripple-ui/issues",
	);
	process.exit(1);
});

process.on("uncaughtException", (err: Error) => {
	console.error(`✖  Unexpected error: ${err.message}`);
	console.error(
		"   If this keeps happening, please open an issue at https://github.com/radeqq007/ripple-ui/issues",
	);
	process.exit(1);
});

const program = new Command();

program
	.command("add <component>")
	.description("Add a Ripple UI component")
	.action(add);

program.command("list").description("List available components").action(list);

program
	.command("installed")
	.description("List installed components")
	.action(installed);

program.command("init").description("Creates components.json").action(init);

program.parse(process.argv);
