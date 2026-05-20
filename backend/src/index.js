require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const playersRouter = require('./routes/players');
const seasonsRouter = require('./routes/seasons');
const matchesRouter = require('./routes/matches');
const leaderboardsRouter = require('./routes/leaderboards');
const statusRouter = require('./routes/status');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Guard our own backend from abuse (separate from PUBG's rate limits)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many requests, please slow down.' },
});
app.use('/api', limiter);

// Routes — all mounted at /api
// Order matters: more specific paths must come before dynamic ones
app.use('/api', playersRouter);       // /api/:platform/players/...
app.use('/api', seasonsRouter);       // /api/:platform/seasons
app.use('/api', matchesRouter);       // /api/:platform/matches/:id  &  /api/telemetry
app.use('/api', leaderboardsRouter);  // /api/:platform/leaderboards/...
app.use('/api/status', statusRouter); // /api/status

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`PUBG Stats backend running on http://localhost:${PORT}`);
});
