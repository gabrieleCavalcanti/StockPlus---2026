import { Pedido } from "../models/pedido.model";
import { PedidoRepository } from "../repository/pedido.repository";

export class PedidoService {
    constructor(private _repository = new PedidoRepository()) {}

  async criarPedido(tipo:string, status_pedido:string,id_cliente_fornecedor: number, id_funcionario:number) {
    const pedidos = Pedido.criarPedido(tipo, status_pedido, id_cliente_fornecedor, id_funcionario);
    return await this._repository.create(pedidos);
  }
  async editarPedido(tipo:string, status_pedido:string, id_funcionario: number, id_pedido:number) {
    const pedidos = Pedido.editarPedido(
      tipo,
      status_pedido,
      id_funcionario,
      id_pedido
    );
    return await this._repository.update(id_pedido, pedidos);
  }
    /**
   * Busca todos os pedidos e retorna formatadas com mostrarDados()
   */
  async selecionarTodosFormatado(): Promise<string[]> {
    // Busca no banco que vem como array de objetos simples
    const pedidosDoBanco = await this._repository.findAll();
    
    // Para cada pedido que tem no banco:
    return pedidosDoBanco.map((row: any) => {
      // Vai ser criado uma instância da classe Pedidos
      const pedidos= new Pedido(row.tipo, row.status_pedido, row.id_cliente_fornecedor, row.id_funcionario, row.id_pedido);
      
      // Chama o método mostrarDados() dessa instância
      return pedidos.mostrarDados();
    });
  }

  /**
   * Busca um clientea por ID e retorna formatada com mostrarDados()
   */
  async selecionarIdFormatado(idPedido: number): Promise<string | null> {
    // Faz uma busca no banco
    const rows = await this._repository.selectById(idPedido);
    
    // Se não achou, retorna null
    if (rows.length === 0) return null;
    
    // Pega a primeira (e única) pedido encontrada
    const row = rows[0];
    
    // Cria INSTÂNCIA e chama mostrarDados()
    const pedidos = new Pedido(row.idCliente, row.idVendedor, row.valorTotal, row.statusPedido, row.idPedido);
    return pedidos.mostrarDados();
  }

}