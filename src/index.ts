import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import publicationRoutes from './routes/publicationRoutes';
import authRoutes from './routes/authRoutes';
import followRoutes from './routes/followRoutes';
import { authenticateToken } from './middlewares/authMiddleware';

export const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use('/user', userRoutes);
app.use('/publication', authenticateToken, publicationRoutes);
app.use('/auth', authRoutes);
app.use('/follow', authenticateToken, followRoutes);

app.listen({
  host: '0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333,

},() => {
  console.log("HTTP server running")
})