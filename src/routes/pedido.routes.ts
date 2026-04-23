import { Router } from "express";
import { PedidoController } from "../controllers/pedido.controller";

const pedidoController = new PedidoController();
const pedidoRoutes = Router();

// pedidoRoutes.get('/pedidos', pedidoController.selecionarTodos);
pedidoRoutes.get('/pedidos', pedidoController.selecionarTodosFormatado);
// pedidoRoutes.get('/pedidos/:id', pedidoController.selecionarId);
pedidoRoutes.get('/pedido/:idFormatado', pedidoController.selecionarIdFormatado)
pedidoRoutes.post('/pedidos', pedidoController.criar);
pedidoRoutes.patch('/pedidos', pedidoController.editar);

export default pedidoRoutes;