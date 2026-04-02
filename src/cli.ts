#!/usr/bin/env node
import { Command } from "commander";
import { init } from "./commands/init.js";
import { add } from "./commands/add.js";
import { list } from "./commands/list.js";
import { installed } from "./commands/installed.js";

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
