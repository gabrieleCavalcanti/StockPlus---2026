import { Router } from "express";
import { TelefoneController } from "../controllers/telefone.controller";

const telefoneRoutes = Router();
const telefoneController = new TelefoneController

telefoneRoutes.get('/telefones', telefoneController.selecionaTodos);
telefoneRoutes.post('/telefones', telefoneController.criar);
telefoneRoutes.patch('/telefones', telefoneController.editar);

export default telefoneRoutes;

