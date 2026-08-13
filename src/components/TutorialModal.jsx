import { useState } from "react";
import "./TutorialModal.css";

const SECOES = [
  {
    titulo: "Dashboard",
    conteudo: (
      <>
        <p>A tela inicial mostra um resumo financeiro da igreja.</p>
        <ul>
          <li><strong>Filtro de período:</strong> escolha "Todo o período" ou um mês/ano específico no topo direito.</li>
          <li><strong>Cards de Entradas, Saídas e Saldo:</strong> mostram os totais do período selecionado.</li>
          <li><strong>Gráfico de linha:</strong> mostra a evolução dos últimos 6 meses (sempre geral).</li>
          <li><strong>Gráficos de pizza:</strong> mostram como o dinheiro entrou e saiu, separado por forma de pagamento (Pix, Dinheiro, etc.).</li>
        </ul>
      </>
    ),
  },
  {
    titulo: "Lançamentos",
    conteudo: (
      <>
        <p>Aqui você registra todas as entradas e saídas de dinheiro.</p>
        <ul>
          <li><strong>+ Novo Lançamento:</strong> clique para registrar uma entrada ou saída.</li>
          <li><strong>Filtros:</strong> filtre por tipo (entrada/saída) e por período de datas.</li>
          <li><strong>Editar/Excluir:</strong> você só pode editar ou excluir seus próprios lançamentos. O Pastor pode gerenciar todos.</li>
          <li><strong>Paginação:</strong> use os botões "Anterior" e "Próxima" para navegar entre páginas de lançamentos.</li>
        </ul>
      </>
    ),
  },
  {
    titulo: "Usuários",
    conteudo: (
      <>
        <p>Área exclusiva do Pastor para gerenciar quem tem acesso ao sistema.</p>
        <ul>
          <li><strong>+ Novo Usuário:</strong> cadastre um novo Tesoureiro ou Pastor.</li>
          <li><strong>Editar:</strong> altere nome, email, função ou cargo de qualquer usuário.</li>
          <li><strong>Excluir:</strong> remove o acesso do usuário ao sistema. Você não pode excluir a si mesmo.</li>
        </ul>
      </>
    ),
  },
  {
    titulo: "Meu Perfil",
    conteudo: (
      <>
        <p>Qualquer usuário pode acessar e editar suas próprias informações aqui.</p>
        <ul>
          <li><strong>Nome, Função e Email:</strong> podem ser alterados livremente.</li>
          <li><strong>Senha:</strong> deixe em branco se não quiser trocar.</li>
          <li><strong>Cargo (Role):</strong> não pode ser alterado por você mesmo — apenas o Pastor pode mudar isso.</li>
        </ul>
      </>
    ),
  },
];

function TutorialModal({ onFechar }) {
  const [secaoAtiva, setSecaoAtiva] = useState(0);

  return (
    <div className="tutorial-overlay" onClick={onFechar}>
      <div className="tutorial-card" onClick={(e) => e.stopPropagation()}>
        <div className="tutorial-header">
          <h2>Como usar o sistema</h2>
          <button className="tutorial-fechar" onClick={onFechar}>✕</button>
        </div>

        <div className="tutorial-abas">
          {SECOES.map((secao, index) => (
            <button
              key={index}
              className={`tutorial-aba ${secaoAtiva === index ? "tutorial-aba-ativa" : ""}`}
              onClick={() => setSecaoAtiva(index)}
            >
              {secao.titulo}
            </button>
          ))}
        </div>

        <div className="tutorial-conteudo">
          {SECOES[secaoAtiva].conteudo}
        </div>
      </div>
    </div>
  );
}

export default TutorialModal;