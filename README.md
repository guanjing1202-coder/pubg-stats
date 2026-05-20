# PUBG Stats

PUBG Stats is a full-stack PUBG player analytics app built on the official PUBG API. It provides player search, season stats, ranked stats, lifetime performance, match history, match details, weapon mastery, survival mastery, global leaderboards, favorites, recent searches, and bilingual Chinese/English UI.

## Features

- Search PUBG players by platform and player name
- View current and historical season stats by game mode
- View ranked tier, RP, peak tier, and ranked performance
- View lifetime stats with radar chart visualization
- Load recent matches and drill into full match details
- Inspect roster/team placement and sortable participant tables
- View weapon mastery and survival mastery data
- Browse global leaderboard by region, season, and mode
- Save favorite players and recent searches in localStorage
- Switch between Chinese and English
- Backend API proxy with caching, rate limiting, parameter validation, and telemetry URL allowlisting

## Tech Stack

| Layer | Stack |
| --- | --- |
| Frontend | React 18, Vite, Tailwind CSS |
| Data fetching | TanStack React Query, Axios |
| Charts | Recharts |
| Routing | React Router v6 |
| Backend | Node.js, Express |
| Cache | node-cache |
| API source | Official PUBG API |
| Tests | Node.js built-in test runner |

## Project Structure

```text
pubg-stats/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── middleware/
│   │   │   ├── cache.js
│   │   │   └── validate.js
│   │   ├── routes/
│   │   │   ├── leaderboards.js
│   │   │   ├── matches.js
│   │   │   ├── players.js
│   │   │   ├── seasons.js
│   │   │   └── status.js
│   │   └── services/
│   │       └── pubgApi.js
│   └── test/
│       └── validate.test.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── i18n/
│   │   ├── pages/
│   │   └── utils/
│   └── vite.config.js
├── start.bat
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm
- PUBG API key from [developer.pubg.com](https://developer.pubg.com)

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
PUBG_API_KEY=your_pubg_api_key_here
PORT=3001
NODE_ENV=development
CACHE_TTL=300
```

Optional:

```env
FRONTEND_URL=http://localhost:5173
```

## Getting Started

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

On Windows, you can also run:

```bat
start.bat
```

## Scripts

Backend:

```bash
npm run dev      # start Express with nodemon
npm start        # start Express with node
npm test         # run backend validation tests
```

Frontend:

```bash
npm run dev      # start Vite dev server
npm run build    # build production assets
npm run preview  # preview production build
```

## API Overview

The frontend calls the local backend through `/api`. The backend proxies official PUBG API requests and keeps the API key off the client.

| Local endpoint | Purpose |
| --- | --- |
| `GET /api/status` | PUBG API status |
| `GET /api/:platform/players?name=` | Search player by name |
| `GET /api/:platform/players/:playerId` | Get player by ID |
| `GET /api/:platform/seasons` | List seasons |
| `GET /api/:platform/players/:playerId/seasons/:seasonId` | Season stats |
| `GET /api/:platform/players/:playerId/seasons/:seasonId/ranked` | Ranked stats |
| `GET /api/:platform/players/:playerId/lifetime` | Lifetime stats |
| `GET /api/:platform/matches/:matchId` | Match details |
| `GET /api/telemetry?url=` | Fetch allowlisted telemetry JSON |
| `GET /api/:platform/players/:playerId/weapon_mastery` | Weapon mastery |
| `GET /api/:platform/players/:playerId/survival_mastery` | Survival mastery |
| `GET /api/:platformRegion/leaderboards/:seasonId/:gameMode` | Leaderboard |

## Security Notes

- `PUBG_API_KEY` is only used by the backend and must not be exposed in frontend code.
- Telemetry proxy requests are restricted to official PUBG telemetry CDN hosts.
- Backend route params are validated before proxying requests to PUBG.
- `.env`, dependencies, build outputs, logs, and crash dumps are ignored by `.gitignore`.

## Performance Notes

- React Query caches client-side responses.
- The backend uses in-memory caching to reduce PUBG API calls.
- Chart-heavy lifetime and season-trend views are lazy-loaded to keep the initial bundle smaller.

## Testing

Run backend tests:

```bash
cd backend
npm test
```

Build the frontend:

```bash
cd frontend
npm run build
```

## PUBG API Notes

- PUBG match data is only retained for a limited period.
- Player match history is limited by what the official API returns.
- PUBG API rate limits apply. The app surfaces a dedicated rate-limit message when a 429 response occurs.

## License

This project is an unofficial PUBG stats tool. PUBG is a registered trademark of KRAFTON, Inc. Data is sourced from the official PUBG API.
