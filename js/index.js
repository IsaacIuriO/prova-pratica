// Express
const express = require('express');
const app = express();

// Session
const session = require('express-session')
app.use(session({
    secret:'qualquercoisanadaavesoquemuitosecreta',
    resave:false,
    saveUninitialized:false
}));

// mysql2/promise
const mysql = require('mysql2/promise');

// Importa o 'obterProduto' do bancoDados
const { obterProdutos, incluirProduto } = require('./repositorio/bancoDados');

// Uso do JSON
app.use(express.json());

// Uso do URLEncoded - extendido
app.use(express.urlencoded({extended:true}))



// Ir login - GET
app.get('/login', (req, res) =>{
    res.sendFile(__dirname + "/login.html")
});

// Ir index - GET
app.get('/', (req, res) =>{
    if(req.session.user){
        res.sendFile(__dirname + "/index.html");
    } else{
        res.redirect('/login')
    }
});

// Ir cadastro - GET
app.get('/cadastro', (req, res) =>{
    if(req.session.user){
        res.sendFile(__dirname + "/cadastro.html");
    } else{
        res.redirect('/login')
    }
});

// Ir estoque - GET
app.get('/estoque', async (req, res) =>{
    if(req.session.user){
        res.sendFile(__dirname + "/estoque.html");
    } else{
        res.redirect('/login')
    }

    const produtos = await obterProdutos();
    res.json({produtos})
});

// Ir alertas - GET
app.get('/alertas', (req, res) =>{
    if(req.session.user){
        res.sendFile(__dirname + "/alertas.html");
    } else{
        res.redirect('/login')
    }
});


// login - POST
app.post('/login', (req, res) =>{
    // resgata o usuario e senha
    const{ user, password } = req.body
    
    // verifica e redireciona conforme a veracidade
    if(user == "senai" && password == "senha"){
        req.session.user = user;
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

// cadastro - POST
app.post('/cadastro', async (req, res) =>{
    // resgata o usuario e senha
    const{ nome, marca, volume, embalagem, aplicacao, estoque, estoque_min } = req.body

    const resposta = await incluirProduto(nome, marca, volume, embalagem, aplicacao, estoque, estoque_min);

    if(resposta.affectedRows > 0){
        res.redirect('https://jsonplaceholder.typicode.com/estoque')
    } else {
        res.redirect('/cadastro')
        res.json({msg: 'Deu ruim ;-;'});
    }

});

// Bota o server pra funcionar
const port = 3100;
app.listen(port);
