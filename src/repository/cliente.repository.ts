import { db } from "../database/connection.database";
import { ICliente } from "../models/cliente.model";
import { ResultSetHeader } from "mysql2";

export class ClienteRepository {
    async findAll(): Promise<ICliente[]> {
        const [rows] = await db.execute<ICliente[]>(
            'SELECT * FROM clientes;'
        );
        return rows;
    }

    async findId(id_cliente: number): Promise<ICliente[]> {
        const sql = 'SELECT * FROM clientes WHERE id_cliente=?;';
        const values = [id_cliente];
        const [rows] = await db.execute<ICliente[]>(sql, values);
        return rows;
    }

    // async findNome(nome_pessoa: string): Promise<ICliente[]> {
    //     const sql = 'SELECT * FROM clientes WHERE =?;';
    //     const values = [nome_pessoa];
    //     const [rows] = await db.execute<ICliente[]>(sql, values);
    //     return rows;
    // }

    async create(dados: Omit<ICliente, 'id'>): Promise<ResultSetHeader> {
        const sql = 'INSERT INTO clientes (cpf, id_pessoa) VALUES (?,?);';
        const values = [dados._cpf, dados._id_pessoa];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async update(id_cliente: number, dados: Omit<ICliente, 'id'>): Promise<ResultSetHeader> {
        const sql = 'UPDATE clientes SET cpf=? WHERE id_cliente=?;';
        const values = [dados._cpf, id_cliente];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
}