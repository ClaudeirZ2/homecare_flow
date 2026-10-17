import { useCallback, useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ModalConfirmacao from '../components/ui/ModalConfirmacao';
import PageHeader from '../components/ui/PageHeader';
import FormularioEscala from '../components/escalas/FormularioEscala';
import TabelaEscalas from '../components/escalas/TabelaEscalas';
import FiltroEscalas from '../components/escalas/FiltroEscalas';
import { escalaService } from '../services/escalaService';
import { pacienteService } from '../services/pacienteService';
import { profissionalService } from '../services/profissionalService';
import { mensagemDeErro } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// CRUD COMPLETO de Escalas, 100% integrado ao backend
export default function Escalas() {
  const { ehGestao } = useAuth();
  const toast = useToast();

  const [escalas, setEscalas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [filtros, setFiltros] = useState({ status: '', data: '' });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [modalForm, setModalForm] = useState(false);
  const [escalaEditando, setEscalaEditando] = useState(null);
  const [escalaExcluindo, setEscalaExcluindo] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setEscalas(await escalaService.listar(filtros));
    } catch (err) {
      toast.erro(mensagemDeErro(err, 'Erro ao carregar escalas.'));
    } finally {
      setCarregando(false);
    }
  }, [filtros, toast]);

  useEffect(() => { carregar(); }, [carregar]);

  // Listas para os selects do formulário (apenas a gestão cria/edita)
  useEffect(() => {
    if (!ehGestao) return;
    Promise.all([pacienteService.listar(), profissionalService.listar()])
      .then(([pac, prof]) => { setPacientes(pac); setProfissionais(prof); })
      .catch((err) => toast.erro(mensagemDeErro(err)));
  }, [ehGestao, toast]);

  function abrirNovo() { setEscalaEditando(null); setModalForm(true); }
  function abrirEdicao(e) { setEscalaEditando(e); setModalForm(true); }

  async function salvar(dados) {
    setSalvando(true);
    try {
      if (escalaEditando) {
        await escalaService.atualizar(escalaEditando.id, dados);
        toast.sucesso('Escala atualizada.');
      } else {
        await escalaService.criar(dados);
        toast.sucesso('Escala criada.');
      }
      setModalForm(false);
      carregar();
    } catch (err) {
      toast.erro(mensagemDeErro(err, 'Erro ao salvar a escala.'));
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    setSalvando(true);
    try {
      await escalaService.remover(escalaExcluindo.id);
      toast.sucesso('Escala excluída.');
      setEscalaExcluindo(null);
      carregar();
    } catch (err) {
      toast.erro(mensagemDeErro(err, 'Erro ao excluir a escala.'));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <PageHeader
        titulo="Escalas"
        subtitulo={ehGestao ? 'Planeje quem atende quem, em qual dia e turno.' : 'Suas escalas de atendimento.'}
      >
        {ehGestao && <Button onClick={abrirNovo}>+ Nova escala</Button>}
      </PageHeader>

      <FiltroEscalas filtros={filtros} onChange={setFiltros} />

      {carregando
        ? <p className="texto-suave">Carregando...</p>
        : <TabelaEscalas escalas={escalas} podeEditar={ehGestao} onEditar={abrirEdicao} onExcluir={setEscalaExcluindo} />}

      <Modal aberto={modalForm} titulo={escalaEditando ? 'Editar escala' : 'Nova escala'} onFechar={() => setModalForm(false)}>
        <FormularioEscala
          escala={escalaEditando} pacientes={pacientes} profissionais={profissionais} salvando={salvando}
          onSalvar={salvar} onCancelar={() => setModalForm(false)}
        />
      </Modal>

      <ModalConfirmacao
        aberto={!!escalaExcluindo}
        mensagem={`Deseja realmente excluir a escala de ${escalaExcluindo?.paciente_nome}?`}
        carregando={salvando}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setEscalaExcluindo(null)}
      />
    </>
  );
}
