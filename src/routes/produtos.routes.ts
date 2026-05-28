import { Router } from "express";
import uploadImage from "../middleware/uploadImage.middleware";
import { ProdutoController } from "../controllers/produto.controller";

const produtoController = new ProdutoController();
const produtoRoutes = Router();

produtoRoutes.get('/produtos', produtoController.buscarProduto)
produtoRoutes.get('/produtosPorNome', produtoController.buscarPorNome)
produtoRoutes.get('/verificarValidades', produtoController.verificarValidades)
produtoRoutes.get('/produtosPorValidade', produtoController.buscarPorValidade)
produtoRoutes.post('/produtos', uploadImage, produtoController.criar)
produtoRoutes.patch('/produtos/:id_produto', uploadImage,produtoController.editar );
produtoRoutes.delete('/produtos/:id_produto', produtoController.deletar)

export default produtoRoutes;
