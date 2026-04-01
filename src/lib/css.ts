import fs from "fs/promises";
import { themes } from "./themes.js";

export const updateCss = async (cssPath: string, theme: string) => {
  const marker = "/* Ripple UI Theme */";

  let existingContent = "";
  try {
    existingContent = await fs.readFile(cssPath, "utf-8");
  } catch {}

  const markerIdx = existingContent.indexOf(marker);
  const userContent = markerIdx !== -1
    ? existingContent.slice(0, markerIdx).trimEnd()
    : existingContent.trimEnd();

  const t = themes[theme]!; // TODO: get theme from components.json

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
    --background: ${t.root.bg};
    --foreground: ${t.root.fg};
    --card: ${t.root.card.bg};
    --card-foreground: ${t.root.card.fg};
    --popover: ${t.root.popover.bg};
    --popover-foreground: ${t.root.popover.fg};
    --primary: ${t.root.primary.bg};
    --primary-foreground: ${t.root.primary.fg};
    --secondary: ${t.root.secondary.bg};
    --secondary-foreground: ${t.root.secondary.fg};
    --muted: ${t.root.muted.bg};
    --muted-foreground: ${t.root.muted.fg};
    --accent: ${t.root.accent.bg};
    --accent-foreground: ${t.root.accent.fg};
    --destructive: ${t.root.destructive};
    --border: ${t.root.border};
    --input: ${t.root.input};
    --ring: ${t.root.ring};
    --chart-1: ${t.root.charts[0]};
    --chart-2: ${t.root.charts[1]};
    --chart-3: ${t.root.charts[2]};
    --chart-4: ${t.root.charts[3]};
    --chart-5: ${t.root.charts[4]};
    --radius: ${t.radius};
    --sidebar: ${t.root.sidebar.bg};
    --sidebar-foreground: ${t.root.sidebar.fg};
    --sidebar-primary: ${t.root.sidebar.primary.bg};
    --sidebar-primary-foreground: ${t.root.sidebar.primary.fg};
    --sidebar-accent: ${t.root.sidebar.accent.bg};
    --sidebar-accent-foreground: ${t.root.sidebar.accent.fg};
    --sidebar-border: ${t.root.sidebar.border};
    --sidebar-ring: ${t.root.sidebar.ring};
}

.dark {
    --background: ${t.dark.bg};
    --foreground: ${t.dark.fg};
    --card: ${t.dark.card.bg};
    --card-foreground: ${t.dark.card.fg};
    --popover: ${t.dark.popover.bg};
    --popover-foreground: ${t.dark.popover.fg};
    --primary: ${t.dark.primary.bg};
    --primary-foreground: ${t.dark.primary.fg};
    --secondary: ${t.dark.secondary.bg};
    --secondary-foreground: ${t.dark.secondary.fg};
    --muted: ${t.dark.muted.bg};
    --muted-foreground: ${t.dark.muted.fg};
    --accent: ${t.dark.accent.bg};
    --accent-foreground: ${t.dark.accent.fg};
    --destructive: ${t.dark.destructive};
    --border: ${t.dark.border};
    --input: ${t.dark.input};
    --ring: ${t.dark.ring};
    --chart-1: ${t.dark.charts[0]};
    --chart-2: ${t.dark.charts[1]};
    --chart-3: ${t.dark.charts[2]};
    --chart-4: ${t.dark.charts[3]};
    --chart-5: ${t.dark.charts[4]};
    --sidebar: ${t.dark.sidebar.bg};
    --sidebar-foreground: ${t.dark.sidebar.fg};
    --sidebar-primary: ${t.dark.sidebar.primary.bg};
    --sidebar-primary-foreground: ${t.dark.sidebar.primary.fg};
    --sidebar-accent: ${t.dark.sidebar.accent.bg};
    --sidebar-accent-foreground: ${t.dark.sidebar.accent.fg};
    --sidebar-border: ${t.dark.sidebar.border};
    --sidebar-ring: ${t.dark.sidebar.ring};
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
