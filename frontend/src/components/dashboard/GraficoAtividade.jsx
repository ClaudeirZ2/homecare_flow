import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { hojeISO } from '../../utils/formatters';

const COR_ESCALAS = '#4b7fa8'; // azul da logo
const COR_PLANTOES = '#1fa88a'; // verde-água da logo

// Soma dias a uma data 'AAAA-MM-DD' sem passar por UTC
function somarDias(iso, dias) {
  const [a, m, d] = iso.split('-').map(Number);
  const data = new Date(a, m - 1, d + dias);
  const pad = (n) => String(n).padStart(2, '0');
  return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}`;
}

function TooltipGrafico({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="grafico-tooltip">
      <strong>{label}</strong>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
}

// Escalas previstas x plantões realizados, de 10 dias atrás até 4 dias à frente
export default function GraficoAtividade({ escalas, plantoes }) {
  const dados = useMemo(() => {
    const hoje = hojeISO();
    return Array.from({ length: 15 }, (_, i) => {
      const dia = somarDias(hoje, i - 10);
      return {
        dia: `${dia.slice(8, 10)}/${dia.slice(5, 7)}`,
        escalas: escalas.filter((e) => e.data_prevista === dia && e.status !== 'cancelado').length,
        plantoes: plantoes.filter((p) => p.data_prevista === dia).length,
      };
    });
  }, [escalas, plantoes]);

  return (
    <div className="painel">
      <div className="painel-cabecalho">
        <div>
          <h3 className="painel-titulo">Atividade da equipe</h3>
          <p className="texto-suave">Escalas previstas e plantões realizados por dia</p>
        </div>
        <div className="grafico-legenda">
          <span><i style={{ background: COR_ESCALAS }} /> Escalas</span>
          <span><i style={{ background: COR_PLANTOES }} /> Plantões</span>
        </div>
      </div>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <AreaChart data={dados} margin={{ top: 8, right: 20, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="gEscalas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COR_ESCALAS} stopOpacity={0.25} />
                <stop offset="100%" stopColor={COR_ESCALAS} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gPlantoes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COR_PLANTOES} stopOpacity={0.3} />
                <stop offset="100%" stopColor={COR_PLANTOES} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#eef2f6" vertical={false} />
            <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={1} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<TooltipGrafico />} />
            <Area type="monotone" dataKey="escalas" name="Escalas" stroke={COR_ESCALAS} strokeWidth={2} fill="url(#gEscalas)" />
            <Area type="monotone" dataKey="plantoes" name="Plantões" stroke={COR_PLANTOES} strokeWidth={2} fill="url(#gPlantoes)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
