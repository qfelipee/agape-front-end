import { useState } from "react";
import "../components/LancamentoForm.css";

function UsuarioForm({ inicial, onSalvar, onCancelar }) {
  const [nome, setNome] = useState(inicial?.nome || "");
  const [funcao, setFuncao] = useState(inicial?.funcao || "");
  const [email, setEmail] = useState(inicial?.email || "");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState(inicial?.role || "TESOUREIRO");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      const dados = { nome, funcao, email, role };
      if (senha) dados.senha = senha;
      if (!inicial && !senha) {
        throw new Error("Senha é obrigatória para novo usuário");
      }
      await onSalvar(dados);
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="form-overlay">
      <div className="form-card">
        <h2>{inicial ? "Editar Usuário" : "Novo Usuário"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-campo">
            <label>Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="form-campo">
            <label>Função</label>
            <input type="text" value={funcao} onChange={(e) => setFuncao(e.target.value)} placeholder="Diácono, Secretário..." />
          </div>

          <div className="form-campo">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-campo">
            <label>{inicial ? "Nova senha (deixe em branco para manter)" : "Senha"}</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>

          <div className="form-campo">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="TESOUREIRO">Tesoureiro</option>
              <option value="PASTOR">Pastor</option>
            </select>
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

export default UsuarioForm;