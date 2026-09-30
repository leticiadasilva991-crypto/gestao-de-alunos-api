import { api } from '../helpers/api.js';
import 'dotenv/config';

let tokenEmCache = null;

export async function comTokenAdmin() {
    if (!tokenEmCache) {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: process.env.ADMIN_EMAIL || 'admin@escola.com',
                senha: process.env.ADMIN_SENHA || 'admin123'
            });

        if (loginResposta.status !== 200 || !loginResposta.body?.token) {
            throw new Error('Falha ao obter token do administrador.');
        }

        tokenEmCache = loginResposta.body.token;
    }

    return `Bearer ${tokenEmCache}`;
}

export async function comTokenAluno(
    email = process.env.ALUNO_EMAIL || process.env.USUARIO_EMAIL || 'ana.souza@example.com',
    senha = process.env.ALUNO_SENHA || process.env.USUARIO_SENHA || '123456'
) {
    const loginResposta = await api()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ email, senha });

    if (loginResposta.status !== 200 || !loginResposta.body?.token) {
        throw new Error('Falha ao obter token do aluno.');
    }

    return `Bearer ${loginResposta.body.token}`;
}