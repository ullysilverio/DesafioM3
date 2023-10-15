CREATE database dindin; 

create table IF NOT EXISTS usuarios (
  id serial primary key,
  nome text not null,
  email text not null unique,
  senha text not null
 );


create table IF NOT EXISTS categorias (
  id serial primary key,
  descricao text not null
 );


create table IF NOT EXISTS transacoes (
  id serial primary key,
  tipo text not null,
  descricao text not null,
  valor integer not null,
  data timestamptz not null,
  usuario_id integer references usuarios(id),
  categoria_id integer references categorias(id)
);


INSERT into categorias
(descricao)
values
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');