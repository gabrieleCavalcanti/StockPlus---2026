import { RowDataPacket } from "mysql2";

export interface IFuncionario extends RowDataPacket {
    id_funcionario?: number;
    cargo?: string;
    data_admissao?: Date;
    id_pessoa?: number;
}

export class Funcionario {
    private _id_fornecedor?: number;
    private _cargo: string = '';
    private _data_admissao: Date;
    private _id_pessoa: number = 0;

    //Construtor
    constructor(cargo: string, data_admissao: Date, id_pessoa: number, id_fornecedor?: number) {
        this._cargo = cargo;
        this._data_admissao = data_admissao
        this._id_fornecedor = id_fornecedor;
        this._id_pessoa = id_pessoa;
    }

    //GETTERS
    public get IdFornecedor(): number | undefined {
        return this._id_fornecedor;
    }

    public get Cargo(): string {
        return this._cargo;
    }

    public get DataAdmissao(): Date {
        return this._data_admissao;
    }

    public get IdPessoa(): number {
        return this._id_pessoa;
    }


    // DP => FACTORY
    public static criar(cargo: string, data_admissao: Date, id_pessoa: number): Funcionario {
        return new Funcionario(cargo, data_admissao, id_pessoa);
    }

    public static editar(cargo: string,  data_admissao: Date,id_fornecedor: number) {
        return new Funcionario(cargo, data_admissao, id_fornecedor);
    }

}