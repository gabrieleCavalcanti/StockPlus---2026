import { Request, Response } from "express";
import { PedidoService } from "../services/pedido.service";

export class PedidoController {
  constructor(private _service = new PedidoService()) {}

  criar = async (req: Request, res: Response) => {
    try {
      const { tipo, idClienteFornecedor, idFuncionario,quantidade, id_produto } = req.body;
      req.body;
      const novo = await this._service.criarPedido(
        tipo,
        idClienteFornecedor,
        idFuncionario,
        quantidade, id_produto 
      );
      res.status(201).json({ novo });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocorreu um erro no servidor",
          errorMessage: error.message,
        });
      }
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: "Erro desconhecido",
      });
    }
  };

  editar = async (req: Request, res: Response) => {
    try {
      const { tipo, idClienteFornecedor, idFuncionario } = req.body;
      const idPedido = Number(req.query.idFormatado);      
      const alterado = await this._service.editarPedido(
        tipo,
        idClienteFornecedor,
        idFuncionario,
        idPedido
      );
      res.status(200).json({ alterado });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocorreu um erro no servidor",
          errorMessage: error.message,
        });
      }
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: "Erro desconhecido",
      });
    }
  };

  /**
   * Retorna todas os pedidos usando o método mostrarDados() do Model
   */
  selecionarTodosFormatado = async (req: Request, res: Response) => {
    try {
      // Chama o novo método do Service
      const pedidosFormatados = await this._service.selecionarTodosFormatado();

      // Retorna para o Insomnia
      res.status(200).json({
        message: "Lista de pedido formatada",
        quantidade: pedidosFormatados.length,
        dados: pedidosFormatados,
      });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocorreu um erro no servidor",
          errorMessage: error.message,
        });
      }
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: "Erro desconhecido",
      });
    }
  };

  selecionarIdFormatado = async (req: Request, res: Response) => {
    try {
      const idFormatado = Number(req.params.idFormatado);
      console.log(idFormatado);

      // Chama o novo método do Service
      const pedidoFormatados =
        await this._service.selecionarIdFormatado(idFormatado);

      // Se não encontrou
      if (!pedidoFormatados) {
        return res.status(404).json({
          message: "Pedidos não encontrados",
        });
      }

      // Retorna para o Insomnia
      res.status(200).json({
        message: "Pedidos encontrados",
        dados: pedidoFormatados,
      });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocorreu um erro no servidor",
          errorMessage: error.message,
        });
      }
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: "Erro desconhecido",
      });
    }
  };
  selecionarPorClienteFornecedor = async (req: Request, res: Response) => {
  try {
    const idClienteFornecedor = Number(req.params.id_cliente_fornecedor);

    if (isNaN(idClienteFornecedor)) {
      return res.status(400).json({
        message: 'ID cliente/fornecedor inválido',
      });
    }

    const pedidosClientes =
      await this._service.selecionarPorClienteFornecedor(idClienteFornecedor);

    if (!pedidosClientes) {
      return res.status(404).json({
        message: 'Pedidos não encontrados',
      });
    }

    return res.status(200).json({
      message: 'Pedidos encontrados',
      dados: pedidosClientes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Erro interno do servidor',
    });
  }
};
}
