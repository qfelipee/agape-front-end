import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { updateUsuario } from "../services/api";
import "./Lancamentos.css";

function Perfil() {
  const { user, token, loginUser } = useAuth();
  const [nome, setNome] = useState(user?.nome || "");
  const [funcao, setFuncao] = useState(user?.funcao || "");
  const [email, setEmail] = useState(user?.email || "");
  const [senha, setSenha] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setSucesso("");
    setSalvando(true);

    try {
      const dados = { nome, funcao, email };
      if (senha) dados.senha = senha;

      const atualizado = await updateUsuario(token, user.id, dados);

      loginUser(
        { id: atualizado.id, nome: atualizado.nome, funcao: atualizado.funcao, email: atualizado.email, role: atualizado.role },
        token
      );

      setSenha("");
      setSucesso("Perfil atualizado com sucesso!");
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      <h1>Meu Perfil</h1>

      <div className="form-card" style={{ marginTop: "24px", maxWidth: "420px" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-campo">
            <label>Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="form-campo">
            <label>Função</label>
            <input type="text" value={funcao} onChange={(e) => setFuncao(e.target.value)} />
          </div>

          <div className="form-campo">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-campo">
            <label>Nova senha (deixe em branco para manter)</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>

          <div className="form-campo">
            <label>Cargo (Role)</label>
            <input type="text" value={user?.role} disabled />
          </div>

          {erro && <p className="form-erro">{erro}</p>}
          {sucesso && <p style={{ color: "var(--cor-verde)", fontSize: "13px" }}>{sucesso}</p>}

          <button type="submit" className="form-btn-salvar" disabled={salvando} style={{ width: "100%", marginTop: "12px" }}>
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Perfil;