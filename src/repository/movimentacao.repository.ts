import { db } from "../database/connection.database";
import { IMovimentacao } from "../models/movimentacao.model";
import { ResultSetHeader } from "mysql2";

export class MovimentacaoRepository {
    async findAll(): Promise<IMovimentacao[]> {
        const [rows] = await db.execute<IMovimentacao[]>('select * from movimentacoes;');
        return rows;
    }


async findBystatus(status: string): Promise<IMovimentacao[]> {
    const [rows] = await db.execute<IMovimentacao[]>('select * from movimentacoes where status = ?;', [status]);
    return rows;
}

async create(
    dados: IMovimentacao,
  ): Promise<ResultSetHeader> {
    const sql = `
      INSERT INTO movimentacoes (quantidade, status, id_itens_pedido)
      VALUES (?,?,?);
    `;

    const values = [
      dados.quantidade,
      dados.status,
      dados.id_itens_pedido,
    ];

    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
};
