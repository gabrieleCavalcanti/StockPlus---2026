import { Request, Response } from "express";
import { MovimentacaoService } from "../services/movimentacao.service";
import { TipoMovimentacao } from "../models/movimentacao.model";

export class MovimentacaoController {
    constructor(private _service = new MovimentacaoService()) { }
    private formatarDadosEstoque = (estoque: any[]) => {
        return estoque.map(item => {
            const tipoTratado = item.tipo_pedido ? String(item.tipo_pedido).toLowerCase().trim() : "";
            let tipoFormatado = item.tipo_pedido;
            if (tipoTratado === "venda") tipoFormatado = "cliente";
            if (tipoTratado === "compra") tipoFormatado = "fornecedor";
            const valorTotal = (item.quantidade || 0) * (item.valor_produto || 0);
            const valorTotalFormatado = valorTotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
            return {
                ...item,
                tipo_pedido: tipoFormatado,
                valor_total_movimentacao: valorTotal,
                valor_total_formatado: valorTotalFormatado 
            };
        });
    }

    selecionarTodos = async (req: Request, res: Response) => {
        try {
            const dadosBrutos = await this._service.selecionarTodos();
            const estoque = this.formatarDadosEstoque(dadosBrutos);
            return res.status(200).json({ estoque });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
            }
            return res.status(500).json({ message: 'Erro desconhecido' });
        }
    }

    selecionaByStatus = async (req: Request, res: Response) => {
        try {
            if (!req.query.status) {
                return res.status(400).json({ message: "O parâmetro 'status' é obrigatório." });
            }
            const statusInformado = String(req.query.status).toLowerCase().trim();
            if (statusInformado !== 'entrada' && statusInformado !== 'saida') {
                return res.status(400).json({ 
                    message: "Status inválido. Use 'entrada' ou 'saida'." 
                });
            }
            const status = statusInformado as TipoMovimentacao;
            const dadosBrutos = await this._service.selecionaByStatus(status);
            if (!dadosBrutos || dadosBrutos.length === 0) {
                return res.status(404).json({ message: "Nenhum estoque encontrado com esse status." });
            }
            const estoque = this.formatarDadosEstoque(dadosBrutos);
            return res.status(200).json({ estoque });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
            }
            return res.status(500).json({ message: 'Erro desconhecido' });
        }
    }
}
