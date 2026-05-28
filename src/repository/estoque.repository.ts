import { db } from "../database/connection.database";
import { IEstoque } from "../models/estoque.model";

export class EstoqueRepository {
    async findAll(): Promise<IEstoque[]> {
        const [rows] = await db.execute<IEstoque[]>('select * from estoque;');
        return rows;
    }

    async findById(id_produto: number): Promise<IEstoque[] | undefined> {
        const [rows] = await db.execute<IEstoque[]>('select * from estoque where id_produto = ?;', [id_produto]);
        return rows;
    }

async findByMin(): Promise<IEstoque[]> {
    const margemSeguranca = 12;
    const [rows] = await db.execute<IEstoque[]>( 'select * from estoque where quantidade <= (quantidade_minima + ?)', [margemSeguranca] );
    return rows;
}
};
