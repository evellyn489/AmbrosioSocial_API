import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Teste para buscar usuário por ID', () => {
    const uniqueEmail = `paulo${Math.random()}@gmail.com`;
    it('Deve retornar o usuário e seus tweets ao buscar por ID', async () => {
        const name = 'Paulo Silva';
        const email = uniqueEmail;
        const password = 'Paulo123@';
        const gender = 'masculino';
        const visibility = 'privado';
        const birthDate = '12/05/1990';

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
                gender,
                visibility,
                birthDate
            },
        });

        const response = await request(app).get(`/user/${user.id}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(name);
        expect(response.body.tweets).toBeInstanceOf(Array);

        await prisma.token.delete({where: {id: user.id}});
        await prisma.user.delete({ where: { email: user.email } });
    });

    it('Deve retornar um erro ao tentar buscar um usuário inexistente', async () => {
        const id = -100000;
    
        const response = await request(app).get(`/user/${id}`);
        
        expect(response.body).toEqual(null);
    });
});