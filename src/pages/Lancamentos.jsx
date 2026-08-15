import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import { getLancamentos, createLancamento, updateLancamento, deleteLancamento, getLancamentosParaExportar } from "../services/api";
import { exportarExcel, exportarPDF } from "../utils/export";
import LancamentoForm from "../components/LancamentoForm";
import ConfirmModal from "../components/ConfirmModal";
import "./Lancamentos.css";

function Lancamentos() {
  const { token, user } = useAuth();
  const [pagina, setPagina] = useState(null);
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(null);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const resultado = await getLancamentos(token, {
        tipo: filtroTipo || undefined,
        dataInicio: dataInicio ? `${dataInicio}T00:00:00` : undefined,
        dataFim: dataFim ? `${dataFim}T23:59:59` : undefined,
        page: numeroPagina,
        size: 10,
      });
      setPagina(resultado);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, [token, filtroTipo, dataInicio, dataFim, numeroPagina]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function handleSalvar(dados) {
    if (editando) {
      await updateLancamento(token, editando.id, dados);
    } else {
      await createLancamento(token, dados);
    }
    setMostrarForm(false);
    setEditando(null);
    carregar();
  }

  function pedirConfirmacaoExclusao(id) {
    setConfirmandoExclusao(id);
  }

  async function confirmarExclusao() {
    try {
      await deleteLancamento(token, confirmandoExclusao);
      carregar();
    } catch (err) {
      alert(err.message);
    } finally {
      setConfirmandoExclusao(null);
    }
  }

  function podeEditar(lancamento) {
    return user?.role === "PASTOR" || lancamento.userId === user?.id;
  }

  function limparFiltros() {
    setFiltroTipo("");
    setDataInicio("");
    setDataFim("");
    setNumeroPagina(0);
  }

  const colunasLancamento = [
    { titulo: "Tipo", valor: (l) => l.tipo },
    { titulo: "Descrição", valor: (l) => l.descricao },
    { titulo: "Valor", valor: (l) => `R$ ${l.valor.toFixed(2)}` },
    { titulo: "Forma de Pagamento", valor: (l) => l.formaPagamento || "-" },
    { titulo: "Data", valor: (l) => new Date(l.dtHoraLancado).toLocaleDateString("pt-BR") },
    { titulo: "Usuário", valor: (l) => l.userNome },
  ];

  async function handleExportarExcel() {
    const dados = await getLancamentosParaExportar(token, {
      tipo: filtroTipo || undefined,
      dataInicio: dataInicio ? `${dataInicio}T00:00:00` : undefined,
      dataFim: dataFim ? `${dataFim}T23:59:59` : undefined,
    });
    exportarExcel(dados, colunasLancamento, "lancamentos");
  }

  async function handleExportarPDF() {
    const dados = await getLancamentosParaExportar(token, {
      tipo: filtroTipo || undefined,
      dataInicio: dataInicio ? `${dataInicio}T00:00:00` : undefined,
      dataFim: dataFim ? `${dataFim}T23:59:59` : undefined,
    });
    exportarPDF(dados, colunasLancamento, "lancamentos", "Relatório de Lançamentos");
  }

  return (
    <div>
      <div className="lancamentos-header">
        <h1>Lançamentos</h1>
        <button
          className="btn-novo"
          onClick={() => {
            setEditando(null);
            setMostrarForm(true);
          }}
        >
          + Novo Lançamento
        </button>
      </div>

      <div className="lancamentos-filtros">
        <select
          value={filtroTipo}
          onChange={(e) => {
            setFiltroTipo(e.target.value);
            setNumeroPagina(0);
          }}
        >
          <option value="">Todos os tipos</option>
          <option value="ENTRADA">Entrada</option>
          <option value="SAIDA">Saída</option>
        </select>

        <input
          type="date"
          value={dataInicio}
          onChange={(e) => {
            setDataInicio(e.target.value);
            setNumeroPagina(0);
          }}
        />

        <input
          type="date"
          value={dataFim}
          onChange={(e) => {
            setDataFim(e.target.value);
            setNumeroPagina(0);
          }}
        />

        <button className="btn-limpar-filtro" onClick={limparFiltros}>
          Limpar filtros
        </button>

        <button className="btn-exportar" onClick={handleExportarExcel}>
          Exportar Excel
        </button>

        <button className="btn-exportar" onClick={handleExportarPDF}>
          Exportar PDF
        </button>
      </div>

      {carregando && <p>Carregando...</p>}
      {erro && <p className="lancamentos-erro">{erro}</p>}

      {pagina && (
        <>
          <div className="tabela-wrapper">
            <table className="lancamentos-tabela">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Forma</th>
                  <th>Data</th>
                  <th>Usuário</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pagina.content.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <span className={`badge ${l.tipo === "ENTRADA" ? "badge-verde" : "badge-vermelho"}`}>
                        {l.tipo}
                      </span>
                    </td>
                    <td>{l.descricao}</td>
                    <td>R$ {l.valor.toFixed(2)}</td>
                    <td>{l.formaPagamento || "-"}</td>
                    <td>{new Date(l.dtHoraLancado).toLocaleDateString("pt-BR")}</td>
                    <td>{l.userNome}</td>
                    <td>
                      {podeEditar(l) && (
                        <>
                          <button
                            className="btn-acao"
                            onClick={() => {
                              setEditando(l);
                              setMostrarForm(true);
                            }}
                          >
                            Editar
                          </button>
                          <button className="btn-acao btn-excluir" onClick={() => pedirConfirmacaoExclusao(l.id)}>
                            Excluir
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lancamentos-paginacao">
            <button
              disabled={pagina.number === 0}
              onClick={() => setNumeroPagina((p) => p - 1)}
            >
              Anterior
            </button>
            <span>
              Página {pagina.number + 1} de {pagina.totalPages || 1}
            </span>
            <button
              disabled={pagina.number + 1 >= pagina.totalPages}
              onClick={() => setNumeroPagina((p) => p + 1)}
            >
              Próxima
            </button>
          </div>
        </>
      )}

      {mostrarForm && (
        <LancamentoForm
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
          titulo="Excluir lançamento"
          mensagem="Tem certeza que deseja excluir este lançamento? Essa ação não pode ser desfeita."
          tipo="perigo"
          onConfirmar={confirmarExclusao}
          onCancelar={() => setConfirmandoExclusao(null)}
        />
      )}
    </div>
  );
}

export default Lancamentos;