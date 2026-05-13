import { ClienteRepository } from "../repository/cliente.repository";
import { Cliente } from "../models/cliente.model";

export class ClienteService {
    constructor(private _repository = new ClienteRepository()) { }

    async selecionaTodos() {
        return await this._repository.findAll();
    }

    async selecionaId(id_cliente: number) {
        return await this._repository.findId(id_cliente);
    }

    async editar(id_cliente: number, cpf: string) {
        const pessoa = Cliente.editar(cpf, id_cliente);
        return await this._repository.update(id_cliente, pessoa)
    }
}