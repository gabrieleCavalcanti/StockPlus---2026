import { ItensPedido } from "../models/itensPedido.model";
import { ItensPedidoRepository } from "../repository/itensPedidos.repository";
import { IItensPedido } from "../models/itensPedido.model";

export class ItensPedidosService {
    constructor(private _repository = new ItensPedidoRepository()) {}


  // async editarItensPedido(quantidade:number, status:string, id_pedido: number, id_produto:number, id_itens_pedido: number) {
  //   const itenspedidos =ItensPedido.editarItensPedidos(
  //     quantidade,
  //     id_produto,
  //     status,
  //     id_pedido,
  //   );
  //   return await this._repository.update(id_itens_pedido, itenspedidos);

  // }
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