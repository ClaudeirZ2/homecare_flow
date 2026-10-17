import { Inbox } from 'lucide-react';

// Tabela genérica: recebe colunas [{ chave, titulo, render?, alinhar? }] e dados
export default function Table({ colunas, dados, vazio = 'Nenhum registro encontrado.', carregando }) {
  return (
    <div className="tabela-wrap">
      <table className="tabela">
        <thead>
          <tr>
            {colunas.map((c) => (
              <th key={c.chave} style={c.alinhar ? { textAlign: c.alinhar } : undefined}>{c.titulo}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(carregando || dados.length === 0) && (
            <tr>
              <td colSpan={colunas.length}>
                <div className="vazio">
                  {carregando ? 'Carregando...' : <><Inbox size={28} /><strong>{vazio}</strong></>}
                </div>
              </td>
            </tr>
          )}
          {!carregando && dados.map((linha, i) => (
            <tr key={linha.id ?? i}>
              {colunas.map((c) => (
                <td key={c.chave} style={c.alinhar ? { textAlign: c.alinhar } : undefined}>
                  {c.render ? c.render(linha) : linha[c.chave]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
