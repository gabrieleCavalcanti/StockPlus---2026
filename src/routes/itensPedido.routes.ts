import { Router } from "express";
import { ItensPedidoController } from "../controllers/itensPedido.controller";

const itensPedidoController = new ItensPedidoController();
const itensPedidoRoutes =Router();

// itensPedidoRoutes.post('/itensPedido', itensPedidoController.criar);
itensPedidoRoutes.patch('/itensPedido', itensPedidoController.editar)

export default itensPedidoRoutes;