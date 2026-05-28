import { ProdutoRepository } from "../repository/produto.repository";
import { Produto } from "../models/produto.model";

export class ProdutoService {
    constructor(private _repository = new ProdutoRepository()) { }

    async selecionaTodos() {
        return await this._repository.findAll();
    }
    async verificarValidades(){
        return await this._repository.verificarValidades();
    }
    async selecionaValidade(data_vencimento: string) {
        return await this._repository.selectByValidade(data_vencimento)
    }
    async selecionaNome(nome_produto: string) {
        return await this._repository.selectByNome(nome_produto)
    }
    async selecionaId(id_categoria: number) {
        return await this._repository.selectById(id_categoria);
    }
    async criar(nome_produto: string, valor_produto: number, vinculo_imagem: string, id_categoria: number, data_vencimento: Date) {
        const produto = Produto.criar(nome_produto, valor_produto, vinculo_imagem, data_vencimento, id_categoria);
        return await this._repository.create(produto)
    }
    async editar(nome_produto: string, valor_produto:number, vinculo_imagem: string, id_categoria: number, data_vencimento: Date,  id_produto: number) {
        const produto = Produto.editar(nome_produto, valor_produto, vinculo_imagem, data_vencimento, id_categoria, id_produto);
        return await this._repository.update(id_produto, produto);
    }

    async deletar(id_produto: number) {
        return await this._repository.delete(id_produto);
    }
}