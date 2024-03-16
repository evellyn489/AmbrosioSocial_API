import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import publicationRoutes from './routes/publicationRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from './middlewares/authMiddleware';

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173'
 }));
app.use('/user', userRoutes);
app.use('/publication', authenticateToken, publicationRoutes);
app.use('/auth', authRoutes);

app.listen(3000, () => {
  console.log('Server ready at localhost:3000');
});