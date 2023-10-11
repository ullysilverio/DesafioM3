const bcrypt = require('bcrypt')
const pool = require('../conexao')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJwt')



const listarTransacoes = async (req, res) => {
    const usuarioLogado = req.usuario.id;
    try {
        const transacoesPorId = await pool.query(`
            select t.id, t.tipo, t.descricao, 
            t.valor, t.data, t.usuario_id, 
            t.categoria_id, c.descricao as categoria_nome 
            from 
            transacoes t join categorias c on t.categoria_id = c.id
            where t.usuario_id = $1`, [usuarioLogado])
            return res.status(200).json(transacoesPorId.rows);


    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

const listarIdTransacao = async (req, res) => {

    const { id } = req.params;
    const usuarioLogado = req.usuario.id;

    try {

        const TransacaoId = await pool.query(`
        select t.id, t.tipo, t.descricao, 
        t.valor, t.data, t.usuario_id, 
        t.categoria_id, c.descricao as categoria_nome 
        from 
        transacoes t join categorias c on t.categoria_id = c.id
        where t.usuario_id = $1 and t.id = $2`, [usuarioLogado, id]);

        if (TransacaoId.rowCount < 1) {
            return res.status(404).json({ mensagem: 'Transação não encontrada' })

        }
        return res.status(200).json(TransacaoId.rows[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

}

//tratar o que fazer com as negativas dos dados de entrada e saída
//onde colocar o id usuario
// dados e ordens de resposta nos exemplos estao errados

const cadastrarTransacao = async (req, res) => {

    const usuarioLogado = req.usuario.id;
    const { descricao, valor, data, categoria_id, tipo } = req.body


    try {

        const transacao = await pool.query(`
            insert into transacoes
            (tipo, descricao, valor, data, usuario_id, categoria_id)
            values
            ($1, $2, $3, $4, $5 , $6) returning *`, [tipo, descricao, valor, data, usuarioLogado, categoria_id]
        );

        const categoriaNomeQuery = await pool.query(`
        SELECT descricao AS categoria_nome
        FROM categorias WHERE id = $1`, [categoria_id]);

        const novaTransacao = {...transacao.rows[0],categoria_nome: categoriaNomeQuery.rows[0].categoria_nome,
        };
  
        return res.status(200).json(novaTransacao);

    } catch (error) {
        console.error("Erro: ", error);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

}


const atualizarTransacao = async (req, res) => {

    const usuarioLogado = req.usuario.id;
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body

    try {
        const consultaTrasacaoId = await pool.query(`
        select * from transacoes
        where usuario_id = $1 and id = $2`, [usuarioLogado, id]);

        if (consultaTrasacaoId.rowCount < 1) {
            return res.status(404).json({ mensagem: 'Transação não encontrada' });
        }

        await pool.query(`
        update transacoes
        set tipo = $1, descricao = $2, valor = $3, data = $4, categoria_id = $5
        where id = $6 and usuario_id = $7 `, [tipo, descricao, valor, data, categoria_id, id, usuarioLogado]);


        return res.status(204).send()

    } catch (error) {

        console.log(error);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

}


const excluirTransacao = async (req, res) => {

    const usuarioLogado = req.usuario.id;
    const { id } = req.params;

    try {
        const transacaoApagada =  await pool.query(`
        select * from transacoes
        where usuario_id = $1 and id = $2`, [usuarioLogado, id]);

        if (transacaoApagada.rowCount < 1) {
            return res.status(404).json({ mensagem: 'Transação não encontrada' });
        }

        await pool.query(`
        delete from transacoes
        where id = $1 and usuario_id = $2 `, [id, usuarioLogado]);

        return res.status(204).send()

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

}

const extrato = async (req, res) => {
    
    try {
        const entrada = await pool.query(`
            select sum(valor) from transacoes where usuario_id = $1 and tipo = $2`,
        [req.usuario.id, "entrada"])

        const saida = await pool.query(`
            select sum(valor) from transacoes where usuario_id = $1 and tipo = $2`,
        [req.usuario.id, "saida"])
        
        if (saida.rows[0].sum < 1 && entrada.rows[0].sum < 1) {
            return res.json({
                entrada: 0, 
                saida: 0
            })
        }

        else if (entrada.rows[0].sum < 1){
            return res.json({
                entrada: 0, 
                saida: saida.rows[0].sum
            })
        } else if (saida.rows[0].sum < 1) {
            return res.json({
                entrada: entrada.rows[0].sum, 
                saida: 0
            })
        } 
        
        else {
        
        return res.json({
            entrada: entrada.rows[0].sum, 
            saida: saida.rows[0].sum
        })
    }

    } catch (error) {
        
        return res.status(500).json({mensagem: "Erro interno do servidor"})
    }
}


module.exports = {
    listarTransacoes, listarIdTransacao, cadastrarTransacao, atualizarTransacao, excluirTransacao, extrato
}

