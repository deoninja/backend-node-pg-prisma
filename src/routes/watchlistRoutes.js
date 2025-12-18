import express from 'express';
import { addToWatchlist } from '../controllers/watchlistController.js';

const router = express.Router();

router.post('/watchlist', addToWatchlist);

export default router;
