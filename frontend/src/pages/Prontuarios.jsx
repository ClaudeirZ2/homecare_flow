import { useEffect, useState } from 'react';
import FormularioProntuario from '../components/prontuario/FormularioProntuario';
import HistoricoPaciente from '../components/prontuario/HistoricoPaciente';
import Input from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import { pacienteService } from '../services/pacienteService';
import { plantaoService } from '../services/plantaoService';
import { prontuarioService } from '../services/prontuarioService';
import { mensagemDeErro } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Prontuarios() {
  const toast = useToast();
  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState('');
  const [registros, setRegistros] = useState([]);
  const [plantoes, setPlantoes] = useState([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    Promise.all([pacienteService.listar(), plantaoService.listar()])
      .then(([pac, pl]) => { setPacientes(pac); setPlantoes(pl); })
      .catch((err) => toast.erro(mensagemDeErro(err)));
  }, [toast]);

  useEffect(() => {
    if (!pacienteId) { setRegistros([]); return; }
    prontuarioService.listarPorPaciente(pacienteId)
      .then(setRegistros)
      .catch((err) => toast.erro(mensagemDeErro(err)));
  }, [pacienteId, toast]);

  async function salvar(dados) {
    setSalvando(true);
    try {
      await prontuarioService.criar(dados);
      toast.sucesso('Prontuário registrado!');
      // Mostra o histórico do paciente do plantão que acabou de ser registrado
      const plantao = plantoes.find((p) => String(p.id) === String(dados.plantao_id));
      if (plantao) {
        setPacienteId(String(plantao.paciente_id));
        setRegistros(await prontuarioService.listarPorPaciente(plantao.paciente_id));
      }
      return true;
    } catch (err) {
      toast.erro(mensagemDeErro(err, 'Erro ao registrar o prontuário.'));
      return false;
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <PageHeader titulo="Prontuário Digital" subtitulo="Registro padronizado de cada plantão, substituindo anotações em papel." />
      <FormularioProntuario plantoes={plantoes} salvando={salvando} onSalvar={salvar} />

      <h2 className="secao-titulo" style={{ marginTop: 32 }}>Histórico do paciente</h2>
      <div className="filtros">
        <Input label="Paciente" name="paciente" value={pacienteId} onChange={(e) => setPacienteId(e.target.value)}
          options={pacientes.map((p) => ({ value: p.id, label: p.nome }))} />
      </div>
      <HistoricoPaciente registros={registros} />
    </>
  );
}
