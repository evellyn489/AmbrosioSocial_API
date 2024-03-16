import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Publication CRUD

// Create Publication
router.post('/', async (req, res) => {
  const { content, image } = req.body;
  console.log(content, image)
  // @ts-ignore
  const user = req.user;
  try {
    const result = await prisma.publication.create({
      data: {
        content,
        image,
        userId: user.id,
      },
      include: { user: true },
    });

    res.json(result);
  } catch (e) {
    res.status(400).json({ error: 'Error publication' });
  }
});

// list Publication
router.get('/', async (req, res) => {
  const allTweets = await prisma.publication.findMany({
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
  res.json(allTweets);
});

// get one Publication
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Query tweet with id: ', id);

  const tweet = await prisma.publication.findUnique({
    where: { id: Number(id) },
    include: { user: true },
  });
  if (!tweet) {
    return res.status(404).json({ error: 'Tweet not found!' });
  }

  res.json(tweet);
});

// update Publication
router.put('/:id', (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

// delete Publication
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.publication.delete({ where: { id: Number(id) } });
  res.sendStatus(200);
});

export default router;