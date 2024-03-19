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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
describe('Teste para rota de login', () => {
    const uniqueEmail = `leticia${Math.random()}@gmail.com`;
    it('Deve retornar um token de autenticação e o usuário ao fazer login com credenciais válidas', () => __awaiter(void 0, void 0, void 0, function* () {
        const name = 'Leticia Lima';
        const email = uniqueEmail;
        const password = 'Leticia123@';
        const gender = 'feminino';
        const visibility = 'privado';
        const birthDate = '20/05/2000';
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                gender,
                visibility,
                birthDate
            },
        });
        const response = yield (0, supertest_1.default)(index_1.app).post('/auth/login').send({ email, password });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('authToken');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe(email);
        yield prisma.user.delete({ where: { email: user.email } });
    }), 10000);
    it('Deve retornar um erro ao tentar fazer login com credenciais inválidas', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = 'ana@gmail.com';
        const password = 'ana123@';
        const response = yield (0, supertest_1.default)(index_1.app).post('/auth/login').send({ email, password });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    }));
});
