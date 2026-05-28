import { EstoqueRepository } from "../repository/estoque.repository";
import { Estoque } from "../models/estoque.model";

export class EstoqueService {
    constructor(private _repository = new EstoqueRepository()) { }

    async selecionarTodos() {
        return await this._repository.findAll();
    }

    async selecionaById(id_estoque: number) {
        const result = await this._repository.findById(id_estoque);
        return result;
    }


async selecionaByMin() {
    const dadosBanco = await this._repository.findByMin();
    return dadosBanco.map(produto => {
        const estoqueModel = new Estoque(
            produto.id_produto, 
            produto.quantidade, 
            produto.quantidade_minima
        );
        return {
            idProduto: produto.id_produto,
            quantidade: estoqueModel.quantidade,
            quantidade_minima: estoqueModel.quantidade_minima,
            status: estoqueModel.statusEstoque 
        };
    });
}
};