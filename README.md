# Ramis Web App

Grower-facing web application for Ramis Technology — smart pest monitoring and robotic field intelligence.

React 18 · Vite · TypeScript · Tailwind · shadcn/ui · react-router (hash routing for static hosting)

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # output in dist/
```

## Deploy

Pushing to `main` builds and publishes to GitHub Pages automatically via `.github/workflows/deploy.yml`.
Enable it once in the repo: **Settings → Pages → Source: GitHub Actions**.

## Structure

```
src/app/pages/        Home, Overview, Heatmap, Robot, Thresholds, Reports, Settings
src/app/components/   feature components (CameraPanel, LampControl, RobotStatus, …)
src/app/components/ui shadcn/ui primitives
src/app/utils/        mockData.ts, farmGrid.ts
src/imports/          design specs and reference images from Figma Make
```

All data is illustrative sample data.

© 2026 Ramis Technology Ltd.
