import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import logo from "../assets/logo.png";
import "./Sidebar.css";

function Sidebar({ aberta, onFechar }) {
  const { user } = useAuth();

  return (
    <>
      {aberta && <div className="sidebar-overlay" onClick={onFechar}></div>}

      <aside className={`sidebar ${aberta ? "sidebar-aberta" : ""}`}>
        <div className="sidebar-logo">
          <img src={logo} alt="Logo da Igreja" />
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="sidebar-link" onClick={onFechar}>
            Dashboard
          </NavLink>
          <NavLink to="/lancamentos" className="sidebar-link" onClick={onFechar}>
            Lançamentos
          </NavLink>
          {user?.role === "PASTOR" && (
            <NavLink to="/usuarios" className="sidebar-link" onClick={onFechar}>
              Usuários
            </NavLink>
          )}
          <NavLink to="/perfil" className="sidebar-link" onClick={onFechar}>
            Meu Perfil
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;