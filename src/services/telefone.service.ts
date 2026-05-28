import { TelefoneRepository } from "../repository/telefone.repository";
import { Telefone } from "../models/telefone.model";

export class TelefoneService {
    constructor(private _repository = new TelefoneRepository()) { }

    async selecionaTodos(id_pessoa: number) {
        return await this._repository.findAllPessoa(id_pessoa);
    }

    async selecionaId(id_telefone: number) {
        return await this._repository.findId(id_telefone);
    }

    async criar(telefone: string, id_pessoa: number) {
        const tel = Telefone.criar(telefone, id_pessoa);
        return await this._repository.create(tel);
    }

    async editar(id_telefone: number, telefone: string) {
        const tel = Telefone.editar(telefone, id_telefone);
        return await this._repository.update(id_telefone, tel)
    }
}