// Erros conhecidos do MySQL traduzidos para respostas amigáveis
const ERROS_MYSQL = {
  ER_DUP_ENTRY: { status: 409, erro: 'Registro duplicado: já existe um cadastro com esses dados.' },
  ER_NO_REFERENCED_ROW_2: { status: 400, erro: 'Registro relacionado não encontrado (verifique os IDs informados).' },
  ER_ROW_IS_REFERENCED_2: { status: 409, erro: 'Não é possível remover: existem registros vinculados.' },
  ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: { status: 400, erro: 'Valor inválido em um dos campos.' },
  WARN_DATA_TRUNCATED: { status: 400, erro: 'Valor inválido em um dos campos.' },
};

// Middleware final: captura qualquer erro não tratado nas rotas
function errorHandler(err, req, res, next) {
  console.error('🔥 Erro:', err.code || '', err.message);

  const conhecido = ERROS_MYSQL[err.code];
  if (conhecido) {
    return res.status(conhecido.status).json({ erro: conhecido.erro });
  }

  const status = err.status || 500;
  res.status(status).json({
    // Erros internos não expõem detalhes do banco para o cliente
    erro: status < 500 ? err.message : 'Erro interno no servidor.',
  });
}

module.exports = errorHandler;
