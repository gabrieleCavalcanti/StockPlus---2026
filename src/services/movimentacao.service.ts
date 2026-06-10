import { MovimentacaoRepository } from "../repository/movimentacao.repository";
import { IMovimentacao } from "../models/movimentacao.model"; // Importado a interface com "I"

export class MovimentacaoService {
constructor(private _repository = new MovimentacaoRepository()) { }

    async selecionarTodos(): Promise<IMovimentacao[]> {
        return await this._repository.findAll();
    }

    async selecionaByStatus(status: string): Promise<IMovimentacao[]> {
        return await this._repository.findBystatus(status);
    }
}
