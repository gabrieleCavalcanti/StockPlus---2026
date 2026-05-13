import { PessoaRepository } from "../repository/pessoa.model";
import { Pessoa } from "../models/pessoa.model";

import { ClienteRepository } from "../repository/cliente.repository";
import { FuncionarioRepository } from "../repository/funcinario.repository";
import { FornecedorRepository } from "../repository/fornecedor.repository";

import { Cliente } from "../models/cliente.model";
import { Funcionario } from "../models/funcionario.model";
import { Fornecedor } from "../models/fornecedor.model";

export class PessoaService {
    constructor(
        private _repository = new PessoaRepository(),
        private _clienteRepository = new ClienteRepository(),
        private _funcionarioRepository = new FuncionarioRepository(),
        private _fornecedorRepository = new FornecedorRepository()
    ) { }

    async selecionaTodos() {
        return await this._repository.findAll();
    }

    async selecionaId(id_pessoa: number) {
        return await this._repository.findId(id_pessoa);
    }

    async selecionaNome(nome_pessoa: string) {
        return await this._repository.findNome(nome_pessoa);
    }

    // async criar(nome_pessoa: string, email: string, tipo: string) {
    //     const pessoa = Pessoa.criar(nome_pessoa, email, tipo);
    //     return await this._repository.create(pessoa);
    // }

    async criar(dados: any) {

        // cria pessoa
        const pessoa = Pessoa.criar(
            dados.nome,
            dados.email,
            dados.tipo
        );

        const pessoaCriada = await this._repository.create(pessoa);

        const id_pessoa = pessoaCriada.insertId;


        switch (dados.tipo.toLowerCase()) {

            case "cliente":

                const cliente = Cliente.criar(
                    dados.cpf,
                    id_pessoa
                );

                await this._clienteRepository.create(cliente);

                break;


            case "funcionario":

                const funcionario = Funcionario.criar(
                    dados.cargo,
                    dados.data_admissao,
                    id_pessoa
                );

                await this._funcionarioRepository.create(funcionario);

                break;


            case "fornecedor":

                const fornecedor = Fornecedor.criar(
                    dados.cnpj,
                    id_pessoa
                );

                await this._fornecedorRepository.create(fornecedor);

                break;


            default:
                throw new Error("Tipo inválido");

        }


        return {
            message: "Pessoa criada com sucesso",
            id_pessoa
        };

    }


    async editar(id: number, nome_pessoa: string, email: string, tipo: string) {
        const pessoa = Pessoa.editar(nome_pessoa, email, tipo, id);
        return await this._repository.update(id, pessoa)
    }
}