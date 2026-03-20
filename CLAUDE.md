# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies and build spark-flow (required before first dev run)
npm run re-install

# Start dev server (port 8000, proxies /api /console /oauth2 to WEB_SERVER)
npm run dev

# Build main app
npm run build:app

# Build spark-flow package (must build before main if flow code changed)
npm run build:flow

# Lint and auto-fix
npm run lint
```

No test runner is configured in this project.

## Environment

Copy `.env.example` to `.env` in `packages/main/`. Key variables:
- `WEB_SERVER` — backend server URL
- `BACK_END` — `java` or `python` (affects available routes and features)
- `DEFAULT_USERNAME` / `DEFAULT_PASSWORD` — dev login credentials

Requires Node v20+.

## Architecture

**Monorepo** with 3 packages:

- **`packages/main`** — Primary SPA built with **Umi 4** + **React 18** + **TypeScript**. This is where most development happens.
- **`packages/spark-flow`** — Visual workflow editor built on `@xyflow/react`. Published as `@spark-ai/flow`. Uses **Zustand** for state management. Must be built before main can consume it.
- **`packages/spark-i18n`** — i18n utility library.

### Main Package Structure

- **`src/pages/`** — Route pages. Routing defined in `.umirc.ts` (not file-based). Primary routes: `/app`, `/component`, `/knowledge`, `/mcp`, `/setting`, `/debug`, `/dify`, `/agent-schema`.
- **`src/services/`** — API service layer. Each domain (appManage, modelService, plugin, knowledge, mcp, workflow) has a dedicated service file exporting typed async functions.
- **`src/types/`** — TypeScript interfaces matching service domains.
- **`src/request/`** — Axios wrapper with Bearer token auth, auto token refresh, and error notification via Ant Design.
- **`src/layouts/`** — Side menu layout with header, theme/lang selectors, login provider.
- **`src/components/`** — Shared UI components.
- **`src/i18n/`** — Chinese, English, Japanese translations.
- **`src/legacy/`** — Isolated legacy code.

### Key Patterns

- **UI**: Ant Design v5 + TailwindCSS v3 (preflight disabled to coexist). Ant Design uses custom prefix `ag-ant`. Custom components from `@spark-ai/design`.
- **Styling**: Tailwind for utility classes, LESS for Ant Design customization.
- **Hooks**: `ahooks` library (useMount, useSetState, etc.) used extensively.
- **State**: No global store in main app — local state via hooks. Zustand only in spark-flow.
- **Backend flexibility**: Routes and features conditionally rendered based on `BACK_END` env var (java vs python).
- **Path aliases**: `@/` and `@src/` both resolve to `packages/main/src/`.

### Spark-Flow Workflow Editor

Built on `@xyflow/react` with ELK.js for auto-layout, `@dnd-kit` for drag-and-drop, CodeMirror for in-node code editing (JS/Python/JSON). State managed via Zustand store with debounced save (5s).

## Pre-commit

Husky + lint-staged runs ESLint/Prettier on TS/JS files and Stylelint on LESS files.
