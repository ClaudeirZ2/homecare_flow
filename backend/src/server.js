const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testarConexao } = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Rotas
const authRoutes = require('./routes/auth.routes');
const pacientesRoutes = require('./routes/pacientes.routes');
const profissionaisRoutes = require('./routes/profissionais.routes');
const escalasRoutes = require('./routes/escalas.routes');
const plantoesRoutes = require('./routes/plantoes.routes');
const prontuariosRoutes = require('./routes/prontuarios.routes');
const pagamentosRoutes = require('./routes/pagamentos.routes');

const app = express();

// Em produção, defina CORS_ORIGIN (ex.: https://meu-front.com); em dev libera tudo
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Rota de verificação rápida (health check)
app.get('/', (req, res) => {
  res.json({ status: 'online', projeto: 'Home Care Flow API' });
});

// Montagem das rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/profissionais', profissionaisRoutes);
app.use('/api/escalas', escalasRoutes);
app.use('/api/plantoes', plantoesRoutes);
app.use('/api/prontuarios', prontuariosRoutes);
app.use('/api/pagamentos', pagamentosRoutes);

// Rota inexistente
app.use('/api', (req, res) => {
  res.status(404).json({ erro: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
});

// Tratamento de erros (deve ser o último middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET não definido. Copie .env.example para .env e preencha.');
  process.exit(1);
}

app.listen(PORT, async () => {
  console.log(`🚀 Home Care Flow API rodando em http://localhost:${PORT}`);
  await testarConexao();
});
