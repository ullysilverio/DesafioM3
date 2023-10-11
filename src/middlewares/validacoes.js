const pool = require('../conexao')

const verificaNome = (req, res, next) => {
    const { nome } = req.body

    if (!nome) {
        return res.status(400).json({ mensagem: "O campo 'Nome' é obrigatorio" })
    }
    next();
}

const verificaEmail =  (req, res, next) => {
    const {email} = req.body; 

    if (!email) {
        return res.status(400).json({ mensagem: "O campo 'Email' é obrigatorio" })
    }
    next();

}

const verificaSenha = (req, res, next) => {
    const { senha } = req.body

    if (!senha) {
        return res.status(400).json({ mensagem: "O campo 'Senha' é obrigatorio" })
    }

    next();
}


const verificaDescricao = (req, res, next) => {
    const { descricao } = req.body

    if (!descricao) {
        return res.status(400).json({ mensagem: "O campo 'Descricao' é obrigatorio" })
    }
    next();
}


const verificaValor = (req, res, next) => {
    const { valor } = req.body

    if (!valor) {
        return res.status(400).json({ mensagem: "O campo 'Valor' é obrigatorio" })
    }
    next();
}


const verificaData = (req, res, next) => {
    const { data } = req.body

    if (!data) {
        return res.status(400).json({ mensagem: "O campo 'Data' é obrigatorio" })
    }
    next();
}


const verificaCategoria = async (req, res, next) => {
    const { categoria_id } = req.body

    if (!categoria_id) {
        return res.status(400).json({ mensagem: "O campo 'Categoria_id' é obrigatorio" })
    }

    try{
        const categoria = await pool.query(`
        select * from categorias where id = $1`, [categoria_id]);

        if(categoria.rowCount < 1){
            return res.status(400).json({mensagem:'Id da categoria não encontrado'})
        }

    } catch(error){
        return res.status(500).json({mensagem: 'Erro interno do servidor'});
    }
    next();
}


const verificaTipo = (req, res, next) => {
    const { tipo } = req.body

    if (!tipo) {
        return res.status(400).json({ mensagem: "O campo 'Tipo' é obrigatorio" })
    }

    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({ mensagem: "O campo 'Tipo' deve ser 'entrada' ou 'saida'" })
    }
    next();
}







module.exports = {
    verificaNome, verificaEmail, verificaSenha, verificaDescricao, verificaValor, verificaData, verificaCategoria, verificaTipo
}