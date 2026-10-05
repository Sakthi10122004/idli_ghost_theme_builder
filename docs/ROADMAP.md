# Project Roadmap - Ghost Theme Builder

## Phase 1: Foundation (Completed)
- [x] Initialize Next.js, Tailwind, TypeScript, Zustand, and shadcn/ui.
- [x] Define `ThemeDocument` schema and TypeScript types.
- [x] Implement Zustand editor store with history (undo/redo).
- [x] Build the editor shell layout (Vercel-inspired 3-panel UI).
- [x] Create core blocks: Section, Container, Columns, Text, Heading, Button.
- [x] Add basic desktop/tablet/mobile device toggle and preview renderer.

## Phase 2: Extended Layout & Content Blocks (Completed)
- [x] Implement responsive style compiler mapping layout settings per breakpoint.
- [x] Expand inspector panel dynamically using schema-driven fields.
- [x] Implement image and rich text blocks.

## Phase 3: Ghost Dynamic Blocks (Completed)
- [x] Implement Ghost abstractions: Site Header, Post Grid, Featured Posts, Author, Tags, Newsletter Signup.
- [x] Map block attributes to safe Handlebars tags (`{{@site.title}}`, `{{#foreach posts}}`, etc.).

## Phase 4: Ghost Theme Compiler & Exporter (Completed)
- [x] Build AST-to-Handlebars template generator.
- [x] Generate standard theme structure (index.hbs, post.hbs, default.hbs).
- [x] Bundle generated Tailwind CSS into assets/css/screen.css.
- [x] Create the ZIP file generator and verification UI.

## Phase 5: Template Fixes & Extended Components (Completed)
- [x] Fix custom-template rendering bug in `compilePageToHbs`: ensure `custom-*` templates receive `{{#post}}...{{/post}}` context wrapping matching `page.hbs` so dynamic helpers (`{{title}}`, `{{content}}`, `{{feature_image}}`) resolve properly.
- [x] Added `comments` block: native Ghost `{{comments}}` integration with `comment_count` and template context validation.
- [x] Added `related-posts` block: primary-tag filtered querying via Ghost `{{#get "posts"}}` with configurable limit, excerpt, and image toggles.
- [x] Added `embed` block: unescaped literal raw HTML / iframe embed container with max-width and aspect ratio controls.
- [x] Added `post-navigation` block: previous and next post links via Ghost `{{#prev_post}}` and `{{#next_post}}` helpers.
- [x] Integrated all 4 components into central registry and block picker palette with template context warning badges.
