import { FuncionarioRepository } from "../repository/funcinario.repository";
import { Funcionario } from "../models/funcionario.model";

export class FuncionarioService {
    constructor(private _repository = new FuncionarioRepository) { }

    async selecionaTodos() {
        return await this._repository.findAll();
    }

    async selecionaId(id_funcionario: number) {
        return await this._repository.findId(id_funcionario);
    }

    async editar(id_funcionario: number, cargo: string, data_admissao: Date) {
        const funcinario = Funcionario.editar(cargo, data_admissao, id_funcionario);
        return await this._repository.update(id_funcionario, funcinario)
    }
}