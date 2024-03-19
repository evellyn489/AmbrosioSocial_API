import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

describe('Teste para rota de login', () => {
    const uniqueEmail = `leticia${Math.random()}@gmail.com`;
    it('Deve retornar um token de autenticação e o usuário ao fazer login com credenciais válidas', async () => {
        const name = 'Leticia Lima'
        const email = uniqueEmail;
        const password = 'Leticia123@';
        const gender = 'feminino';
        const visibility = 'privado';
        const birthDate = '20/05/2000';

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                gender,
                visibility,
                birthDate
            },
        });

        const response = await request(app).post('/auth/login').send({ email, password });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('authToken');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe(email);

        await prisma.user.delete({ where: { email: user.email } });

    }, 10000);

    it('Deve retornar um erro ao tentar fazer login com credenciais inválidas', async () => {
        const email = 'ana@gmail.com';
        const password = 'ana123@';

        const response = await request(app).post('/auth/login').send({ email, password });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    });
});