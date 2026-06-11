import { db } from "../database/connection.database";
import { ResultSetHeader,RowDataPacket } from "mysql2";
import { IItensPedido } from "../models/itensPedido.model";
import { TipoMovimentacao } from "../config/enum/tipoMovimentacao.enum";
import { StatusItensPedido } from "../config/enum/statusItensPedido.enum";

export class ItensPedidoRepository {
  
  async findById(id_itens_pedido: number): Promise<RowDataPacket[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT *
       FROM itensPedido`,
      [id_itens_pedido],
    );
    return rows;
  }

  async update(
    id_itens_pedido: number,
    dados: IItensPedido,
  ): Promise<ResultSetHeader> {
    const sql =
      "UPDATE itensPedido SET quantidade = ?, status = ?, id_pedido = ?, id_produto = ? WHERE id_itens_pedido=?;";
    const values = [
      dados.quantidade,
      dados.status,
      dados.id_pedido,
      dados.id_produto,
      id_itens_pedido,
    ];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
  
  async devolverItem(id_itens_pedido: number): Promise<void> {
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      // 1️⃣ Buscar item
      const [rows] = await conn.execute<RowDataPacket[]>(
        `SELECT quantidade, id_produto, status
         FROM itensPedido
         WHERE id_itens_pedido = ?`,
        [id_itens_pedido],
      );

      if (rows.length === 0) {
        throw new Error("Item não encontrado");
      }

      const item = rows[0];

      if (item.status === StatusItensPedido.DEVOLVIDO) {
        throw new Error("Item já devolvido");
      }

      // 2️⃣ Atualiza status do item
      await conn.execute(
        `UPDATE itensPedido
         SET status = ?
         WHERE id_itens_pedido = ?`,
        [StatusItensPedido.DEVOLVIDO, id_itens_pedido],
      );

      // 3️⃣ Cria movimentação de ENTRADA
      await conn.execute(
        `INSERT INTO movimentacoes (quantidade, status, id_itens_pedido)
         VALUES (?,?,?)`,
        [item.quantidade, TipoMovimentacao.ENTRADA, id_itens_pedido],
      );

      // 4️⃣ Atualiza estoque (quantidade volta)
      await conn.execute(
        `UPDATE estoque
         SET quantidade = quantidade + ?
         WHERE id_produto = ?`,
        [item.quantidade, item.id_produto],
      );

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}
