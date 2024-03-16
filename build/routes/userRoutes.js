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
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// User CRUD
/*
  Test with curl:

  curl -X POST -H "Content-Type: application/json" \
       -d '{"name": "Elon Musk", "email": "doge@twitter.com", "birthDate": "04/11/2003", "gender": "Masculino", "password: "senha123@A", "visibility": "public"}' \
       http://localhost:3000/user/

*/
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
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
        res.json(result);
    }
    catch (e) {
        res.status(400).json({ error: 'Username and email should be unique' });
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
// get one user
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield prisma.user.findUnique({
        where: { id: Number(id) },
        include: { tweets: true },
    });
    res.json(user);
}));
/*
  Test with curl:

  curl -X PUT -H "Content-Type: application/json" \
       -d '{"name": "Vadim", "bio": "Hello there!"}' \
       http://localhost:3000/user/1

*/
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
// curl -X DELETE http://localhost:3000/user/6
// delete user
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.user.delete({ where: { id: Number(id) } });
    res.sendStatus(200);
}));
exports.default = router;
