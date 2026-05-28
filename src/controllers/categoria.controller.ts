import { Request, Response } from 'express'
import { CategoriaService } from "../services/categoria.service";

export class CategoriaController {
    constructor(private _service = new CategoriaService()) { }

    buscarCategoria = async (req: Request, res: Response) => {
        try {

            const idCategoria = Number(req.query.idCategoria);
            if (idCategoria) {
                const resultadoSelecionaId = await this._service.selecionaId(idCategoria)
                if (resultadoSelecionaId.length === 0) {
                    return res.status(200).json({ message: 'Não há dados com o id pesquisado' })
                }
                return res.status(200).json({ resultadoSelecionaId })
            }
            const resultadoSelecionaTodos = await this._service.selecionaTodos();
            res.status(200).json({ message: "Resultado categorias:", resultadoSelecionaTodos })
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
            const nome_categoria = String(req.params.nome_categoria)
            const resultadoSelecionaNome = await this._service.selecionaNome(nome_categoria)

            if (resultadoSelecionaNome.length === 0) {
                return res.status(200).json({ message: 'Não há dados com o nome pesquisado' })
            }
            return res.status(200).json({ message: "Resultado categorias buscada pelo nome:", resultadoSelecionaNome })
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
            const { nome_categoria, ativo } = req.body;
            if (!nome_categoria || !isNaN(nome_categoria)) {
                return res.status(200).json({ message: 'Verifique os dados e tente novamente' })
            }
            const novoRegistro = await this._service.criar(nome_categoria, ativo);
            res.status(201).json({ message: "Categoria criada com sucesso!", novoRegistro })
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
            const { nome_categoria, ativo } = req.body;
            const id_categoria = Number(req.params.id_categoria);
            if (!id_categoria) {
                return res.status(200).json({ message: 'Verifique os dados e tente novamente' })
            }
            const resultadoSelecionaId = await this._service.selecionaId(id_categoria);
            const categoriaAtual = resultadoSelecionaId[0];

            const novaDescricao = nome_categoria ?? categoriaAtual.nome_categoria;
            const novoAtivo = ativo ?? categoriaAtual.ativo;
            const resultUpdatePedidos = await this._service.editar(
                novaDescricao,
                novoAtivo,
                id_categoria
            );

            if (resultUpdatePedidos.affectedRows === 1 && resultUpdatePedidos.changedRows === 0) {
                return res.status(200).json({ message: 'Nenhuma alteração foi realizada' });
            }

            return res.status(200).json({ message: 'Categoria alterada com sucesso', resultUpdatePedidos });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' })
        }
    }

    listarAtivas = async (req: Request, res: Response) => {
        try {
            const categorias = await this._service.listarAtivas();
            return res.json({ message: "Resultado de categorias ativas:", categorias });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' })
        }

    }
} 