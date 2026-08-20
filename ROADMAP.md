# Project Roadmap - Ghost Theme Builder

## Phase 1: Foundation (Current)
- [ ] Initialize Next.js, Tailwind, TypeScript, Zustand, and shadcn/ui.
- [ ] Define `ThemeDocument` schema and TypeScript types.
- [ ] Implement Zustand editor store with history (undo/redo).
- [ ] Build the editor shell layout (Vercel-inspired 3-panel UI).
- [ ] Create core blocks: Section, Container, Columns, Text, Heading, Button.
- [ ] Add basic desktop/tablet/mobile device toggle and preview renderer.

## Phase 2: Extended Layout & Content Blocks
- [ ] Implement responsive style compiler mapping layout settings per breakpoint.
- [ ] Expand inspector panel dynamically using schema-driven fields.
- [ ] Implement image and rich text blocks.

## Phase 3: Ghost Dynamic Blocks
- [ ] Implement Ghost abstractions: Site Header, Post Grid, Featured Posts, Author, Tags, Newsletter Signup.
- [ ] Map block attributes to safe Handlebars tags (`{{@site.title}}`, `{{#foreach posts}}`, etc.).

## Phase 4: Ghost Theme Compiler & Exporter
- [ ] Build AST-to-Handlebars template generator.
- [ ] Generate standard theme structure (index.hbs, post.hbs, default.hbs).
- [ ] Bundle generated Tailwind CSS into assets/css/screen.css.
- [ ] Create the ZIP file generator and verification UI.
