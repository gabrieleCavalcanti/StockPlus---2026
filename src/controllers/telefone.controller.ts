import { Request, Response } from "express";
import { TelefoneService } from "../services/telefone.service";

export class TelefoneController {
    constructor(private _service = new TelefoneService()) { }

    selecionaTodos = async (req: Request, res: Response) => {
        try {

            const id_pessoa = Number(req.query.id_pessoa);
            const id_telefone = Number(req.query.id_telefone);

            // BUSCA POR ID_TELEFONE
            if (id_telefone && !isNaN(id_telefone)) {

                const telefone = await this._service.selecionaId(id_telefone);

                if (telefone.length === 0) {
                    return res.status(404).json({message: 'Telefone não encontrado'});
                }

                return res.status(200).json({telefone});
            }

            // BUSCA POR ID_PESSOA
            if (id_pessoa && !isNaN(id_pessoa)) {

                const telefones = await this._service.selecionaTodos(id_pessoa);

                if (telefones.length === 0) {
                    return res.status(404).json({message: 'Nenhum telefone encontrado'});
                }

                return res.status(200).json({telefones});
            }

            return res.status(400).json({message: 'Informe id_pessoa ou id_telefone'});
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

            const { telefone, id_pessoa } = req.body;

            const novo = await this._service.criar(telefone, id_pessoa);

            return res.status(201).json({ message: "Telefone criado com sucesso", data: novo });


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
            const { telefone } = req.body;

            // if (!nome || !isNaN(nome)) {
            //     return res.status(200).json({ message: 'Valor invalido!' })
            // }

            console.log({ telefone, id });
            const alterado = await this._service.editar(id, telefone);
            res.status(200).json({ message: 'Telefone Editado Com Sucesso', alterado });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro Desconhecido' });
        }
    }
}