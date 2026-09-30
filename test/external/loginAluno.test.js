import { expect } from 'chai';
import { comTokenAluno } from '../helpers/auth.js';

describe('Logar com o usuário do Aluno', () => {
    it('obtém um token válido pelo helper de autenticação', async () => {
        const tokenAluno = await comTokenAluno('ana.souza@example.com', '123456');

        expect(tokenAluno).to.match(/^Bearer \S+$/);
    });
});