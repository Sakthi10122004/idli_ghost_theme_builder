# Architecture - Ghost Theme Builder

## Core Concept: AST / Intermediate Representation

The core of the theme builder is the `ThemeDocument` JSON tree, representing the entire configuration of the Ghost theme. Editing actions manipulate this tree using a Zustand store. 

```text
Visual Editor (React/Tailwind UI)
      ↓ (Modifies Zustand Store)
ThemeDocument JSON / AST
      ↓ (Transformed by Renderers & Compilers)
┌───────────────────────────┐
│                           │
▼                           ▼
React Preview Renderer      Ghost Theme Compiler
(Real-time Canvas preview)  (Generates HBS, CSS, package.json)
                            │
                            ▼
                        ZIP Export
```

## Structure

- **Types**: Defined in `src/types/theme.ts` representing layout configuration, global styles, page sections, and block schemas.
- **Visual Editor**: The canvas loads a dynamic renderer that renders each block type using corresponding React preview components.
- **Ghost Theme Compiler**: Parses the `ThemeDocument` and generates Handlebars template strings (`.hbs` files), CSS bundles (responsive breakpoints, typography, and variable overrides), and metadata files like `package.json` and `routes.yaml`.
