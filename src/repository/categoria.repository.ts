import { db } from "../database/connection.database";
import { ICategoria } from "../models/categoria.model";
import { ResultSetHeader } from "mysql2";

export class CategoriaRepository {
    async findAll(): Promise<ICategoria[]> {
        const [rows] = await db.execute<ICategoria[]>(
            'SELECT * FROM Categoria'
        );
        return rows;
    }

    async listarCategoriasAtivas(): Promise<ICategoria[]> {
        const [rows] = await db.execute<ICategoria[]>(

            'SELECT * FROM categoria WHERE ativo = 1'
        );
        return rows;
    }
    async selectByNome(nome_categoria: string): Promise<ICategoria[]> {
        const sql = 'SELECT * FROM Categoria WHERE nome_categoria=?;';
        const values = [nome_categoria];
        const [rows] = await db.execute<ICategoria[]>(sql, values);
        return rows
    }

    async selectById(id_categoria: number): Promise<ICategoria[]> {
        const sql = 'SELECT * FROM Categoria WHERE id_categoria=?;';
        const values = [id_categoria];
        const [rows] = await db.execute<ICategoria[]>(sql, values);
        return rows
    }

    async create(dados: Omit<ICategoria, 'id_categoria'>): Promise<ResultSetHeader> {
        const sql = 'INSERT INTO Categoria (nome_categoria, ativo) VALUES(?, ?);';
        const values = [dados._nomeCategoria, dados._ativo];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async update(id_categoria: number, dados: Omit<ICategoria, 'id_categoria'>): Promise<ResultSetHeader> {
        const sql = 'UPDATE Categoria SET nome_categoria=?, ativo=? WHERE id_categoria=?;';
        const values = [dados._nomeCategoria, dados._ativo, id_categoria];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
}

