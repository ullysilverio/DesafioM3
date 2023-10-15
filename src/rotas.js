const express = require('express')

const {
	cadastrarUsuario,
    login,
    obterPerfil,
    atualizarUsuario
	
} = require('./controladores/usuarios')

const verificarUsuarioLogado = require('./intermediarios/autenticacao')

const rotas = express()


rotas.post('/usuario', cadastrarUsuario)

rotas.post('/login', login)

rotas.use(verificarUsuarioLogado)

rotas.get('/perfil', obterPerfil)

rotas.put('/usuario', atualizarUsuario)

module.exports = rotas 