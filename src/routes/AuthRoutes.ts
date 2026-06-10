import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

const authController = new AuthController();
const authMiddleware = new AuthMiddleware();
const authRoutes =Router();

authRoutes.post('/login', authController.login);

authRoutes.get('/rotaProtegida', authMiddleware.authenticate, authController.rotaProtegida);



export default authRoutes;