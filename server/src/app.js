import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import workspaceRoutes from './routes/workspace.routes.js';
import boardRoutes from './routes/board.routes.js';
import listRoutes from './routes/list.routes.js';
import cardRoutes from './routes/card.routes.js';
import commentRoutes from './routes/comment.routes.js';
import activityRoutes from './routes/activity.routes.js';

import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();
await connectDB();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json());

app.get('/health', (_, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/activity', activityRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
