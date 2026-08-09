import { useState } from "react";
import "./LancamentoForm.css";

function LancamentoForm({ inicial, onSalvar, onCancelar }) {
  const [tipo, setTipo] = useState(inicial?.tipo || "ENTRADA");
  const [descricao, setDescricao] = useState(inicial?.descricao || "");
  const [valor, setValor] = useState(inicial?.valor || "");
  const [formaPagamento, setFormaPagamento] = useState(inicial?.formaPagamento || "");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      await onSalvar({
        tipo,
        descricao,
        valor: parseFloat(valor),
        formaPagamento,
      });
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="form-overlay">
      <div className="form-card">
        <h2>{inicial ? "Editar Lançamento" : "Novo Lançamento"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-campo">
            <label>Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="ENTRADA">Entrada</option>
              <option value="SAIDA">Saída</option>
            </select>
          </div>

          <div className="form-campo">
            <label>Descrição</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>

          <div className="form-campo">
            <label>Valor</label>
            <input
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
            />
          </div>

          <div className="form-campo">
            <label>Forma de Pagamento</label>
            <input
              type="text"
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
              placeholder="PIX, Dinheiro, Cartão..."
            />
          </div>

          {erro && <p className="form-erro">{erro}</p>}

          <div className="form-acoes">
            <button type="button" className="form-btn-cancelar" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="submit" className="form-btn-salvar" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LancamentoForm;