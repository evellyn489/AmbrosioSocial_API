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
// Publication CRUD
// Create Publication
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, image } = req.body;
    // @ts-ignore
    const user = req.user;
    try {
        const result = yield prisma.publication.create({
            data: {
                content,
                image,
                userId: user.id,
            },
            include: { user: true },
        });
        res.json(result);
    }
    catch (e) {
        res.status(400).json({ error: 'Error publication' });
    }
}));
// list Publication
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allTweets = yield prisma.publication.findMany({
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
}));
// get one Publication
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log('Query tweet with id: ', id);
    const tweet = yield prisma.publication.findUnique({
        where: { id: Number(id) },
        include: { user: true },
    });
    if (!tweet) {
        return res.status(404).json({ error: 'Tweet not found!' });
    }
    res.json(tweet);
}));
// update Publication
router.put('/:id', (req, res) => {
    const { id } = req.params;
    res.status(501).json({ error: `Not Implemented: ${id}` });
});
// delete Publication
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.publication.delete({ where: { id: Number(id) } });
    res.sendStatus(200);
}));
exports.default = router;
