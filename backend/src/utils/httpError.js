// Cria um erro com status HTTP, tratado pelo errorHandler
function httpError(status, mensagem) {
  const err = new Error(mensagem);
  err.status = status;
  return err;
}

module.exports = httpError;
