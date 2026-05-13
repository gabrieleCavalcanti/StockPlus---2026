import { Request, Response } from "express";
import { ClienteService } from "../services/cliente.service";

export class ClienteController {
    constructor(private _service = new ClienteService()) { }

    selecionaTodos = async (req: Request, res: Response) => {
        try {
            const id = req.query.id;

            if (id) {
                const id_pessoa = Number(id);
                const pessoaId = await this._service.selecionaId(id_pessoa);
                if (pessoaId.length === 0) {
                    return res.status(200).json({ message: 'Cliente não localizado' });
                }
                return res.status(200).json({ data: pessoaId });
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
    editar = async (req: Request, res: Response) => {
        try {
            const id = Number(req.query.id)
            const { cpf } = req.body;

            // if (!nome || !isNaN(nome)) {
            //     return res.status(200).json({ message: 'Valor invalido!' })
            // }

            console.log({ cpf, id});
            const alterado = await this._service.editar(id, cpf);
            res.status(200).json({ message: 'Cliente Editado Com Sucesso',alterado });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
        }
    }
}