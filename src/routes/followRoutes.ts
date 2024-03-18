import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Follow CRUD

// Follow user
router.post('/users/:userId/follow', async (req, res) => {
    const { userId } = req.params;
    const { followingId } = req.body;

    try {  
      const follow = await prisma.follow.create({
        data: {
          followerId: parseInt(followingId),
          followingId: parseInt(userId),
        },
      });

    res.json(follow);

    } catch (error) {
      console.error('Erro ao seguir usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Unfollow user
router.delete('/users/:userId/unfollow/:followingId', async (req, res) => {
    const { userId, followingId } = req.params;
    try {
      await prisma.follow.deleteMany({
        where: {
          followerId: parseInt(followingId),
          followingId: parseInt(userId),
        },
      });
      res.json({ message: 'Usuário parou de seguir com sucesso.' });
    } catch (error) {
      console.error('Erro ao parar de seguir usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


// get followers user

router.get('/users/:userId/followers', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const followers = await prisma.follow.findMany({
      where: {
        followerId: parseInt(userId),
      },
      include: {
        follower: true,
      },
    });
    res.json(followers.map(f => f.follower));
  } catch (error) {
    console.error('Erro ao buscar seguidores do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// get following user
router.get('/users/:userId/following', async (req, res) => {
    const { userId } = req.params
    
    try {
      const following = await prisma.follow.findMany({
        where: {
          followingId: parseInt(userId),
        },
        include: {
          following: true,
        },
      });
      res.json(following.map(f => f.following));
    } catch (error) {
      console.error('Erro ao buscar usuários seguidos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// get publications following users

router.get('/explore/posts', async (req, res) => {
    //@ts-ignore
    const user = req.user; 
    
    const {id} = user;
    
    const userId = id;

    try {
        const followingUsers = await prisma.follow.findMany({
            where: { followingId: userId }, 
            select: { followerId: true }
        });
        
    
        const followingUserIds = followingUsers.map(user => user.followerId);
        const followingPosts = await prisma.publication.findMany({
      		where: { userId: { in: followingUserIds } }, 
      		orderBy: { createdAt: 'desc' }, 
      		include: { user: true }, 
    });
        
        res.json(followingPosts);
    } catch (error) {
        console.error('Erro ao obter postagens dos usuários seguidos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


export default router;
