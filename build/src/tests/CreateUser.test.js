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
describe('Teste para criar um usuário', () => {
    const uniqueEmail = `paula${Math.random()}@gmail.com`;
    it('Deve criar um usuário com sucesso', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            name: 'Paula Silva',
            email: uniqueEmail,
            birthDate: '25/08/2000',
            gender: 'feminino',
            visibility: 'privado',
            password: 'Paula123@',
        };
        const response = yield (0, supertest_1.default)(index_1.app).post('/user').send(userData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe(userData.email);
        expect(response.body.name).toBe(userData.name);
        expect(response.body.birthDate).toBe(userData.birthDate);
        expect(response.body.gender).toBe(userData.gender);
        expect(response.body.visibility).toBe(userData.visibility);
        yield prisma.user.delete({ where: { email: userData.email } });
    }));
    it("Deve retornar um erro ao tentar criar um usuário", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidUserData = {
            name: "Pedro Silva",
            birthDate: "05/12/1995",
            gender: "masculino",
            visibility: "público",
            password: "Pedro123@",
        };
        const response = yield (0, supertest_1.default)(index_1.app).post('/user').send(invalidUserData);
        expect(response.status).toBe(400);
    }));
});
