import BarraProgresso from '../ui/BarraProgresso';

const SERIES = [
  { status: 'agendado', rotulo: 'Agendadas', cor: '#4b7fa8' },
  { status: 'em_andamento', rotulo: 'Em andamento', cor: '#d97706' },
  { status: 'concluido', rotulo: 'Concluídas', cor: '#1fa88a' },
  { status: 'cancelado', rotulo: 'Canceladas', cor: '#cbd5e1' },
];

// Distribuição das escalas por status (barras, como no mockup)
export default function ResumoEscalas({ escalas }) {
  return (
    <div className="painel">
      <div className="painel-cabecalho">
        <h3 className="painel-titulo">Escalas por status</h3>
        <span className="texto-suave numero">{escalas.length} no total</span>
      </div>
      {SERIES.map((s) => (
        <BarraProgresso
          key={s.status}
          rotulo={s.rotulo}
          cor={s.cor}
          valor={escalas.filter((e) => e.status === s.status).length}
          total={escalas.length}
        />
      ))}
    </div>
  );
}
