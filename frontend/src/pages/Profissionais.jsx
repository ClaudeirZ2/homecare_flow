import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ModalConfirmacao from '../components/ui/ModalConfirmacao';
import PageHeader from '../components/ui/PageHeader';
import TabelaProfissionais from '../components/profissionais/TabelaProfissionais';
import FormularioProfissional from '../components/profissionais/FormularioProfissional';
import { profissionalService } from '../services/profissionalService';
import { mensagemDeErro } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Tela do CRUD de Cuidadores/Profissionais
export default function Profissionais() {
  const { ehGestao } = useAuth();
  const toast = useToast();

  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [modalForm, setModalForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [excluindo, setExcluindo] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setLista(await profissionalService.listar());
    } catch (err) {
      toast.erro(mensagemDeErro(err, 'Erro ao carregar profissionais.'));
    } finally {
      setCarregando(false);
    }
  }, [toast]);

  useEffect(() => { carregar(); }, [carregar]);

  async function salvar(dados) {
    setSalvando(true);
    try {
      if (editando) {
        await profissionalService.atualizar(editando.id, dados);
        toast.sucesso('Profissional atualizado.');
      } else {
        await profissionalService.criar(dados);
        toast.sucesso('Profissional cadastrado. Ele já pode entrar com o e-mail e a senha informados.');
      }
      setModalForm(false);
      carregar();
    } catch (err) {
      toast.erro(mensagemDeErro(err, 'Erro ao salvar o profissional.'));
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    setSalvando(true);
    try {
      await profissionalService.remover(excluindo.id);
      toast.sucesso('Profissional desativado.');
      setExcluindo(null);
      carregar();
    } catch (err) {
      toast.erro(mensagemDeErro(err, 'Erro ao remover o profissional.'));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <PageHeader titulo="Cuidadores" subtitulo="Técnicos e cuidadores que realizam os plantões.">
        {ehGestao && <Button icone={Plus} onClick={() => { setEditando(null); setModalForm(true); }}>Novo profissional</Button>}
      </PageHeader>

      <TabelaProfissionais
        profissionais={lista} carregando={carregando} podeEditar={ehGestao}
        onEditar={(p) => { setEditando(p); setModalForm(true); }}
        onExcluir={setExcluindo}
      />

      <Modal aberto={modalForm} titulo={editando ? 'Editar profissional' : 'Novo profissional'} onFechar={() => setModalForm(false)}>
        <FormularioProfissional profissional={editando} salvando={salvando} onSalvar={salvar} onCancelar={() => setModalForm(false)} />
      </Modal>

      <ModalConfirmacao
        aberto={!!excluindo}
        mensagem={`Desativar ${excluindo?.nome}? O acesso ao sistema será bloqueado e as escalas futuras canceladas. Plantões e pagamentos já registrados são mantidos.`}
        textoConfirmar="Sim, desativar"
        carregando={salvando}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setExcluindo(null)}
      />
    </>
  );
}
