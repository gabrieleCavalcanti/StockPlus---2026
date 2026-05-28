import { RowDataPacket } from "mysql2";

export interface IEstoque extends RowDataPacket {
    id_estoque?: number;
    id_produto: number;
    quantidade: number;
    quantidade_minima: number;
   
}

export class Estoque {
    private _id_estoque?: number;
    private _id_produto: number;
    private _quantidade: number;
    private _quantidade_minima: number;

    constructor(id_produto: number, quantidade: number, quantidade_minima: number,  id_estoque?: number) {
        this._id_produto = id_produto;
        this._quantidade = quantidade;
        this._quantidade_minima = quantidade_minima;
        this._id_estoque = id_estoque;
    }

    public get id_produto(): number { return this._id_produto }
    public get id_estoque(): number | undefined { return this._id_estoque }
    public get quantidade(): number { return this._quantidade }
    public get quantidade_minima(): number { return this._quantidade_minima }
  
   get statusEstoque(): string {
        const margemSeguranca = 10;
        if (this.quantidade <= this.quantidade_minima) {
            return "CRITICO";
        }
        if (this.quantidade > this.quantidade_minima && 
            this.quantidade <= (this.quantidade_minima + margemSeguranca)) {
            return "ALERTA";
        }
        return "NORMAL";
    }
}

