import { useCallback, useEffect, useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ModalConfirmacao from '../components/ui/ModalConfirmacao';
import PageHeader from '../components/ui/PageHeader';
import Input from '../components/ui/Input';
import EstadoVazio from '../components/ui/EstadoVazio';
import CardPaciente from '../components/pacientes/CardPaciente';
import FormularioPaciente from '../components/pacientes/FormularioPaciente';
import ModalQrCode from '../components/pacientes/ModalQrCode';
import { pacienteService } from '../services/pacienteService';
import { mensagemDeErro } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Tela do CRUD de Pacientes, com busca por nome
export default function Pacientes() {
  const { ehGestao, ehAdmin } = useAuth();
  const toast = useToast();

  const [pacientes, setPacientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [modalForm, setModalForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [excluindo, setExcluindo] = useState(null);
  const [pacienteQr, setPacienteQr] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setPacientes(await pacienteService.listar());
    } catch (err) {
      toast.erro(mensagemDeErro(err, 'Erro ao carregar pacientes.'));
    } finally {
      setCarregando(false);
    }
  }, [toast]);

  useEffect(() => { carregar(); }, [carregar]);

  async function salvar(dados) {
    setSalvando(true);
    try {
      if (editando) {
        await pacienteService.atualizar(editando.id, dados);
        toast.sucesso('Paciente atualizado.');
      } else {
        await pacienteService.criar(dados);
        toast.sucesso('Paciente cadastrado.');
      }
      setModalForm(false);
      carregar();
    } catch (err) {
      toast.erro(mensagemDeErro(err, 'Erro ao salvar o paciente.'));
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    setSalvando(true);
    try {
      await pacienteService.remover(excluindo.id);
      toast.sucesso('Paciente removido. O histórico de atendimentos foi preservado.');
      setExcluindo(null);
      carregar();
    } catch (err) {
      toast.erro(mensagemDeErro(err, 'Erro ao remover o paciente.'));
    } finally {
      setSalvando(false);
    }
  }

  const filtrados = pacientes.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <>
      <PageHeader
        titulo={ehGestao ? 'Pacientes' : 'Meus pacientes'}
        subtitulo={ehGestao
          ? `${pacientes.length} pacientes ativos em atendimento domiciliar.`
          : 'Pacientes que você atende: endereço e contato do responsável.'}
      >
        {ehGestao && <Button icone={Plus} onClick={() => { setEditando(null); setModalForm(true); }}>Novo paciente</Button>}
      </PageHeader>

      <div className="barra-filtros">
        <Input label="Buscar por nome" name="busca" value={busca} onChange={(e) => setBusca(e.target.value)}
          icone={Search} placeholder="Digite o nome do paciente" />
      </div>

      {carregando && <p className="texto-suave">Carregando...</p>}
      {!carregando && filtrados.length === 0 && (
        <EstadoVazio icone={Users} titulo="Nenhum paciente encontrado" descricao="Ajuste a busca ou cadastre um novo paciente." />
      )}

      <div className="grid-pacientes">
        {filtrados.map((p) => (
          <CardPaciente
            key={p.id} paciente={p} podeEditar={ehGestao} podeExcluir={ehAdmin}
            onEditar={(pac) => { setEditando(pac); setModalForm(true); }}
            onExcluir={setExcluindo}
            onVerQr={setPacienteQr}
          />
        ))}
      </div>

      <Modal aberto={modalForm} titulo={editando ? 'Editar paciente' : 'Novo paciente'} onFechar={() => setModalForm(false)}>
        <FormularioPaciente paciente={editando} salvando={salvando} onSalvar={salvar} onCancelar={() => setModalForm(false)} />
      </Modal>

      <ModalQrCode paciente={pacienteQr} onFechar={() => setPacienteQr(null)} />

      <ModalConfirmacao
        aberto={!!excluindo}
        mensagem={`Remover ${excluindo?.nome}? As escalas futuras serão canceladas, mas o histórico é mantido.`}
        textoConfirmar="Sim, remover"
        carregando={salvando}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setExcluindo(null)}
      />
    </>
  );
}
