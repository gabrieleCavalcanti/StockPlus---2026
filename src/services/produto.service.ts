import { ProdutoRepository } from "../repository/produto.repository";
import { Produto } from "../models/produto.model";

export class ProdutoService {
    constructor(private _repository = new ProdutoRepository()) { }

    async selecionaTodos() {
        return await this._repository.findAll();
    }

    async verificarValidades() {
        return await this._repository.verificarValidades();
    }

    async verificarAlertas() {
        return await this._repository.verificarAlertas();
    }

    async selecionaValidade(data_vencimento: string) {
        return await this._repository.selectByValidade(data_vencimento);
    }

    async selecionaNome(nome_produto: string) {
        return await this._repository.selectByNome(nome_produto);
    }

    async selecionaId(id_produto: number) {
        return await this._repository.selectById(id_produto);
    }

    async criar(
        nome_produto: string,
        valor_produto: number,
        vinculo_imagem: string,
        id_categoria: number,
        data_vencimento: Date,
        quantidade_minima: number
    ) {

        return await this._repository.create({
            nome_produto,
            valor_produto,
            vinculo_imagem,
            id_categoria,
            data_vencimento,
            quantidade_minima
        });
    }

    async editar(
        nome_produto: string,
        valor_produto: number,
        vinculo_imagem: string,
        id_categoria: number,
        data_vencimento: Date,
        id_produto: number,
        quantidade_minima: number
    ) {

        return await this._repository.update({
            id_produto,
            nome_produto,
            valor_produto,
            vinculo_imagem,
            id_categoria,
            data_vencimento,
            quantidade_minima
        });
    }

    async deletar(id_produto: number) {
        return await this._repository.delete(id_produto);
    }
}