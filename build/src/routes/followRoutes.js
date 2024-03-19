"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Follow CRUD
// Follow user
router.post('/users/:userId/follow', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { followingId } = req.body;
    try {
        const follow = yield prisma.follow.create({
            data: {
                followerId: parseInt(followingId),
                followingId: parseInt(userId),
            },
        });
        res.json(follow);
    }
    catch (error) {
        console.error('Erro ao seguir usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}));
// Unfollow user
router.delete('/users/:userId/unfollow/:followingId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, followingId } = req.params;
    try {
        yield prisma.follow.deleteMany({
            where: {
                followerId: parseInt(followingId),
                followingId: parseInt(userId),
            },
        });
        res.json({ message: 'Usuário parou de seguir com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao parar de seguir usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}));
// get followers user
router.get('/users/:userId/followers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const followers = yield prisma.follow.findMany({
            where: {
                followerId: parseInt(userId),
            },
            include: {
                follower: true,
            },
        });
        res.json(followers.map(f => f.follower));
    }
    catch (error) {
        console.error('Erro ao buscar seguidores do usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}));
// get following user
router.get('/users/:userId/following', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const following = yield prisma.follow.findMany({
            where: {
                followingId: parseInt(userId),
            },
            include: {
                following: true,
            },
        });
        res.json(following.map(f => f.following));
    }
    catch (error) {
        console.error('Erro ao buscar usuários seguidos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}));
// get publications following users
router.get('/explore/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const user = req.user;
    const { id } = user;
    const userId = id;
    try {
        const followingUsers = yield prisma.follow.findMany({
            where: { followingId: userId },
            select: { followerId: true }
        });
        const followingUserIds = followingUsers.map(user => user.followerId);
        const followingPosts = yield prisma.publication.findMany({
            where: { userId: { in: followingUserIds } },
            orderBy: { createdAt: 'desc' },
            include: { user: true },
        });
        res.json(followingPosts);
    }
    catch (error) {
        console.error('Erro ao obter postagens dos usuários seguidos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}));
exports.default = router;
