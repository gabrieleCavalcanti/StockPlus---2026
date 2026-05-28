import { PessoaRepository } from "../repository/pessoa.model";
import { Pessoa } from "../models/pessoa.model";

export class PessoaService {
    constructor(
        private _repository = new PessoaRepository(),
    ) { }

    async selecionaTodos() {
        return await this._repository.findAll();
    }

    async selecionaId(id_pessoa: number) {
        return await this._repository.findId(id_pessoa);
    }

    async selecionaNome(nome_pessoa: string) {
        return await this._repository.findNome(nome_pessoa);
    }

    async selecionaTipo(id_pessoa: number) {
        return await this._repository.selectTipo(id_pessoa);
    }

    async criar(nome_pessoa: string, email: string, tipo: string, infoExtra: any) {
        const pessoa = Pessoa.criar(nome_pessoa, email, tipo);
        return await this._repository.create(pessoa, infoExtra);
    }

    async editar( id: number, nome_pessoa: string,  email: string,  infoExtra: any) {
        const pessoa = Pessoa.editar( nome_pessoa, email, id);
        return await this._repository.update(pessoa, infoExtra);
    }

    async selecionaTodosClientes() {
        return await this._repository.findClientes();
    }

    async selecionaTodosFuncionarios() {
        return await this._repository.findFuncinarios();
    }

    async selecionaTodosFornecedores() {
        return await this._repository.findFornecedores();
    }
}