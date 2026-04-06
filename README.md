# ripple-ui
![NPM Version](https://img.shields.io/npm/v/rippleui-cli)
![License](https://img.shields.io/github/license/radeqq007/ripple-ui)
![downloads](https://img.shields.io/npm/dm/rippleui-cli)
[![CI](https://github.com/radeqq007/ripple-ui/actions/workflows/CI.yaml/badge.svg)](https://github.com/radeqq007/ripple-ui/actions/workflows/CI.yaml)
![Last commit](https://img.shields.io/github/last-commit/radeqq007/ripple-ui)
![GitHub stars](https://img.shields.io/github/stars/radeqq007/ripple-ui?style=social)


A [shadcn/ui](https://github.com/shadcn-ui/ui) inspired component library for [Ripple TS](https://github.com/Ripple-TS/ripple).

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
