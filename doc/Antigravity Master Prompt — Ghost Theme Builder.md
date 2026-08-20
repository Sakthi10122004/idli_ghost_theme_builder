# Build a Production-Ready Ghost Theme Builder

## 1. Product Goal

Build a modern, production-ready **visual Ghost Theme Builder** using **Next.js + React + TypeScript**.

The application should allow users to visually create and customize Ghost themes using a drag-and-drop editor and then:

1. Preview the theme live.
2. Customize responsive layouts.
3. Configure typography, colors, spacing, and global styles.
4. Use Ghost-specific dynamic content.
5. Generate a valid Ghost theme structure.
6. Export the completed theme as a `.zip`.
7. Eventually support deploying the generated theme directly to Ghost/IdliStack.

The most important requirement is:

> The visual builder must generate a real, valid Ghost theme, not just a proprietary JSON website.

The architecture should therefore separate:

```text
Visual Editor
      ↓
Theme JSON / AST
      ↓
Renderer
      ↓
Ghost Theme Compiler
      ↓
Handlebars + CSS + JS + package.json
      ↓
Ghost Theme ZIP
```

---

# 2. Technology Stack

Use:

- Next.js latest stable
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand for editor state
- dnd-kit for drag and drop
- Zod for schema validation
- Handlebars-compatible template generation
- PostCSS where useful
- Vitest/Jest for unit tests
- Playwright for end-to-end testing

Use a clean modular architecture.

Avoid unnecessary dependencies.

Do not introduce a backend unless required for the MVP.

The application should initially work fully locally/client-side wherever possible.

---

# 3. Repository Structure

Create a maintainable structure similar to:

```text
src/
├── app/
│   ├── page.tsx
│   ├── builder/
│   │   └── page.tsx
│   ├── preview/
│   │   └── page.tsx
│   └── export/
│       └── page.tsx
│
├── components/
│   ├── builder/
│   │   ├── Builder.tsx
│   │   ├── Canvas.tsx
│   │   ├── LeftSidebar.tsx
│   │   ├── RightSidebar.tsx
│   │   ├── Toolbar.tsx
│   │   ├── LayersPanel.tsx
│   │   └── ResponsiveToolbar.tsx
│   │
│   ├── blocks/
│   │   ├── HeaderBlock.tsx
│   │   ├── HeroBlock.tsx
│   │   ├── PostGridBlock.tsx
│   │   ├── FeaturedPostsBlock.tsx
│   │   ├── NewsletterBlock.tsx
│   │   ├── AuthorBlock.tsx
│   │   ├── CTABlock.tsx
│   │   ├── ImageBlock.tsx
│   │   ├── TextBlock.tsx
│   │   └── FooterBlock.tsx
│   │
│   └── ui/
│
├── editor/
│   ├── schema/
│   ├── renderer/
│   ├── compiler/
│   ├── blocks/
│   └── commands/
│
├── ghost/
│   ├── handlebars/
│   ├── theme-generator/
│   ├── theme-validator/
│   └── ghost-schema/
│
├── store/
│   └── editorStore.ts
│
├── lib/
│   ├── export/
│   ├── validation/
│   └── utils/
│
├── types/
│
└── templates/
    ├── minimal/
    ├── magazine/
    └── newsletter/
```

Adjust the structure when appropriate, but maintain clear separation between:

- Editor
- Rendering
- Theme schema
- Ghost compiler
- UI
- Export

---

# 4. Core Concept: Theme JSON

Do NOT directly generate Handlebars while the user is editing.

Create an intermediate representation called `ThemeDocument`.

Example:

```ts
interface ThemeDocument {
  metadata: ThemeMetadata;
  settings: ThemeSettings;
  pages: ThemePages;
  globalStyles: GlobalStyles;
}
```

Example:

```json
{
  "metadata": {
    "name": "My Ghost Theme",
    "version": "1.0.0",
    "author": "Theme Builder"
  },
  "settings": {
    "containerWidth": 1200,
    "fontFamily": "Inter",
    "primaryColor": "#111111"
  },
  "pages": {
    "home": {
      "sections": []
    },
    "post": {
      "sections": []
    }
  }
}
```

Every block should have:

```json
{
  "id": "unique-id",
  "type": "hero",
  "props": {},
  "styles": {},
  "responsive": {}
}
```

Use Zod schemas to validate the complete ThemeDocument.

---

# 5. Block System

Build the editor around reusable blocks.

Initial blocks:

## Layout

- Section
- Container
- Columns
- Spacer
- Divider

## Content

- Text
- Heading
- Image
- Button
- Rich Text

## Ghost-specific

- Site Header
- Navigation
- Hero
- Featured Posts
- Post Grid
- Latest Posts
- Post Card
- Author
- Author Bio
- Tags
- Newsletter Signup
- Membership CTA
- Related Posts
- Footer

Each block must define:

```ts
interface BuilderBlock {
  type: string;

  label: string;

  category: string;

  icon: React.ComponentType;

  defaultProps: unknown;

  defaultStyles: unknown;

  renderPreview(): ReactNode;

  compileToGhost(): GhostTemplate;

  getInspectorSchema(): InspectorSchema;
}
```

Make the block system extensible.

Adding a new block should not require modifying the entire editor.

---

# 6. Drag-and-Drop Editor

Create a professional visual editor.

Layout:

```text
┌───────────────────────────────────────────────────────────┐
│ Logo │ Desktop │ Tablet │ Mobile │ Undo │ Redo │ Preview │
├──────────────┬──────────────────────────────┬─────────────┤
│              │                              │             │
│ Components   │                              │ Properties  │
│              │                              │             │
│ Layout       │       LIVE CANVAS            │ Typography  │
│ Content      │                              │ Spacing     │
│ Ghost        │                              │ Colors      │
│              │                              │ Responsive  │
│              │                              │             │
└──────────────┴──────────────────────────────┴─────────────┘
```

Features:

- Drag blocks onto canvas
- Reorder blocks
- Duplicate block
- Delete block
- Select block
- Nested sections
- Multi-column layouts
- Keyboard shortcuts
- Undo/redo
- Copy/paste blocks
- Lock blocks
- Hide/show blocks
- Layers/tree view

Use dnd-kit.

---

# 7. Responsive Editing

Support:

- Desktop
- Tablet
- Mobile

Users must be able to configure:

- Font size
- Padding
- Margin
- Width
- Alignment
- Columns
- Visibility

per breakpoint.

Example:

```json
{
  "fontSize": {
    "desktop": "64px",
    "tablet": "48px",
    "mobile": "36px"
  }
}
```

Generate responsive CSS automatically.

---

# 8. Inspector Panel

When selecting a component, display a contextual inspector.

Example:

```text
Hero
────────────────────

Content

Heading
[ Build your audience ]

Description
[ Grow your newsletter ]

Button
[ Subscribe ]

────────────────────

Layout

Alignment
[ Center ]

Max Width
[ 800px ]

────────────────────

Typography

Font
[ Inter ]

Size
[ 64px ]

Weight
[ 700 ]

────────────────────

Spacing

Padding
Top     80
Bottom  80

────────────────────

Background

Color
[ #ffffff ]

Image
[ Upload ]

Overlay
[ 20% ]
```

The inspector must be generated from block schemas wherever possible rather than hardcoded separately for every block.

---

# 9. Ghost Dynamic Content

This is one of the most important features.

The builder must understand Ghost dynamic variables.

Create a Ghost data abstraction.

Examples:

```text
{{@site.title}}
{{@site.description}}
{{@site.url}}

{{title}}
{{content}}
{{excerpt}}

{{#foreach posts}}
{{title}}
{{url}}
{{feature_image}}
{{excerpt}}
{{/foreach}}

{{#foreach authors}}
{{name}}
{{profile_image}}
{{bio}}
{{/foreach}}

{{navigation}}
```

Do not allow users to accidentally generate invalid Handlebars.

Create a safe dynamic-content system.

For example:

```text
Dynamic Content
├── Site
│   ├── Site Title
│   ├── Site Description
│   └── Site URL
│
├── Post
│   ├── Title
│   ├── Content
│   ├── Excerpt
│   ├── Feature Image
│   └── URL
│
├── Author
│   ├── Name
│   ├── Bio
│   └── Profile Image
│
└── Navigation
    └── Primary Navigation
```

Internally map these to Ghost Handlebars expressions.

---

# 10. Live Preview

The editor should render the ThemeDocument immediately.

Do NOT rely on generated Handlebars for every editor interaction.

Use a React renderer for the editor.

Architecture:

```text
ThemeDocument
      ↓
React Renderer
      ↓
Live Preview
```

Separately:

```text
ThemeDocument
      ↓
Ghost Compiler
      ↓
Handlebars Theme
```

This keeps editing fast.

---

# 11. Ghost Theme Compiler

Build a dedicated compiler.

Input:

```text
ThemeDocument
```

Output:

```text
GhostTheme
```

The compiler should generate:

```text
theme/
├── package.json
├── default.hbs
├── index.hbs
├── post.hbs
├── page.hbs
├── author.hbs
├── tag.hbs
├── error.hbs
├── custom-home.hbs
├── partials/
│   ├── header.hbs
│   ├── footer.hbs
│   ├── navigation.hbs
│   ├── post-card.hbs
│   ├── post-grid.hbs
│   └── newsletter.hbs
│
├── assets/
│   ├── css/
│   │   └── screen.css
│   ├── js/
│   │   └── main.js
│   └── fonts/
│
└── routes.yaml
```

Do not hardcode a single theme.

The compiler should compose the output based on the ThemeDocument.

---

# 12. Theme Templates

Create at least three starter themes:

### Minimal

Simple typography-focused blog.

### Magazine

Editorial/news-style layout.

### Newsletter

Newsletter/content creator focused theme.

Each starter theme should be represented using the same ThemeDocument schema.

The user should be able to load a starter theme and customize it.

---

# 13. Global Design System

Create global tokens:

```ts
interface DesignTokens {
  colors: {};
  typography: {};
  spacing: {};
  radii: {};
  shadows: {};
  containers: {};
}
```

Example:

```json
{
  "colors": {
    "background": "#ffffff",
    "foreground": "#111111",
    "muted": "#6b7280",
    "primary": "#111111",
    "accent": "#2563eb"
  },
  "typography": {
    "bodyFont": "Inter",
    "headingFont": "Inter",
    "baseSize": "16px"
  }
}
```

Blocks should consume these tokens instead of duplicating values.

---

# 14. Theme Settings

Provide a global settings panel:

## Branding

- Site name
- Logo
- Favicon
- Description

## Colors

- Background
- Text
- Primary
- Secondary
- Accent

## Typography

- Body font
- Heading font
- Font scale
- Line height

## Layout

- Container width
- Header height
- Section spacing
- Post grid columns

## Blog

- Show author
- Show date
- Show tags
- Show reading time
- Show featured image

## Newsletter

- Enable newsletter section
- CTA text
- Button text

---

# 15. Pages

Support these Ghost pages initially:

```text
Home
Post
Page
Author
Tag
Error
```

The builder UI should allow switching between pages:

```text
Pages

Home
Posts
Pages
Authors
Tags
404
```

Each page should have its own layout.

---

# 16. Theme Export

Create an Export Theme flow.

Example:

```text
Export Theme

Theme Name
[ My Theme ]

Version
[ 1.0.0 ]

Author
[ Praveen ]

────────────────────

✓ Theme structure
✓ Handlebars templates
✓ CSS
✓ JavaScript
✓ package.json
✓ routes.yaml

[ Validate Theme ]

[ Download ZIP ]
```

The downloaded ZIP must be directly installable into Ghost.

---

# 17. Theme Validation

Before allowing export:

Validate:

- Required Ghost files
- package.json
- Handlebars syntax
- Template references
- Asset paths
- routes.yaml
- Theme metadata
- Invalid blocks
- Missing dependencies

Show errors in a useful UI:

```text
Theme Validation

✓ package.json
✓ default.hbs
✓ index.hbs
✓ post.hbs
✓ assets
✓ partials

Warnings

⚠ Newsletter block requires member configuration.

Errors

✕ post.hbs contains invalid template reference.
```

Never silently generate an invalid theme.

---

# 18. Code Editor

Add an optional advanced mode.

Tabs:

```text
Templates
CSS
JavaScript
Routes
```

Allow advanced users to inspect generated output.

The visual editor remains the primary interface.

When possible, changes in the visual editor should regenerate the generated files.

Clearly distinguish:

```text
Generated code
Custom code
```

Do not overwrite custom code without warning.

---

# 19. Preview Modes

Provide:

- Desktop
- Tablet
- Mobile

Also provide:

- Homepage preview
- Post preview
- Author preview
- Tag preview

Use realistic mock Ghost content.

Create a mock data layer:

```ts
const mockGhostData = {
  site: {},
  posts: [],
  authors: [],
  tags: [],
  navigation: []
};
```

This should make the builder usable without connecting to a Ghost instance.

---

# 20. Persistence

For MVP:

Use localStorage or IndexedDB.

Persist:

- Current ThemeDocument
- Recent projects
- User preferences
- Undo/redo state where practical

Create:

```text
New Theme
Open Theme
Save
Duplicate
Export
```

Do not require authentication for the MVP.

Design the persistence layer so it can later be replaced with a database/API.

---

# 21. Project Management

Create a project dashboard:

```text
My Themes

┌────────────────────┐
│ Minimal Blog       │
│ Updated 2 hours ago│
│                    │
│ Open   Duplicate   │
└────────────────────┘
```

Features:

- Create theme
- Duplicate theme
- Rename
- Delete
- Export
- Open editor

---

# 22. UI/UX Requirements

The UI should feel like a modern professional design tool.

Reference the interaction quality of:

- Framer
- Webflow
- Figma
- Vercel
- Linear

Do NOT copy their visual design.

Requirements:

- Clean
- Minimal
- Dense but not cluttered
- Excellent spacing
- Keyboard-friendly
- Fast interactions
- No unnecessary rounded cards everywhere
- Avoid excessive borders
- Strong hierarchy
- Responsive
- Accessible

Use shadcn/ui components where appropriate.

---

# 23. Keyboard Shortcuts

Support:

```text
Cmd/Ctrl + Z       Undo
Cmd/Ctrl + Shift+Z Redo
Cmd/Ctrl + D       Duplicate
Cmd/Ctrl + C       Copy
Cmd/Ctrl + V       Paste
Delete             Delete block
Escape             Deselect
```

Add a keyboard shortcut help modal.

---

# 24. Accessibility

Follow WCAG principles.

Ensure:

- Keyboard navigation
- Focus states
- ARIA labels
- Accessible drag/drop alternatives
- Screen-reader friendly controls
- Sufficient contrast
- Semantic HTML

---

# 25. AI-Ready Architecture

Do not implement AI generation initially, but design the architecture so it can be added later.

Eventually users should be able to say:

> Create a minimal technology blog theme with a dark header, large typography, featured posts and a newsletter CTA.

The AI should generate a valid ThemeDocument rather than directly generating arbitrary HTML.

Architecture:

```text
AI Prompt
   ↓
ThemeDocument
   ↓
Validation
   ↓
Preview
   ↓
Ghost Compiler
```

This is important.

---

# 26. Future IdliStack Integration

Do not tightly couple the builder to IdliStack yet.

However, create a clean deployment abstraction:

```ts
interface DeploymentProvider {
  deploy(theme: GhostTheme): Promise<DeploymentResult>;
}
```

Future providers:

```text
Ghost ZIP
Ghost Admin API
IdliStack
Local Ghost
```

Eventually IdliStack can implement:

```ts
class IdliStackDeploymentProvider
```

This should allow:

```text
Build Theme
     ↓
Deploy
     ↓
IdliStack
     ↓
Ghost Instance
     ↓
Custom Domain
     ↓
SSL
```

---

# 27. Security

Treat user-provided content as untrusted.

Prevent:

- XSS
- arbitrary script injection
- unsafe HTML
- malicious template injection

Do not allow arbitrary Handlebars helpers.

Sanitize HTML where necessary.

Keep advanced custom code behind an explicit advanced mode.

---

# 28. Testing

Create tests for:

## Theme schema

- Valid ThemeDocument
- Invalid ThemeDocument

## Block rendering

- Every block renders

## Compiler

- Hero → valid HBS
- Post Grid → valid HBS
- Header → valid HBS
- Footer → valid HBS

## Export

Ensure exported ZIP contains required files.

## Responsive CSS

Verify breakpoint generation.

## E2E

Test:

```text
Create theme
→ Add hero
→ Add post grid
→ Change colors
→ Change typography
→ Preview mobile
→ Export
→ Validate ZIP
```

---

# 29. Development Phases

Implement incrementally.

## Phase 1 — Foundation

Build:

- Next.js project
- ThemeDocument schema
- Zustand store
- Editor shell
- Canvas
- Component sidebar
- Inspector

Do not build every component yet.

## Phase 2 — Core Blocks

Implement:

- Section
- Container
- Text
- Heading
- Image
- Button
- Header
- Footer

## Phase 3 — Ghost Blocks

Implement:

- Navigation
- Featured posts
- Post grid
- Post card
- Author
- Tags
- Newsletter

## Phase 4 — Ghost Compiler

Implement:

```text
ThemeDocument
→ HBS
→ CSS
→ JS
→ package.json
→ ZIP
```

## Phase 5 — Validation

Implement Ghost theme validation.

## Phase 6 — Starter Themes

Build:

- Minimal
- Magazine
- Newsletter

## Phase 7 — Polish

Improve:

- UX
- Keyboard shortcuts
- Responsive editing
- Accessibility
- Performance
- Error handling

---

# 30. Important Engineering Rules

Follow these rules throughout development:

1. TypeScript strict mode.
2. Avoid `any` unless absolutely necessary.
3. Keep components small and composable.
4. Do not duplicate block logic.
5. Use schemas for validation.
6. Keep ThemeDocument independent from React.
7. Keep Ghost compilation independent from the UI.
8. Keep the compiler deterministic.
9. Do not generate arbitrary invalid Handlebars.
10. Every exported theme must be structurally valid.
11. Add tests for every compiler feature.
12. Do not over-engineer the MVP.
13. Prefer reusable abstractions over hardcoded page-specific implementations.
14. Do not couple the application directly to IdliStack.
15. Document architectural decisions.

---

# 31. Project Documentation

Create and maintain:

```text
docs/
├── architecture.md
├── theme-schema.md
├── block-system.md
├── ghost-compiler.md
├── export-format.md
├── deployment.md
├── contributing.md
└── roadmap.md
```

Also create:

```text
AGENTS.md
ARCHITECTURE.md
CONTRIBUTING.md
ROADMAP.md
```

`AGENTS.md` should contain project-specific instructions for future AI agents working on this repository.

---

# 32. Definition of Done

The MVP is complete only when a user can:

1. Open the application.
2. Create a new theme.
3. Choose a starter template.
4. Open the visual editor.
5. Drag blocks onto the page.
6. Reorder blocks.
7. Edit their properties.
8. Change global colors.
9. Change typography.
10. Switch between desktop/tablet/mobile.
11. Preview a homepage.
12. Preview a Ghost post.
13. Save the project.
14. Validate the theme.
15. Export a `.zip`.
16. Extract the ZIP.
17. Install the theme into Ghost.
18. See the generated theme render correctly.

The final product should feel like:

**"Webflow for Ghost themes"**

while preserving the underlying power and portability of real Ghost themes.

---

# 33. First Task

Do not attempt to build the entire product in one step.

First:

1. Inspect the repository.
2. Create `AGENTS.md`.
3. Create `ARCHITECTURE.md`.
4. Create `ROADMAP.md`.
5. Initialize the Next.js/TypeScript architecture if required.
6. Define the ThemeDocument schema.
7. Define the Block interface.
8. Implement Zustand editor state.
9. Build the initial three-panel editor shell.
10. Implement Section, Heading, Text and Button blocks.
11. Implement drag-and-drop.
12. Implement the inspector.
13. Implement desktop/tablet/mobile preview.
14. Add tests.
15. Run lint, typecheck and tests.

Do not move to the Ghost compiler until the editor foundation is stable.

After completing each phase, update `ROADMAP.md` and document important architectural decisions.

Prioritize a clean foundation over quickly adding a large number of features.