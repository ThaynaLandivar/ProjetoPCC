// app.js
const express = require("express");
const app = express();
const path = require("path");
const routes = require("./routes/index"); // Importa as rotas

// Configuração do EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Usa as rotas definidas em index.js
app.use("/", routes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});