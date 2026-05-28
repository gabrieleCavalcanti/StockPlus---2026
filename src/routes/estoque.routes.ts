import { Router } from "express";
import { EstoqueController } from "../controllers/estoque.controller";

const estoqueController = new EstoqueController();
const estoqueRoutes = Router();

estoqueRoutes.get('/estoque', estoqueController.selecionarTodos);
estoqueRoutes.get('/estoque/id', estoqueController.selecionaById);
estoqueRoutes.get('/estoque/baixo', estoqueController.selecionaByMin);

export default estoqueRoutes;



