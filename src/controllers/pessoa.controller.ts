import { Request, Response } from "express";
import { PessoaService } from "../services/pessoa.service";

export class PessoaController {
    constructor(private _service = new PessoaService()) { }

    selecionaTodos = async (req: Request, res: Response) => {
        try {
            const id = req.query.id;
            const nome = req.query.nome;
            const tipo = req.query.tipo;

            let paramDup = null;

            if ((id && nome) || (id && tipo) || (nome && tipo)) {
                paramDup = 'Mais de um parâmetro informado, prioridade: ID > NOME > TIPO';
            }

            // ID
            if (id) {

                const id_pessoa = Number(id);
                const pessoaId = await this._service.selecionaId(id_pessoa);

                if (pessoaId.length === 0) {
                    return res.status(404).json({ message: 'Pessoa não localizada' });
                }
                return res.status(200).json({ pessoaId, paramDuplicado: paramDup });
            }

            // NOME
            if (nome) {

                const nome_pessoa = String(nome);
                const pessoaNome = await this._service.selecionaNome(nome_pessoa);

                if (pessoaNome.length === 0) {
                    return res.status(404).json({ message: 'Pessoa não localizada' });
                }

                return res.status(200).json({ pessoaNome, paramDuplicado: paramDup });
            }

            // TIPO
            if (tipo) {

                const tipoPessoa = String(tipo).toUpperCase();

                if (tipoPessoa === 'CLIENTE') {
                    const clientes = await this._service.selecionaTodosClientes();
                    return res.status(200).json({ clientes });
                }

                if (tipoPessoa === 'FUNCIONARIO') {

                    const funcionarios = await this._service.selecionaTodosFuncionarios();

                    return res.status(200).json({ funcionarios });
                }

                if (tipoPessoa === 'FORNECEDOR') {

                    const fornecedores = await this._service.selecionaTodosFornecedores();

                    return res.status(200).json({ fornecedores });
                }

                return res.status(400).json({ message: 'Tipo inválido' });
            }

            // TODOS
            const pessoas = await this._service.selecionaTodos();

            return res.status(200).json({ pessoas });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
        }
    }

    criar = async (req: Request, res: Response) => {

        try {

            const { nome_pessoa, email, tipo, ...infoExtra } = req.body;


            if (!nome_pessoa || nome_pessoa.trim() === '') {
                return res.status(400).json({ message: "Nome é obrigatório" });
            }

            if (!email || email.trim() === '') {
                return res.status(400).json({ message: "Email é obrigatório" });
            }

            if (!tipo || tipo.trim() === '') {
                return res.status(400).json({ message: "Tipo é obrigatório" });
            }


            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Email inválido" });
            }

            const tiposValidos = [
                "CLIENTE",
                "FUNCIONARIO",
                "FORNECEDOR"
            ];

            if (
                !tiposValidos.includes(tipo.toUpperCase())
            ) {
                return res.status(400).json({ message: "Tipo inválido" });
            }

            switch (tipo.toUpperCase()) {

                case "CLIENTE":

                    if (
                        !infoExtra.cpf ||
                        infoExtra.cpf.trim() === ''
                    ) {
                        return res.status(400).json({ message: "CPF é obrigatório" });
                    }

                    // CPF somente números
                    const cpfRegex = /^\d{11}$/;

                    if (!cpfRegex.test(infoExtra.cpf)) {
                        return res.status(400).json({ message: "CPF deve conter 11 números" });
                    }

                    break;


                case "FUNCIONARIO":

                    if (
                        !infoExtra.cargo ||
                        infoExtra.cargo.trim() === ''
                    ) {
                        return res.status(400).json({ message: "Cargo é obrigatório" });
                    }

                    if (!infoExtra.data_admissao) {
                        return res.status(400).json({ message: "Data de admissão é obrigatória" });
                    }

                    break;


                case "FORNECEDOR":

                    if (
                        !infoExtra.cnpj ||
                        infoExtra.cnpj.trim() === ''
                    ) {
                        return res.status(400).json({ message: "CNPJ é obrigatório" });
                    }

                    // CNPJ somente números
                    const cnpjRegex = /^\d{14}$/;

                    if (!cnpjRegex.test(infoExtra.cnpj)) {
                        return res.status(400).json({ message: "CNPJ deve conter 14 números" });
                    }

                    break;
            }

            // CRIAÇÃO

            const novo = await this._service.criar(nome_pessoa, email, tipo, infoExtra);

            return res.status(201).json({
                message: "Pessoa criada com sucesso",
                data: novo
            });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
        }

    }
    editar = async (req: Request, res: Response) => {

        try {

            const id = req.query.id;
            const { nome_pessoa, email, ...infoExtra } = req.body;

            console.log(id, nome_pessoa, email, infoExtra);

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ message: "Id inválido" });
            }

            if (!nome_pessoa || nome_pessoa.trim() === '') {
                return res.status(400).json({ message: "Nome é obrigatório" });
            }

            if (!email || email.trim() === '') {
                return res.status(400).json({ message: "Email é obrigatório" });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Email inválido" });
            }

            const tipo = (await this._service.selecionaTipo(Number(id)))[0].tipo;

            console.log(tipo);

            // CLIENTE
            if (tipo === 'CLIENTE') {

                if (!infoExtra.cpf || infoExtra.cpf.trim() === '') {
                    return res.status(400).json({ message: "CPF Obrigatorio" });
                }

                const cpf = infoExtra.cpf.replace(/\D/g, '');

                if (cpf.length !== 11) {
                    return res.status(400).json({ message: "CPF deve conter 11 dígitos" });
                }

                if (/^(\d)\1+$/.test(cpf)) {
                    return res.status(400).json({ message: "CPF inválido" });
                }
            }

            // FORNECEDOR
            if (tipo === 'FORNECEDOR') {

                if (!infoExtra.cnpj || infoExtra.cnpj.trim() === '') {
                    return res.status(400).json({ message: "CNPJ Obrigatorio" });
                }

                const cnpj = infoExtra.cnpj.replace(/\D/g, '');

                if (cnpj.length !== 14) {
                    return res.status(400).json({ message: "CNPJ deve conter 14 dígitos" });
                }

                if (/^(\d)\1+$/.test(cnpj)) {
                    return res.status(400).json({ message: "CNPJ inválido" });
                }
            }

            // FUNCIONARIO
            if (tipo === 'FUNCIONARIO') {

                if (!infoExtra.cargo || infoExtra.cargo.trim() === '') {
                    return res.status(400).json({ message: "Cargo é obrigatório" });
                }

                if (
                    !infoExtra.data_admissao ||
                    isNaN(Date.parse(infoExtra.data_admissao))
                ) {
                    return res.status(400).json({ message: "Data de admissão inválida" });
                }
            }

            await this._service.editar(Number(id), nome_pessoa, email, infoExtra);

            return res.status(200).json({ message: "Pessoa atualizada com sucesso" });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
        }
    }

}
/**** inserir todossss */