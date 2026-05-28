import { db } from "../database/connection.database";
import { IProduto } from "../models/produto.model";
import { ResultSetHeader } from "mysql2";

export class ProdutoRepository {
    async findAll(): Promise<IProduto[]> {
        const [rows] = await db.execute<IProduto[]>(
            'SELECT * FROM Produtos'
        );
        return rows;
    }
    async selectByValidade(data_vencimento: string): Promise<IProduto[]> {
        const sql = 'SELECT * FROM Produtos WHERE data_vencimento=?;';
        const values = [data_vencimento];
        const [rows] = await db.execute<IProduto[]>(sql, values)
        return rows
    }

    async verificarValidades(): Promise<IProduto[]>{
        const [rows] = await db.execute<IProduto[]>(
            `SELECT * FROM 
                produtos
            WHERE 
                data_vencimento <= DATE_ADD(CURRENT_DATE(), INTERVAL 31 DAY)
                AND data_vencimento >= CURRENT_DATE()
            ORDER BY 
                data_vencimento ASC;
`
        )
        return rows;
    }

    async selectByNome(nome_produto: string): Promise<IProduto[]> {
        const sql = 'SELECT * FROM Produtos WHERE nome_produto=?;';
        const values = [nome_produto];
        const [rows] = await db.execute<IProduto[]>(sql, values);
        return rows
    }

    async selectById(id_produto: number): Promise<IProduto[]> {
        const sql = 'SELECT * FROM Produtos WHERE id_produto=?;';
        const values = [id_produto];
        const [rows] = await db.execute<IProduto[]>(sql, values);
        return rows
    }

    async create(dados: Omit<IProduto, 'id_produto'>): Promise<ResultSetHeader> {
        const sql = 'INSERT INTO Produtos (nome_produto, valor_produto, vinculo_imagem, id_categoria, data_vencimento) VALUES(?, ?, ?, ?, ?);';
        const values = [dados._nomeProduto, dados._valorProduto, dados._vinculoImagem, dados._idCategoria, dados._dataVencimento,];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async update(id_produto: number, dados: Omit<IProduto, 'id_produto'>): Promise<ResultSetHeader> {
        const sql = 'UPDATE Produtos SET nome_produto=?, valor_produto=?, vinculo_imagem=?, id_categoria=?, data_vencimento=? WHERE id_produto=?;';
        const values = [dados._nomeProduto, dados._valorProduto, dados._vinculoImagem, dados._idCategoria, dados._dataVencimento, id_produto];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async delete(id_produto: number): Promise<IProduto[]> {
        const sql = 'DELETE FROM produtos WHERE id_produto=?;';
        const values = [id_produto]
        const [rows] = await db.execute<IProduto[]>(sql, values)
        return rows;
    }
}

