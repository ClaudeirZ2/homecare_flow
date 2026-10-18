// Um "res" falso do Express para testar middlewares sem subir o servidor
function respostaFalsa() {
  const res = { statusCode: 200, corpo: null };
  res.status = (codigo) => { res.statusCode = codigo; return res; };
  res.json = (dados) => { res.corpo = dados; return res; };
  return res;
}

module.exports = { respostaFalsa };
