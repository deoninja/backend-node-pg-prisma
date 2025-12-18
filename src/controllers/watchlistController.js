import { prisma } from '../config/db.js';

const addToWatchlist = async (req, res) => {
  try {
    const { movieId, status, notes, userId, rating } = req.body;

    if (!userId || !movieId) {
      return res.status(400).json({ error: 'userId and movieId are required' });
    }

    // verify movie exists
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Check if already added to watchlist
    const existingInWatchlist = await prisma.watchlistItem.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    if (existingInWatchlist) {
      return res.status(400).json({ error: 'Movie already in the watchlist' });
    }

    // Add to watchlist
    const watchlistItem = await prisma.watchlistItem.create({
      data: {
        userId,
        movieId,
        status: status ?? 'PLANNED',
        rating: rating ?? null,
        notes: notes ?? null,
      },
    });

    return res.status(201).json({
      status: 'success',
      data: {
        watchlistItem,
      },
    });
  } catch (err) {
    console.error('Error adding to watchlist:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export { addToWatchlist };
