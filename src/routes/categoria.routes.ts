import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.controller";

const categoriaController = new CategoriaController();
const categoriaRoutes = Router();

categoriaRoutes.get('/categorias', categoriaController.buscarCategoria)
categoriaRoutes.get('/categoriasAtiva', categoriaController.listarAtivas)
categoriaRoutes.get('/categorias/:nome_categoria', categoriaController.buscarPorNome)
categoriaRoutes.post('/categorias', categoriaController.criar)
categoriaRoutes.patch('/categorias/:id_categoria', categoriaController.editar)


export default categoriaRoutes;
