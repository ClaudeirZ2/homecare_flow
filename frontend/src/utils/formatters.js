// Funções para formatar datas, valores e textos nas telas

// '2026-10-16' vira '16/10/2026'. Faço só com texto, porque com new Date() o fuso fazia o dia mudar.
export function formatarData(dataISO) {
  if (!dataISO) return '—';
  const [ano, mes, dia] = String(dataISO).slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

export function formatarDataHora(valor) {
  if (!valor) return '—';
  return new Date(valor).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

// Só o horário: '07:00'
export function formatarHora(valor) {
  if (!valor) return '—';
  return new Date(valor).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// 42.5 -> '42,5 h'
export function formatarHoras(valor) {
  if (valor === null || valor === undefined) return '—';
  return `${Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} h`;
}

// 85 -> '85 m' · 2450 -> '2,5 km'
export function formatarDistancia(metros) {
  if (metros === null || metros === undefined) return '—';
  if (metros < 1000) return `${metros} m`;
  return `${(metros / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km`;
}

// Data de hoje 'AAAA-MM-DD' no horário local (o toISOString usa UTC e à noite já dava o dia seguinte)
export function hojeISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export const ROTULOS = {
  manha: 'Manhã',
  tarde: 'Tarde',
  noite: 'Noite',
  '12x36': '12x36',
  agendado: 'Agendado',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
  finalizado: 'Finalizado',
  disponivel: 'Disponível',
  em_plantao: 'Em plantão',
  indisponivel: 'Indisponível',
  pendente: 'Pendente',
  pago: 'Pago',
  gps: 'GPS',
  qrcode: 'QR Code',
  admin: 'Administrador',
  gestor: 'Gestor',
  tecnico: 'Técnico',
};

export const rotulo = (valor) => ROTULOS[valor] || valor || '—';

// Transforma uma lista de chaves em opções de select, já com o nome bonito
export const opcoes = (...chaves) => chaves.map((c) => ({ value: c, label: rotulo(c) }));
