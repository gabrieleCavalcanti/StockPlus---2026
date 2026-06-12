import { ItensPedido } from "../models/itensPedido.model";
import { ItensPedidoRepository } from "../repository/itensPedidos.repository";
import { IItensPedido } from "../models/itensPedido.model";

export class ItensPedidosService {
    constructor(private _repository = new ItensPedidoRepository()) {}

  async devolverItem(id_itens_pedido: number) {
    return await this._repository.devolverItem(id_itens_pedido);
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