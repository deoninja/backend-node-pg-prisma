import express from 'express';
import { register, login, logout } from '../controllers/authControllers.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
