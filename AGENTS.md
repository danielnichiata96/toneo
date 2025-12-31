# Repository Guidelines

## Project Structure & Module Organization
- `frontend/src/app` holds Next.js App Router routes and layouts.
- `frontend/src/components`, `frontend/src/lib`, `frontend/src/types`, `frontend/src/data` contain UI building blocks, helpers, and static datasets.
- `frontend/public` stores static assets.
- `backend/app` contains the FastAPI application, with `backend/app/routers`, `backend/app/services`, `backend/app/models`, and `backend/app/core`.
- `backend/scripts/import_cedict.py` downloads and imports CC-CEDICT into `backend/data`.
- `backend/tests` is the pytest location (currently empty).

## Build, Test, and Development Commands
- `cd backend && python -m venv venv && pip install -r requirements.txt` sets up the backend environment.
- `cd backend && python scripts/import_cedict.py` fetches and prepares dictionary data (run once or when updating data).
- `cd backend && uvicorn app.main:app --reload` runs the API at `http://localhost:8000`.
- `cd frontend && npm install` installs frontend dependencies.
- `cd frontend && npm run dev` starts Next.js at `http://localhost:3000`.
- `cd frontend && npm run build` builds the production bundle; `npm start` serves it.
- `cd frontend && npm run lint` runs Next.js ESLint rules.
- `docker-compose up --build` runs both services with Docker.

## Coding Style & Naming Conventions
- TypeScript/React: follow Next.js defaults; keep components in `PascalCase` and hooks/helpers in `camelCase`.
- Python: prefer PEP 8 style; keep modules in `snake_case`.
- Formatting uses Next.js + ESLint defaults; no additional formatters are configured.

## Testing Guidelines
- Backend tests use `pytest` and `pytest-asyncio`; add tests under `backend/tests` named `test_*.py`.
- Frontend tests use Vitest; run `cd frontend && npm run test`.
- Run backend tests with `cd backend && pytest`.

## Commit & Pull Request Guidelines
- No Git history is available in this checkout, so no existing commit convention is visible.
- Use short, imperative commit messages (e.g., `Add tone sandhi rule`).
- PRs should include a clear description, linked issues (if any), and UI screenshots or recordings for frontend changes.

## Configuration Notes
- Backend expects `CORS_ORIGINS` for allowed frontend hosts.
- Frontend reads `NEXT_PUBLIC_API_URL` to reach the API.
