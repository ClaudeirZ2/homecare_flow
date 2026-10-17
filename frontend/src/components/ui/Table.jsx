// Tabela genérica: recebe colunas [{ chave, titulo, render? }] e dados
export default function Table({ colunas, dados, vazio = 'Nenhum registro encontrado.' }) {
  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {colunas.map((c) => (
              <th key={c.chave} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>
                {c.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dados.length === 0 && (
            <tr><td colSpan={colunas.length} style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-muted)' }}>{vazio}</td></tr>
          )}
          {dados.map((linha, i) => (
            <tr key={linha.id ?? i}>
              {colunas.map((c) => (
                <td key={c.chave} style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
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
