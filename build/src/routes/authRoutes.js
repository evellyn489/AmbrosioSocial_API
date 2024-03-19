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
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const EXPIRATION_TIME = 24 * 60 * 60;
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET';
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
function generateAuthToken(tokenId) {
    const jwtPayload = { tokenId };
    return jsonwebtoken_1.default.sign(jwtPayload, JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: EXPIRATION_TIME
    });
}
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        const expirationTime = 24 * 60 * 60 * 1000;
        const authToken = generateAuthToken(user.id);
        yield prisma.token.create({
            data: {
                type: 'API',
                expiration: new Date(Date.now() + expirationTime),
                userId: user.id,
            },
        });
        res.json({ authToken, user });
    }
    catch (e) {
        console.log(e);
        res
            .status(400)
            .json({ error: "Couldn't start the authentication process" });
    }
}));
exports.default = router;
