# Repository Guidelines

## Project Structure & Module Organization
- Root splits into `backend` (FastAPI) and `frontend` (Next.js 16 + TypeScript). Shared helpers and process scripts live at the repo root (`dev.sh`, `start.sh`, `stop.sh`, `test.sh`, `install.sh`).
- Backend layout: `backend/app/routes` for API routers, `backend/app/models` for Pydantic schemas, `backend/app/utils` for helpers, `backend/app/middleware` for cross-cutting concerns, and tests in `backend/tests` with fixtures in `conftest.py`. Entry point is `backend/main.py`.
- Frontend layout: `frontend/src/app` for route segments, `frontend/src/components` (use subfolders like `components/ui` and `components/rides`), `frontend/src/lib` for client utilities, and `frontend/public` for static assets.
- Deployment configs live in `docker-compose*.yml`, `vercel*.json`, and `supabase/`. Consult `DEPLOYMENT.md` and `deploy-guide.md` for environment-specific notes.

## Build, Test, and Development Commands
- Install everything once: `./install.sh` (creates Python venv, installs backend and frontend deps, seeds `.env`).
- Dev stack together: `./dev.sh` (or faster `./start.sh`) to launch FastAPI on `:8000` and Next.js on `:3000`; logs in `logs/`.
- Backend only: `cd backend && source ../venv/bin/activate && uvicorn main:app --reload`.
- Frontend only: `cd frontend && npm install && npm run dev`.
- Testing shortcuts: `./test.sh all` runs both sides. Per side: `cd backend && pytest [-m marker|--cov]`; `cd frontend && npm run test` (use `test:e2e`, `test:ui`, `test:api`, `test:fast` as needed).

## Coding Style & Naming Conventions
- Python 3.11, FastAPI, and Pydantic v2: keep type hints, 4-space indents, and prefer raising HTTPException in routes. Place shared logic in `app/utils`; avoid creds in code—load via `python-dotenv`.
- TypeScript/Next.js: rely on the provided ESLint config (`npm run lint`). Use PascalCase for React components, camelCase for variables/functions, and file/folder names aligned with route segments (kebab-case URLs). Prefer client utilities in `src/lib` and reusable UI in `src/components/ui`.
- Tailwind CSS is available; favor semantic class grouping and `data-testid` on interactive elements to keep Playwright selectors stable.

## Testing Guidelines
- Backend: pytest markers include `unit`, `integration`, `api`, `slow`, `database` (see `backend/pytest.ini` and `backend/tests/README.md`). Aim to cover routers and utilities; mock Supabase and external calls. Generate coverage with `pytest --cov=main --cov-report=html`.
- Frontend: Tests are Playwright-based; align selectors with `data-testid`. Use `npm run test:report` to inspect failures locally. For UI changes, add at least one targeted E2E or component-level check.
- CI expectations: tests should pass locally; attach coverage artifacts or reports when relevant.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commit hints seen in history (`fix:`, `chore:`). Use clear scope, e.g., `feat: add ride booking flow` or `chore: update eslint config`.
- Pull requests should include: a brief summary of changes, impacted areas (backend/frontend), manual test notes or commands executed, and screenshots/GIFs for UI-visible changes. Link issues when applicable and call out env var or config changes explicitly.

## Security & Configuration Tips
- Keep secrets out of git: populate `.env` (backend) and `.env.local` (frontend) with Supabase keys and API base URLs. Never hardcode keys in `app/routes` or `src/lib`.
- When updating infra files (`docker-compose*.yml`, `vercel*.json`, `supabase/*`), document expected ports and required env vars in the PR and verify `dev.sh` still boots without manual tweaks.
