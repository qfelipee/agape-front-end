import { useState } from "react";
import { useAuth } from "../context/useAuth";
import Sidebar from "./Sidebar";
import StatusOverlay from "./StatusOverlay";
import "./Layout.css";

function Layout({ children }) {
  const { user, logoutUser } = useAuth();
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [saindo, setSaindo] = useState(false);

  function handleLogout() {
    setSaindo(true);
    setTimeout(() => {
      logoutUser();
    }, 1000);
  }

  if (saindo) {
    return (
      <StatusOverlay
        tipo="saindo"
        titulo="Saindo da conta..."
        subtitulo="Até logo!"
      />
    );
  }

  return (
    <div className="layout">
      <Sidebar aberta={sidebarAberta} onFechar={() => setSidebarAberta(false)} />
      <div className="layout-content">
        <header className="layout-topbar">
          <button
            className="layout-hamburguer"
            onClick={() => setSidebarAberta(true)}
            aria-label="Abrir menu"
          >
            ☰
          </button>

          <div className="topbar-user">
            <div className="topbar-user-info">
              <span className="topbar-user-nome">{user?.nome}</span>
              <span className="topbar-user-role">{user?.role}</span>
            </div>
            <button className="topbar-sair" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </header>
        <main className="layout-main">{children}</main>
      </div>
    </div>
  );
}

export default Layout;