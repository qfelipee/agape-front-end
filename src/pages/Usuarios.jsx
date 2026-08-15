import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from "../services/api";
import UsuarioForm from "../components/UsuarioForm";
import ConfirmModal from "../components/ConfirmModal";
import { exportarExcel, exportarPDF } from "../utils/export";
import "./Lancamentos.css";

function Usuarios() {
  const { token, user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(null);
  const [avisoAutoExclusao, setAvisoAutoExclusao] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const resultado = await getUsuarios(token);
      setUsuarios(resultado);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, [token]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function handleSalvar(dados) {
    if (editando) {
      await updateUsuario(token, editando.id, dados);
    } else {
      await createUsuario(token, dados);
    }
    setMostrarForm(false);
    setEditando(null);
    carregar();
  }

  function pedirConfirmacaoExclusao(id) {
    if (id === user?.id) {
      setAvisoAutoExclusao(true);
      return;
    }
    setConfirmandoExclusao(id);
  }

  async function confirmarExclusao() {
    try {
      await deleteUsuario(token, confirmandoExclusao);
      carregar();
    } catch (err) {
      alert(err.message);
    } finally {
      setConfirmandoExclusao(null);
    }
  }

  const colunasUsuario = [
    { titulo: "Nome", valor: (u) => u.nome },
    { titulo: "Email", valor: (u) => u.email },
    { titulo: "Função", valor: (u) => u.funcao || "-" },
    { titulo: "Role", valor: (u) => u.role },
  ];

  function handleExportarExcel() {
    exportarExcel(usuarios, colunasUsuario, "usuarios");
  }

  function handleExportarPDF() {
    exportarPDF(usuarios, colunasUsuario, "usuarios", "Relatório de Usuários");
  }

  return (
    <div>
      <div className="lancamentos-header">
        <h1>Usuários</h1>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button className="btn-exportar" onClick={handleExportarExcel}>
            Exportar Excel
          </button>
          <button className="btn-exportar" onClick={handleExportarPDF}>
            Exportar PDF
          </button>
          <button
            className="btn-novo"
            onClick={() => {
              setEditando(null);
              setMostrarForm(true);
            }}
          >
            + Novo Usuário
          </button>
        </div>
      </div>

      {carregando && <p>Carregando...</p>}
      {erro && <p className="lancamentos-erro">{erro}</p>}

      {!carregando && !erro && (
        <div className="tabela-wrapper">
          <table className="lancamentos-tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Função</th>
                <th>Role</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td>{u.funcao || "-"}</td>
                  <td>
                    <span className={`badge ${u.role === "PASTOR" ? "badge-verde" : "badge-vermelho"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-acao"
                      onClick={() => {
                        setEditando(u);
                        setMostrarForm(true);
                      }}
                    >
                      Editar
                    </button>
                    {u.id !== user?.id && (
                      <button className="btn-acao btn-excluir" onClick={() => pedirConfirmacaoExclusao(u.id)}>
                        Excluir
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mostrarForm && (
        <UsuarioForm
          inicial={editando}
          onSalvar={handleSalvar}
          onCancelar={() => {
            setMostrarForm(false);
            setEditando(null);
          }}
        />
      )}

      {confirmandoExclusao && (
        <ConfirmModal
          titulo="Excluir usuário"
          mensagem="Tem certeza que deseja excluir este usuário? Essa ação não pode ser desfeita."
          tipo="perigo"
          onConfirmar={confirmarExclusao}
          onCancelar={() => setConfirmandoExclusao(null)}
        />
      )}

      {avisoAutoExclusao && (
        <ConfirmModal
          titulo="Ação não permitida"
          mensagem="Você não pode excluir seu próprio usuário."
          tipo="aviso"
          onConfirmar={() => setAvisoAutoExclusao(false)}
        />
      )}
    </div>
  );
}

export default Usuarios;