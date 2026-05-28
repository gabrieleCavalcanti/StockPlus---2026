import { RowDataPacket } from "mysql2";

export interface ITelefone extends RowDataPacket {
    id_telefone?: number;
    telefone?: string;
    id_pessoa?: number;
}

export class Telefone {
    private _id_telefone?: number;
    private _telefone: string = '';
    private _id_pessoa: number = 0;

    //Construtor
    constructor(telefone: string, id_pessoa: number, id_telefone?: number) {
        this._telefone = telefone;
        this._id_telefone = id_telefone;
        this._id_pessoa = id_pessoa;
    }

    //GETTERS
    public get IdTelefone(): number | undefined {
        return this._id_telefone;
    }

    public get Cpf(): string {
        return this._telefone;
    }

    public get IdPessoa(): number {
        return this._id_pessoa;
    }


    // DP => FACTORY
    public static criar(telefone: string, id_pessoa: number): Telefone {
        return new Telefone(telefone, id_pessoa);
    }

    public static editar(telefone: string, id_telefone: number) {
        return new Telefone(telefone, id_telefone);
    }

}