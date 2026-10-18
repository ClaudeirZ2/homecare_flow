// Documentação da API no padrão OpenAPI 3 (aparece em /api/docs com o Swagger UI).
// Escrevi em JS em vez de JSON para poder reaproveitar os pedaços que se repetem.

const erro = { $ref: '#/components/schemas/Erro' };
const respostasPadrao = {
  400: { description: 'Dados inválidos', content: { 'application/json': { schema: erro } } },
  401: { description: 'Sem login ou token vencido', content: { 'application/json': { schema: erro } } },
  403: { description: 'Sem permissão para este perfil', content: { 'application/json': { schema: erro } } },
};
const idPath = { name: 'id', in: 'path', required: true, schema: { type: 'integer' } };
const corpo = (schema) => ({ required: true, content: { 'application/json': { schema } } });

function crud(tag, nome, schema, exemplo) {
  return {
    [`/${nome}`]: {
      get: { tags: [tag], summary: `Lista ${nome}`, responses: { 200: { description: 'OK' }, ...respostasPadrao } },
      post: {
        tags: [tag], summary: `Cria (gestão)`, requestBody: corpo({ ...schema, example: exemplo }),
        responses: { 201: { description: 'Criado' }, 409: { description: 'Conflito' }, ...respostasPadrao },
      },
    },
    [`/${nome}/{id}`]: {
      get: { tags: [tag], summary: 'Detalha', parameters: [idPath], responses: { 200: { description: 'OK' }, 404: { description: 'Não encontrado' } } },
      put: {
        tags: [tag], summary: 'Atualiza (gestão)', parameters: [idPath], requestBody: corpo(schema),
        responses: { 200: { description: 'Atualizado' }, ...respostasPadrao },
      },
      delete: {
        tags: [tag], summary: 'Remove (gestão)', parameters: [idPath],
        responses: { 204: { description: 'Removido' }, 404: { description: 'Não encontrado' }, 409: { description: 'Tem histórico' } },
      },
    },
  };
}

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Home Care Flow API',
    version: '2.0.0',
    description:
      'API REST do Home Care Flow: escalas, plantões (check-in/out por GPS ou QR Code), prontuário e pagamentos.\n\n'
      + '**Como testar:** faça o `POST /auth/login` com `admin@homecareflow.com` / `123456`, copie o `token` '
      + 'e clique em **Authorize** (cadeado) para usar as outras rotas.',
  },
  servers: [{ url: '/api' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      Erro: { type: 'object', properties: { erro: { type: 'string', example: 'Mensagem do erro' } } },
      Escala: {
        type: 'object',
        required: ['paciente_id', 'profissional_id', 'data_prevista', 'turno'],
        properties: {
          paciente_id: { type: 'integer' },
          profissional_id: { type: 'integer' },
          data_prevista: { type: 'string', format: 'date' },
          turno: { type: 'string', enum: ['manha', 'tarde', 'noite', '12x36'] },
          status: { type: 'string', enum: ['agendado', 'em_andamento', 'concluido', 'cancelado'] },
          observacoes: { type: 'string' },
        },
      },
      Paciente: {
        type: 'object',
        required: ['nome'],
        properties: {
          nome: { type: 'string' },
          idade: { type: 'integer', minimum: 18 },
          endereco: { type: 'string' },
          responsavel_contato: { type: 'string' },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          observacoes_gerais: { type: 'string' },
        },
      },
      Profissional: {
        type: 'object',
        required: ['nome', 'email'],
        properties: {
          nome: { type: 'string' },
          email: { type: 'string', format: 'email' },
          senha: { type: 'string', description: 'Só no cadastro (mínimo 6 caracteres)' },
          telefone: { type: 'string' },
          especialidade: { type: 'string' },
          valor_hora: { type: 'number' },
          status_disponibilidade: { type: 'string', enum: ['disponivel', 'em_plantao', 'indisponivel'] },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Autenticação' }, { name: 'Escalas', description: 'CRUD completo' },
    { name: 'Pacientes', description: 'CRUD completo' }, { name: 'Profissionais', description: 'CRUD completo' },
    { name: 'Plantões' }, { name: 'Prontuários' }, { name: 'Pagamentos' }, { name: 'Auditoria' },
  ],
  paths: {
    '/auth/login': {
      post: {
        tags: ['Autenticação'], summary: 'Login (devolve o token JWT)', security: [],
        requestBody: corpo({
          type: 'object', properties: { email: { type: 'string' }, senha: { type: 'string' } },
          example: { email: 'admin@homecareflow.com', senha: '123456' },
        }),
        responses: { 200: { description: 'OK: { usuario, token }' }, 401: { description: 'Email ou senha inválidos' }, 429: { description: 'Muitas tentativas' } },
      },
    },
    '/auth/me': { get: { tags: ['Autenticação'], summary: 'Usuário logado', responses: { 200: { description: 'OK' }, ...respostasPadrao } } },
    '/auth/senha': {
      put: {
        tags: ['Autenticação'], summary: 'Trocar a própria senha',
        requestBody: corpo({ type: 'object', properties: { senhaAtual: { type: 'string' }, novaSenha: { type: 'string' } } }),
        responses: { 200: { description: 'Senha alterada' }, ...respostasPadrao },
      },
    },
    ...crud('Escalas', 'escalas', { $ref: '#/components/schemas/Escala' },
      { paciente_id: 1, profissional_id: 1, data_prevista: '2026-12-20', turno: 'manha' }),
    ...crud('Pacientes', 'pacientes', { $ref: '#/components/schemas/Paciente' },
      { nome: 'Maria da Silva', idade: 80, endereco: 'Rua A, 10' }),
    ...crud('Profissionais', 'profissionais', { $ref: '#/components/schemas/Profissional' },
      { nome: 'Rita Alves', email: 'rita@exemplo.com', senha: '123456', especialidade: 'Cuidadora', valor_hora: 20 }),
    '/plantoes': { get: { tags: ['Plantões'], summary: 'Lista (técnico: só os dele)', responses: { 200: { description: 'OK' } } } },
    '/plantoes/checkin': {
      post: {
        tags: ['Plantões'], summary: 'Check-in por GPS ou QR Code (só no dia da escala)',
        requestBody: corpo({
          type: 'object',
          properties: {
            escala_id: { type: 'integer' }, metodo: { type: 'string', enum: ['gps', 'qrcode'] },
            lat: { type: 'number' }, lng: { type: 'number' }, codigo: { type: 'string' },
          },
          example: { escala_id: 4, metodo: 'qrcode', codigo: 'QR-PAC-0001' },
        }),
        responses: { 201: { description: 'Plantão criado (com distância e fora_do_raio)' }, 409: { description: 'Já teve check-in ou não é o dia' }, ...respostasPadrao },
      },
    },
    '/plantoes/{id}/checkout': {
      put: { tags: ['Plantões'], summary: 'Check-out', parameters: [idPath], responses: { 200: { description: 'Plantão finalizado' }, 409: { description: 'Já finalizado' } } },
    },
    '/prontuarios': {
      post: {
        tags: ['Prontuários'], summary: 'Registra prontuário de um plantão',
        requestBody: corpo({ type: 'object', example: { plantao_id: 1, pressao_arterial: '12/8', temperatura: 36.5, observacoes: 'Sem intercorrências' } }),
        responses: { 201: { description: 'Criado' }, ...respostasPadrao },
      },
    },
    '/prontuarios/paciente/{id}': {
      get: { tags: ['Prontuários'], summary: 'Histórico do paciente', parameters: [idPath], responses: { 200: { description: 'OK' } } },
    },
    '/pagamentos/relatorio/{mes}': {
      get: {
        tags: ['Pagamentos'], summary: 'Calcula e grava o fechamento do mês (gestão)',
        parameters: [{ name: 'mes', in: 'path', required: true, schema: { type: 'string', example: '2026-10' } }],
        responses: { 200: { description: 'OK' }, ...respostasPadrao },
      },
    },
    '/pagamentos/meus': {
      get: {
        tags: ['Pagamentos'], summary: 'Meus ganhos (técnico): resumo do mês + histórico',
        parameters: [{ name: 'mes', in: 'query', schema: { type: 'string', example: '2026-10' } }],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/pagamentos/{id}/pagar': {
      put: { tags: ['Pagamentos'], summary: 'Marca como pago (gestão)', parameters: [idPath], responses: { 200: { description: 'OK' }, 409: { description: 'Já pago' } } },
    },
    '/auditoria': {
      get: {
        tags: ['Auditoria'], summary: 'Últimas ações registradas (gestão)',
        parameters: [{ name: 'limite', in: 'query', schema: { type: 'integer', default: 10 } }],
        responses: { 200: { description: 'OK' }, ...respostasPadrao },
      },
    },
  },
};
