# StockPlus API

## Descrição

O StockPlus é um sistema de gerenciamento de estoque desenvolvido em TypeScript, utilizando arquitetura em camadas e banco de dados MySQL.

O sistema permite:

* Cadastro de clientes, fornecedores e funcionários.
* Controle de autenticação de funcionários.
* Gerenciamento de categorias e produtos.
* Controle de estoque.
* Registro de compras e vendas.
* Geração automática de movimentações de estoque.
* Controle de entradas e saídas de produtos.

---

# Regras de Negócio

## Pessoas

A tabela `pessoas` é a entidade principal para armazenamento de dados cadastrais.

* Deve ser criada com nome e email

Uma pessoa pode possuir um dos seguintes tipos:

* CLIENTE
* FORNECEDOR
* FUNCIONARIO

### Cliente

Ao cadastrar um cliente:

* Deve ser criada uma pessoa com tipo `CLIENTE`.
* Deve ser criado um registro na tabela `clientes`.
* O CPF é obrigatório.

### Fornecedor

Ao cadastrar um fornecedor:

* Deve ser criada uma pessoa com tipo `FORNECEDOR`.
* Deve ser criado um registro na tabela `fornecedor`.
* O CNPJ é obrigatório.

### Funcionário

Ao cadastrar um funcionário:

* Deve ser criada uma pessoa com tipo `FUNCIONARIO`.
* Deve ser criado um registro na tabela `funcionarios`.
* Deve ser criado um registro na tabela `login`.
* Usuário e senha são obrigatórios.
* A senha é armazenada utilizando hash.

---

# Login

Somente funcionários possuem acesso ao sistema.

Cada funcionário possui:

* Username único.
* Senha criptografada.
* Um único registro de login.

---

# Categorias

As categorias podem possuir dois estados:

* Ativa
* Inativa

### Regras

* Um produto só pode ser cadastrado em uma categoria ativa.
* Não é permitido desativar uma categoria que possua produtos vinculados.

---

# Produtos

Todo produto deve possuir:

* Nome.
* Imagem.
* Categoria.
* Data de vencimento.
* Valor unitário.

### Regras

* O produto deve estar vinculado a uma categoria ativa.
* Todo produto deve possuir um registro correspondente na tabela de estoque.
* 

---

# Estoque

O estoque controla:

* Quantidade atual.
* Quantidade mínima.

### Regras

* Cada produto possui apenas um estoque.
* O sistema deve alertar quando a quantidade atual estiver abaixo da quantidade mínima.
* Alterações de estoque ocorrem exclusivamente através das movimentações geradas pelos pedidos.

---

# Pedidos

Os pedidos representam operações de compra e venda.

Tipos disponíveis:

* COMPRA
* VENDA

Campos principais:

* Cliente ou fornecedor responsável.
* Funcionário responsável.
* Valor total.
* Data do pedido.

## Pedido de Compra

Quando o tipo for `COMPRA`:

* O campo `id_cliente_fornecedor` deve referenciar uma pessoa do tipo `FORNECEDOR`.
* Os produtos serão adicionados ao estoque.
* Será gerada uma movimentação de entrada.

## Pedido de Venda

Quando o tipo for `VENDA`:

* O campo `id_cliente_fornecedor` deve referenciar uma pessoa do tipo `CLIENTE`.
* Os produtos serão removidos do estoque.
* Será gerada uma movimentação de saída.

## Funcionário Responsável

Independentemente do tipo do pedido:

* O campo `id_funcionario` deve referenciar uma pessoa do tipo `FUNCIONARIO`.

---

# Itens do Pedido

Cada pedido pode possuir vários itens.

Campos:

* Produto.
* Quantidade.
* Valor unitário.
* Status.

Status disponíveis:

* CONCLUIDO
* DEVOLVIDO

### Regras

* O valor unitário não é informado pelo usuário.
* O valor unitário é obtido automaticamente da tabela `produtos`.
* O valor total do pedido é calculado automaticamente pela soma:

```
valor_total =
Σ (quantidade × valor_unitario)
```

---

# Movimentações

Toda movimentação é gerada automaticamente a partir dos itens do pedido.

Tipos:

* entrada
* saida

### Regras

#### Entrada

Ocorre quando:

* O pedido é do tipo COMPRA.

Ação realizada:

* A quantidade do item é adicionada ao estoque.

#### Saída

Ocorre quando:

* O pedido é do tipo VENDA.

Ação realizada:

* A quantidade do item é removida do estoque.

---

# Fluxo de Funcionamento

## Compra

Fornecedor
→ Pedido de Compra
→ Itens do Pedido
→ Movimentação de Entrada
→ Atualização do Estoque

## Venda

Cliente
→ Pedido de Venda
→ Itens do Pedido
→ Movimentação de Saída
→ Atualização do Estoque

---

# Tecnologias Utilizadas

* TypeScript
* Node.js
* Express
* MySQL
* JWT Authentication
* Bcrypt
* Multer
* Arquitetura em Camadas (Controller, Service, Repository)

---

# Estrutura do Banco de Dados

Principais tabelas:

* pessoas
* clientes
* fornecedor
* funcionarios
* login
* telefones
* categoria
* produtos
* estoque
* pedidos
* itenspedido
* movimentacoes

---

# Integridade dos Dados

O sistema garante que:

* Apenas funcionários podem realizar login.
* Produtos só podem ser cadastrados em categorias ativas.
* Categorias com produtos vinculados não podem ser desativadas.
* Compras aumentam o estoque.
* Vendas diminuem o estoque.
* O valor total do pedido é calculado automaticamente.
* O valor unitário dos itens é obtido diretamente do produto.
* Toda movimentação possui vínculo com um item de pedido.
* Todo pedido possui um funcionário responsável.


# Funcionalidades do Sistema

O sistema StockPlus contempla as seguintes funcionalidades:

## Gestão de Pessoas

* Cadastro de clientes.
* Cadastro de fornecedores.
* Cadastro de funcionários.
* Controle de autenticação através de login e senha.
* Criptografia de senhas utilizando hash.
* Selecionar por tipo clientes/fornecedores/funcionários

## Gestão de Produtos

* Cadastro de produtos.
* Associação de produtos a categorias.
* Associação de produtos a fornecedores através dos pedidos de compra.
* Controle de valor unitário.
* Controle de data de vencimento.
* Upload e gerenciamento de imagens dos produtos.

## Gestão de Categorias

* Cadastro de categorias.
* Ativação e desativação de categorias.
* Bloqueio da desativação de categorias que possuam produtos vinculados.

## Controle de Estoque

* Registro automático de entradas de mercadorias.
* Registro automático de saídas de mercadorias.
* Controle de quantidade atual.
* Controle de quantidade mínima.
* Atualização automática do estoque através das movimentações.

## Controle de Movimentações

* Registro completo do histórico de movimentações.
* Identificação de movimentações de entrada.
* Identificação de movimentações de saída.
* Vinculação da movimentação ao item do pedido responsável pela alteração do estoque.

## Controle de Pedidos

* Registro de pedidos de compra.
* Registro de pedidos de venda.
* Cálculo automático do valor total do pedido.
* Cálculo automático do valor unitário dos itens a partir do cadastro do produto.
* Associação do pedido ao funcionário responsável.

## Controle de Validade

* Consulta de produtos vencidos.
* Alerta de produtos com vencimento em até 90 dias.
* Alerta de produtos com vencimento em até 45 dias.
* Identificação de produtos próximos da data de vencimento.

## Controle de Quantidade Minima

* Alerta de estoque CRITICO(estoque abaixo) ou ALERTA(perto de estoque baixo) da quantidade mínima.

