import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET';

const prisma = new PrismaClient();

type AuthRequest = Request & { user?: User };

export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  // Authentication
  const authHeader = req.headers.authorization;
  const jwtToken = authHeader?.split(' ')[1];
 
  if (!jwtToken) {
    return res.sendStatus(401);
  }

  try {
    const payload = (await jwt.verify(jwtToken, JWT_SECRET)) as {
      tokenId: number;
    };
    
    const dbToken = await prisma.token.findFirst({
      where: { userId: payload.tokenId },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!dbToken || !dbToken.expiration) {
      return res.status(401).json({ error: 'API token expired' });
    }

    const expirationTime = new Date(dbToken?.expiration);

    if (expirationTime < new Date()) {
      console.log('expired')
      return res.status(401).json({ error: 'API token expired' });
    }

    req.user = dbToken.user;
  } catch (e) {
    return res.sendStatus(401);
  }

  next();
}