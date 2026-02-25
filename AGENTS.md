# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

MERN stack CRUD application for managing employee records (name, position, level). Monorepo with separate `client/` and `server/` directories, each with their own `package.json` and `node_modules`.

## Commands

### Server (from `server/`)
- **Dev:** `npm run dev` (uses nodemon, hot-reloads on changes)
- **Start:** `npm start` (plain node, for production)
- **Port:** defaults to 5001 (configured via `PORT` in `server/.env`)

### Client (from `client/`)
- **Dev:** `npm run dev` (Vite dev server on port 5174)
- **Build:** `npm run build` (outputs to `client/dist/`)
- **Lint:** `npx eslint .` (flat config in `client/eslint.config.js`)

### Root-level convenience scripts (from project root)
- `npm run build` — installs client deps and builds client
- `npm start` — installs server deps and starts server

### No test framework is configured. There are no test scripts or testing dependencies.

## Architecture

### Server (`server/`)
- **Express + native MongoDB driver** (not Mongoose) — all DB operations use the `mongodb` package directly.
- `server.js` — single-file Express app. All REST routes (`/record`) are defined inline here. CORS, JSON parsing, and error handling middleware are all configured in this file.
- `db/connection.js` — connects to MongoDB Atlas using `ATLAS_URI` env var, exports the `db` object (database: `emp_list`, collection: `records`).
- `routes/record.js` — **exists but is unused**; `server.js` does not import it. The inline routes in `server.js` are the active ones.
- All files use ES modules (`"type": "module"`).

### Client (`client/`)
- **React 19 + Vite + Tailwind CSS v3 + React Router v7.**
- `src/main.jsx` — app entry point; defines all routes via `createBrowserRouter`. Three routes: `/` (list), `/create` (new record), `/edit/:id` (edit record).
- `src/App.jsx` — layout shell with `<Navbar />` and `<Outlet />`.
- `src/components/RecordList.jsx` — fetches and displays all employees in a table; handles deletion.
- `src/components/Record.jsx` — form component for creating/editing an employee. Splits `name` into `firstName`/`lastName` on the client but stores as a single `name` field on the server.
- `src/components/Navbar.jsx` — navigation links to `/` and `/create`.
- API base URL comes from `VITE_API_URL` env var (set in `client/.env` for dev, `client/.env.production` for prod).
- All files use ES modules.

### Data Model
Employee records have three fields: `name` (string), `position` (string), `level` (one of "Intern", "Junior", "Senior").

## Environment Variables

- `server/.env`: `ATLAS_URI` (MongoDB Atlas connection string), `PORT`
- `client/.env`: `VITE_API_URL` (backend URL, e.g., `http://localhost:5001`)
- See `.env.example` at project root for reference.

## Deployment

- **Client:** Vercel (configured via `client/vercel.json` with SPA rewrites). Dockerfile also available for containerized deploys using nginx.
- **Server:** Render. Dockerfile exposes port 10000.
- Production CORS origins are configured in `server.js` (`allowedOrigins` array). When adding new deployment URLs, update this array and set the `CLIENT_URL` env var.

## Key Conventions

- Tailwind utility classes are used directly in JSX — no component library or CSS modules.
- The ESLint config (`client/eslint.config.js`) uses flat config format and ignores unused vars that start with an uppercase letter or underscore (`varsIgnorePattern: '^[A-Z_]'`).
- Vite dev server is pinned to port 5174 with `strictPort: true`.
