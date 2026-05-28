import { RowDataPacket } from "mysql2";

export interface ICliente extends RowDataPacket {
    id_cliente?: number;
    cpf?: string;
    id_pessoa?: number;
}

export class Cliente {
    private _id_cliente?: number;
    private _cpf: string = '';
    private _id_pessoa: number = 0;

    //Construtor
    constructor(cpf: string, id_pessoa: number, id_cliente?: number) {
        this._cpf = cpf;
        this._id_cliente = id_cliente;
        this._id_pessoa = id_pessoa;
    }

    //GETTERS
    public get IdCliente(): number | undefined {
        return this._id_cliente;
    }

    public get Cpf(): string {
        return this._cpf;
    }

    public get IdPessoa(): number {
        return this._id_pessoa;
    }


    // DP => FACTORY
    public static criar(cpf: string, id_pessoa: number): Cliente {
        return new Cliente(cpf, id_pessoa);
    }

    public static editar(cpf: string, id_cliente: number) {
        return new Cliente(cpf, id_cliente);
    }

}