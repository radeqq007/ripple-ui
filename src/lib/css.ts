import fs from "fs/promises";
import { themes } from "./themes.js";

export const updateCss = async (cssPath: string) => {
  const marker = "/* Ripple UI Theme */";

  let existingContent = "";
  try {
    existingContent = await fs.readFile(cssPath, "utf-8");
  } catch {}

  const markerIdx = existingContent.indexOf(marker);
  const userContent = markerIdx !== -1
    ? existingContent.slice(0, markerIdx).trimEnd()
    : existingContent.trimEnd();

  const theme = themes["stone"]!; // TODO: get theme from components.json

  // TODO: add more themes instead of just one hardcoded theme
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
    --background: ${theme.root.bg};
    --foreground: ${theme.root.fg};
    --card: ${theme.root.card.bg};
    --card-foreground: ${theme.root.card.fg};
    --popover: ${theme.root.popover.bg};
    --popover-foreground: ${theme.root.popover.fg};
    --primary: ${theme.root.primary.bg};
    --primary-foreground: ${theme.root.primary.fg};
    --secondary: ${theme.root.secondary.bg};
    --secondary-foreground: ${theme.root.secondary.fg};
    --muted: ${theme.root.muted.bg};
    --muted-foreground: ${theme.root.muted.fg};
    --accent: ${theme.root.accent.bg};
    --accent-foreground: ${theme.root.accent.fg};
    --destructive: ${theme.root.destructive};
    --border: ${theme.root.border};
    --input: ${theme.root.input};
    --ring: ${theme.root.ring};
    --chart-1: ${theme.root.charts[0]};
    --chart-2: ${theme.root.charts[1]};
    --chart-3: ${theme.root.charts[2]};
    --chart-4: ${theme.root.charts[3]};
    --chart-5: ${theme.root.charts[4]};
    --radius: ${theme.radius};
    --sidebar: ${theme.root.sidebar.bg};
    --sidebar-foreground: ${theme.root.sidebar.fg};
    --sidebar-primary: ${theme.root.sidebar.primary.bg};
    --sidebar-primary-foreground: ${theme.root.sidebar.primary.fg};
    --sidebar-accent: ${theme.root.sidebar.accent.bg};
    --sidebar-accent-foreground: ${theme.root.sidebar.accent.fg};
    --sidebar-border: ${theme.root.sidebar.border};
    --sidebar-ring: ${theme.root.sidebar.ring};
}

.dark {
    --background: ${theme.dark.bg};
    --foreground: ${theme.dark.fg};
    --card: ${theme.dark.card.bg};
    --card-foreground: ${theme.dark.card.fg};
    --popover: ${theme.dark.popover.bg};
    --popover-foreground: ${theme.dark.popover.fg};
    --primary: ${theme.dark.primary.bg};
    --primary-foreground: ${theme.dark.primary.fg};
    --secondary: ${theme.dark.secondary.bg};
    --secondary-foreground: ${theme.dark.secondary.fg};
    --muted: ${theme.dark.muted.bg};
    --muted-foreground: ${theme.dark.muted.fg};
    --accent: ${theme.dark.accent.bg};
    --accent-foreground: ${theme.dark.accent.fg};
    --destructive: ${theme.dark.destructive};
    --border: ${theme.dark.border};
    --input: ${theme.dark.input};
    --ring: ${theme.dark.ring};
    --chart-1: ${theme.dark.charts[0]};
    --chart-2: ${theme.dark.charts[1]};
    --chart-3: ${theme.dark.charts[2]};
    --chart-4: ${theme.dark.charts[3]};
    --chart-5: ${theme.dark.charts[4]};
    --sidebar: ${theme.dark.sidebar.bg};
    --sidebar-foreground: ${theme.dark.sidebar.fg};
    --sidebar-primary: ${theme.dark.sidebar.primary.bg};
    --sidebar-primary-foreground: ${theme.dark.sidebar.primary.fg};
    --sidebar-accent: ${theme.dark.sidebar.accent.bg};
    --sidebar-accent-foreground: ${theme.dark.sidebar.accent.fg};
    --sidebar-border: ${theme.dark.sidebar.border};
    --sidebar-ring: ${theme.dark.sidebar.ring};
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
    ? `${userContent}\n\n${theme}\n`
    : `${theme}\n`;

  await fs.writeFile(cssPath, newContent);
};
