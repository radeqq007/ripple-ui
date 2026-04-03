# ripple-ui
A shadcn/ui inspired component library for Ripple TS.

## Getting started

### 1. Initialize

```sh
npx ripple-ui init
```

This will:

- Detect your tailwind setup and import alias defined in the vite configuration
- Ask you to chose a base color and an accent theme
- Write a `components.json` config file
- Inject CSS variables and theme tokens into your main CSS file

### 2. Add components

```sh
npx ripple-ui add <component name>
```

Components and their dependencies are copied into your src/components/ directory.

### 3. Browse available components

```sh
npx ripple-ui list
```

### 4. See what's installed

```sh
npx ripple-ui installed
```

## Aviable components

- button
- checkbox
- input
- label
- utils

## Theming

### Base colors:
- stone
- zinc
- slate

### Accent themes:
- neutral
- blue
- violet
- rose
- orange

## components.json

Generated during initalization:
```json
{
  "aliases": {
    "components": "@/components",
    "utils": "@/utils"
  },
  "css": "src/index.css",
  "installed": [],
  "componentsDir": "src/components",
  "utilsDir": "src/utils"
}
```
