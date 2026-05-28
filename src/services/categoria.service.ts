import { CategoriaRepository } from "../repository/categoria.repository";
import { Categoria } from "../models/categoria.model";

export class CategoriaService {
    constructor(private _repository = new CategoriaRepository()) { }

    async selecionaTodos() {
        return await this._repository.findAll();
    }
    async listarAtivas() {
        return this._repository.listarCategoriasAtivas();
    }
    async selecionaNome(nome_categoria: string) {
        return await this._repository.selectByNome(nome_categoria)
    }
    async selecionaId(id_categoria: number) {
        return await this._repository.selectById(id_categoria);
    }
    async criar(nome_categoria: string, ativo: boolean) {
        const categoria = Categoria.criar(nome_categoria, ativo);
        return await this._repository.create(categoria)
    }
    async editar(nome_categoria: string, ativo: boolean, id_categoria: number) {
        const categoria = Categoria.editar(nome_categoria, ativo, id_categoria);
        return await this._repository.update(id_categoria, categoria);
    }
}