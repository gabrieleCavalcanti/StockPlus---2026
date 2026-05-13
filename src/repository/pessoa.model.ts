import { db } from "../database/connection.database";
import { IPessoa } from "../models/pessoa.model";
import { ResultSetHeader } from "mysql2";

export class PessoaRepository {
    async findAll(): Promise<IPessoa[]> {
        const [rows] = await db.execute<IPessoa[]>(
            'SELECT * FROM pessoas;'
        );
        return rows;
    }

    async findId(id_pessoa: number): Promise<IPessoa[]> {
        const sql = 'SELECT * FROM pessoas WHERE id_pessoa=?;';
        const values = [id_pessoa];
        const [rows] = await db.execute<IPessoa[]>(sql, values);
        return rows;
    }

    async findNome(nome_pessoa: string): Promise<IPessoa[]> {
        const sql = 'SELECT * FROM pessoas WHERE nome_pessoa=?;';
        const values = [nome_pessoa];
        const [rows] = await db.execute<IPessoa[]>(sql, values);
        return rows;
    }

    // criação com 
    async create(dados: Omit<IPessoa, 'id'>): Promise<ResultSetHeader> {
        const sql = 'INSERT INTO pessoas (nome_pessoa, email, tipo) VALUES (?,?,?);';
        const values = [dados._nome_pessoa, dados._email, dados._tipo];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async update(id_pessoa: number, dados: Omit<IPessoa, 'id'>): Promise<ResultSetHeader> {
        const sql = 'UPDATE pessoas SET nome_pessoa=?, email=?, tipo=? WHERE id_pessoa=?;';
        const values = [dados._nome_pessoa, dados._email, dados._tipo, id_pessoa];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
}