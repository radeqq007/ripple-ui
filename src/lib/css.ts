import fs from "node:fs/promises";
import { die } from "./errors.js";
import { type AccentTheme, accentThemes, type Base, bases } from "./themes.js";

export const updateCss = async (
	cssPath: string,
	baseName: string,
	accentName: string,
) => {
	const marker = "/* Ripple UI Theme */";

	let existingContent = "";
	try {
		existingContent = await fs.readFile(cssPath, "utf-8");
	} catch {
		die(
			`Could not read CSS file: ${cssPath}`,
			`Check that the file exists and is readable.`,
		);
	}

	const markerIdx = existingContent.indexOf(marker);
	const userContent =
		markerIdx !== -1
			? existingContent.slice(0, markerIdx).trimEnd()
			: existingContent.trimEnd();

	const b: Base | undefined = bases[baseName];
	if (!b) die(`Unknown base color: ${baseName}`);

	const a: AccentTheme | undefined = accentThemes[accentName];
	if (!a) die(`Unkown accent theme: ${accentName}`);

	// Typescript doesn't detect the never type in die()
	// Those checks are always false
	// They are here just to make typescript shut up
	if (!a) return;
	if (!b) return;

	const content = `/* Ripple UI Theme */
@import "tw-animate-css";
@import "@fontsource-variable/geist";

@custom-variant dark (&:is(.dark *));

@theme inline {
    --font-heading: var(--font-sans);
    --font-sans: 'Geist Variable', sans-serif;
    --color-sidebar-ring: var(--sidebar-ring);
    --color-sidebar-border: var(--sidebar-border);
    --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
    --color-sidebar-accent: var(--sidebar-accent);
    --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
    --color-sidebar-primary: var(--sidebar-primary);
    --color-sidebar-foreground: var(--sidebar-foreground);
    --color-sidebar: var(--sidebar);
    --color-chart-5: var(--chart-5);
    --color-chart-4: var(--chart-4);
    --color-chart-3: var(--chart-3);
    --color-chart-2: var(--chart-2);
    --color-chart-1: var(--chart-1);
    --color-ring: var(--ring);
    --color-input: var(--input);
    --color-border: var(--border);
    --color-destructive: var(--destructive);
    --color-accent-foreground: var(--accent-foreground);
    --color-accent: var(--accent);
    --color-muted-foreground: var(--muted-foreground);
    --color-muted: var(--muted);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-secondary: var(--secondary);
    --color-primary-foreground: var(--primary-foreground);
    --color-primary: var(--primary);
    --color-popover-foreground: var(--popover-foreground);
    --color-popover: var(--popover);
    --color-card-foreground: var(--card-foreground);
    --color-card: var(--card);
    --color-foreground: var(--foreground);
    --color-background: var(--background);
    --radius-sm: calc(var(--radius) * 0.6);
    --radius-md: calc(var(--radius) * 0.8);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) * 1.4);
    --radius-2xl: calc(var(--radius) * 1.8);
    --radius-3xl: calc(var(--radius) * 2.2);
    --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
    --background: ${b.root.bg};
    --foreground: ${b.root.fg};
    --card: ${b.root.card.bg};
    --card-foreground: ${b.root.card.fg};
    --popover: ${b.root.popover.bg};
    --popover-foreground: ${b.root.popover.fg};
    --primary: ${a.root.primary.bg};
    --primary-foreground: ${a.root.primary.fg};
    --secondary: ${b.root.secondary.bg};
    --secondary-foreground: ${b.root.secondary.fg};
    --muted: ${b.root.muted.bg};
    --muted-foreground: ${b.root.muted.fg};
    --accent: ${b.root.accent.bg};
    --accent-foreground: ${b.root.accent.fg};
    --destructive: ${b.root.destructive};
    --border: ${b.root.border};
    --input: ${b.root.input};
    --ring: ${b.root.ring};
    --chart-1: ${b.root.charts[0]};
    --chart-2: ${b.root.charts[1]};
    --chart-3: ${b.root.charts[2]};
    --chart-4: ${b.root.charts[3]};
    --chart-5: ${b.root.charts[4]};
    --radius: ${a.radius};
    --sidebar: ${b.root.sidebar.bg};
    --sidebar-foreground: ${b.root.sidebar.fg};
    --sidebar-primary: ${a.root.sidebar.primary.bg};
    --sidebar-primary-foreground: ${a.root.sidebar.primary.fg};
    --sidebar-accent: ${b.root.sidebar.accent.bg};
    --sidebar-accent-foreground: ${b.root.sidebar.accent.fg};
    --sidebar-border: ${b.root.sidebar.border};
    --sidebar-ring: ${b.root.sidebar.ring};
}

.dark {
    --background: ${b.dark.bg};
    --foreground: ${b.dark.fg};
    --card: ${b.dark.card.bg};
    --card-foreground: ${b.dark.card.fg};
    --popover: ${b.dark.popover.bg};
    --popover-foreground: ${b.dark.popover.fg};
    --primary: ${a.dark.primary.bg};
    --primary-foreground: ${a.dark.primary.fg};
    --secondary: ${b.dark.secondary.bg};
    --secondary-foreground: ${b.dark.secondary.fg};
    --muted: ${b.dark.muted.bg};
    --muted-foreground: ${b.dark.muted.fg};
    --accent: ${b.dark.accent.bg};
    --accent-foreground: ${b.dark.accent.fg};
    --destructive: ${b.dark.destructive};
    --border: ${b.dark.border};
    --input: ${b.dark.input};
    --ring: ${b.dark.ring};
    --chart-1: ${b.dark.charts[0]};
    --chart-2: ${b.dark.charts[1]};
    --chart-3: ${b.dark.charts[2]};
    --chart-4: ${b.dark.charts[3]};
    --chart-5: ${b.dark.charts[4]};
    --sidebar: ${b.dark.sidebar.bg};
    --sidebar-foreground: ${b.dark.sidebar.fg};
    --sidebar-primary: ${a.dark.sidebar.primary.bg};
    --sidebar-primary-foreground: ${a.dark.sidebar.primary.fg};
    --sidebar-accent: ${b.dark.sidebar.accent.bg};
    --sidebar-accent-foreground: ${b.dark.sidebar.accent.fg};
    --sidebar-border: ${b.dark.sidebar.border};
    --sidebar-ring: ${b.dark.sidebar.ring};
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}`;

	const newContent = userContent
		? `${userContent}\n\n${content}\n`
		: `${content}\n`;

	try {
		await fs.writeFile(cssPath, newContent);
	} catch (e) {
		die(`Could not write into ${cssPath}: ${(e as Error).message}`);
	}
};
