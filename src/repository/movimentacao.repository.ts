import { db } from "../database/connection.database";
import { IMovimentacao } from "../models/movimentacao.model";

export class MovimentacaoRepository {
    
    async findAll(): Promise<IMovimentacao[]> {
        const query = `select  m.id_movimentacao, m.status as status_movimentacao,  m.data_cadastro,  ip.quantidade,  ip.status AS status_item,   ip.id_pedido,  ip.id_produto, p.nome_produto, p.valor_produto, pes.nome_pessoa as nome_cliente_fornecedor, ped.tipo as tipo_pedido 
            from movimentacoes m
            inner join itenspedido ip on m.id_itens_pedido = ip.id_itens_pedido
            inner join produtos p on ip.id_produto = p.id_produto
            inner join pedidos ped on ip.id_pedido = ped.id_pedido
            inner join pessoas pes on ped.id_cliente_fornecedor = pes.id_pessoa;`;
        
        const [rows] = await db.execute<IMovimentacao[]>(query);
        return rows;
    }

    async findBystatus(status: string): Promise<IMovimentacao[]> {
        const query = `
            select m.id_movimentacao, m.status as status_movimentacao, m.data_cadastro, ip.quantidade,  ip.status AS status_item, ip.id_pedido, ip.id_produto, p.nome_produto, p.valor_produto, pes.nome_pessoa as nome_cliente_fornecedor, ped.tipo as tipo_pedido
            from movimentacoes m
            inner join itenspedido ip on m.id_itens_pedido = ip.id_itens_pedido
            inner join produtos p on ip.id_produto = p.id_produto
            inner join pedidos ped on ip.id_pedido = ped.id_pedido
            inner join pessoas pes on ped.id_cliente_fornecedor = pes.id_pessoa where m.status = ?;`;

        const [rows] = await db.execute<IMovimentacao[]>(query, [status]);
        return rows;
    }
}
