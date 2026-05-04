# RallyIQ

RallyIQ is a full-stack volleyball statistics app for creating matches, tracking in-game events, saving player stats, and exporting match tables for printing or PDF.

## Features

- Create and delete volleyball matches
- Track score and player events during a match
- Rename players per match
- Save match state to PostgreSQL
- View saved matches from the games page
- Export the stats table with the browser print / Save as PDF flow
- Responsive React UI styled with Tailwind CSS

## Tech Stack

**Frontend**

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

**Backend**

- Node.js
- Express
- PostgreSQL
- `pg`

## Project Structure

```text
react-project/
  backend/
    db.js
    server.js
    package.json
  frontend/
    src/
      components/
      pages/
      layouts/
    package.json
```

## Local Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Required environment variable:

```text
DATABASE_URL=postgresql://user:password@host:5432/database
```

Optional environment variable:

```text
DATABASE_SSL=true
```

Use `DATABASE_SSL=true` only when your Postgres connection requires SSL. For a local Postgres database, leave it unset.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on the Vite dev server, usually:

```text
http://localhost:5173
```

## API Routes

```text
GET    /                  API health check
GET    /test-db           PostgreSQL connection test
GET    /games             List games
POST   /games             Create a game
GET    /games/:id         Get one game
PATCH  /games/:id         Save score, stats, log, and player names
DELETE /games/:id         Delete a game
POST   /games/:id/events  Add one tracked event
```

## Deployment

The intended deployment setup is:

- Frontend: Vercel
- Backend: Render
- Database: Render PostgreSQL

On Render, add these environment variables to the backend service:

```text
DATABASE_URL=<Render PostgreSQL Internal Database URL>
NODE_ENV=production
```

If using an external Postgres URL that requires SSL, also add:

```text
DATABASE_SSL=true
```

The frontend currently points to the Render backend API from `frontend/src/pages/GamesPage.tsx`.

## Scripts

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Backend:

```bash
npm run dev
npm start
```

## Notes

The backend creates or updates the `games` table on startup, including the `playernames` JSON column used for custom player names.

Built as a full-stack learning project.
