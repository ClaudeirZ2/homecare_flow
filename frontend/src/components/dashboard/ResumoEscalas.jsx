import BarraProgresso from '../ui/BarraProgresso';

const SERIES = [
  { status: 'agendado', rotulo: 'Agendadas', cor: 'var(--color-info)' },
  { status: 'em_andamento', rotulo: 'Em andamento', cor: 'var(--color-warning)' },
  { status: 'concluido', rotulo: 'Concluídas', cor: 'var(--color-accent)' },
  { status: 'cancelado', rotulo: 'Canceladas', cor: 'var(--color-danger)' },
];

// Distribuição das escalas por status (barras, como no mockup)
export default function ResumoEscalas({ escalas }) {
  return (
    <div className="painel">
      <h3 className="painel-titulo">Escalas por status</h3>
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
