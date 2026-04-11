<!--
Sync Impact Report
- Version change: initial → 1.0.0
- Modified principles: 
  - [PRINCIPLE_1_NAME] → I. Server-First Architecture
  - [PRINCIPLE_2_NAME] → II. App Router Conventions
  - [PRINCIPLE_3_NAME] → III. Strict Type Safety
  - [PRINCIPLE_4_NAME] → IV. Performance by Default
  - [PRINCIPLE_5_NAME] → V. Component Composition
- Added sections: Technology Constraints, Development Workflow
- Removed sections: N/A
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check needs update)
  - ✅ .specify/templates/spec-template.md
  - ⚠ .specify/templates/tasks-template.md
- Follow-up TODOs: None
-->
# Sablewood Chronicles Constitution

## Core Principles

### I. Server-First Architecture
Maximize performance, SEO, and maintainability by keeping components on the server.
**Rule:** Default to React Server Components. Only use `"use client"` when interactivity, hooks (like `useState`), or browser APIs are strictly required. Pass data to Client Components as props rather than fetching inside them when possible.

### II. App Router Conventions
Maintain consistency with Next.js App Router architecture.
**Rule:** Strictly follow `app/` directory conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`). Colocate components, tests, and styles near their usage where appropriate. Do not use the legacy `pages/` directory.

### III. Strict Type Safety
Prevent runtime errors and improve developer experience through rigorous typing.
**Rule:** TypeScript is mandatory. Avoid `any` under all circumstances. Define clear interfaces or types for all component props, API payloads, state, and external data fetches. Ensure strict null checking.

### IV. Performance by Default
Deliver fast, accessible user experiences.
**Rule:** Utilize Next.js built-in optimizations (`next/image`, `next/font`, `next/link`). Optimize data fetching (fetch in parallel where possible, use suspense boundaries). Use Tailwind CSS efficiently for styling.

### V. Component Composition
Ensure maintainable and scalable UI construction.
**Rule:** Keep components small, focused, and composable. Use standard UI composition patterns (e.g., passing `children`, compound components) rather than massive boolean prop lists that dictate internal rendering logic.

## Technology Constraints

The technology stack is explicitly defined to minimize ecosystem fragmentation and ensure a unified codebase.
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **Linting:** ESLint with strict rules

## Development Workflow

- All changes MUST be implemented in a dedicated feature branch (`speckit.git.feature`).
- Code review and strict adherence to the above principles are required before merging.
- Any UI component must handle loading and error states gracefully using Next.js boundaries (`loading.tsx`, `error.tsx`, `<Suspense>`).

## Governance

This Constitution supersedes all other practices.
All implementation plans and PRs must explicitly verify compliance with these Core Principles. Any deviation or added complexity must be documented, justified, and approved.

**Version**: 1.0.0 | **Ratified**: 2026-04-11 | **Last Amended**: 2026-04-11
