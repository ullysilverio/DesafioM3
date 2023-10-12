const bcrypt = require('bcrypt')
const pool = require('../conexao')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJwt')



const cadastrarUsuario = async (req, res) => {
const {nome, email, senha} = req.body   
    try{
        const emailExiste = await pool.query('select * from usuarios where email = $1', [email])
        if(emailExiste.rowCount > 0){
            return res.status(400).json({mensagem: 'Já existe usuário cadastrado com o e-mail informado.'})
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10)
        const query = `
        insert into usuarios (nome, email, senha)
        values ($1, $2, $3) returning *
        `

        const {rows} = await pool.query(query, [nome, email, senhaCriptografada])

        const {senha: _, ...usuario} = rows[0]
        return res.status(201).json(usuario)

    } catch (error){
        return res.status(500).json({mensagem: 'Erro interno do servidor'})
    }

}


const login = async (req, res) =>{
    const {email, senha} = req.body

    try{
        const { rows, rowCount} = await pool.query('select * from usuarios where email = $1', [email])

        if (rowCount === 0){
            return res.status(400).json({mensagem: 'Usuário e/ou senha inválido(s).'})
        }

        const {senha: senhaUsuario, ...usuario} = rows[0]

        const senhaCorreta = await bcrypt.compare(senha, senhaUsuario)

        if (!senhaCorreta){
            return res.status(400).json({mensagem: 'Email ou senha inválida'})
        }

        const token = jwt.sign({id: usuario.id}, senhaJwt, {expiresIn: '8h'})

        return res.json({
            usuario,
            token
        })

    } catch (error){
    return res.status(500).json({mensagem: 'Erro interno do servidor'})
    }
}

const detalharUsuario = async (req, res) => {
    try {

        const {id, nome: userName, email: userEmail } = req.usuario;
        const perfilUsuario = { id, nome: userName, email: userEmail };

        return res.json(perfilUsuario)
    } catch {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });

    }
    }


const atualizarUsuario = async ( req, res ) =>{
    const {nome, email, senha} = req.body
    const { id } = req.usuario
    
    
        try {
            // Consulta o usuário logado pelo ID
      
            const consultaEmail = await pool.query(`
            select * from usuarios where email = $1`, [email]);
      
              if (consultaEmail.rowCount == 1){
                  const consultaUsuarioLogado = await pool.query(
                  'SELECT email FROM usuarios WHERE id = $1', [id]);
                  const emailUsuarioLogado = consultaUsuarioLogado.rows[0].email;
                  if(email !== emailUsuarioLogado){
                      return res.status(403).json({
                          mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.',
                        });
                      }
                  }
                  const senhaCriptografada = await bcrypt.hash(senha, 10);
                  const usuarioAtualizado = 'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4'; await pool.query(usuarioAtualizado, [nome, email, senhaCriptografada, id]);
                  return res.status(200).send()
          }catch (error) {
            return res.status(500).json({ mensagem: 'Erro interno no servidor' });
          }
    }



const listarCategorias = async (req, res) => {
    const categoriaListadas = await pool.query(
        'select * from categorias'
    )

    return res.status(200).json(categoriaListadas.rows)
}

module.exports = {
    cadastrarUsuario, login, detalharUsuario, atualizarUsuario, listarCategorias
}