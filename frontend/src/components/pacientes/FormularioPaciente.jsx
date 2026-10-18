import { useEffect, useState } from 'react';
import { LocateFixed } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const VAZIO = {
  nome: '', idade: '', endereco: '', responsavel_contato: '', latitude: '', longitude: '', observacoes_gerais: '',
};

// Formulário para cadastrar ou editar um paciente
export default function FormularioPaciente({ paciente, salvando, onSalvar, onCancelar }) {
  const [form, setForm] = useState(VAZIO);
  const [localizando, setLocalizando] = useState(false);
  const [avisoGps, setAvisoGps] = useState('');

  useEffect(() => {
    setAvisoGps('');
    setForm(paciente
      ? {
          nome: paciente.nome,
          idade: paciente.idade ?? '',
          endereco: paciente.endereco || '',
          responsavel_contato: paciente.responsavel_contato || '',
          latitude: paciente.latitude ?? '',
          longitude: paciente.longitude ?? '',
          observacoes_gerais: paciente.observacoes_gerais || '',
        }
      : VAZIO);
  }, [paciente]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Para quando o gestor estiver na casa do paciente: pega o GPS do aparelho
  function usarMinhaLocalizacao() {
    if (!navigator.geolocation) { setAvisoGps('Este navegador não tem GPS.'); return; }
    setLocalizando(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, latitude: pos.coords.latitude.toFixed(7), longitude: pos.coords.longitude.toFixed(7) }));
        setAvisoGps('');
        setLocalizando(false);
      },
      () => { setAvisoGps('Não consegui pegar a localização. Verifique a permissão do navegador.'); setLocalizando(false); },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSalvar(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Nome completo" name="nome" value={form.nome} onChange={handleChange} required />
      <div className="form-grid">
        <Input label="Idade" name="idade" type="number" min={18} max={130} value={form.idade} onChange={handleChange}
          ajuda="Atendimento voltado ao público adulto (18+)." />
        <Input label="Contato do responsável" name="responsavel_contato" value={form.responsavel_contato}
          onChange={handleChange} placeholder="Nome - (00) 00000-0000" />
      </div>
      <Input label="Endereço" name="endereco" value={form.endereco} onChange={handleChange} />

      <p className="form-secao">Localização da residência (opcional)</p>
      <div className="form-grid">
        <Input label="Latitude" name="latitude" type="number" step="any" value={form.latitude} onChange={handleChange} placeholder="-16.4708" />
        <Input label="Longitude" name="longitude" type="number" step="any" value={form.longitude} onChange={handleChange} placeholder="-54.6356" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: -6, marginBottom: 16, flexWrap: 'wrap' }}>
        <Button size="sm" variant="outline" icone={LocateFixed} onClick={usarMinhaLocalizacao} carregando={localizando}>
          Usar minha localização atual
        </Button>
        <span className="campo-ajuda" style={{ margin: 0 }}>
          {avisoGps || 'Usada para conferir se o check-in por GPS foi feito na casa do paciente.'}
        </span>
      </div>

      <Input label="Observações gerais" name="observacoes_gerais" type="textarea" value={form.observacoes_gerais}
        onChange={handleChange} placeholder="Rotina, restrições, cuidados especiais..." />

      <div className="form-acoes">
        <Button variant="outline" onClick={onCancelar}>Cancelar</Button>
        <Button type="submit" carregando={salvando}>{paciente ? 'Salvar alterações' : 'Cadastrar paciente'}</Button>
      </div>
    </form>
  );
}
