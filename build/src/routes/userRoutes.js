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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// User CRUD
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = 10;
        const hashedPassword = yield bcryptjs_1.default.hash(password, saltRounds);
        return hashedPassword;
    });
}
// Create user
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, birthDate, gender, visibility, password } = req.body;
    try {
        const hashedPassword = yield hashPassword(password);
        const result = yield prisma.user.create({
            data: {
                email,
                name,
                birthDate,
                gender,
                password: hashedPassword,
                visibility
            },
        });
        console.log(result);
        res.json(result);
    }
    catch (e) {
        res.status(400).json({ error: 'Error' });
    }
}));
// list users
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUser = yield prisma.user.findMany({
    // select: {
    //   id: true,
    //   name: true,
    //   image: true,
    //   bio: true,
    // },
    });
    res.json(allUser);
}));
router.get('/search', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchTerm = req.query.searchTerm;
    try {
        const users = yield prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: searchTerm.toLowerCase() } },
                ],
            },
        });
        res.json(users);
    }
    catch (error) {
        console.error('Erro ao pesquisar usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}));
router.get('/:userId/publications', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const userPublications = yield prisma.publication.findMany({
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
    }
    catch (error) {
        console.error('Erro ao buscar publicações do usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield prisma.user.findUnique({
        where: { id: parseInt(id, 10) },
        include: { tweets: true },
    });
    res.json(user);
}));
router.get('/:userId', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const userProfile = yield prisma.user.findUnique({
            where: { id: parseInt(userId) },
            select: { id: true, name: true, email: true }
        });
        if (!userProfile) {
            return res.status(404).json({ error: 'Perfil de usuário não encontrado' });
        }
        res.json(userProfile);
    }
    catch (error) {
        console.error('Erro ao buscar o perfil do usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}));
// update user
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        const result = yield prisma.user.update({
            where: { id: Number(id) },
            data: { name, email, password },
        });
        res.json(result);
    }
    catch (e) {
        res.status(400).json({ error: `Failed to update the user` });
    }
}));
// delete user
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.user.delete({ where: { id: Number(id) } });
    res.sendStatus(200);
}));
exports.default = router;
