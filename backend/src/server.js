const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testarConexao } = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Rotas (cada arquivo cuida de um recurso da API)
const authRoutes = require('./routes/auth.routes');
const pacientesRoutes = require('./routes/pacientes.routes');
const profissionaisRoutes = require('./routes/profissionais.routes');
const escalasRoutes = require('./routes/escalas.routes');
const plantoesRoutes = require('./routes/plantoes.routes');
const prontuariosRoutes = require('./routes/prontuarios.routes');
const pagamentosRoutes = require('./routes/pagamentos.routes');

const app = express();

// CORS: no meu computador libero tudo. Na nuvem coloco em CORS_ORIGIN
// o endereço do front na Vercel, assim só o meu site consegue chamar a API.
// Dá para colocar mais de um endereço separado por vírgula.
const origens = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()) : '*';
app.use(cors({ origin: origens }));
app.use(express.json());

// Rota simples para saber se a API está no ar (o Render também usa para checar a saúde do serviço)
app.get('/', (req, res) => {
  res.json({ status: 'online', projeto: 'Home Care Flow API' });
});

// Aqui eu "monto" cada grupo de rotas no seu caminho
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/profissionais', profissionaisRoutes);
app.use('/api/escalas', escalasRoutes);
app.use('/api/plantoes', plantoesRoutes);
app.use('/api/prontuarios', prontuariosRoutes);
app.use('/api/pagamentos', pagamentosRoutes);

// Se ninguém respondeu até aqui, a rota não existe
app.use('/api', (req, res) => {
  res.status(404).json({ erro: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
});

// O tratamento de erros precisa ser o último middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Sem o segredo do JWT o login não funciona, então nem deixo o servidor subir
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET não definido. Copie .env.example para .env e preencha.');
  process.exit(1);
}

app.listen(PORT, async () => {
  console.log(`🚀 Home Care Flow API rodando na porta ${PORT}`);
  await testarConexao();
});
