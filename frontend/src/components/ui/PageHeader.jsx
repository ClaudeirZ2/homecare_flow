// Cabeçalho que se repete em todas as páginas: título, subtítulo e botões do lado direito
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
