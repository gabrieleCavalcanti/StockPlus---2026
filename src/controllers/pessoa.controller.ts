import { Request, Response } from "express";
import { PessoaService } from "../services/pessoa.service";

export class PessoaController {
    constructor(private _service = new PessoaService()) { }

    selecionaTodos = async (req: Request, res: Response) => {
        try {
            const id = req.query.id
            const nome = req.query.nome;
            let paramDup = null;

            if (id && nome) {
                paramDup = 'Na Inserção de ID e Nome, a consulta é realizada pelo ID';
            }

            if (id) {
                const id_pessoa = Number(id);
                const pessoaId = await this._service.selecionaId(id_pessoa);
                if (pessoaId.length === 0) {
                    return res.status(200).json({ message: 'Pessoa não localizada' });
                }
                return res.status(200).json({ pessoaId, paramDuplicado: paramDup });
            }
            if (nome) {
                const nome_pessoa = String(nome);
                const pessoaNome = await this._service.selecionaNome(nome_pessoa);
                if (pessoaNome.length === 0) {
                    return res.status(200).json({ message: 'Pessoa não localizada' });
                }
                return res.status(200).json({ pessoaNome });
            }

            const pessoas = await this._service.selecionaTodos();
            res.status(200).json({ pessoas });

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

            const dados = req.body;

            console.log(dados);

            const novo = await this._service.criar(dados);

            return res.status(201).json({message: "Pessoa criada com sucesso", data: novo});
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
            const id = Number(req.query.id)
            const { nome, email, tipo } = req.body;

            // if (!nome || !isNaN(nome)) {
            //     return res.status(200).json({ message: 'Valor invalido!' })
            // }

            console.log({ nome, email, tipo, id });
            const alterado = await this._service.editar(id, nome, email, tipo);
            res.status(200).json({ alterado });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
        }
    }
}