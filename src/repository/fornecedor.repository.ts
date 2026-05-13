import { db } from "../database/connection.database";
import { IFornecedor } from "../models/fornecedor.model";
import { ResultSetHeader } from "mysql2";

export class FornecedorRepository {
    async findAll(): Promise<IFornecedor[]> {
        const [rows] = await db.execute<IFornecedor[]>(
            'SELECT * FROM fornecedor;'
        );
        return rows;
    }

    async findId(id_fornecedor: number): Promise<IFornecedor[]> {
        const sql = 'SELECT * FROM fornecedor WHERE id_fornecedor=?;';
        const values = [id_fornecedor];
        const [rows] = await db.execute<IFornecedor[]>(sql, values);
        return rows;
    }

    // async findNome(nome_pessoa: string): Promise<ICliente[]> {
    //     const sql = 'SELECT * FROM clientes WHERE =?;';
    //     const values = [nome_pessoa];
    //     const [rows] = await db.execute<ICliente[]>(sql, values);
    //     return rows;
    // }

    async create(dados: Omit<IFornecedor, 'id'>): Promise<ResultSetHeader> {
        const sql = 'INSERT INTO fornecedor (cnpj, id_pessoa) VALUES (?,?);';
        const values = [dados._cnpj, dados._id_pessoa];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async update(id_fornecedor: number, dados: Omit<IFornecedor, 'id'>): Promise<ResultSetHeader> {
        const sql = 'UPDATE fornecedor SET cnpj=? WHERE id_fornecedor=?;';
        const values = [dados._cnpj, id_fornecedor];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
}