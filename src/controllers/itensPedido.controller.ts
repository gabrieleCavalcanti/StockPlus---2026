import { Request, Response } from "express";
import { ItensPedidosService } from "../services/itensPedidos.service";

export class ItensPedidoController {
  constructor(private _service = new ItensPedidosService()) {}
  editar = async (req: Request, res: Response) => {
    try {
      const { quantidade, status, id_pedido, id_produto } = req.body;
      const idItensPedido = Number(req.query.idItensPedido);
      const alterado = await this._service.editarItensPedido(
        quantidade,
        status,
        id_pedido,
        id_produto,
        idItensPedido,
      );
     res.status(200).json({ alterado });
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
devolver = async (req: Request, res: Response) => {
  try {
    const id_itens_pedido = Number(req.params.id_itens_pedido);

    if (!id_itens_pedido) {
      return res
        .status(400)
        .json({ message: "id_itens_pedido é obrigatório" });
    }

    await this._service.devolverItem(id_itens_pedido);

    return res.status(200).json({
      message: "Item devolvido com sucesso",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
}
