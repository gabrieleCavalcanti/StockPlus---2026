//

export interface IItensPedido {
  id_itens_pedido: number;
  quantidade: number;
  status: string;
  id_pedido: number;
  id_produto: number;

}
export class ItensPedido {
  private _id_itens_pedido?: number;
  private _quantidade: number;
  private _status: string;
  private _id_pedido?: number;
  private _id_produto: number;

  constructor(
    quantidade: number,
    id_produto: number,
    status: string = "",
    id_pedido?: number,
    id_itens_pedido?: number,
  ) {
    this._id_itens_pedido = id_itens_pedido;
    this._quantidade = quantidade;
    this._status = status;
    this._id_pedido = id_pedido;
    this._id_produto = id_produto;
  }

//   /**
//    * Getters
//    */
  public get IdItensPedido(): number | undefined {
    return this._id_itens_pedido;
  }

  public get Quantidade(): number {
    return this._quantidade;
  }

  public get Status(): string{
    return this._status;
  }

  public get IdPedido(): number | undefined  {
    return this._id_pedido;
  }

  public get IdProduto(): number {
    return this._id_produto;
  }

//   // SETTERS

  set Status(valor: string) {
    const values = (valor ?? "").trim();
    // Regra simples: 4-20 caracteres alfanuméricos, hífen e barra permitidos
    const regex = /^[A-Za-z0-9\-\/]{4,20}$/;
    if (!regex.test(values)) {
      throw new Error("Status inválido. Use 4 a 20 caracteres (letras).");
    }
    this._status = values;
  }

  set IdPedido(value: number) {
    this._id_pedido = value;
  }

  set IdProduto(value: number) {
    this._id_produto = value;
  }

//   /**
//    * Criar Pedido
//    */
  public static criarItensPedidos(
    quantidade: number,
    id_produto: number,
    status?: string,
    id_pedido?: number,
  ): ItensPedido {
    return new ItensPedido(
      quantidade,
      id_produto,
      status,
      id_pedido
    );
  }

//   // Update

  public static editarItensPedidos(
    quantidade: number,
    id_produto: number,
    status: string,
    id_pedido: number,
    
  ): ItensPedido {
    return new ItensPedido(quantidade,id_produto, status, id_pedido);
  }

  inserir(): ItensPedido {
    return this;
  }

  alterar(): ItensPedido {
    return this;
  }

  mostrarDados(): ItensPedido{
   return this;
  }
}