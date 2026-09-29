# Idli Ghost Theme Builder

A powerful, visual drag-and-drop theme builder for the [Ghost CMS](https://ghost.org/) publishing platform. Built with Next.js (App Router), React 19, Tailwind CSS v4, and Zustand, Idli allows creators and developers to visually assemble production-ready Ghost themes with real-time canvas previews and compile them into 100% `gscan`-compliant Handlebars (`.hbs`), minified CSS, and packaged `.zip` themes.

---

## Key Features

### Visual Drag-and-Drop Canvas
- **Fluid Layout Reordering**: Powered by `@dnd-kit`, supporting intuitive drag-and-drop reordering of sections, columns, and blocks.
- **Responsive Viewport Previews**: Switch seamlessly between **Desktop (1280px)**, **Tablet (768px)**, and **Mobile (375px)** viewports with auto-fit canvas scaling.
- **Decoupled Theme Modes**: Independent App Theme (`appThemeMode`: Light/Dark for builder chrome) and Ghost Theme (`previewColorMode`: Light/Dark for the theme preview frame).
- **Undo / Redo & Autosave**: Full state history stack with debounced local storage persistence and database sync.
- **Custom Template Management**: Built-in template creator and duplicator generating slug-based `custom-[slug].hbs` templates with real-time duplicate detection.

### Native Ghost CMS Integration
- **Ghost Admin Accent Color (`@site.accent_color`)**: Theme styles dynamically cascade the publication's brand accent color configured in **Ghost Admin &rarr; Settings &rarr; Design & branding &rarr; Accent color** across primary buttons, links, hover states, blockquotes, badges, checkmarks, and focus rings.
- **Ghost Admin Typography Synchronization**: Inverted `:root` token architecture (`--gh-font-heading` and `--gh-font-body`) ensures that fonts selected in **Ghost Admin &rarr; Settings &rarr; Design & branding &rarr; Typography** instantly cascade across all semantic headings, titles, body paragraphs, and UI widgets without rebuilding.
- **Dynamic Ghost Navigation**: Dedicated `partials/navigation.hbs` template rendering Ghost's native `{{navigation}}` helper with support for primary and secondary navigation menus configured in Ghost Admin.
- **Ghost Native Comments UI**: Seamless integration with `@tryghost/comments-ui` via `{{comments}}`, featuring automatic iframe background transparency and light/dark theme synchronization.
- **Ghost Post & Page Stacks**: Full support for Ghost content contexts, including `@page.show_title_and_feature_image`, post excerpts, feature images, authors, tags, reading times, and member gating.

### Ghost Theme Compiler & Packaging
- **AST to Handlebars Translation**: Parses the visual AST (`ThemeDocument`) into clean, semantic Handlebars templates (`index.hbs`, `post.hbs`, `page.hbs`, `tag.hbs`, `author.hbs`, `default.hbs`, etc.).
- **Automated CSS Minification**: Theme stylesheets (`assets/built/screen.css`) are automatically stripped of comments and whitespace during compilation.
- **Strict `gscan` Validation**: Bundles Casper template assets, manifest metadata, required locales (`locales/en.json`), and package configurations (`card_assets: true`, `keywords: ["ghost-theme"]`) to achieve 100% clean passes in Ghost's official validator.
- **One-Click ZIP Export**: Packages templates, minified assets, and configuration into a ready-to-upload Ghost theme `.zip` archive using `JSZip`.

### Styling & Multi-Mode Backgrounds
- **Universal Multi-Mode Backgrounds**: Reusable background engine supporting 6 distinct modes:
  - Solid Color (with transparency toggle)
  - Linear Gradients (with degree rotation slider)
  - Radial Gradients
  - Mesh Gradients (with ambient glow effects)
  - SVG Repeat Patterns (dots, grid, waves, diagonal lines)
  - Image Overlays (with customizable overlay color and opacity)
- **Elimination of Duplicate Spacing**: Unified padding and spacing controls across sidebars and inspectors.

---

## Component Library (34 Modular Blocks)

Every component follows a modular 4-file architecture (`schema.ts`, `canvas.tsx`, `sidebar.tsx`, `compiler.ts`) and is registered in the central block registry:

| Category | Components |
| :--- | :--- |
| **Layout & Structure** | `section`, `container`, `columns`, `spacer`, `divider` |
| **Ghost Core** | `header`, `footer`, `post-content`, `page-detail`, `post-grid`, `featured-posts`, `related-posts`, `post-navigation`, `author-profile`, `tag-header`, `tag-archive`, `comments`, `share`, `error-view` |
| **Content & Media** | `heading`, `text`, `button`, `image`, `video-player`, `cards`, `grid-gallery`, `logo-cloud` |
| **Engagement & Conversion** | `hero`, `newsletter`, `faq`, `stats`, `team`, `testimonials` |

---

## Architecture & Data Flow

```text
┌─────────────────────────────────────────────────────────────┐
│                 Visual Builder UI (React 19)                │
│  - Toolbar (Viewport, History, Theme Modes, Export)         │
│  - LeftSidebar (Block Palette, Page Templates, Navigation)  │
│  - Canvas Preview Frame (#canvas-preview-frame)             │
│  - RightSidebar (Inspector: Properties & Styles)            │
└──────────────────────────────┬──────────────────────────────┘
                               │
                      Modifies │ Zustand Store
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 ThemeDocument (AST State)                   │
│  - settings (accentColor, designTokens, typography)         │
│  - pages (index, post, page, custom-[slug], etc.)           │
│  - sections & blocks tree                                   │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
       Renders │ Canvas Preview        Compiles│ Export Pipeline
               ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│    Canvas Block Renderers   │ │    Ghost Theme Compiler     │
│  - React Canvas Components  │ │  - Handlebars AST Codegen   │
│  - Real-time CSS Variables  │ │  - screen.css Minification  │
│  - DND Kit Sortable Nodes   │ │  - Casper Manifest Bundling │
└─────────────────────────────┘ │  - gscan Validation Passes  │
                                └──────────────┬──────────────┘
                                               │ Generates
                                               ▼
                                ┌─────────────────────────────┐
                                │   Downloadable Theme ZIP    │
                                │   (Upload ready for Ghost)  │
                                └─────────────────────────────┘
```

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16+ (App Router)
- **UI Library**: [React](https://react.dev/) 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4 & `@tailwindcss/postcss`
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) v5
- **Drag & Drop**: [`@dnd-kit/core`](https://dndkit.com/), `@dnd-kit/sortable`, `@dnd-kit/modifiers`
- **Validation**: [Zod](https://zod.dev/) v4 & Ghost [GScan](https://github.com/TryGhost/gscan)
- **Archive Generation**: [JSZip](https://stuk.github.io/jszip/)
- **Database ORM**: [Prisma](https://www.prisma.io/) (SQLite/PostgreSQL)

---

## Project Structure

```text
ghost-theme-builder/
├── prisma/                          # Database schema and SQLite development migrations
│   └── schema.prisma
├── public/                          # Static public assets (casper template, icons, fonts)
│   └── casper-template/             # Default Casper manifest and SVG assets for gscan
├── scripts/                         # Build, audit, and verification scripts
│   ├── generate_casper_manifest.js
│   └── verify-component-registration.mjs
├── src/
│   ├── app/                         # Next.js App Router root
│   │   ├── api/                     # Backend API endpoints (themes, export, validation)
│   │   ├── globals.css              # Global brand design tokens & dark mode cascades
│   │   ├── layout.tsx               # Root application layout
│   │   └── page.tsx                 # Main builder interface entry point
│   ├── components/
│   │   └── builder/                 # Builder interface components
│   │       ├── Builder.tsx          # Master builder orchestration shell
│   │       ├── Canvas.tsx           # Scaled preview canvas & iframe container
│   │       ├── Toolbar.tsx          # Top navigation, view toggles & action buttons
│   │       ├── LeftSidebar.tsx      # Component insertion palette & template manager
│   │       ├── RightSidebar.tsx     # Context-sensitive property & style inspector
│   │       ├── compiler.ts          # Master Ghost Handlebars & CSS compiler engine
│   │       └── ...modals            # CustomTemplateModal, TemplatePickerModal, etc.
│   ├── editor/
│   │   └── components/              # 34 Modular Component Definitions
│   │       ├── <component-name>/
│   │       │   ├── schema.ts        # Zod props/style schema and defaults
│   │       │   ├── canvas.tsx       # Live React canvas preview component
│   │       │   ├── sidebar.tsx      # Block-specific inspector controls
│   │       │   └── compiler.ts      # Ghost Handlebars & CSS generator
│   │       ├── registry.ts          # Central registry mapping block types to modules
│   │       ├── blockTemplates.ts    # Block layout defaults and seed templates
│   │       └── shared/              # Shared utilities (backgrounds, escaping, colors)
│   ├── lib/                         # Server utilities, Prisma client, logging
│   ├── store/                       # Zustand state management
│   │   ├── editorStore.ts           # Central builder state, actions, undo/redo
│   │   └── templates.ts             # Pre-configured full-page layout templates
│   └── types/                       # Shared TypeScript interface definitions
│       └── theme.ts                 # ThemeDocument AST and styling types
├── AGENTS.md                        # Coding standards and AI agent directives
├── ARCHITECTURE.md                  # High-level architecture documentation
├── DESIGN.md                        # Design system tokens and UI styling rules
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.18.0 or newer (v20+ recommended)
- **Package Manager**: `npm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sakthi-t4gc/t4gc_theme_builder.git
   cd t4gc_theme_builder/ghost-theme-builder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Initialize the local database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts & Verification

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js local development server with Turbopack |
| `npm run build` | Compiles the production Next.js build |
| `npm run start` | Starts the production Next.js server |
| `npm run typecheck` | Validates TypeScript types across the entire project (`tsc --noEmit`) |
| `npm run lint` | Runs ESLint 9 to ensure strict code quality and syntax compliance |
| `npx tsx export-test.ts` | Runs the full theme compilation pipeline and verifies all exported `.hbs` and `.css` files |

---

## Deploying Exported Themes to Ghost

1. In the builder header, click **Export Theme**.
2. Download the compiled `<theme-name>.zip` file.
3. Open your Ghost Admin panel (e.g. `https://your-site.ghost.io/ghost`).
4. Navigate to **Settings &rarr; Design & branding &rarr; Change theme**.
5. Click **Upload theme** in the top-right corner and select your `.zip` package.
6. Click **Activate now**.
7. Customize your **Accent color** and **Typography** under **Design & branding**; your theme will dynamically adapt in real time!

---

## Development Guidelines

- **Clean Architecture**: Keep Ghost Handlebars compiler logic completely pure and decoupled from React rendering.
- **Strict Typing**: Write type-safe TypeScript code without `any`.
- **Ghost Validation**: Ensure any exported Handlebars changes preserve balanced blocks (`{{#...}}` / `{{/...}}`) and pass `gscan` validation rules.
- **Reference Docs**:
  - [`CONTRIBUTING.md`](./CONTRIBUTING.md) - Step-by-step guide on forking, branching, and creating Pull Requests.
  - [`AGENTS.md`](./AGENTS.md) - AI agent rules and conventions.
  - [`ARCHITECTURE.md`](./ARCHITECTURE.md) - Deep-dive into AST nodes and compilation.
  - [`DESIGN.md`](./DESIGN.md) - Design system guidelines and color tokens.

---

## Contributing

We welcome community contributions! Please read our [**Contributing & Pull Request Guide**](./CONTRIBUTING.md) for detailed instructions on:
1. Forking and setting up the local development environment
2. Branching and commit conventions
3. Pre-flight verification checklist (`typecheck`, `lint`, and export tests)
4. Opening and formatting a proper Pull Request

