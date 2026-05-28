import { Request, Response } from "express";
import { MovimentacaoService } from "../services/movimentacao.service";

export class MovimentacaoController {
    constructor(private _service = new MovimentacaoService()) { }

    selecionarTodos = async (req: Request, res: Response) => {
        try {
            const estoque = await this._service.selecionarTodos();
            res.status(200).json({ estoque });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
            }
            res.status(500).json({ message: 'Erro desconhecido' });
        }
    }

    selecionaByStatus = async (req: Request, res: Response) => {
        try {
            const status = String(req.query.status);
            const estoque = await this._service.selecionaByStatus(status);
            if (!estoque) return res.status(404).json({ message: "estoque não encontrado" });
            res.status(200).json({ estoque });
        } catch (error: unknown) {
            if (error instanceof Error) return res.status(500).json({ errorMessage: error.message });
        }
    }

 


}