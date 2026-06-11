import { db } from "../database/connection.database";
import { IProduto } from "../models/produto.model";
import { ResultSetHeader, PoolConnection } from "mysql2/promise";

export class ProdutoRepository {

    async findAll(): Promise<IProduto[]> {
        const [rows] = await db.execute<IProduto[]>(
            `SELECT 
                p.id_produto,
                p.nome_produto,
                p.valor_produto,
                p.vinculo_imagem,
                p.id_categoria,
                p.data_vencimento,
                e.quantidade,
                e.quantidade_minima
            FROM produtos p
            INNER JOIN estoque e 
                ON e.id_produto = p.id_produto;`
        );
        return rows;
    }

    async selectByValidade(data_vencimento: string): Promise<IProduto[]> {
        const sql = 'SELECT * FROM produtos WHERE data_vencimento=?;';
        const values = [data_vencimento];
        const [rows] = await db.execute<IProduto[]>(sql, values);
        return rows;
    }

    async verificarValidades(): Promise<IProduto[]> {
        const [rows] = await db.execute<IProduto[]>(
            `SELECT *
            FROM produtos
            WHERE
                data_vencimento < CURDATE()
                OR data_vencimento <= DATE_ADD(CURDATE(), INTERVAL 31 DAY)
            ORDER BY data_vencimento ASC;`
        );
        return rows;
    }

    async verificarAlertas(): Promise<IProduto[]> {
        const [rows] = await db.execute<IProduto[]>(
            `SELECT *
            FROM produtos
            WHERE data_vencimento >= DATE_ADD(CURDATE(), INTERVAL 45 DAY)
            AND data_vencimento <= DATE_ADD(CURDATE(), INTERVAL 90 DAY)
            ORDER BY data_vencimento ASC;`
        );

        return rows;
    }

    async selectByNome(nome_produto: string): Promise<IProduto[]> {
        const sql = 'SELECT * FROM produtos WHERE nome_produto=?;';
        const values = [nome_produto];
        const [rows] = await db.execute<IProduto[]>(sql, values);
        return rows;
    }

    async selectById(id_produto: number): Promise<IProduto[]> {
        const sql = 'SELECT * FROM produtos WHERE id_produto=?;';
        const values = [id_produto];
        const [rows] = await db.execute<IProduto[]>(sql, values);
        return rows;
    }

    async create(
        dados: {
            nome_produto: string;
            valor_produto: number;
            vinculo_imagem: string;
            id_categoria: number;
            data_vencimento: Date;
            quantidade_minima: number;
        }
    ): Promise<ResultSetHeader> {

        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();
            const [result]: any = await conn.execute(
                `INSERT INTO produtos
                (nome_produto, valor_produto, vinculo_imagem, id_categoria, data_vencimento)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    dados.nome_produto,
                    dados.valor_produto,
                    dados.vinculo_imagem,
                    dados.id_categoria,
                    dados.data_vencimento
                ]
            );

            const idProduto = result.insertId;
            await conn.execute(
                `INSERT INTO estoque
                (id_produto, quantidade, quantidade_minima)
                VALUES (?, ?, ?)`,
                [
                    idProduto,
                    0,
                    dados.quantidade_minima
                ]
            );

            await conn.commit();
            return result;

        } catch (error) {
            await conn.rollback();
            throw error;

        } finally {
            conn.release();
        }
    }
    async update(dados: any): Promise<ResultSetHeader> {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();

            const [result]: any = await conn.execute(
                `UPDATE produtos 
             SET nome_produto=?, valor_produto=?, vinculo_imagem=?, id_categoria=?, data_vencimento=? 
             WHERE id_produto=?`,
                [
                    dados.nome_produto,
                    dados.valor_produto,
                    dados.vinculo_imagem,
                    dados.id_categoria,
                    dados.data_vencimento,
                    dados.id_produto
                ]
            );
            const quantidadeMinima = Number(dados.quantidade_minima);

            if (!isNaN(quantidadeMinima)) {
                await conn.execute(
                    `UPDATE estoque 
                        SET quantidade_minima=? 
                        WHERE id_produto=?`,
                    [
                        quantidadeMinima,
                        Number(dados.id_produto)
                    ]
                );
            }


            await conn.commit();
            return result;

        } catch (error) {
            await conn.rollback();
            throw error;

        } finally {
            conn.release();
        }
    }

    async delete(id_produto: number): Promise<ResultSetHeader> {
        const sql = 'DELETE FROM produtos WHERE id_produto=?;';
        const values = [id_produto];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
}