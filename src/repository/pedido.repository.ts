import { db } from "../database/connection.database";
import { Pedido } from "../models/pedido.model";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class PedidoRepository {
  async findAll(): Promise<RowDataPacket[]> {
    const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM pedido;");
    return rows;
  }
  async selectById(id_pedido: number): Promise<RowDataPacket[]> {
    const sql = "SELECT * FROM pedido WHERE id_pedido = ?;";
    const values = [id_pedido];
    const [rows] = await db.execute<RowDataPacket[]>(sql, values);
    return rows;
  }
  async selectByCliente(
    id_cliente_fornecedor: number,
  ): Promise<RowDataPacket[]> {
    const sql = "SELECT * FROM pedido WHERE id_cliente_fornecedor = ?;";
    const values = [id_cliente_fornecedor];
    const [rows] = await db.execute<RowDataPacket[]>(sql, values);
    return rows;
  }

  async create(
    dados: Omit<Pedido, "id_pedido">,
  ): Promise<ResultSetHeader> {
    const sql =
      "INSERT INTO pedido (tipo, statusPedido, id_cliente_fornecedor, id_funcionario) VALUES (?,?,?,?);";
    const values = [
      dados.Tipo,
      dados.StatusPedido,
      dados.IdClienteFornecedor,
      dados.IdFuncionario,
    ];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  async update(
    id_pedido: number,
    dados: Omit<Pedido, "id_pedido">,
  ): Promise<ResultSetHeader> {
    const sql =
      "UPDATE pedido SET tipo = ?, status_pedido = ? WHERE id_pedido=?;";
    const values = [dados.Tipo, dados.StatusPedido, id_pedido];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

}
