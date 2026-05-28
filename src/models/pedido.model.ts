import { RowDataPacket } from "mysql2";

export class Pedido {
  private _id_pedido?: number;
  private _tipo: string;
  private _id_cliente_fornecedor: number;
  private _id_funcionario: number;

  constructor(
    tipo: string = "",
    id_cliente_fornecedor: number,
    id_funcionario: number,
    id_pedido?: number,
  ) {
    this._id_pedido = id_pedido;
    this._tipo = tipo;
    this._id_cliente_fornecedor = id_cliente_fornecedor;
    this._id_funcionario = id_funcionario;
  }

  /**
   * Getters
   */
  public get IdPedido(): number | undefined {
    return this._id_pedido;
  }

  public get Tipo(): string {
    return this._tipo;
  }

  public get IdClienteFornecedor(): number {
    return this._id_cliente_fornecedor;
  }

  public get IdFuncionario(): number {
    return this._id_funcionario;
  }

  // SETTERS

  // set StatusPedido(valor: string) {
  //   const values = (valor ?? "").trim();
  //   // Regra simples: 4-20 caracteres alfanuméricos, hífen e barra permitidos
  //   const regex = /^[A-Za-z0-9\-\/]{4,20}$/;
  //   if (!regex.test(values)) {
  //     throw new Error("Status inválido. Use 4 a 20 caracteres (letras).");
  //   }
  //   this._status_pedido = values;
  // }

  set IdClienteFornecedor(value: number) {
    this._id_cliente_fornecedor = value;
  }

  set IdFuncionario(value: number) {
    this._id_funcionario = value;
  }

  /**
   * Criar Pedido
   */
  public static criarPedido(
    tipo: string,
    id_cliente_fornecedor: number,
    id_funcionario: number,
  ): Pedido {
    return new Pedido(
      tipo,
      id_cliente_fornecedor,
      id_funcionario,
    );
  }

  // Update

  public static editarPedido(
    tipo: string,
    id_cliente_fornecedor: number,
    id_funcionario: number,
    id_pedido: number,
    
  ): Pedido {
    return new Pedido(tipo, id_cliente_fornecedor, id_funcionario, id_pedido );
  }

  inserir(): Pedido {
    return this;
  }

  alterar(): Pedido {
    return this;
  }

  mostrarDados(): Pedido{
   return this;
  }
}
