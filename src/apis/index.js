import express from 'express';
import authRouter from '../routers/auth.router.js';

const router = express.Router();

router.use('/auth', authRouter);

export default router;
