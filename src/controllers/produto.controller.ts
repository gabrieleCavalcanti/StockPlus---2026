import { Request, Response } from 'express'
import { ProdutoService } from "../services/produto.service";
import { CategoriaService } from "../services/categoria.service";

export class ProdutoController {
    constructor(private _service = new ProdutoService(), private _serviceCategoria = new CategoriaService()) { }

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

            const produtos = resultadoValidades.map(produto => {
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);

                const vencimento = new Date(produto.data_vencimento!);
                vencimento.setHours(0, 0, 0, 0);

                const diferencaDias = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
                );
                let mensagem_validade = '';
                if (diferencaDias < 0) {
                    mensagem_validade = 'Produto vencido';
                } else if (diferencaDias <= 31) {
                    mensagem_validade = 'Produto próximo ao vencimento';
                }

                return { ...produto, mensagem_validade };
            });
            return res.status(200).json({ message: 'Verificação de validade', produtos });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' })
        }
    }
    verificarAlertas = async (req: Request, res: Response) => {
        try {
            const resultado = await this._service.verificarAlertas();

            const produtos = resultado.map(produto => {
                const dias = Math.floor(
                    (new Date(produto.data_vencimento!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                );
                return { ...produto, message: `Faltam ${dias} dias para vencer` };
            });

            return res.status(200).json({ message: 'Alertas de validade entre 45 a 90 dias para vencer', produtos });

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
            const {
                nome_produto,
                valor_produto,
                vinculo_imagem,
                id_categoria,
                data_vencimento,
                quantidade_minima
            } = req.body;

            if (
                !nome_produto ||
                !id_categoria ||
                isNaN(Number(id_categoria)) ||
                !data_vencimento ||
                !valor_produto ||
                isNaN(Number(valor_produto)) ||
                quantidade_minima === undefined ||
                isNaN(Number(quantidade_minima))
            ) {
                return res.status(400).json({ message: 'Verifique os valores e tente novamente.' });
            }

            const resultadoSelecionaId = await this._serviceCategoria.selecionaId(Number(id_categoria));
            if (!resultadoSelecionaId || resultadoSelecionaId.length === 0) {
                return res.status(404).json({ message: 'Não há dados com o id categoria pesquisado' });
            }

            if (!data_vencimento || typeof data_vencimento !== 'string') {
                return res.status(400).json({ message: 'Data de vencimento obrigatória' });
            }

            const regex = /^\d{4}-\d{2}-\d{2}$/;
            if (!regex.test(data_vencimento)) {
                return res.status(400).json({ message: 'Data inválida. Use o formato YYYY-MM-DD' });
            }

            const vencimento = new Date(data_vencimento);
            if (isNaN(vencimento.getTime())) {
                return res.status(400).json({ message: 'Data de vencimento inválida' });
            }

            const resultado = await this._serviceCategoria.selecionaId(id_categoria);
            const categoria = resultado[0];
            if (!categoria.ativo) {
                return res.status(400).json({ message: 'Categoria inativa' });
            }

            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            vencimento.setHours(0, 0, 0, 0);

            if (vencimento < hoje) {
                return res.status(400).json({ message: 'Não é possível cadastrar um produto vencido' });
            }

            if (!req.file) {
                return res.status(400).json({ message: 'Imagem é obrigatória' });
            }

            const imagem = req.file.filename;

            const novoRegistro = await this._service.criar(
                nome_produto,
                Number(valor_produto),
                imagem,
                Number(id_categoria),
                vencimento,
                Number(quantidade_minima)
            );


            return res.status(201).json({
                message: 'Produto criado com sucesso!',
                novoRegistro
            });

        } catch (error: unknown) {
            console.error(error);

            if (error instanceof Error) {
                return res.status(500).json({
                    message: 'Ocorreu um erro no servidor',
                    errorMessage: error.message
                });
            }

            return res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: 'Erro desconhecido'
            });
        }
    }

    editar = async (req: Request, res: Response) => {
        try {
            const id_produto = Number(req.params.id_produto);
            const {
                nome_produto,
                valor_produto,
                vinculo_imagem,
                id_categoria,
                data_vencimento,
                quantidade_minima
            } = req.body;

            if (isNaN(id_produto) || !id_produto) {
                return res.status(400).json({ message: 'ID inválido' });
            }

            const resultadoSelecionaId = await this._service.selecionaId(id_produto);
            if (!resultadoSelecionaId || resultadoSelecionaId.length === 0) {
                return res.status(404).json({ message: 'Não há dados com o id pesquisado' });
            }

            const pedidoAtual = resultadoSelecionaId[0];

            if (!nome_produto && !id_categoria && !data_vencimento && !req.file && !valor_produto && quantidade_minima === undefined) {
                return res.status(400).json({ message: 'Nenhum dado novo inserido' });
            }

            const resultado = await this._serviceCategoria.selecionaId(id_categoria);
            const categoria = resultado[0];
            if (!categoria.ativo) {
                return res.status(400).json({ message: 'Categoria inativa' });
            }

            let novaDataVencimento: Date = pedidoAtual.data_vencimento ?? new Date();

            if (data_vencimento) {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(data_vencimento)) {
                    return res.status(400).json({ message: 'Data inválida. Use YYYY-MM-DD' });
                }

                const vencimento = new Date(data_vencimento + "T00:00:00");

                if (isNaN(vencimento.getTime())) {
                    return res.status(400).json({ message: 'Data de vencimento inválida' });
                }

                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                vencimento.setHours(0, 0, 0, 0);

                if (vencimento < hoje) {
                    return res.status(400).json({ message: 'Não é possível alterar para uma data vencida' });
                }

                novaDataVencimento = vencimento;
            }

            const imagem = req.file?.filename;

            const novoNomeProduto = nome_produto ?? pedidoAtual.nome_produto;
            const novoValorProduto = valor_produto ?? pedidoAtual.valor_produto;
            const novaImagem = imagem ?? vinculo_imagem ?? pedidoAtual.vinculo_imagem;
            const novoIdCategoria = id_categoria ?? pedidoAtual.id_categoria;
            const novaQuantidadeMinima =
                quantidade_minima !== undefined && quantidade_minima !== null
                    ? Number(quantidade_minima)
                    : pedidoAtual.quantidade_minima;

            const resultUpdateProdutos = await this._service.editar(
                novoNomeProduto,
                novoValorProduto,
                novaImagem,
                Number(novoIdCategoria),
                novaDataVencimento,
                id_produto,
                Number(novaQuantidadeMinima)
            );

            if (resultUpdateProdutos.affectedRows === 1 && resultUpdateProdutos.changedRows === 0) {
                return res.status(200).json({
                    message: 'Nenhuma alteração foi realizada',
                    resultUpdateProdutos
                });
            }

            return res.status(200).json({
                message: 'Produto alterado com sucesso',
                resultUpdateProdutos
            });

        } catch (error: unknown) {
            console.error(error);

            if (error instanceof Error) {
                return res.status(500).json({
                    message: 'Ocorreu um erro no servidor',
                    errorMessage: error.message
                });
            }

            return res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: 'Erro desconhecido'
            });
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
                return res.status(400).json({
                    message: 'Não é possível excluir o produto', errorMessage: 'Este produto possui registros vinculados no sistema'
                });
            }
            if (err instanceof Error) {
                return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: err.message });
            }
            return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' });
        }
    }
} 