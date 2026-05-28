import { db } from "../database/connection.database";
import { ITelefone } from "../models/telefone.model";
import { ResultSetHeader } from "mysql2";


export class TelefoneRepository {
    async findAllPessoa(id_pessoa: number): Promise<ITelefone[]> {
        const sql = 'SELECT * FROM telefones WHERE id_pessoa=?;';
        const values = [id_pessoa];
        const [rows] = await db.execute<ITelefone[]>(sql, values);
        return rows;
    }

    async findId(id_telefone: number): Promise<ITelefone[]> {
        const sql = 'SELECT * FROM telefones WHERE id_telefone=?;';
        const values = [id_telefone];
        const [rows] = await db.execute<ITelefone[]>(sql, values);
        return rows;
    }

    async create(dados: Omit<ITelefone, 'id'>): Promise<ResultSetHeader> {
        const sql = 'INSERT INTO telefones (telefone, id_pessoa) VALUES (?,?);';
        const values = [dados._telefone, dados._id_pessoa];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async update(id_telefone: number, dados: Omit<ITelefone, 'id'>): Promise<ResultSetHeader> {
        const sql = 'UPDATE telefones SET telefone=? WHERE id_telefone=?;';
        const values = [dados._telefone, id_telefone];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
}