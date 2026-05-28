import { db } from "../database/connection.database";
import { IMovimentacao } from "../models/movimentacao.model";

export class MovimentacaoRepository {
    async findAll(): Promise<IMovimentacao[]> {
        const [rows] = await db.execute<IMovimentacao[]>('select * from movimentacoes;');
        return rows;
    }


async findBystatus(status: string): Promise<IMovimentacao[]> {
    const [rows] = await db.execute<IMovimentacao[]>('select * from movimentacoes where status = ?;', [status]);
    return rows;
}

};
