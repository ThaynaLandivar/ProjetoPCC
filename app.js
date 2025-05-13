// app.js
const express = require("express");
const app = express();
const path = require("path");
const routes = require("./routes/index");
const { User, sequelize } = require('./user');
const { Sequelize } = require('sequelize');

// Sincroniza o banco ao iniciar o app
sequelize.sync();

// Configura o EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Processar dados do corpo da requisição
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas definidas em index.js
app.use("/", routes);

// Rota para solicitar acesso (gerar senha temporária)
app.post('/solicitar-acesso', async (req, res) => {
    try {
        const { email, ddd, telefone } = req.body;
        if (!email || !ddd || !telefone) {
            return res.status(400).send('E-mail, DDD ou telefone não informado.');
        }
        const senhaTemporaria = Math.floor(100000 + Math.random() * 900000).toString();
        const numeroCompleto = `55${ddd}${telefone}`;

        // Cria ou atualiza o usuário
        await User.upsert({
            email: email,
            senha: senhaTemporaria,
            telefone: numeroCompleto
        });

        // Busca o usuário salvo para pegar o ID
        const user = await User.findOne({ where: { email: email } });

        // Exibe no terminal apenas ID, email, senha e telefone
        if (user) {
            console.log('Usuário salvo:', user.id, user.email, user.senha, user.telefone);
        }

        const mensagem = encodeURIComponent(`Sua senha temporária é: ${senhaTemporaria}. Por favor, altere-a após o primeiro acesso.`);
        const linkWhatsappWeb = `https://wa.me/${numeroCompleto}?text=${mensagem}`;

        res.render('senha_gerada', {
            senhaTemporaria,
            linkWhatsappWeb
        });
    } catch (error) {
        console.error('Erro ao processar solicitação:', error);
        res.status(500).send('Erro ao processar solicitação.');
    }
});

// Rota para alterar senha
app.post('/alterar-senha', async (req, res) => {
    const { ddd, telefone, novaSenha } = req.body;
    const numeroCompleto = `55${ddd}${telefone}`;
    try {
        const user = await User.findOne({ where: { telefone: numeroCompleto } });
        if (!user) {
            return res.status(404).send('Usuário não encontrado.');
        }
        user.senha = novaSenha;
        await user.save();
        res.send('Senha alterada com sucesso!');
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        res.status(500).send('Erro ao alterar senha.');
    }
});

// Rota de login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Busca pelo e-mail
        const user = await User.findOne({ where: { email: username } });
        if (!user) {
            return res.status(401).send('Usuário não encontrado.');
        }
        if (user.senha !== password) {
            return res.status(401).send('Senha incorreta.');
        }
        res.send('Login realizado com sucesso!');
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).send('Erro no login.');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Rota para exibir o formulário HTML (caso queira usar um formulário direto)
app.get('/formulario', (req, res) => {
    res.send(formHTML); // Certifique-se de definir formHTML ou remova esta rota se não usar
});

// Rota para exibir a página de requisição
app.get('/requisicao', (req, res) => {
    res.render('requisicao');
});