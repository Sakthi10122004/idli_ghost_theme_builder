# Idli Ghost Theme Builder — Version 0.0.1 (Pre-release)

## Overview

The Idli team is pleased to announce the first official pre-release of **Idli Ghost Theme Builder (v0.0.1)**. 

Idli Ghost Theme Builder is a specialized, visual drag-and-drop theme development environment engineered specifically for the [Ghost CMS](https://ghost.org/) publishing platform. Built on Next.js (App Router), React 19, Tailwind CSS v4, and Zustand, Idli allows developers, agencies, and publication teams to visually design responsive Ghost publication themes with live canvas previews and compile them into standards-compliant Handlebars (`.hbs`), minified production stylesheets, and ready-to-deploy `.zip` theme archives.

This release represents the initial public pre-release baseline, establishing the core visual editing workspace, a 33-block modular component registry, native Ghost CMS design token synchronization, and a certified `gscan`-compatible theme compilation pipeline.

---

## Technical Architecture & Core Capabilities

### 1. Visual Drag-and-Drop Workspace
- **Layout Manipulation Engine**: Integrates `@dnd-kit` to provide deterministic drag-and-drop reordering and hierarchical nesting across sections, containers, and column layouts.
- **Multi-Device Responsive Previews**: Provides viewport controls for Desktop (1280px), Tablet (768px), and Mobile (375px) with responsive auto-fit scaling.
- **Decoupled Theme Architecture**: Separates the builder UI chrome theme (`appThemeMode`: Light/Dark) from the active Ghost theme preview frame (`previewColorMode`: Light/Dark).
- **State Management & History Stack**: Backed by a Zustand state store featuring granular undo/redo history, debounced local persistence, and SQLite/Prisma synchronization.
- **Dynamic Template Creation**: Supports creating and duplicating slug-based custom templates (`custom-[slug].hbs`) with real-time route collision and duplicate detection.

### 2. Native Ghost CMS Integration
- **Ghost Brand Accent Color (`@site.accent_color`)**: Theme styles dynamically cascade the publication's brand accent color configured in Ghost Admin across primary actions, links, blockquotes, badges, and focus rings.
- **Dynamic Typography Cascading**: Utilizes an inverted `:root` token architecture (`--gh-font-heading` and `--gh-font-body`) to ensure fonts selected in Ghost Admin instantly reflect across headings and body copy without requiring theme recompilation.
- **Native Navigation Menus**: Emits a dedicated `partials/navigation.hbs` template rendering Ghost's native `{{navigation}}` and `{{navigation type="secondary"}}` helpers.
- **Ghost Comments Integration**: Integrates directly with `@tryghost/comments-ui` via the native `{{comments}}` helper, including transparent background adaptation and light/dark theme synchronization.
- **Content Context Compatibility**: Supports Ghost publication contexts, including `@page.show_title_and_feature_image`, post excerpts, feature image alignment utility classes (`.kg-width-wide`, `.kg-width-full`), author bios, tags, reading times, and member access gating.

### 3. Theme Compilation & Packaging Pipeline
- **AST to Handlebars Translation**: Parses the visual document AST (`ThemeDocument`) into clean, semantic Handlebars templates (`index.hbs`, `post.hbs`, `page.hbs`, `tag.hbs`, `author.hbs`, `default.hbs`, and custom templates).
- **Automated Asset Minification**: Theme stylesheets (`assets/css/screen.css`) are automatically stripped of comments and redundant whitespace during compilation.
- **Certified `gscan` Validation**: Injects Casper template baseline assets, manifest metadata, required locales (`locales/en.json`), and package configurations (`card_assets: true`, `keywords: ["ghost-theme"]`) to guarantee 100% clean passes in Ghost's official validation tool.
- **In-Memory ZIP Generation**: Packages templates, compiled assets, and configuration into a ready-to-upload Ghost theme `.zip` archive via `JSZip`.

### 4. Modular Component Library (33 Blocks)
Every builder block implements a 4-file modular architecture (`schema.ts`, `canvas.tsx`, `sidebar.tsx`, `compiler.ts`) registered in the central component registry:
- **Layout & Structure**: Section, Container, Columns, Spacer, Divider
- **Ghost Core**: Header, Footer, Post Content, Page Detail, Post Grid, Featured Posts, Related Posts, Post Navigation, Author Profile, Tag Header, Tag Archive, Comments, Share, Error View
- **Content & Media**: Heading, Text, Button, Image, Video Player, Cards, Grid Gallery, Logo Cloud
- **Engagement & Conversion**: Hero, Newsletter, FAQ, Stats, Team, Testimonials

### 5. Universal Background Engine
Sections and containers support six distinct rendering modes:
- Solid Color with alpha transparency configuration
- Linear Gradients with degree rotation controls
- Radial Gradients
- Mesh Gradients with atmospheric glow rendering
- SVG Repeat Patterns (dots, grid, waves, diagonal lines)
- Image Overlays with customizable overlay tint and opacity

### 6. Theme Dashboard & Starter Presets
- Centralized management dashboard with live theme quick-look preview and dual grid/list view modes.
- Includes three curated starter presets:
  - **Apex Minimal**: High-contrast typography with clean editorial whitespace.
  - **Editorial Gazette**: Multi-column editorial magazine layout with serif headings.
  - **Geist Tech Log**: Monospace technical publication theme with dark mode optimization.

---

## Quality Assurance & Verification

The codebase has undergone full pre-flight verification prior to this release:
- TypeScript static analysis: `npm run typecheck` passed (0 errors).
- Component registry verification: `npm run test:components` passed (33/33 modular blocks verified).
- Gscan theme compliance: Verified clean pass against Ghost theme specification standards.

---

## Installation & Local Development

### System Requirements
- Node.js: `v18.18.0` or higher (`v20+ LTS` recommended)
- npm: `v9.0.0` or higher
- Git: Latest version

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/Sakthi10122004/idli_ghost_theme_builder.git
cd idli_ghost_theme_builder/ghost-theme-builder

# Install project dependencies
npm install

# Initialize database schema
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## Pre-release Notice & Feedback

This is an official pre-release intended for testing, development, and community feedback. While the compiled themes meet all Ghost validation standards, users are encouraged to test exported themes in staging environments prior to production deployment.

To report issues or propose enhancements, please use the structured issue templates in the repository:
- Bug Reports: Submit via GitHub Issues under Bug Report.
- Feature Requests: Submit via GitHub Issues under Feature Request.
- Component Proposals: Submit via GitHub Issues under New Component Proposal.
