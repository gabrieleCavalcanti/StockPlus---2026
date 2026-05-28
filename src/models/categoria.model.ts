import { RowDataPacket } from "mysql2";

export interface ICategoria extends RowDataPacket {
    id_categoria?: number;
    nome_categoria?: string;
    ativo?: boolean;
    data_cadastro?: Date;
}
export class Categoria {
    private _idCategoria?: number;
    private _nomeCategoria: string = '';
    private _ativo: boolean;
    private _dataCad?: Date;
    
    constructor(nome_categoria: string, ativo: boolean, id_categoria?: number, data_cadastro?: Date) {
        this._nomeCategoria = nome_categoria;
        this._ativo = ativo ?? true;
        this._idCategoria = id_categoria;
        this._dataCad = data_cadastro;
    }

    public get Id_categoria(): number | undefined {
        return this._idCategoria
    }

    public get Nome_categoria(): string {
        return this._nomeCategoria
    }
    public get Ativo(): boolean {
        return this._ativo
    }
    public get Data_cadastro(): Date | undefined {
        return this._dataCad
    }


    public set nome_categoria(value: string) {
        this._validarNomeCategoria(value);
        this._nomeCategoria = value;
    }

    // DESIGN PATTERNS => FACTORY
    public static criar(nome_categoria: string, ativo: boolean): Categoria {
        return new Categoria(nome_categoria, ativo)
    }
    public static editar(nome_categoria: string, ativo: boolean, idCategoria: number) {
        return new Categoria(nome_categoria, ativo, idCategoria)
    }


    private _validarNomeCategoria(value: string): void {
        if (!value || value.trim().length < 3) {
            throw new Error('Nome da categoria deve ter pelo menos 3 caracteres')
        }
        if (value.trim().length > 45) {
            throw new Error('Nome da categoria deve ter no máximo 45 caracteres')
        }
    }
}


