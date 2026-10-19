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
import { useAuth } from '../context/AuthContext';

export default function Prontuarios() {
  const toast = useToast();
  const { ehGestao } = useAuth();
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
      // Depois de salvar, já mostro o histórico do paciente para conferir o registro novo
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
      <PageHeader
        titulo="Prontuário Digital"
        subtitulo={ehGestao
          ? 'Consulte o histórico padronizado de cada paciente.'
          : 'Registro padronizado de cada plantão, substituindo anotações em papel.'}
      />
      {/* Quem registra é quem fez o plantão; a gestão só consulta */}
      {!ehGestao && <FormularioProntuario plantoes={plantoes} salvando={salvando} onSalvar={salvar} />}

      <h2 className="secao-titulo" style={{ marginTop: ehGestao ? 0 : 32 }}>Histórico do paciente</h2>
      <div className="barra-filtros">
        <Input label="Paciente" name="paciente" value={pacienteId} onChange={(e) => setPacienteId(e.target.value)}
          options={pacientes.map((p) => ({ value: p.id, label: p.nome }))} />
      </div>
      <HistoricoPaciente registros={registros} />
    </>
  );
}
