import { expect } from 'chai';
import { comTokenAdmin } from '../helpers/auth.js';

describe('Logar com o usuário Administrador', () => {
    it('obtém um token válido pelo helper de autenticação', async () => {
        const tokenAdmin = await comTokenAdmin();

        expect(tokenAdmin).to.match(/^Bearer \S+$/);
    });
});