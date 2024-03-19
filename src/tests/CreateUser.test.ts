import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Teste para criar um usuário', () => {
    type UserData = {
        name: string;
        email: string;
        birthDate: string;
        gender: string;
        visibility: string;
        password: string;
    };
    
    const uniqueEmail = `paula${Math.random()}@gmail.com`;
    it('Deve criar um usuário com sucesso', async () => {
        const userData: UserData = {
            name: 'Paula Silva',
            email: uniqueEmail,
            birthDate: '25/08/2000',
            gender: 'feminino',
            visibility: 'privado',
            password: 'Paula123@',
        };

        const response = await request(app).post('/user').send(userData);
        expect(response.status).toBe(200);
    
        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe(userData.email);
        expect(response.body.name).toBe(userData.name);
        expect(response.body.birthDate).toBe(userData.birthDate);
        expect(response.body.gender).toBe(userData.gender);
        expect(response.body.visibility).toBe(userData.visibility);

        await prisma.user.delete({ where: { email: userData.email }});
    });

    it("Deve retornar um erro ao tentar criar um usuário", async () => {
        const invalidUserData = {
            name: "Pedro Silva",
            birthDate: "05/12/1995",
            gender: "masculino",
            visibility: "público",
            password: "Pedro123@",
        };

        const response = await request(app).post('/user').send(invalidUserData);

        expect(response.status).toBe(400);
    })
})