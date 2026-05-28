import { db } from "../database/connection.database";
import { Pedido } from "../models/pedido.model";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ItensPedido } from "../models/itensPedido.model";

export class PedidoRepository {
  async findAll(): Promise<RowDataPacket[]> {
    const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM pedidos;");
    return rows;
  }
  async selectById(id_pedido: number): Promise<RowDataPacket[]> {
    const sql = "SELECT * FROM pedidos WHERE id_pedido = ?;";
    const values = [id_pedido];
    const [rows] = await db.execute<RowDataPacket[]>(sql, values);
    return rows;
  }
  async selectByCliente(
    id_cliente_fornecedor: number,
  ): Promise<RowDataPacket[]> {
    const sql = "SELECT * FROM pedidos WHERE id_cliente_fornecedor = ?;";
    const values = [id_cliente_fornecedor];
    const [rows] = await db.execute<RowDataPacket[]>(sql, values);
    return rows;
  }

  async create(
    dados: Omit<Pedido, "id_pedido">,
    dadosItens: Omit<ItensPedido, "id_itens_pedido">,
  ): Promise<DadosRetornoPedido> {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const sql =
        "INSERT INTO pedidos (tipo, id_cliente_fornecedor, id_funcionario) VALUES (?,?,?);";
      const values = [
        dados.Tipo,
        dados.IdClienteFornecedor,
        dados.IdFuncionario,
      ];

      const [rows] = await conn.execute<ResultSetHeader>(sql, values);

      console.log(
        "TESTEEEE: ",
        dadosItens.Quantidade,
        dadosItens.Status,
        rows.insertId,
        dadosItens.IdProduto,
      );

      const sqlItens =
        "INSERT INTO itenspedido (quantidade, status, id_pedido, id_produto) VALUES (?,?,?,?);";
      const valuesItens = [
        dadosItens.Quantidade,
        "CONCLUIDO",
        rows.insertId,
        dadosItens.IdProduto,
      ];
      const [rowsItens] = await conn.execute<ResultSetHeader>(
        sqlItens,
        valuesItens,
      );

      const sqlMov =
        "INSERT INTO movimentacoes (quantidade, status, id_itens_pedido) VALUES (?,?,?);";
      const valuesMov = [
        dadosItens.Quantidade,
        "CONCLUIDO",
        rowsItens.insertId,
      ];
      const [rowsMov] = await conn.execute<ResultSetHeader>(sqlMov, valuesMov);

      const sqlEstoque =
        dados.Tipo.toUpperCase() == "COMPRA"
          ? "UPDATE estoque SET quantidade = quantidade + ? WHERE id_produto=? "
          : "UPDATE estoque SET quantidade = quantidade - ? WHERE id_produto=? ";
      const valuesEstoque = [
        dadosItens.Quantidade,
         dadosItens.IdProduto,
      ];
      const [rowsEstoque] = await conn.execute<ResultSetHeader>(
        sqlEstoque,
        valuesEstoque,
      );
      await conn.commit();
      return { rows, rowsItens, rowsMov, rowsEstoque };
    } catch (error: unknown) {
      await conn.rollback();
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      throw new Error(message);
    } finally {
      conn.release();
    }
  }

  async update(
    id_pedido: number,
    dados: Omit<Pedido, "id_pedido">,
  ): Promise<ResultSetHeader> {
    const sql =
      "UPDATE pedidos SET tipo = ?, id_cliente_fornecedor=?, id_funcionario =? WHERE id_pedido=?;";
    const values = [
      dados.Tipo,
      dados.IdClienteFornecedor,
      dados.IdFuncionario,
      id_pedido,
    ];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
}

interface DadosRetornoPedido {
  rows: ResultSetHeader;
  rowsItens: ResultSetHeader;
  rowsMov: ResultSetHeader;
  rowsEstoque: ResultSetHeader;
}
// Executando uma trigger: trg_atualiza_valor_pedido_after_update