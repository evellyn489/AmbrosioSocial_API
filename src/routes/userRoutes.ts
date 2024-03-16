import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// User CRUD

/*
  Test with curl:

  curl -X POST -H "Content-Type: application/json" \
       -d '{"name": "Elon Musk", "email": "doge@twitter.com", "birthDate": "04/11/2003", "gender": "Masculino", "password": "senha123@A", "visibility": "public"}' \
       http://localhost:3000/user/

*/

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

// get one user
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { tweets: true },
  });

  res.json(user);
});

/*
  Test with curl:

  curl -X PUT -H "Content-Type: application/json" \
       -d '{"name": "Vadim", "bio": "Hello there!"}' \
       http://localhost:3000/user/1

*/
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

// curl -X DELETE http://localhost:3000/user/6
// delete user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: Number(id) } });
  res.sendStatus(200);
});

export default router;