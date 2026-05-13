import { db } from "../database/connection.database";
import { IFuncionario } from "../models/funcionario.model";
import { ResultSetHeader } from "mysql2";

export class FuncionarioRepository {
    async findAll(): Promise<IFuncionario[]> {
        const [rows] = await db.execute<IFuncionario[]>(
            'SELECT * FROM funcionarios;'
        );
        return rows;
    }

    async findId(id_funcionarios: number): Promise<IFuncionario[]> {
        const sql = 'SELECT * FROM funcionarios WHERE id_funcionarios=?;';
        const values = [id_funcionarios];
        const [rows] = await db.execute<IFuncionario[]>(sql, values);
        return rows;
    }

    // async findNome(nome_pessoa: string): Promise<ICliente[]> {
    //     const sql = 'SELECT * FROM clientes WHERE =?;';
    //     const values = [nome_pessoa];
    //     const [rows] = await db.execute<ICliente[]>(sql, values);
    //     return rows;
    // }

    async create(dados: Omit<IFuncionario, 'id'>): Promise<ResultSetHeader> {
        const sql = 'INSERT INTO funcionarios (cargo, data_admissao, id_pessoa) VALUES (?,?);';
        const values = [dados._cargo,dados._data_admissao, dados._id_pessoa];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async update(id_fornecedor: number, dados: Omit<IFuncionario, 'id'>): Promise<ResultSetHeader> {
        const sql = 'UPDATE funcionarios SET cargo=?, data_admissao=? WHERE id_funcionarios=?;';
        const values = [dados._cargo, dados._data_admissao, id_fornecedor];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
}