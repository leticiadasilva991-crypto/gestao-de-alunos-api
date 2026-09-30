import { randomUUID } from 'node:crypto';
import { expect } from 'chai';
import { api } from '../helpers/api.js';
import { comTokenAdmin, comTokenAluno } from '../helpers/auth.js';
import testesDeMatriculas from '../fixtures/fluxoEntregaTrabalho.json' with { type: 'json' };

describe('Fluxo de matrícula e entrega de trabalho', () => {
    testesDeMatriculas.forEach((testeDeMatricula) => {
        it(testeDeMatricula.cenario, async () => {
            const tokenAdmin = await comTokenAdmin();
            const identificadorUnico = randomUUID();
            const dadosAluno = {
                ...testeDeMatricula.dadosAluno,
                email: `aluno.${identificadorUnico}@example.com`,
                matricula: `${testeDeMatricula.dadosAluno.matricula}-${identificadorUnico}`,
            };
            const dadosDisciplina = {
                ...testeDeMatricula.dadosDisciplina,
                codigo: `${testeDeMatricula.dadosDisciplina.codigo}-${identificadorUnico}`,
            };

            const cadastroAlunoResposta = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin)
                .send(dadosAluno);

            expect(cadastroAlunoResposta.status).to.equal(testeDeMatricula.statusCodeAluno);
            const alunoId = cadastroAlunoResposta.body.id;

            const cadastroDisciplinaResposta = await api()
                .post('/api/admin/disciplinas')
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin)
                .send(dadosDisciplina);

            expect(cadastroDisciplinaResposta.status).to.equal(testeDeMatricula.statusCodeDisciplina);
            const disciplinaId = cadastroDisciplinaResposta.body.id;

            const cadastroMatriculaResposta = await api()
                .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin)
                .send({ alunoId });

            expect(cadastroMatriculaResposta.status).to.equal(testeDeMatricula.statusCodeMatricula);
            expect(cadastroMatriculaResposta.body.alunoId).to.equal(alunoId);
            expect(cadastroMatriculaResposta.body.disciplinaId).to.equal(disciplinaId);

            const alunosMatriculadosResposta = await api()
                .get(`/api/admin/disciplinas/${disciplinaId}/alunos`)
                .set('Authorization', tokenAdmin);

            expect(alunosMatriculadosResposta.status).to.equal(testeDeMatricula.statusCodeConsultaMatricula);
            expect(alunosMatriculadosResposta.body.map((aluno) => aluno.id)).to.include(alunoId);

            const tokenAluno = await comTokenAluno(dadosAluno.email, dadosAluno.senha);
            const cadastroEntregaResposta = await api()
                .post(`/api/alunos/${alunoId}/trabalhos`)
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAluno)
                .send({ ...testeDeMatricula.trabalho, disciplinaId });

            expect(cadastroEntregaResposta.status).to.equal(testeDeMatricula.statusCodeTrabalho);
            expect(cadastroEntregaResposta.body.alunoId).to.equal(alunoId);
            expect(cadastroEntregaResposta.body.disciplinaId).to.equal(disciplinaId);
        });
    });
});