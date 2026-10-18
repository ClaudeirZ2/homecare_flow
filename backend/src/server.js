const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const documentacaoApi = require('./docs/openapi');

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
const auditoriaRoutes = require('./routes/auditoria.routes');

const app = express();

// O Render fica na frente da API (proxy). Isso faz o Express enxergar o IP real de quem acessa,
// que é usado pelo limite de tentativas de login.
app.set('trust proxy', 1);

// helmet: adiciona cabeçalhos HTTP de segurança. Desliguei o CSP porque a API só devolve JSON
// e ele atrapalharia a página de documentação (Swagger).
app.use(helmet({ contentSecurityPolicy: false }));

// CORS: no meu computador libero tudo. Na nuvem coloco em CORS_ORIGIN
// o endereço do front na Vercel, assim só o meu site consegue chamar a API.
// Dá para colocar mais de um endereço separado por vírgula.
const origens = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()) : '*';
app.use(cors({ origin: origens }));
app.use(express.json({ limit: '100kb' }));

// Limite de tentativas de login: no máximo 10 a cada 15 minutos por IP.
// Protege contra quem fica tentando adivinhar senhas (força bruta).
const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.LIMITE_LOGIN) || 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true, // só conta as tentativas que deram erro
  message: { erro: 'Muitas tentativas de login. Aguarde alguns minutos e tente de novo.' },
});

// Rota simples para saber se a API está no ar (o Render também usa para checar a saúde do serviço)
app.get('/', (req, res) => {
  res.json({ status: 'online', projeto: 'Home Care Flow API', documentacao: '/api/docs' });
});

// Aqui eu "monto" cada grupo de rotas no seu caminho
// Documentação interativa da API (Swagger): http://localhost:5000/api/docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(documentacaoApi, {
  customSiteTitle: 'Home Care Flow — API',
  swaggerOptions: { persistAuthorization: true },
}));

app.use('/api/auth/login', limiteLogin);
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/profissionais', profissionaisRoutes);
app.use('/api/escalas', escalasRoutes);
app.use('/api/plantoes', plantoesRoutes);
app.use('/api/prontuarios', prontuariosRoutes);
app.use('/api/pagamentos', pagamentosRoutes);
app.use('/api/auditoria', auditoriaRoutes);

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
