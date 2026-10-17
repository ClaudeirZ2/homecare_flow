// Cabeçalho padrão das páginas: título, subtítulo e ações (ex.: botão "+ Novo")
export default function PageHeader({ titulo, subtitulo, children }) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{titulo}</h1>
        {subtitulo && <p className="page-subtitle">{subtitulo}</p>}
      </div>
      {children && <div className="page-header-acoes">{children}</div>}
    </div>
  );
}
