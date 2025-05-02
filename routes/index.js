const express = require("express");
const router = express.Router();

// Usuário padrão de primeiro acesso (simulação de um banco de dados)
const usuarioPadrao = {
    email: "admin@teste.com.br",
    senha: "admin@123",
    primeiroAcesso: true // Define se o usuário precisa alterar a senha
};

// Middleware para processar dados do formulário
router.use(express.urlencoded({ extended: true }));

// Rota para a página de login
router.get("/", (req, res) => {
    res.render("login");
});

// Rota de autenticação
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === usuarioPadrao.email && password === usuarioPadrao.senha) {
        // Se for primeiro acesso, redireciona para alteração de senha
        if (usuarioPadrao.primeiroAcesso) {
            return res.redirect("/primeiro-acesso");
        }
        return res.redirect("/dashboard");
    }

    // Caso contrário, redireciona de volta para login (pode incluir um erro)
    res.redirect("/");
});

// Rota para tela de primeiro acesso
router.get("/primeiro-acesso", (req, res) => {
    res.render("primeiro_acesso");
});

// Rota para processar alteração de senha
router.post("/alterar-senha", (req, res) => {
    const { novaSenha, confirmarSenha } = req.body;

    if (novaSenha === confirmarSenha) {
        // Atualiza a senha e remove a obrigatoriedade do primeiro acesso
        usuarioPadrao.senha = novaSenha;
        usuarioPadrao.primeiroAcesso = false;

        return res.redirect("/dashboard");
    }

    // Redireciona para a mesma página com erro se as senhas não coincidirem
    res.send("As senhas não coincidem. Tente novamente.");
});

// Rota para o dashboard
router.get("/dashboard", (req, res) => {
    res.render("dashboard");
});

// Rota para logout
router.get("/logout", (req, res) => {
    res.redirect("/");
});

// Rota para tratar o envio do formulário
router.get("/requisicao", (req, res) => {
    res.render("requisicao");
});

module.exports = router;
