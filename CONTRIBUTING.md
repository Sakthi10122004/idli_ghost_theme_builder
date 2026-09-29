# Contributing & Pull Request Guide

Thank you for your interest in contributing to **Idli Ghost Theme Builder**! This guide walks you step-by-step through forking the repository, setting up your local development environment, adhering to project guidelines, and opening a clean, review-ready Pull Request (PR).

---

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Step-by-Step: Fork & Local Setup](#2-step-by-step-fork--local-setup)
3. [Branching Guidelines](#3-branching-guidelines)
4. [Development Standards & Architecture](#4-development-standards--architecture)
5. [Pre-Flight Verification Checklist](#5-pre-flight-verification-checklist)
6. [Commit Message Conventions](#6-commit-message-conventions)
7. [Submitting a Proper Pull Request](#7-submitting-a-proper-pull-request)
8. [PR Description Template](#8-pr-description-template)
9. [Review Process & Follow-up](#9-review-process--follow-up)

---

## 1. Prerequisites

Before getting started, make sure you have the following installed on your machine:
- **Node.js**: `v18.18.0` or newer (`v20+ LTS` recommended)
- **Git**: Latest version
- **npm**: Comes with Node.js
- A GitHub account

---

## 2. Step-by-Step: Fork & Local Setup

### Step 1: Fork the Repository
1. Navigate to the main repository on GitHub:
   [https://github.com/sakthi-t4gc/t4gc_theme_builder](https://github.com/sakthi-t4gc/t4gc_theme_builder)
2. Click the **Fork** button in the top-right corner of the page.
3. Choose your personal GitHub account as the destination.

### Step 2: Clone Your Fork Locally
Clone your newly created fork to your local machine:
```bash
git clone https://github.com/<your-username>/t4gc_theme_builder.git
cd t4gc_theme_builder/ghost-theme-builder
```

### Step 3: Configure Upstream Remote
Keep your local clone synchronized with the original repository by adding an `upstream` remote:
```bash
git remote add upstream https://github.com/sakthi-t4gc/t4gc_theme_builder.git
git remote -v
```
You should see:
- `origin`: pointing to your personal fork (`<your-username>/t4gc_theme_builder`)
- `upstream`: pointing to the official repository (`sakthi-t4gc/t4gc_theme_builder`)

### Step 4: Install Dependencies & Setup Database
```bash
# Install NPM packages
npm install

# Generate Prisma client and initialize SQLite local database
npx prisma generate
npx prisma db push
```

### Step 5: Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to verify that the builder loads correctly.

---

## 3. Branching Guidelines

Never make code changes directly on the `main` branch. Always create a dedicated, descriptively named topic branch for each feature or bugfix.

### Sync with Upstream First
Before creating a new branch, make sure your local `main` is completely up-to-date:
```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### Create a Topic Branch
Use a prefix that describes the type of change:
- `feat/` for new features or components (e.g. `feat/audio-player-block`)
- `fix/` for bug fixes (e.g. `fix/canvas-dark-mode-contrast`)
- `docs/` for documentation updates (e.g. `docs/pr-instructions`)
- `refactor/` for code refactoring without functional changes (e.g. `refactor/background-utilities`)

```bash
git checkout -b feat/your-feature-name
```

---

## 4. Development Standards & Architecture

To maintain code quality and compatibility with Ghost CMS, please adhere to these core rules:

### 1. TypeScript Strictness
- Write type-safe TypeScript code.
- **Do not use `any`**. Use explicit interfaces from `src/types/theme.ts` or generic types.

### 2. Modular 4-File Component Architecture
When creating or modifying blocks under `src/editor/components/<component-name>/`, you must follow the registry pattern:
- **`schema.ts`**: Defines Zod validation schemas, default props, and layout styles.
- **`canvas.tsx`**: Modular React component rendering interactive preview on the visual canvas.
- **`sidebar.tsx`**: Context-sensitive settings inspector for the block.
- **`compiler.ts`**: Pure Handlebars (`.hbs`) markup and scoped CSS generator.
- **Registration**: All components must be registered in `src/editor/components/registry.ts` and `src/components/builder/LeftSidebar.tsx`.

### 3. Pure Compiler Logic
- Ghost Handlebars compilation (`compiler.ts`) must be **completely pure and decoupled** from React and UI rendering.
- Sanitize user-provided text with `escapeHtml` and URLs with `escapeUrl` from `src/editor/components/shared/escape.ts`.
- Always preserve double-curly Handlebars tags (`{{...}}`) unescaped.

### 4. Ghost CMS Native Parity
- **Accent Color**: Ensure primary buttons, links, and hover states cascade dynamically using `var(--ghost-accent-color, var(--color-accent))`.
- **Typography**: Respect `--gh-font-heading` and `--gh-font-body` so publisher selections in Ghost Admin work out of the box.
- **Dark Mode**: Support `.dark` mode classes without breaking canvas frame isolation.

---

## 5. Pre-Flight Verification Checklist

Before committing code or opening a PR, run all project automated checks locally:

```bash
# 1. Typecheck: Must complete with 0 errors
npm run typecheck

# 2. Lint: Must pass with 0 errors
npm run lint

# 3. Component Registration: Verifies all 33 blocks are structurally complete
npm run test:components

# 4. Theme Export & Handlebars Validation: Compiles full theme package
npx tsx export-test.ts
```

> [!IMPORTANT]
> All four commands must pass cleanly without errors before submitting your Pull Request.

---

## 6. Commit Message Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<scope>): <short description in imperative mood>

[optional body explaining rationale and non-obvious details]
```

### Examples:
- `feat(components): add audio player block with volume controls`
- `fix(comments): resolve white background iframe flash in dark mode`
- `docs(readme): add deployment instructions for ghost(pro)`
- `refactor(compiler): simplify background gradient css generation`

---

## 7. Submitting a Proper Pull Request

### Step 1: Rebase on Latest Upstream
Ensure your branch is cleanly rebased on the latest `upstream/main`:
```bash
git fetch upstream
git rebase upstream/main
```
If there are merge conflicts, resolve them, run verification checks, and continue the rebase:
```bash
git add <resolved-files>
git rebase --continue
```

### Step 2: Push to Your Fork
```bash
git push -u origin feat/your-feature-name
```
*(If you rebased an already pushed branch, use `git push --force-with-lease origin feat/your-feature-name`)*.

### Step 3: Open the Pull Request on GitHub
1. Go to your fork on GitHub: `https://github.com/<your-username>/t4gc_theme_builder`.
2. A banner will typically appear saying: **"feat/your-feature-name had recent pushes"** &rarr; click **Compare & pull request**.
3. Ensure the base repository is `sakthi-t4gc/t4gc_theme_builder` with base branch `main`.
4. Fill out the Pull Request title and description using the template below.

---

## 8. PR Description Template

Copy and paste this template into your PR description:

```markdown
## Summary
A clear, concise 2-3 sentence overview of what this PR accomplishes.

## Motivation & Context
Why is this change required? What issue does it solve? (e.g. `Fixes #123`)

## Detailed Changes
- Added ...
- Updated ...
- Fixed ...

## Visual Parity & Screenshots (if applicable)
| Light Mode | Dark Mode |
| :---: | :---: |
| *(Attach screenshot)* | *(Attach screenshot)* |

## Pre-Flight Verification
- [ ] `npm run typecheck` passed (0 errors)
- [ ] `npm run lint` passed (0 errors)
- [ ] `npm run test:components` passed (33/33 verified)
- [ ] `npx tsx export-test.ts` passed (clean theme export & balanced Handlebars)
- [ ] Verified manually in Desktop, Tablet, and Mobile preview modes
```

---

## 9. Review Process & Follow-up

1. **Automated CI**: Automated continuous integration workflows will run typechecking, linting, and export tests on your PR.
2. **Code Review**: Maintainers will review your changes for design consistency, architecture compliance, and Ghost compatibility.
3. **Addressing Feedback**:
   - Make requested changes in your local branch.
   - Commit changes and push again to your fork:
     ```bash
     git add .
     git commit -m "fix(review): address review comments"
     git push origin feat/your-feature-name
     ```
   - The Pull Request will automatically update with your new commits!
4. **Merge**: Once approved and all checks pass, your PR will be squashed and merged into `main`.

Thank you for helping make Idli Ghost Theme Builder better!
