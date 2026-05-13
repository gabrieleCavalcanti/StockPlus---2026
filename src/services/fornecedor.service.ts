import { FornecedorRepository } from "../repository/fornecedor.repository";
import { Fornecedor } from "../models/fornecedor.model";

export class FornecedorService {
    constructor(private _repository = new FornecedorRepository()) { }

    async selecionaTodos() {
        return await this._repository.findAll();
    }

    async selecionaId(id_fornecedor: number) {
        return await this._repository.findId(id_fornecedor);
    }

    async editar(id_fornecedor: number, cnpj: string) {
        const pessoa = Fornecedor.editar(cnpj, id_fornecedor);
        return await this._repository.update(id_fornecedor, pessoa)
    }
}