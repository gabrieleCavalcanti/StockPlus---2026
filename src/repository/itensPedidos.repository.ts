import { db } from "../database/connection.database";
import { ResultSetHeader } from "mysql2";
import { IItensPedido } from "../models/itensPedido.model";

export class ItensPedidoRepository {
  
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
}
