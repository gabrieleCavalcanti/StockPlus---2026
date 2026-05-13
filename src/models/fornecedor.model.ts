import { RowDataPacket } from "mysql2";

export interface IFornecedor extends RowDataPacket {
    id_fornecedor?: number;
    cnpj?: string;
    id_pessoa?: number;
}

export class Fornecedor {
    private _id_fornecedor?: number;
    private _cnpj: string = '';
    private _id_pessoa: number = 0;

    //Construtor
    constructor(cpf: string, id_pessoa: number, id_fornecedor?: number) {
        this._cnpj = cpf;
        this._id_fornecedor = id_fornecedor;
        this._id_pessoa = id_pessoa;
    }

    //GETTERS
    public get IdFornecedor(): number | undefined {
        return this._id_fornecedor;
    }

    public get Cnpj(): string {
        return this._cnpj;
    }

    public get IdPessoa(): number {
        return this._id_pessoa;
    }


    // DP => FACTORY
    public static criar(cnpj: string, id_pessoa: number): Fornecedor {
        return new Fornecedor(cnpj, id_pessoa);
    }

    public static editar(cnpj: string, id_fornecedor: number) {
        return new Fornecedor(cnpj, id_fornecedor);
    }

}