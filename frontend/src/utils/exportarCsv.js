// Monta e baixa um arquivo CSV que abre direto no Excel
export function exportarCsv(nomeArquivo, colunas, linhas) {
  const escapar = (valor) => `"${String(valor ?? '').replace(/"/g, '""')}"`;
  const cabecalho = colunas.map((c) => escapar(c.titulo)).join(';');
  const corpo = linhas.map((l) => colunas.map((c) => escapar(c.valor(l))).join(';'));
  const conteudo = '﻿' + [cabecalho, ...corpo].join('\r\n'); // esse caractere invisível faz o Excel entender os acentos

  const url = URL.createObjectURL(new Blob([conteudo], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  link.click();
  URL.revokeObjectURL(url);
}
