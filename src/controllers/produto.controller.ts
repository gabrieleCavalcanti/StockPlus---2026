import { Request, Response } from 'express'
import { ProdutoService } from "../services/produto.service";

export class ProdutoController {
    constructor(private _service = new ProdutoService()) { }

    buscarProduto = async (req: Request, res: Response) => {
        try {
            const id_produto = Number(req.query.id_produto);
            if (id_produto) {
                const resultadoSelecionaId = await this._service.selecionaId(id_produto)
                if (isNaN(id_produto) || !id_produto || id_produto < 1) {
                    return res.status(400).json({ message: 'ID inválido' });
                }
                if (resultadoSelecionaId.length === 0) {
                    return res.status(200).json({ message: 'Não há dados com o id pesquisado' })
                }
                return res.status(200).json({ message: "Produtos: ", resultadoSelecionaId })
            }
            const resultadoSelecionaTodos = await this._service.selecionaTodos();
            res.status(200).json({ resultadoSelecionaTodos })
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' })
        }
    }

    verificarValidades = async (req: Request, res: Response) => {
        try {
            const resultadoValidades = await this._service.verificarValidades();
            res.status(200).json({ message: 'Produtos próximo do vencimento(31 dias)', resultadoValidades })
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' })
        }
    }



    buscarPorValidade = async (req: Request, res: Response) => {
        try {
            const { data_vencimento } = req.query;
            if (!data_vencimento) {
                return res.status(400).json({ message: 'Data de vencimento é obrigatória' });
            }
            const data = String(data_vencimento);
            const resultadoSelecionaData = await this._service.selecionaValidade(data);

            if (resultadoSelecionaData.length === 0) {
                return res.status(200).json({ message: 'Não há dados com a data pesquisada' });
            }
            return res.status(200).json({ message: "Resultado filtrando por data", resultadoSelecionaData });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' })
        }
    }

    buscarPorNome = async (req: Request, res: Response) => {
        try {
            const nome_produto = String(req.query.nome_produto)

            if (nome_produto) {
                const resultadoSelecionaNome = await this._service.selecionaNome(nome_produto)
                if (resultadoSelecionaNome.length === 0) {
                    return res.status(200).json({ message: 'Não há dados com o nome pesquisado' })
                }
                return res.status(200).json({ message: 'Resultado filtrando por nome', resultadoSelecionaNome })
            }
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' })
        }
    }


    criar = async (req: Request, res: Response) => {
        try {
            const { nome_produto, valor_produto, vinculo_imagem, id_categoria, data_vencimento, } = req.body;

            if (!nome_produto || !id_categoria || isNaN(id_categoria) || !data_vencimento || !valor_produto || isNaN(valor_produto)) {
                return res.status(200).json({ message: 'Verifique os valores e tente novamente!' })
            }
            if (!req.file) {
                return res.status(400).json({ message: 'Imagem é obrigatória' });
            }
            const imagem = req.file?.filename;
            const novoRegistro = await this._service.criar(nome_produto, valor_produto, imagem ?? null, id_categoria, data_vencimento,);
            res.status(201).json({ message: 'Produto criado com sucesso!', novoRegistro })
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' })
        }
    }
    editar = async (req: Request, res: Response) => {
        try {
            const id_produto = Number(req.params.id_produto);
            const { nome_produto, valor_produto, vinculo_imagem, id_categoria, data_vencimento } = req.body;

            if (isNaN(id_produto) || !id_produto) {
                return res.status(400).json({ message: 'ID inválido' });
            }
            const resultadoSelecionaId = await this._service.selecionaId(id_produto);
            if (!resultadoSelecionaId || resultadoSelecionaId.length === 0) {
                return res.status(404).json({ message: 'Não há dados com o id pesquisado' });
            }

            if (!nome_produto && !id_categoria && !data_vencimento && !req.file && !valor_produto) {
                return res.status(400).json({ message: 'Nenhum dado novo inserido' });
            }


            const pedidoAtual = resultadoSelecionaId[0];
            const imagem = req.file?.filename;

            const novoNomeProduto = nome_produto ?? pedidoAtual.nome_produto;
            const novoValorProduto = valor_produto ?? pedidoAtual.valor_produto;
            const novaImagem = imagem ?? vinculo_imagem ?? pedidoAtual.vinculo_imagem;
            const novoIdCategoria = id_categoria ?? pedidoAtual.id_categoria;
            const novaDataVencimento = data_vencimento ?? pedidoAtual.data_vencimento;

            const resultUpdateProdutos = await this._service.editar(
                novoNomeProduto,
                novoValorProduto,
                novaImagem,
                novoIdCategoria,
                novaDataVencimento,
                id_produto,
            );

            if (resultUpdateProdutos.affectedRows === 1 && resultUpdateProdutos.changedRows === 0) {
                return res.status(200).json({ message: 'Nenhuma alteração foi realizada' });
            }

            return res.status(200).json({ message: 'Pedido alterado com sucesso', resultUpdateProdutos });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' })
        }
    };
    deletar = async (req: Request, res: Response) => {
        try {
            const id_produto = Number(req.params.id_produto)
            if (isNaN(id_produto) || !id_produto || id_produto < 1) {
                return res.status(400).json({ message: 'ID inválido' });
            }
            const resultadoSelecionaId = await this._service.selecionaId(id_produto)
            if (resultadoSelecionaId.length === 0) {
                return res.status(200).json({ message: `Não há dados com o id pesquisado` });
            }
            const deletado = await this._service.deletar(id_produto);
            res.status(200).json({ message: 'Produto excluido com sucesso!', deletado });
        } catch (error: unknown) {
            console.error(error);
            const err = error as any;
            if (err?.code === 'ER_ROW_IS_REFERENCED') {
                return res.status(400).json({ message: 'Não é possível excluir o produto',  errorMessage: 'Este produto possui registros vinculados no sistema'
                });
            }
            if (err instanceof Error) {
                return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: err.message });
            }
            return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' });
        }
    }
} 