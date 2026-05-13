import { Router } from "express";
import { ClienteController } from "../controllers/cliente.controller";

const clienteRoutes = Router();
const clienteController = new ClienteController();

clienteRoutes.get('/clientes', clienteController.selecionaTodos);
clienteRoutes.patch('/clientes', clienteController.editar);

export default clienteRoutes;

