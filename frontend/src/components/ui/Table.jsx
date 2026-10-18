import { Inbox } from 'lucide-react';

// Tabela genérica que uso em várias telas.
// Recebo as colunas como lista: { chave, titulo, render (opcional), alinhar (opcional) }.
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
                {carregando
                  ? <div className="esqueleto-linhas" aria-label="Carregando">{[1, 2, 3, 4].map((n) => <span key={n} className="esqueleto" />)}</div>
                  : <div className="vazio"><Inbox size={28} /><strong>{vazio}</strong></div>}
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
