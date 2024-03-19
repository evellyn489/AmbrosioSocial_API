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
const prisma = new client_1.PrismaClient();
describe('Teste para buscar usuário por ID', () => {
    const uniqueEmail = `paulo${Math.random()}@gmail.com`;
    it('Deve retornar o usuário e seus tweets ao buscar por ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const name = 'Paulo Silva';
        const email = uniqueEmail;
        const password = 'Paulo123@';
        const gender = 'masculino';
        const visibility = 'privado';
        const birthDate = '12/05/1990';
        const user = yield prisma.user.create({
            data: {
                name,
                email,
                password,
                gender,
                visibility,
                birthDate
            },
        });
        const response = yield (0, supertest_1.default)(index_1.app).get(`/user/${user.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(name);
        expect(response.body.tweets).toBeInstanceOf(Array);
        yield prisma.token.delete({ where: { id: user.id } });
        yield prisma.user.delete({ where: { email: user.email } });
    }));
    it('Deve retornar um erro ao tentar buscar um usuário inexistente', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = -100000;
        const response = yield (0, supertest_1.default)(index_1.app).get(`/user/${id}`);
        expect(response.body).toEqual(null);
    }));
});
