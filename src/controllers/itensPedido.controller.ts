import { Request, Response } from "express";
import { ItensPedidosService } from "../services/itensPedidos.service";

export class ItensPedidoController {
  constructor(private _service = new ItensPedidosService()) {}


  editar = async (req: Request, res: Response) => {
    try {
      const { quantidade, status, id_pedido, id_produto } = req.body;
      const idItensPedido = Number(req.query.idItensPedido);
    //   const alterado = await this._service.editarItensPedido(
    //     quantidade,
    //     status,
    //     id_pedido,
    //     id_produto,
    //     idItensPedido,
    //   );
     // res.status(200).json({ alterado });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res
          .status(500)
          .json({
            message: "Ocorreu um erro no servidor",
            errorMessage: error.message,
          });
      }
      res
        .status(500)
        .json({
          message: "Ocorreu um erro no servidor",
          errorMessage: "Erro desconhecido",
        });
    }
  };

  //       /**
  //    * Retorna todas os pedidos usando o método mostrarDados() do Model
  //    */
  //   selecionarTodosFormatado = async (req: Request, res: Response) => {
  //     try {
  //       // Chama o novo método do Service
  //       const pedidosFormatados = await this._service.selecionarTodosFormatado();

  //       // Retorna para o Insomnia
  //       res.status(200).json({
  //         message: "Lista de pedido formatada",
  //         quantidade: pedidosFormatados.length,
  //         dados: pedidosFormatados
  //       });

  //     } catch (error: unknown) {
  //       console.error(error);
  //       if (error instanceof Error) {
  //         return res.status(500).json({
  //           message: 'Ocorreu um erro no servidor',
  //           errorMessage: error.message
  //         });
  //       }
  //       res.status(500).json({
  //         message: 'Ocorreu um erro no servidor',
  //         errorMessage: 'Erro desconhecido'
  //       });
  //     }
  //   }
  //     /**
  //    * Retorna uma categoria usando o método mostrarDados() do Model
  //    */
  //   selecionarIdFormatado = async (req: Request, res: Response) => {
  //     try {
  //       const id_pedido = Number(req.params.id_pedido);

  //       // Chama o novo método do Service
  //       const pedidoFormatados = await this._service.selecionarIdFormatado(id_pedido);

  //       // Se não encontrou
  //       if (!pedidoFormatados) {
  //         return res.status(404).json({
  //           message: 'Pedidos não encontrados'
  //         });
  //       }

  //       // Retorna para o Insomnia
  //       res.status(200).json({
  //         message: "Pedidos encontrados",
  //         dados: pedidoFormatados
  //       });

  //     } catch (error: unknown) {
  //       console.error(error);
  //       if (error instanceof Error) {
  //         return res.status(500).json({
  //           message: 'Ocorreu um erro no servidor',
  //           errorMessage: error.message
  //         });
  //       }
  //       res.status(500).json({
  //         message: 'Ocorreu um erro no servidor',
  //         errorMessage: 'Erro desconhecido'
  //       });
  //     }
  //   }
}
