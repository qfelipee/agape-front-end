import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import { getDashboard } from "../services/api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import "./Dashboard.css";

const CORES = ["#f5a623", "#22c55e", "#ef4444", "#06b6d4", "#a855f7", "#ec4899"];

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function Dashboard() {
  const { token } = useAuth();
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  const anoAtual = new Date().getFullYear();
  const [filtro, setFiltro] = useState("todos"); // "todos" | "mes-ano"
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(anoAtual);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const params = filtro === "mes-ano" ? { mes, ano } : {};
      const resultado = await getDashboard(token, params);
      setDados(resultado);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, [token, filtro, mes, ano]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p style={{ color: "var(--cor-vermelho)" }}>{erro}</p>;
  if (!dados) return null;

  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard</h1>

        <div className="dashboard-filtro">
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="todos">Todo o período</option>
            <option value="mes-ano">Mês/Ano específico</option>
          </select>

          {filtro === "mes-ano" && (
            <>
              <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
                {MESES.map((nomeMes, index) => (
                  <option key={index} value={index + 1}>
                    {nomeMes}
                  </option>
                ))}
              </select>

              <select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
                {Array.from({ length: 5 }, (_, i) => anoAtual - i).map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      <div className="dashboard-kpis">
        <div className="kpi-card">
          <p>Total de Entradas</p>
          <h2 style={{ color: "var(--cor-verde)" }}>R$ {dados.resumo.totalEntradas.toFixed(2)}</h2>
        </div>
        <div className="kpi-card">
          <p>Total de Saídas</p>
          <h2 style={{ color: "var(--cor-vermelho)" }}>R$ {dados.resumo.totalSaidas.toFixed(2)}</h2>
        </div>
        <div className="kpi-card">
          <p>Saldo do Período</p>
          <h2 style={{ color: "var(--cor-dourado)" }}>R$ {dados.resumo.saldoFinal.toFixed(2)}</h2>
        </div>
      </div>

      <div className="dashboard-grafico-linha">
  <h3>Evolução (últimos 6 meses)</h3>
  <ResponsiveContainer width="100%" height={320}>
    <LineChart data={dados.evolucaoMensal} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
      <XAxis dataKey="mes" stroke="#a3a3a3" tick={{ fontSize: 13 }} />
      <YAxis
        stroke="#a3a3a3"
        tick={{ fontSize: 12 }}
        tickFormatter={(valor) => `R$ ${valor.toLocaleString("pt-BR")}`}
        width={90}
      />
      <Tooltip
        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px" }}
        formatter={(valor) => `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
      />
      <Legend />
      <Line
        type="linear"
        dataKey="entradas"
        stroke="#22c55e"
        strokeWidth={3}
        name="Entradas"
        dot={{ r: 6, fill: "#22c55e" }}
        activeDot={{ r: 8 }}
      />
      <Line
        type="linear"
        dataKey="saidas"
        stroke="#ef4444"
        strokeWidth={3}
        name="Saídas"
        dot={{ r: 6, fill: "#ef4444" }}
        activeDot={{ r: 8 }}
      />
    </LineChart>
  </ResponsiveContainer>
</div>

      <div className="dashboard-pizzas">
        <div className="dashboard-pizza-item">
          <h3>Entradas por Forma de Pagamento</h3>
          {dados.distribuicaoEntradas.length === 0 ? (
            <p className="dashboard-vazio">Sem entradas no período</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={dados.distribuicaoEntradas}
                  dataKey="total"
                  nameKey="formaPagamento"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {dados.distribuicaoEntradas.map((entry, index) => (
                    <Cell key={`entrada-${index}`} fill={CORES[index % CORES.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="dashboard-pizza-item">
          <h3>Saídas por Forma de Pagamento</h3>
          {dados.distribuicaoSaidas.length === 0 ? (
            <p className="dashboard-vazio">Sem saídas no período</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={dados.distribuicaoSaidas}
                  dataKey="total"
                  nameKey="formaPagamento"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {dados.distribuicaoSaidas.map((entry, index) => (
                    <Cell key={`saida-${index}`} fill={CORES[index % CORES.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;