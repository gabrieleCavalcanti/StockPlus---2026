import { RowDataPacket } from "mysql2"; 

export interface IPessoa extends RowDataPacket {
    id_pessoa?: number;
    nome_pessoa?: string;
    email?: string;
    tipo?: string;
}

export class Pessoa {
    private _id_pessoa?: number;
    private _nome_pessoa: string = '';
    private _email: string = '';
    private _tipo: string = '';

    //Construtor
    constructor(nome_pessoa: string, email: string, tipo: string, id_pessoa?: number) {
        this.Nome = nome_pessoa;
        this._email = email;
        this._tipo = tipo;
        this._id_pessoa = id_pessoa;
    }

    //GETTERS
    public get Id(): number | undefined {
        return this._id_pessoa;
    }

    public get Nome(): string {
        return this._nome_pessoa;
    }

    public get Email(): string {
        return this._email;
    }

    public get Tipo(): string {
        return this._tipo;
    }

    //SETTERS
    public set Nome(value: string) {
        this._validarNome(value);
        this._nome_pessoa = value;
    }

    // DP => FACTORY
    public static criar(nome_pessoa: string, email: string, tipo: string): Pessoa {
        return new Pessoa(nome_pessoa, email, tipo);
    }

    public static editar(nome_pessoa: string, email: string, tipo: string, id_pessoa: number)  {
        return new Pessoa(nome_pessoa, email, tipo, id_pessoa);
    }

    private _validarNome(value: string): void {
        if (!value || value.trim().length < 3) {
            throw new Error('Nome deve ter pelo menos 3 caracteres')
        }
        if(value.trim().length>45){
            throw new Error('Nome deve ter no maximo 45 caracteres')
        }
    }
}