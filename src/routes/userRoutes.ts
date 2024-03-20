import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// User CRUD

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// Create user
router.post('/', async (req, res) => {
  const { email, name, birthDate, gender, visibility, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    
    const result = await prisma.user.create({
      data: {
        email,
        name,
        birthDate,
        gender, 
        password: hashedPassword,
        visibility
      },
    });

    console.log(result)

    res.json(result);
  } catch (e) {
    res.status(400).json({ error: 'Error' });
  }
});

// list users
router.get('/', async (req, res) => {
  const allUser = await prisma.user.findMany({
    // select: {
    //   id: true,
    //   name: true,
    //   image: true,
    //   bio: true,
    // },
  });

  res.json(allUser);
});

router.get('/search', authenticateToken ,async (req, res) => {
  const searchTerm: string = req.query.searchTerm as string;
  console.log(searchTerm.toLowerCase())
  try {

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { name: { contains: searchTerm.toUpperCase(), mode: 'insensitive' } },
          { name: { contains: searchTerm.toLowerCase(), mode: 'insensitive' } },
        ],
      },
    });

    res.json(users);
  } catch (error) {
    console.error('Erro ao pesquisar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.get('/:userId/publications', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const userPublications = await prisma.publication.findMany({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(userPublications);
  } catch (error) {
    console.error('Erro ao buscar publicações do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: parseInt(id, 10) },
    include: { tweets: true },
  });

  res.json(user);
});

router.get('/:userId', authenticateToken ,async (req, res) => {
  const userId = req.params.userId;

  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { id: true, name: true, email: true }
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'Perfil de usuário não encontrado' });
    }

    res.json(userProfile);
  } catch (error) {
    console.error('Erro ao buscar o perfil do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// update user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const result = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, password },
    });
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: `Failed to update the user` });
  }
});

// delete user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: Number(id) } });
  res.sendStatus(200);
});

export default router;