import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const EXPIRATION_TIME = 24 * 60 * 60;
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET';

const router = Router();
const prisma = new PrismaClient();

function generateAuthToken(tokenId: number): string {
  const jwtPayload = { tokenId };

  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: EXPIRATION_TIME
  });
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const expirationTime = 24 * 60 * 60 * 1000;
    
    const authToken = generateAuthToken(user.id);
    await prisma.token.create({
      data: {
        type: 'API',
        expiration: new Date(Date.now() + expirationTime),
        userId: user.id,
      },
    });

    res.json({ authToken, user });
 
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .json({ error: "Couldn't start the authentication process" });
  }
});

export default router;