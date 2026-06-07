import { Request, Response } from "express";
import { PedidoService } from "../services/pedido.service";
import { Pessoa } from "../models/pessoa.model";
import { PessoaRepository } from "../repository/pessoa.model";

export class PedidoController {
  constructor(private _service = new PedidoService()) {}

  criar = async (req: Request, res: Response) => {
    try {
      const {
        tipo,
        idClienteFornecedor,
        idFuncionario,
        itens,
      } = req.body;
      req.body;

      // Campos obrigatórios: validação
      if (
        !tipo ||
        tipo.toString().trim() === "" ||
        idClienteFornecedor == null ||
        idClienteFornecedor == undefined ||
        idFuncionario == null ||
        idFuncionario == undefined ||
        !Array.isArray(itens) ||
        itens.length === 0
      ) {
        return res.status(400).json({
          error: "Erro: Os campos devem ser todos válidos e preenchidos.",
        });
      }

      // Transforma o valor digitado para letras maiusculas e verifica se é uma compra ou venda
      if (tipo.toUpperCase() != "COMPRA" && tipo.toUpperCase() != "VENDA") {
        return res.status(400).json({ erro: "Tipo de transação inválido" });
      }

      // Se é um id do cliente ou fornecedor
      const pessoa =
        await this._service.selecionarTipoPessoa(idClienteFornecedor);

      if (pessoa.length === 0) {
        return res.status(404).json({
          erro: "Pessoa não encontrada",
        });
      }

      const tipoPessoa = pessoa[0].tipo.toUpperCase();

      // Valida a relação Compra/Venda x Cliente/Fornecedor
      if (
        (tipo.toUpperCase() === "COMPRA" && tipoPessoa !== "FORNECEDOR") ||
        (tipo.toUpperCase() === "VENDA" && tipoPessoa !== "CLIENTE")
      ) {
        return res.status(400).json({
          erro:
            tipo.toUpperCase() === "COMPRA"
              ? "Uma compra deve estar vinculada a um fornecedor"
              : "Uma venda deve estar vinculada a um cliente",
        });
      }

      // Validação se o id funcionario é ou não um funcionário

      const funcionario =
        await this._service.selecionarTipoPessoa(idFuncionario);

      if (funcionario.length === 0) {
        return res.status(404).json({
          erro: "Funcionário não encontrado",
        });
      }

      const tipoFuncionario = funcionario[0].tipo.toUpperCase();

      if (tipoFuncionario !== "FUNCIONARIO") {
        return res.status(400).json({
          erro: "O ID informado não pertence a um funcionário",
        });
      }

      // Verifica se o produto existe

      // Validar se tem estoque de todos os itens antes de criar
      for (const item of itens) {
        const { id_produto, quantidade } = item;

        const produto = await this._service.selecionarProdutoPorId(id_produto);
        if (produto.length === 0) {
          return res
            .status(404)
            .json({ erro: `Produto ${id_produto} não encontrado` });
        }

        if (tipo.toUpperCase() === "VENDA") {
          const estoque =
            await this._service.selecionarEstoquePorProduto(id_produto);
          if (estoque.length === 0) {
            return res
              .status(404)
              .json({
                erro: `Estoque não encontrado para o produto ${id_produto}`,
              });
          }
          if (quantidade <= 0) {
            return res
              .status(400)
              .json({ erro: "A quantidade deve ser maior que zero" });
          }
          if (quantidade > estoque[0].quantidade) {
            return res
              .status(400)
              .json({
                erro: `Estoque insuficiente para produto ${id_produto}. Disponível: ${estoque[0].quantidade}`,
              });
          }
        }
      }

      const novo = await this._service.criarPedido(
        tipo,
        idClienteFornecedor,
        idFuncionario,
        itens,
      );
      res.status(201).json({ novo });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocorreu um erro no servidor",
          errorMessage: error.message,
        });
      }
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: "Erro desconhecido",
      });
    }
  };

  editar = async (req: Request, res: Response) => {
    try {
      const { tipo, idClienteFornecedor, idFuncionario } = req.body;
      const idPedido = Number(req.query.idFormatado);
      const alterado = await this._service.editarPedido(
        tipo,
        idClienteFornecedor,
        idFuncionario,
        idPedido,
      );
      res.status(200).json({ alterado });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocorreu um erro no servidor",
          errorMessage: error.message,
        });
      }
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: "Erro desconhecido",
      });
    }
  };

  /**
   * Retorna todas os pedidos usando o método mostrarDados() do Model
   */
  selecionarTodosFormatado = async (req: Request, res: Response) => {
    try {
      // Chama o novo método do Service
      const pedidosFormatados = await this._service.selecionarTodosFormatado();

      // Retorna para o Insomnia
      res.status(200).json({
        message: "Lista de pedido formatada",
        quantidade: pedidosFormatados.length,
        dados: pedidosFormatados,
      });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocorreu um erro no servidor",
          errorMessage: error.message,
        });
      }
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: "Erro desconhecido",
      });
    }
  };

  selecionarTodosComItens = async (req: Request, res: Response) => {
  try {
    const pedidos = await this._service.selecionarTodosComItens();

    res.status(200).json({
      message: "Lista de pedidos com itens",
      quantidade: pedidos.length,
      dados: pedidos,
    });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
    res.status(500).json({
      message: "Ocorreu um erro no servidor",
      errorMessage: "Erro desconhecido",
    });
  }
};
  selecionarIdFormatado = async (req: Request, res: Response) => {
    try {
      const idFormatado = Number(req.params.idFormatado);

      // Chama o novo método do Service
      const pedidoFormatados =
        await this._service.selecionarIdFormatado(idFormatado);

      // Se não encontrou
      if (!pedidoFormatados) {
        return res.status(404).json({
          message: "Pedidos não encontrados",
        });
      }

      // Retorna para o Insomnia
      res.status(200).json({
        message: "Pedidos encontrados",
        dados: pedidoFormatados,
      });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({
          message: "Ocorreu um erro no servidor",
          errorMessage: error.message,
        });
      }
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: "Erro desconhecido",
      });
    }
  };
  selecionarPorClienteFornecedor = async (req: Request, res: Response) => {
    try {
      const idClienteFornecedor = Number(req.params.id_cliente_fornecedor);

      if (isNaN(idClienteFornecedor)) {
        return res.status(400).json({
          message: "ID cliente/fornecedor inválido",
        });
      }

      const pedidosClientes =
        await this._service.selecionarTipoPessoa(idClienteFornecedor);

      if (!pedidosClientes) {
        return res.status(404).json({
          message: "Pedidos não encontrados",
        });
      }

      return res.status(200).json({
        message: "Pedidos encontrados",
        dados: pedidosClientes,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  };
}
