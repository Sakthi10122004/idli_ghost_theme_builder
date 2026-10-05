# Release v0.0.1: Initial Beta Release of Idli Ghost Theme Builder

We are thrilled to announce **v0.0.1**, the first official beta release of **Idli Ghost Theme Builder** — a modern, visual drag-and-drop theme builder for the [Ghost CMS](https://ghost.org/) publishing platform.

Built with **Next.js (App Router)**, **React 19**, **Tailwind CSS v4**, and **Zustand**, Idli empowers creators, agencies, and developers to visually craft production-ready Ghost themes with real-time responsive previews and compile them into 100% `gscan`-compliant Handlebars (`.hbs`), minified CSS, and packaged `.zip` archives.

---

## 🚀 Key Highlights

### 🎨 Visual Drag-and-Drop Canvas
- **Fluid Layout Reordering**: Powered by `@dnd-kit`, supporting intuitive insertion and reordering of sections, containers, and blocks.
- **Responsive Viewport Previews**: Instantly switch between **Desktop (1280px)**, **Tablet (768px)**, and **Mobile (375px)** viewports with auto-fit canvas scaling.
- **Decoupled Theme Modes**: Independent App Theme (Light/Dark for the editor chrome) and Ghost Theme (Light/Dark for the active theme preview).
- **Undo / Redo & Autosave**: Full state history stack with debounced local storage persistence and database sync.
- **Custom Page Templates**: Built-in template manager generating slug-based `custom-[slug].hbs` templates with real-time duplicate detection.

### 👻 Deep Ghost CMS Native Integration
- **Ghost Admin Accent Color (`@site.accent_color`)**: Theme styles dynamically cascade your publication's brand accent color across primary buttons, links, hover states, blockquotes, badges, and focus rings.
- **Ghost Admin Typography Synchronization**: Inverted `:root` token architecture (`--gh-font-heading` and `--gh-font-body`) ensures fonts selected in Ghost Admin instantly cascade across headings and body text without rebuilding.
- **Dynamic Navigation Integration**: Dedicated `partials/navigation.hbs` template rendering Ghost's native `{{navigation}}` and `{{navigation type="secondary"}}` helpers.
- **Native Comments Integration**: Seamless integration with `@tryghost/comments-ui` via `{{comments}}`, featuring transparent background adaptation and light/dark theme synchronization.
- **Ghost Content Contexts**: Full support for `@page.show_title_and_feature_image`, post excerpts, feature images, authors, tags, reading times, and member access gating.

### 📦 Theme Compiler & Packaging Engine
- **AST to Handlebars Translation**: Parses the visual document AST into semantic, clean Handlebars templates (`index.hbs`, `post.hbs`, `page.hbs`, `tag.hbs`, `author.hbs`, `default.hbs`, etc.).
- **Automated CSS Minification**: Theme stylesheets (`assets/css/screen.css`) are automatically stripped of comments and whitespace during compilation.
- **100% `gscan` Validation**: Bundles Casper template baseline assets, manifest metadata, required locales (`locales/en.json`), and package configurations (`card_assets: true`, `keywords: ["ghost-theme"]`) to achieve flawless passes in Ghost's official validator.
- **One-Click ZIP Export**: Packages templates, minified assets, and configuration into a ready-to-upload Ghost theme `.zip` archive.

### 🧩 33 Production-Ready Modular Blocks
Every block follows a strict 4-file modular architecture (`schema.ts`, `canvas.tsx`, `sidebar.tsx`, `compiler.ts`):
- **Layout & Structure**: `section`, `container`, `columns`, `spacer`, `divider`
- **Ghost Core**: `header`, `footer`, `post-content`, `page-detail`, `post-grid`, `featured-posts`, `related-posts`, `post-navigation`, `author-profile`, `tag-header`, `tag-archive`, `comments`, `share`, `error-view`
- **Content & Media**: `heading`, `text`, `button`, `image`, `video-player`, `cards`, `grid-gallery`, `logo-cloud`
- **Engagement & Conversion**: `hero`, `newsletter`, `faq`, `stats`, `team`, `testimonials`

### 🌈 Universal Multi-Mode Background Engine
Six distinct background modes available across sections and containers:
1. **Solid Color** (with alpha transparency slider)
2. **Linear Gradients** (with degree rotation slider)
3. **Radial Gradients**
4. **Mesh Gradients** (with ambient atmospheric glow effects)
5. **Repeat SVG Patterns** (dots, grid, waves, diagonal lines)
6. **Image Overlays** (with customizable overlay color and opacity)

### 📊 Theme Dashboard & Starter Presets
- Elevated dashboard with atmospheric mesh glow, live quick-look modal, and dual grid/list views.
- Includes 3 starter presets:
  - **Apex Minimal** — High-contrast typography with clean editorial whitespace.
  - **Editorial Gazette** — Traditional publication layout with serif headings and multi-column feeds.
  - **Geist Tech Log** — Developer-centric dark theme with monospace eyebrows and accent glow cards.

---

## 🛠️ Local Development & Quick Start

```bash
# Clone the repository
git clone https://github.com/Sakthi10122004/idli_ghost_theme_builder.git
cd idli_ghost_theme_builder/ghost-theme-builder

# Install dependencies
npm install

# Initialize database
npx prisma generate
npx prisma db push

# Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to open the builder.

---

## 🔍 Pre-Flight Verification Passed
- `npm run typecheck` (0 errors)
- `npm run test:components` (33/33 modular blocks verified)
- `gscan` compatibility: 100% clean passes on exported ZIP archives
