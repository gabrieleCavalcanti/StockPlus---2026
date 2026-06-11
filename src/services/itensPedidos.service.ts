import { ItensPedido } from "../models/itensPedido.model";
import { ItensPedidoRepository } from "../repository/itensPedidos.repository";
import { IItensPedido } from "../models/itensPedido.model";

export class ItensPedidosService {
    constructor(private _repository = new ItensPedidoRepository()) {}

  async devolverItem(id_itens_pedido: number) {
    return await this._repository.devolverItem(id_itens_pedido);
  }

  async editarItensPedido(quantidade:number, status:string, id_pedido: number, id_produto:number, id_itens_pedido: number) {
   const itensPedido: IItensPedido = {
    id_itens_pedido,
    quantidade,
    status,
    id_pedido,
    id_produto,
  };

  return await this._repository.update(id_itens_pedido, itensPedido);
}
  // insertMovimentações: async (pTelefone, pIdCliente) => {
  //       const connection = await pool.getConnection();
  //       try {
  //           await connection.beginTransaction();
  //           const sql = 'INSERT INTO telefones (telefone_cliente, id_cliente) VALUES (?, ?);';
  //           const values = [pTelefone, pIdCliente];
  //           const [rows] = await pool.query(sql, values);
  //           connection.commit();
  //           return rows;
  //       } catch (error) {
  //           connection.rollback();
  //           throw error;
  //       }


}