import { log } from "node:console";
import { Pedido } from "../models/pedido.model";
import { ItensPedido } from "../models/itensPedido.model";
import { PedidoRepository } from "../repository/pedido.repository";

export class PedidoService {
  constructor(private _repository = new PedidoRepository()) {}

  async criarPedido(
    tipo: string,
    id_cliente_fornecedor: number,
    id_funcionario: number,
    quantidade:number, id_produto:number
  ) {
    const pedidos = Pedido.criarPedido(
      tipo,
      id_cliente_fornecedor,
      id_funcionario,
    );
    const itenspedidos = ItensPedido.criarItensPedidos(
      quantidade, 
      id_produto,
      undefined, 
      undefined,
    );

    return await this._repository.create(pedidos, itenspedidos);
  }
  async editarPedido(
    tipo: string,
    id_cliente_fornecedor: number,
    id_funcionario: number,
    id_pedido: number,
  ) {
    const pedidos = Pedido.editarPedido(
      tipo,
      id_cliente_fornecedor,
      id_funcionario,
      id_pedido,
    );
    return await this._repository.update(id_pedido, pedidos);
  }
  /**
   * Busca todos os pedidos e retorna formatadas com mostrarDados()
   */
  async selecionarTodosFormatado(): Promise<Pedido[]> {
    // Busca no banco que vem como array de objetos simples
    const pedidosDoBanco = await this._repository.findAll();

    // Para cada pedido que tem no banco:
    return pedidosDoBanco.map((row: any) => {
      // Vai ser criado uma instância da classe Pedidos
      const pedidos = new Pedido(
        row.tipo,
        row.id_cliente_fornecedor,
        row.id_funcionario,
        row.id_pedido,
      );

      // Chama o método mostrarDados() dessa instância
      return pedidos.mostrarDados();
    });
  }

  /**
   * Busca um clientea por ID e retorna formatada com mostrarDados()
   */
  async selecionarIdFormatado(id_pedido: number): Promise<Pedido | null> {
    // Faz uma busca no banco
    const rows = await this._repository.selectById(id_pedido);
    console.log(id_pedido);

    // Se não achou, retorna null
    if (rows.length === 0) return null;

    // Pega a primeira (e única) pedido encontrada
    const row = rows[0];

    // Cria INSTÂNCIA e chama mostrarDados()
    const pedidos = new Pedido(
      row.tipo,
      row.id_cliente_fornecedor,
      row.id_funcionario,
      row.id_pedido,
    );

    return pedidos.mostrarDados();
  }

 async selecionarPorClienteFornecedor(
  idClienteFornecedor: number
): Promise<Pedido[]> {

  const rows =
    await this._repository.selectByCliente(idClienteFornecedor);

  if (rows.length === 0) return [];

  return rows.map(row => {
    const pedido = new Pedido(
      row.tipo,
      row.id_cliente_fornecedor,
      row.id_funcionario,
      row.id_pedido
    );
    return pedido.mostrarDados();
  });
}
}
