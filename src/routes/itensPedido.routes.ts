import { Router } from "express";
import { ItensPedidoController } from "../controllers/itensPedido.controller";

const itensPedidoController = new ItensPedidoController();
const itensPedidoRoutes =Router();

itensPedidoRoutes.patch(
  "/itensPedido/devolucao/:id_itens_pedido",
  itensPedidoController.devolver,
);


export default itensPedidoRoutes;