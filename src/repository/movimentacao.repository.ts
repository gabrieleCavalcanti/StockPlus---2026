import { db } from "../database/connection.database";
import { IMovimentacao } from "../models/movimentacao.model";
import { ResultSetHeader } from "mysql2";

export class MovimentacaoRepository {

    async findAll(): Promise<IMovimentacao[]> {
        const query = `
            SELECT  
                m.id_movimentacao,
                m.status AS status_movimentacao,
                m.data_cadastro,
                ip.quantidade,
                ip.status AS status_item,
                ip.id_pedido,
                ip.id_produto,
                p.nome_produto,
                p.valor_produto,
                pes.nome_pessoa AS nome_cliente_fornecedor,
                ped.tipo AS tipo_pedido
            FROM movimentacoes m
            INNER JOIN itenspedido ip ON m.id_itens_pedido = ip.id_itens_pedido
            INNER JOIN produtos p ON ip.id_produto = p.id_produto
            INNER JOIN pedidos ped ON ip.id_pedido = ped.id_pedido
            INNER JOIN pessoas pes ON ped.id_cliente_fornecedor = pes.id_pessoa;
        `;

        const [rows] = await db.execute<IMovimentacao[]>(query);
        return rows;
    }

    async findBystatus(status: string): Promise<IMovimentacao[]> {
        const query = `
            SELECT  
                m.id_movimentacao,
                m.status AS status_movimentacao,
                m.data_cadastro,
                ip.quantidade,
                ip.status AS status_item,
                ip.id_pedido,
                ip.id_produto,
                p.nome_produto,
                p.valor_produto,
                pes.nome_pessoa AS nome_cliente_fornecedor,
                ped.tipo AS tipo_pedido
            FROM movimentacoes m
            INNER JOIN itenspedido ip ON m.id_itens_pedido = ip.id_itens_pedido
            INNER JOIN produtos p ON ip.id_produto = p.id_produto
            INNER JOIN pedidos ped ON ip.id_pedido = ped.id_pedido
            INNER JOIN pessoas pes ON ped.id_cliente_fornecedor = pes.id_pessoa
            WHERE m.status = ?;
        `;

        const [rows] = await db.execute<IMovimentacao[]>(query, [status]);
        return rows;
    }

    async create(dados: IMovimentacao): Promise<ResultSetHeader> {
        const sql = `
            INSERT INTO movimentacoes (quantidade, status, id_itens_pedido)
            VALUES (?, ?, ?);
        `;

        const values = [
            dados.quantidade,
            dados.status,
            dados.id_itens_pedido,
        ];

        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
}