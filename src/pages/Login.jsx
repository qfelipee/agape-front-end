import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { useAuth } from "../context/useAuth";
import logo from "../assets/logo.png";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const { loginUser } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setErro("");
        setCarregando(true);

        try {
            const data = await login(email, senha);
            loginUser(
                { id: data.id, nome: data.nome, email: data.email, role: data.role },
                data.token
            );
            navigate("/dashboard");
        } catch (err) {
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <img src={logo} alt="Logo da Igreja" className="login-logo" />
                <h1>Bem-vindo de volta</h1>
                <p className="login-subtitulo">Acesse o sistema financeiro</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-campo">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-campo">
                        <label>Senha</label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>

                    {erro && <p className="login-erro">{erro}</p>}

                    <button type="submit" className="login-botao" disabled={carregando}>
                        {carregando ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;