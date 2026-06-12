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
    itens: { id_produto: number; quantidade: number }[],
  ) {
    const pedido = Pedido.criarPedido(
      tipo,
      id_cliente_fornecedor,
      id_funcionario,
    );
    return await this._repository.create(pedido, itens);
  }

  async editarPedido(
    id_cliente_fornecedor: number,
    id_funcionario: number,
    id_pedido: number,
  ) {
    const pedidos = Pedido.editarPedido(
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
    const pedidosDoBanco = await this._repository.findAll();

    return pedidosDoBanco.map((row: any) => {
      const pedidos = new Pedido(
        row.tipo,
        row.id_cliente_fornecedor,
        row.id_funcionario,
        row.id_pedido,
      );
      return pedidos.mostrarDados();
    });
  }

  async selecionarTodosComItens() {
    const rows = await this._repository.findAllComItens();

    // Agrupa os itens por pedido, o map é como um dicionário onde a chave é o id_pedido para evitar pedidos duplicados.
    const pedidosMap = new Map<number, any>();

    // o for vai percorrer cada linha do banco
    for (const row of rows) {
      // se o pedido ainda não exista no Map, ele cria o pedido com itens:[]
      if (!pedidosMap.has(row.id_pedido)) {
        pedidosMap.set(row.id_pedido, {
          id_pedido: row.id_pedido,
          tipo: row.tipo,
          valor_total: row.valor_total,
          cliente_fornecedor: row.nome_cliente_fornecedor,
          funcionario: row.nome_funcionario,
          itens: [],
        });
      }
      // para cada linha pega o pedido pelo id e coloca o item no array itens
      pedidosMap.get(row.id_pedido).itens.push({
        id_itens_pedido: row.id_itens_pedido,
        nome_produto: row.nome_produto,
        valor_produto: row.valor_produto,
        quantidade: row.quantidade,
        status: row.status,
      });
    }
    // aqui ele vai converter o map em um array e retornar os valores.
    return Array.from(pedidosMap.values());
  }
  /**
   * Busca um pedido por ID e retorna formatado com mostrarDados()
   */
  async selecionarIdFormatado(id_pedido: number): Promise<Pedido | null> {
    const rows = await this._repository.selectById(id_pedido);
    console.log(id_pedido);

    if (rows.length === 0) return null;

    const row = rows[0];

    const pedidos = new Pedido(
      row.tipo,
      row.id_cliente_fornecedor,
      row.id_funcionario,
      row.id_pedido,
    );

    return pedidos.mostrarDados();
  }

  async selecionarTipoPessoa(idClienteFornecedor: number) {
    return await this._repository.selectTipoPessoa(idClienteFornecedor);
  }

  async selecionarProdutoPorId(idProduto: number) {
    return await this._repository.selectByIdProduct(idProduto);
  }

  async selecionarEstoquePorProduto(idProduto: number) {
    return await this._repository.selectEstoqueByProduto(idProduto);
  }

  async buscarPedidoPorId(idPedido: number) {
  return await this._repository.selectById(idPedido);
}
}
