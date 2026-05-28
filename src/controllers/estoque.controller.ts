import { Request, Response } from "express";
import { EstoqueService } from "../services/estoque.service";

export class EstoqueController {
    constructor(private _service = new EstoqueService()) { }

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

    selecionaById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.query.id);
            const estoque = await this._service.selecionaById(id);
            if (!estoque) return res.status(404).json({ message: "estoque não encontrado" });
            res.status(200).json({ estoque });
        } catch (error: unknown) {
            if (error instanceof Error) return res.status(500).json({ errorMessage: error.message });
        }
    }

    selecionaByMin = async (req: Request, res: Response) => {
        try {
            const resultado = await this._service.selecionaByMin();
            return res.status(200).json(resultado);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ errorMessage: error.message });
            }
            return res.status(500).json({ errorMessage: "Erro interno no servidor." });
        }
    }
}