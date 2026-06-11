import { RowDataPacket } from "mysql2";

export interface IProduto extends RowDataPacket {
    id_produto?: number;
    nome_produto?: string;
    vinculo_imagem?: string;
    id_categoria?: number;
    data_vencimento?: Date;
    valor_produto?: number;
}

export class Produto {
    private _idProduto?: number;
    private _nomeProduto: string = '';
    private _vinculoImagem: string = '';
    private _idCategoria: number = 0;
    private _dataVencimento: Date = new Date(0);
    private _valorProduto: number = 0

    constructor(_nomeProduto: string, _vinculoImagem: string, idCategoria: number, data_vencimento: Date, valorProduto: number, idProduto?: number) {
        this._nomeProduto = _nomeProduto;
        this._vinculoImagem = _vinculoImagem;
        this._idCategoria = idCategoria;
        this._dataVencimento = data_vencimento
        this._idProduto = idProduto;
        this._valorProduto = valorProduto;
    }


    public get IdProduto(): number | undefined {
        return this._idProduto
    }
    public get NomeProduto(): string {
        return this._nomeProduto
    }
    public get VinculoImagem(): string {
        return this._vinculoImagem
    }
    public get IdCategoria(): number | undefined {
        return this._idCategoria
    }
    public get DataVencimento(): Date {
        return this._dataVencimento
    }
    public get ValorProduto(): number {
        return this._valorProduto
    }

    // SETTERS
    public set NomeProduto(nome_produto: string) {
        this._validarNomeProduto(nome_produto);
        this._nomeProduto = nome_produto;
    }

    public static criar(nome_produto: string, valor_produto: number, vinculo_imagem: string, data_vencimento: Date, id_categoria: number): Produto {
        return new Produto(nome_produto, vinculo_imagem, id_categoria, data_vencimento, valor_produto)
    }

    public static editar(
        nome_produto: string,
        valor_produto: number,
        vinculo_imagem: string,
        data_vencimento: Date,
        id_categoria: number,
        id_produto: number
    ): Produto {
        return new Produto(
            nome_produto,
            vinculo_imagem,
            id_categoria,
            data_vencimento,
            valor_produto, 
            id_produto     
        );
    }

    private _validarNomeProduto(nome_produto: string): void {
        if (!nome_produto || nome_produto.trim().length < 3) {
            throw new Error('Nome do produto deve ter pelo menos 3 caracteres')
        }
        if (nome_produto.trim().length > 45) {
            throw new Error('Nome do produto deve ter no máximo 45 caracteres')
        }
    }

}