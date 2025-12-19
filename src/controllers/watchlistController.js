import { prisma } from '../config/db.js';

const addToWatchlist = async (req, res) => {
  try {
    const { movieId, status, notes, rating } = req.body;

    if (!req.user.id || !movieId) {
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
          userId: req.user.id,
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
        userId: req.user.id,
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

/**
 * Remove movie from watchlist
 * Deletes watchlist item
 * Ensures only owner can delete
 * Requires protect middleware
 */
const removeFromWatchlist = async (req, res) => {
  // Find watchlist item and verify ownership
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  if (!watchlistItem) {
    return res.status(404).json({ error: 'Watchlist item not found' });
  }

  // Ensure only owner can delete
  if (watchlistItem.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: 'Not allowed to update this watchlist item' });
  }

  await prisma.watchlistItem.delete({
    where: { id: req.params.id },
  });

  res.status(200).json({
    status: 'success',
    message: 'Movie removed from watchlist',
  });
};

export { addToWatchlist, removeFromWatchlist };
