import { db } from "../database/connection.database";
import { Pedido } from "../models/pedido.model";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ItensPedido } from "../models/itensPedido.model";

export class PedidoRepository {
  async findAll(): Promise<RowDataPacket[]> {
    const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM pedidos;");
    return rows;
  }

  async findAllComItens(): Promise<RowDataPacket[]> {
    const sql = `
    SELECT 
      p.id_pedido,
      p.tipo,
      p.valor_total,
      cli.nome_pessoa AS nome_cliente_fornecedor,
      func.nome_pessoa AS nome_funcionario,
      ip.id_itens_pedido,
      ip.quantidade,
      ip.status,
      pr.nome_produto,
      pr.valor_produto
    FROM Pedidos p
    INNER JOIN pessoas cli ON cli.id_pessoa = p.id_cliente_fornecedor
    INNER JOIN pessoas func ON func.id_pessoa = p.id_funcionario
    INNER JOIN itensPedido ip ON ip.id_pedido = p.id_pedido
    INNER JOIN produtos pr ON pr.id_produto = ip.id_produto
    ORDER BY p.id_pedido;
  `;
    const [rows] = await db.execute<RowDataPacket[]>(sql);
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

  async selectTipoPessoa(
    id_cliente_fornecedor: number,
  ): Promise<RowDataPacket[]> {
    const sql = "SELECT tipo FROM pessoas WHERE id_pessoa = ?;";
    const values = [id_cliente_fornecedor];
    const [rows] = await db.execute<RowDataPacket[]>(sql, values);
    return rows;
  }

  async selectByIdProduct(id_produto: number): Promise<RowDataPacket[]> {
    const sql = "SELECT * FROM produtos WHERE id_produto = ?;";
    const values = [id_produto];
    const [rows] = await db.execute<RowDataPacket[]>(sql, values);
    return rows;
  }

  async selectEstoqueByProduto(idProduto: number): Promise<RowDataPacket[]> {
    const sql = "SELECT quantidade FROM estoque WHERE id_produto = ?;";
    const [rows] = await db.execute<RowDataPacket[]>(sql, [idProduto]);
    return rows;
  }

  // múltiplos itens
  async create(
    dados: Omit<Pedido, "id_pedido">,
    itens: { id_produto: number; quantidade: number }[],
  ): Promise<any> {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Cria o pedido
      const sql =
        "INSERT INTO pedidos (tipo, id_cliente_fornecedor, id_funcionario) VALUES (?,?,?);";
      const [rows] = await conn.execute<ResultSetHeader>(sql, [
        dados.Tipo,
        dados.IdClienteFornecedor,
        dados.IdFuncionario,
      ]);

      // Loop nos itens
      for (const item of itens) {
        // Busca o valor do produto
        const [produtoRows] = await conn.execute<RowDataPacket[]>(
          "SELECT valor_produto FROM produtos WHERE id_produto = ?",
          [item.id_produto],
        );
        const produto = produtoRows[0];

        const [rowsItens] = await conn.execute<ResultSetHeader>(
          "INSERT INTO itensPedido (quantidade, status, id_pedido, id_produto, valor_unitario) VALUES (?,?,?,?,?);",
          [
            item.quantidade,
            "CONCLUIDO",
            rows.insertId,
            item.id_produto,
            produto.valor_produto,
          ],
        );

        // Insere movimentação
        await conn.execute(
          "INSERT INTO movimentacoes (quantidade, status, id_itens_pedido) VALUES (?,?,?);",
          [item.quantidade, "CONCLUIDO", rowsItens.insertId],
        );

        // Atualiza estoque
        const sqlEstoque =
          dados.Tipo.toUpperCase() === "COMPRA"
            ? "UPDATE estoque SET quantidade = quantidade + ? WHERE id_produto = ?"
            : "UPDATE estoque SET quantidade = quantidade - ? WHERE id_produto = ?";

        await conn.execute(sqlEstoque, [item.quantidade, item.id_produto]);
      }

      await conn.commit();
      return { insertId: rows.insertId, totalItens: itens.length };
    } catch (error) {
      await conn.rollback();
      throw new Error(
        error instanceof Error ? error.message : "Erro desconhecido",
      );
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

// Executando uma trigger: trg_atualiza_valor_pedido_after_update
