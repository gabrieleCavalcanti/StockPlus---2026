import { Router } from "express";
import categoriaRoutes from "./categoria.routes";
import clienteRoutes from "./cliente.routes";
import estoqueRoutes from "./estoque.routes";
import fornecedorRoutes from "./fornecedor.routes";
import funcionarioRoutes from "./funcionario.routes";
import itensPedidoRoutes from "./itensPedido.routes";
import movimentacaoRoutes from "./movimentacao.routes";
import pedidoRoutes from "./pedido.routes";
import pessoaRoutes from "./pessoa.routes";
import produtoRoutes from "./produtos.routes";


const router = Router();

router.use('/', categoriaRoutes);
router.use('/', clienteRoutes);
router.use('/', estoqueRoutes);
router.use('/', fornecedorRoutes);
router.use('/', funcionarioRoutes);
router.use('/', itensPedidoRoutes);
router.use('/', movimentacaoRoutes);
router.use('/', pedidoRoutes);
router.use('/', pessoaRoutes);
router.use('/', produtoRoutes);


export default router;