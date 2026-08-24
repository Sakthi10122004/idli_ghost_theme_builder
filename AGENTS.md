# Agent Instructions - Ghost Theme Builder

You are an AI assistant working on the Visual Ghost Theme Builder project. Follow these guidelines to maintain consistency and quality.

## Tech Stack & Architecture

- **Next.js (App Router)**: Located in `src/app/`. Use client components where interactivity is needed, and keep routing clean.
- **Tailwind CSS**: Conforms to the design system in `DESIGN.md`. Ensure custom classes/styles are defined in `tailwind.config.ts` or `src/app/globals.css`.
- **Zustand**: Local state store in `src/store/editorStore.ts` for visual editor actions.
- **Zod**: Validation schemas inside `src/editor/schema/`.
- **Ghost theme structures**: Compiled from the visual editor AST into handlebars (`.hbs`), CSS, and metadata, then packaged.

## Component & Template Structures

- **Page Templates**: Dynamic page templates created inside the visual editor must have a slug-based routing representation (e.g. `custom-[slug].hbs` / page templates list key) and should be initialized with default header, content, and footer block IDs.
- **Layout Containers (Columns, Sections, Containers)**:
  - `columns` block must serve as a flex container (row layout by default, wraps on smaller screens) capable of containing child nodes.
  - `spacer` blocks must support custom heights editable via properties.
  - `divider` blocks must conform to the 1px hairline rule style.
- **Ghost Core Widgets**:
  - `author-profile`: Needs custom properties for author bio name and description.
  - `tag-archive`: Captures and displays clean metadata capsules.
  - `post-detail`: A mock screen rendering headings, tags, details, reading time, and placeholder paragraphs to represent article previews.

## Ghost Compiler & Validation Rules

- **Ghost Theme Validator**: Every exported package must adhere to Ghost's structural rules:
  - `package.json` requires: `author.email`, `"keywords": ["ghost-theme"]`, and `"config": { "card_assets": true }`.
  - CSS must define `--gh-font-heading` and `--gh-font-body` variables, and include `.kg-width-wide` and `.kg-width-full` image alignment utility classes.
  - `page.hbs` markup must gate titles/images with `{{#if @page.show_title_and_feature_image}}`.
  - Direct queries (like `{{#get "tags"}}`) must specify a safe maximum limit (e.g. `limit="100"` instead of `"all"`).
  - Theme assets (`assets/css/screen.css`) must be automatically minified (stripping whitespace and comments) during compilation.
  - **Dynamic Navigation Integration**: The compiler must output a dedicated `partials/navigation.hbs` template containing the `{{#foreach navigation}}` loop, and the compiled header layout must render the dynamic list using Ghost's native `{{navigation}}` helper, ensuring absolute compatibility with Ghost backend menu settings.

## Editor Lifecycle & State Rules

- **Autosave Timings**: Debounced store updates saved to database providers must execute within a snappy window (e.g., 400ms delay) to keep editor reactions fast.
- **Hydration safety**: Client-side layout drag-and-drop structures (`dnd-kit` contexts) must delay rendering until client-side hydration completes to prevent server-rendered HTML mismatches.
- **Node native module isolation**: Native Node packages (e.g. `bunyan`, `fs`) must be dynamically imported/required behind server-only scope checks (e.g. `typeof window === 'undefined'`) to prevent client-side bundler compilation failures.
- **Direct Zustand State Queries**: For operations that require the absolute latest state at execution time (e.g., manual saves, theme export compile cycles), query the Zustand store directly using `useEditorStore.getState()` instead of destructured React state variables to bypass React render closure lag.

## Modular Component Registration Rules

- **Component Registration**: All visual builder block types must be defined modularly under `src/editor/components/<component-name>/` following the registry pattern:
  - `schema.ts`: Defines its type name, default props, and default style layouts.
  - `canvas.tsx`: A modular React component for visual block rendering inside the builder canvas workspace.
  - `sidebar.tsx`: A modular React component containing properties settings inputs for the block.
  - `compiler.ts`: A compiler function translating the AST block and its children into standard Ghost Handlebars markup.
- **Central Registry**: Register all modular components in `src/editor/components/registry.ts` to expose them dynamically to the Canvas, compiler, RightSidebar, and editor stores.




## UI Styling Guidelines (from DESIGN.md)

1. **Colors**:
   - Primary/Ink: `#171717` (Used for primary CTAs and body text).
   - Canvas-soft: `#fafafa` (Page background).
   - Hairline: `#ebebeb` (Dividers, borders).
   - Mesh Gradient (cyan, blue, magenta, amber) at hero scale.
2. **Typography**:
   - Display ceiling is weight 600. Avoid `font-bold` (700/800).
   - Use Geist/Inter with negative letter-spacing for headlines.
   - Use Geist Mono/JetBrains Mono for technical captions, tag eyebrows, and code.
3. **Borders & Radii**:
   - Base UI border radius is `rounded-sm` (6px) or `rounded-md` (8px).
   - Primary CTAs are pill-shaped (`rounded-full` / 100px).
   - Hairline borders (1px) for card edges.
4. **Shadows**:
   - Use stacked multi-offset shadows instead of a single heavy drop-shadow.

## Coding Rules

- Write clean, type-safe TypeScript code. No `any`.
- Keep compiler logic completely independent from the UI and React.
- Always run `npm run typecheck` and `npm run lint` before completing tasks.
