import { Router } from "express";
import { FornecedorController } from "../controllers/fornecedor.controller";

const fornecedorRoutes =Router();
const fornecedorController = new FornecedorController();

fornecedorRoutes.get('/fornecedores', fornecedorController.selecionaTodos);
fornecedorRoutes.patch('/fornecedores', fornecedorController.editar);

export default fornecedorRoutes;
