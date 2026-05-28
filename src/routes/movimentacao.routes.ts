import { Router } from "express";
import { MovimentacaoController } from "../controllers/movimentacoes.controller";

const movimentacaoController = new MovimentacaoController();
const movimentacaoRoutes = Router();

movimentacaoRoutes.get('/movimentacao', movimentacaoController.selecionarTodos);
movimentacaoRoutes.get('/movimentacao/status', movimentacaoController.selecionaByStatus);

export default movimentacaoRoutes;



