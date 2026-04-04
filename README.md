# ripple-ui

A shadcn/ui inspired component library for Ripple TS.

## Getting started

### 1. Initialize

```sh
npx rippleui-cli init
```

This will:

- Detect your tailwind setup and import alias defined in the vite configuration
- Ask you to choose a base color and an accent theme
- Write a `components.json` config file
- Inject CSS variables and theme tokens into your main CSS file

### 2. Add components

```sh
npx rippleui-cli add <component name>
```

Components and their dependencies are copied into your src/components/ directory.

### 3. Browse available components

```sh
npx rippleui-cli list
```

### 4. See what's installed

```sh
npx rippleui-cli installed
```

## Available components

- button
- checkbox
- input
- select
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

Generated during initialization:

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
