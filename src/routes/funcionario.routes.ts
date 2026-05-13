import { Router } from "express";
import { FuncionarioController } from "../controllers/funcionario.controller";

const funcionarioRoutes =Router();
const funcionarioController = new FuncionarioController();

funcionarioRoutes.get('/funcionarios', funcionarioController.selecionaTodos);
funcionarioRoutes.patch('/funcionarios', funcionarioController.editar);

export default funcionarioRoutes;
