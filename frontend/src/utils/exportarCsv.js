// Gera e baixa um arquivo CSV (abre direto no Excel, com acentos corretos)
export function exportarCsv(nomeArquivo, colunas, linhas) {
  const escapar = (valor) => `"${String(valor ?? '').replace(/"/g, '""')}"`;
  const cabecalho = colunas.map((c) => escapar(c.titulo)).join(';');
  const corpo = linhas.map((l) => colunas.map((c) => escapar(c.valor(l))).join(';'));
  const conteudo = '﻿' + [cabecalho, ...corpo].join('\r\n'); // BOM para o Excel reconhecer UTF-8

  const url = URL.createObjectURL(new Blob([conteudo], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  link.click();
  URL.revokeObjectURL(url);
}
