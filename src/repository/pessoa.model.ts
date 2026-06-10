import { db } from "../database/connection.database";
import { IPessoa, Pessoa } from "../models/pessoa.model";
import { ILogin } from "../models/LoginModel";
import { ResultSetHeader, PoolConnection } from "mysql2/promise";

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

    async selectTipo(id_pessoa: number): Promise<IPessoa[]> {
        const sql = `SELECT tipo FROM pessoas WHERE id_pessoa = ?;`;
        const values = [id_pessoa];
        const [rows] = await db.execute<IPessoa[]>(sql, values);
        return rows;
    }

    async create(dados: Pessoa, infoExtra: any): Promise<void> {
        const connection: PoolConnection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const sqlPessoa = `INSERT INTO pessoas (nome_pessoa, email, tipo) VALUES (?, ?, ?);`;

            if (!dados.Tipo) {
                throw new Error("Tipo é obrigatório");
            }

            const valuesPessoa = [dados.Nome, dados.Email, dados.Tipo];
            const [resultPessoa] = await connection.execute<ResultSetHeader>(sqlPessoa, valuesPessoa);

            const tiposValidos = [
                'CLIENTE',
                'FORNECEDOR',
                'FUNCIONARIO'
            ];

            if (!tiposValidos.includes(dados.Tipo)) {
                throw new Error('Tipo inválido');
            }

            if (dados.Tipo === 'CLIENTE') {
                const id_pessoa = resultPessoa.insertId;
                const sqlCliente = `INSERT INTO clientes (cpf, id_pessoa)VALUES (?, ?);`;

                await connection.execute<ResultSetHeader>(sqlCliente, [infoExtra.cpf, id_pessoa]);
            }

            if (dados.Tipo === 'FORNECEDOR') {
                const id_pessoa = resultPessoa.insertId;
                const sqlFornecedor = `INSERT INTO fornecedor (cnpj, id_pessoa)VALUES (?, ?); `;

                await connection.execute<ResultSetHeader>(
                    sqlFornecedor,
                    [infoExtra.cnpj, id_pessoa]
                );
            }

            if (dados.Tipo === 'FUNCIONARIO') {
                const id_pessoa = resultPessoa.insertId;

                const sqlFuncionario = `
                    INSERT INTO funcionarios (cargo, data_admissao, id_pessoa)
                    VALUES (?, ?, ?);
                    `;

                const [resultFuncionario] = await connection.execute<ResultSetHeader>(
                    sqlFuncionario,
                    [infoExtra.cargo, infoExtra.data_admissao, id_pessoa]
                );

                const id_func = resultFuncionario.insertId;

                const sqlLogin = `
                    INSERT INTO login (username, password_hash, id_func)
                    VALUES (?, ?, ?);
                `;

                await connection.execute<ResultSetHeader>(
                    sqlLogin,
                    [
                        infoExtra.username,
                        infoExtra.password_hash,
                        id_func
                    ]
                );
                }

            await connection.commit();

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    }

    async update(dados: Pessoa, infoExtra: any): Promise<void> {

        const connection: PoolConnection = await db.getConnection();

        try {

            await connection.beginTransaction();

            if (!dados.Id) {
                throw new Error("Id é obrigatório");
            }

            // busca o tipo da pessoa
            const sqlBusca = `SELECT tipo FROM pessoas WHERE id_pessoa = ?;`;

            const [rows]: any = await connection.execute(sqlBusca, [dados.Id]);

            if (rows.length === 0) {
                throw new Error("Pessoa não encontrada");
            }

            const tipo = rows[0].tipo;

            // atualiza tabela pessoas
            const sqlPessoa = `
            UPDATE pessoas 
            SET nome_pessoa = ?, email = ?
            WHERE id_pessoa = ?;
            `;

            await connection.execute<ResultSetHeader>(
                sqlPessoa,
                [dados.Nome, dados.Email, dados.Id]
            );

            // CLIENTE
            if (tipo === 'CLIENTE') {
                const sqlCliente = `UPDATE clientes SET cpf = ? WHERE id_pessoa = ?; `;

                await connection.execute<ResultSetHeader>(
                    sqlCliente,
                    [infoExtra.cpf, dados.Id]
                );
            }

            // FORNECEDOR
            if (tipo === 'FORNECEDOR') {
                const sqlFornecedor = `UPDATE fornecedor SET cnpj = ? WHERE id_pessoa = ?;`;

                await connection.execute<ResultSetHeader>(
                    sqlFornecedor,
                    [infoExtra.cnpj, dados.Id]
                );
            }

            // FUNCIONARIO
            if (tipo === 'FUNCIONARIO') {

                const sqlFuncionario = ` UPDATE funcionarios SET cargo = ?, data_admissao = ? WHERE id_pessoa = ?;`;

                await connection.execute<ResultSetHeader>(
                    sqlFuncionario,
                    [infoExtra.cargo, infoExtra.data_admissao, dados.Id]
                );
            }

            await connection.commit();

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    }

    async findClientes(): Promise<IPessoa[]> {
        const [rows] = await db.execute<IPessoa[]>(
            `SELECT 
                pessoas.id_pessoa,
                pessoas.nome_pessoa,
                pessoas.email,
                pessoas.tipo,
                clientes.cpf
            FROM pessoas
            INNER JOIN clientes 
            ON pessoas.id_pessoa = clientes.id_pessoa
            WHERE pessoas.tipo = "CLIENTE"
            ORDER BY pessoas.nome_pessoa ASC;`
        );
        return rows;
    }

    async findFuncinarios(): Promise<IPessoa[]> {
        const [rows] = await db.execute<IPessoa[]>(
            `SELECT 
                pessoas.id_pessoa,
                pessoas.nome_pessoa,
                pessoas.email,
                pessoas.tipo,
                funcionarios.cargo,
                funcionarios.data_admissao
            FROM pessoas
            INNER JOIN funcionarios 
            ON pessoas.id_pessoa = funcionarios.id_pessoa
            WHERE pessoas.tipo = "FUNCIONARIO"
            ORDER BY pessoas.nome_pessoa ASC;`
        );
        return rows;
    }

    async findFornecedores(): Promise<IPessoa[]> {
        const [rows] = await db.execute<IPessoa[]>(
            `SELECT 
                pessoas.id_pessoa,
                pessoas.nome_pessoa,
                pessoas.email,
                pessoas.tipo,
                fornecedor.cnpj
            FROM pessoas
            INNER JOIN fornecedor 
            ON pessoas.id_pessoa = fornecedor.id_pessoa
            WHERE pessoas.tipo = "FORNECEDOR"
            ORDER BY pessoas.nome_pessoa ASC;`
        );
        return rows;
    }
}