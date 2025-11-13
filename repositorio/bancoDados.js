const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host:'localhost',
    user:'root',
    database:'empresa_limpeza',
    password:''
});

async function obterProdutos(){
    sql = 'SELECT * FROM produtos';
    const [fields, rows] = await connection.execute(sql);

    return rows;
}

async function incluirProduto(nome, marca, volume, embalagem, aplicacao, estoque, estoque_min){
    const sql = 'INSERT INTO produtos (nome, marca, volume, embalagem, aplicacao, estoque, estoque_min) values (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await connection.execute(sql, [nome, marca, volume, embalagem, aplicacao, estoque, estoque_min]);
    return result;
}

module.exports = {
    obterProdutos,
    incluirProduto
}