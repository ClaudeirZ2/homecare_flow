// Card de indicador (KPI): rótulo, valor, dica opcional e ícone do lucide-react
export default function Card({ title, value, icon: Icone, dica, children }) {
  return (
    <div className="card">
      {title !== undefined && (
        <div className="stat">
          <div>
            <p className="stat-rotulo">{title}</p>
            {value !== undefined && <p className="stat-valor numero">{value}</p>}
            {dica && <p className="stat-dica">{dica}</p>}
          </div>
          {Icone && <span className="stat-icone"><Icone size={18} strokeWidth={2} /></span>}
        </div>
      )}
      {children}
    </div>
  );
}
