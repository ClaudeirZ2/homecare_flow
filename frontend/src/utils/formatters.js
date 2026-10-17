// Funções de formatação compartilhadas pelas telas

// 'AAAA-MM-DD' -> 'DD/MM/AAAA' (sem usar Date, para não sofrer com fuso horário)
export function formatarData(dataISO) {
  if (!dataISO) return '—';
  const [ano, mes, dia] = String(dataISO).slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

export function formatarDataHora(valor) {
  if (!valor) return '—';
  return new Date(valor).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Data local de hoje no formato 'AAAA-MM-DD' (toISOString usaria UTC e erraria à noite)
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

// Converte um objeto { chave: rótulo } em opções para o <Input options>
export const opcoes = (...chaves) => chaves.map((c) => ({ value: c, label: rotulo(c) }));
