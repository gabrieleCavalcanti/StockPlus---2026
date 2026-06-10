import { RowDataPacket } from "mysql2";

export type TipoMovimentacao = 'entrada' | 'saida';

export interface IMovimentacao extends RowDataPacket {
    id_movimentacao?: number;
    quantidade: number;
    status: TipoMovimentacao;
    id_itens_pedido: number;
    data_cadastro?: Date;
    id_pedido?: number;
    id_produto?: number;
    nome_produto?: string;
    valor_produto?: number;
    nome_pessoa?: string;            
    nome_cliente_fornecedor?: string;  
    tipo_pedido?: string; 
    valor_total_formatado?: string;
}


export class Movimentacao {
    private _id_movimentacao?: number;
    private _quantidade: number;
    private _status: string;
    private _id_itens_pedido: number;
    private _data_cadastro?: Date;

    constructor(quantidade: number, status: string, id_itens_pedido: number,  id_movimentacao?: number, data_cadastro?: Date) {
        this._quantidade = quantidade;
        this._status = status;
        this._id_itens_pedido = id_itens_pedido;
        this._id_movimentacao = id_movimentacao;
        this._data_cadastro = data_cadastro || new Date()
    }

    public get id_movimentacao(): number | undefined { return this._id_movimentacao }
    public get quantidade(): number { return this._quantidade }
    public get status(): string { return this._status }
    public get id_itens_pedido(): number { return this._id_itens_pedido }
    public get data_cadastro(): Date | undefined { return this._data_cadastro }
}
