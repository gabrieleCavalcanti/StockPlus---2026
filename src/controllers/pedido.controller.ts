import { Request, Response } from "express";
import { PedidoService } from "../services/pedido.service";


export class PedidoController {
     constructor (private _service = new PedidoService()){}

    criar = async (req: Request, res:Response) => {
        try {
            const {tipo, statusPedido, id_cliente_fornecedor, id_funcionario } = req.body;
            const novo = await this._service.criarPedido(tipo, statusPedido, id_cliente_fornecedor, id_funcionario);
            res.status(201).json({novo})
        } catch (error: unknown) {
            console.error(error);
            if(error instanceof Error){
                return res.status(500).json({message: 'Ocorreu um erro no servidor', errorMessage: error.message});
            }
            res.status(500).json({message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido'});
        }
    }

    editar = async (req: Request, res:Response) => {
        try {
            const {tipo, statusPedido, id_funcionario} = req.body;
            const id_pedido = Number(req.query.id_pedido)
            const alterado = await this._service.editarPedido(tipo, statusPedido,id_funcionario, id_pedido);
            res.status(200).json({alterado})
        } catch (error: unknown) {
            console.error(error);
            if(error instanceof Error){
                return res.status(500).json({message: 'Ocorreu um erro no servidor', errorMessage: error.message});
            }
            res.status(500).json({message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido'});
        }
    }

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
        dados: pedidosFormatados
      });
      
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({ 
          message: 'Ocorreu um erro no servidor', 
          errorMessage: error.message 
        });
      }
      res.status(500).json({ 
        message: 'Ocorreu um erro no servidor', 
        errorMessage: 'Erro desconhecido' 
      });
    }
  }
    /**
   * Retorna uma categoria usando o método mostrarDados() do Model
   */
  selecionarIdFormatado = async (req: Request, res: Response) => {
    try {
      const id_pedido = Number(req.params.id_pedido);
      
      // Chama o novo método do Service
      const pedidoFormatados = await this._service.selecionarIdFormatado(id_pedido);
      
      // Se não encontrou
      if (!pedidoFormatados) {
        return res.status(404).json({ 
          message: 'Pedidos não encontrados' 
        });
      }
      
      // Retorna para o Insomnia
      res.status(200).json({
        message: "Pedidos encontrados",
        dados: pedidoFormatados
      });
      
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({ 
          message: 'Ocorreu um erro no servidor', 
          errorMessage: error.message 
        });
      }
      res.status(500).json({ 
        message: 'Ocorreu um erro no servidor', 
        errorMessage: 'Erro desconhecido' 
      });
    }
  }
}