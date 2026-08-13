import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Lancamentos from "./pages/Lancamentos";
import Usuarios from "./pages/Usuarios";
import Perfil from "./pages/Perfil";
import { ThemeProvider } from "./context/ThemeContext";

function RotaProtegida({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={token ? "/dashboard" : "/login"} />}
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <RotaProtegida>
            <Layout>
              <Dashboard />
            </Layout>
          </RotaProtegida>
        }
      />
      <Route
        path="/lancamentos"
        element={
          <RotaProtegida>
            <Layout>
              <Lancamentos />
            </Layout>
          </RotaProtegida>
        }
      />
      <Route
        path="/usuarios"
        element={
          <RotaProtegida>
            <Layout>
              <Usuarios />
            </Layout>
          </RotaProtegida>
        }
      />
      <Route
  path="/perfil"
  element={
    <RotaProtegida>
      <Layout>
        <Perfil />
      </Layout>
    </RotaProtegida>
  }
/>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;