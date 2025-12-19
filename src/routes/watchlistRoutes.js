import express from 'express';
import {
  addToWatchlist,
  updateWatchlistItem,
  removeFromWatchlist,
} from '../controllers/watchlistController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/watchlist', addToWatchlist);

// {{BaseURL}}/api/v1/movies/watchlist/:id
router.put('/watchlist/:id', updateWatchlistItem);
router.delete('/watchlist/:id', removeFromWatchlist);

export default router;
