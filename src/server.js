import express from 'express';
import dotenv, { config } from 'dotenv';
import { connectDb, disconnectDb } from './config/db.js';

dotenv.config();

// Import routes
import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';

config();
connectDb();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', movieRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movies', watchlistRoutes);

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections (e.g., database connection issues)
process.on('unhandledRejection', async (error) => {
  console.error(`Unhandled Rejection: ${error.message}`);
  await disconnectDb();
  process.exit(1);
});

// Handle uncaught exceptions (e.g., programming errors)
process.on('uncaughtException', async (error) => {
  console.error(`Uncaught Exception: ${error}`);
  await disconnectDb();
  process.exit(1);
});

// Handle graceful shutdown on SIGTERM
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(async () => {
    await disconnectDb();
    process.exit(0);
  });
});

// Handle graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(async () => {
    await disconnectDb();
    process.exit(0);
  });
});
