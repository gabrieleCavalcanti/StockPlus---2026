import { MovimentacaoRepository } from "../repository/movimentacao.repository";
import { Movimentacao } from "../models/movimentacao.model";

export class MovimentacaoService {
    constructor(private _repository = new MovimentacaoRepository()) { }

    async selecionarTodos() {
        return await this._repository.findAll();
    }

    async selecionaByStatus(status: string) {
        const result = await this._repository.findBystatus(status);
        return result;
    }
};