const express = require('express');
const { cadastrarUsuario, login, detalharUsuario, atualizarUsuario, listarCategorias } = require('./controladores/usuarios');
const { listarTransacoes, listarIdTransacao, cadastrarTransacao, atualizarTransacao, deletarTransacao, excluirTransacao, extrato } = require('./controladores/transacoes');
const { verificaNome, verificaEmail, verificaSenha, verificaDescricao, verificaValor, verificaData, verificaCategoria, verificaTipo } = require('./middlewares/validacoes');
const { verificaLogin } = require('./middlewares/verificaLogin');



const rotas = express();

rotas.post('/usuario', verificaNome, verificaEmail, verificaSenha, cadastrarUsuario);
rotas.post('/login', verificaEmail, verificaSenha, login);

rotas.use(verificaLogin)

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', verificaNome, verificaEmail, verificaSenha, atualizarUsuario);
rotas.get('/categoria', listarCategorias);
rotas.get('/transacao', listarTransacoes );
rotas.get('/transacao/extrato', extrato)
rotas.get('/transacao/:id', listarIdTransacao)
rotas.post('/transacao', verificaDescricao, verificaValor, verificaData, verificaCategoria, verificaTipo, cadastrarTransacao)
rotas.put('/transacao/:id', verificaDescricao, verificaValor, verificaData, verificaCategoria, verificaTipo, atualizarTransacao)
rotas.delete('/transacao/:id', excluirTransacao)



module.exports = rotas;