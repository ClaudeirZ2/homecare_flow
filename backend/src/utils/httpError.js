// Ajuda a criar um erro já com o status HTTP certo (o errorHandler usa esse status)
function httpError(status, mensagem) {
  const err = new Error(mensagem);
  err.status = status;
  return err;
}

module.exports = httpError;
