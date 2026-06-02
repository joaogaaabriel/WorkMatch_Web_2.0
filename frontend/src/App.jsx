/**
 * WorkMatch 2.0 — App.jsx
 */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import InicioPage             from "./pages/InicioPage";
import LoginPage              from "./pages/LoginPage";
import CadastroPage           from "./pages/CadastroPage";
import HomeCliente            from "./pages/HomeCliente";
import HomeProfissional       from "./pages/HomeProfissional";
import MeusServicos           from "./pages/MeusServicos";
import NovoServico            from "./pages/NovoServico";
import PerfilProfissional     from "./pages/PerfilProfissional";
import ConfiguracaoPerfilPage from "./pages/ConfiguracaoPerfilPage";
import SuporteClientePage     from "./pages/SuporteClientePage";
import CandidatosServico from "./pages/CandidatosServico";
import ChatServico from "./pages/ChatServico";

import "./styles.css";

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "PROFISSIONAL"
      ? <Navigate to="/home-profissional" replace />
      : <Navigate to="/home-cliente" replace />;
}

export default function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Públicas */}
            <Route path="/"         element={<Navigate to="/inicio" replace />} />
            <Route path="/inicio"   element={<InicioPage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/cadastro" element={<CadastroPage />} />

            {/* Redireciona /home pelo role */}
            <Route path="/home" element={
              <ProtectedRoute><HomeRedirect /></ProtectedRoute>
            } />

            {/* ── CLIENTE ── */}
            <Route path="/home-cliente" element={
              <ProtectedRoute roles={["CLIENTE"]}><HomeCliente /></ProtectedRoute>
            } />
            <Route path="/novo-servico" element={
              <ProtectedRoute roles={["CLIENTE"]}><NovoServico /></ProtectedRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedRoute roles={["CLIENTE"]}><ConfiguracaoPerfilPage /></ProtectedRoute>
            } />

            {/* ── PROFISSIONAL ── */}
            <Route path="/home-profissional" element={
              <ProtectedRoute roles={["PROFISSIONAL"]}><HomeProfissional /></ProtectedRoute>
            } />
            <Route path="/perfil-profissional" element={
              <ProtectedRoute roles={["PROFISSIONAL"]}><PerfilProfissional /></ProtectedRoute>
            } />

            {/* ── COMPARTILHADAS ── */}
            <Route path="/meus-servicos" element={
              <ProtectedRoute><MeusServicos /></ProtectedRoute>
            } />
            <Route path="/suporte" element={
              <ProtectedRoute><SuporteClientePage /></ProtectedRoute>
            } />

            <Route
                path="/servico/:servicoId/candidatos"
                element={
                  <ProtectedRoute roles={["CLIENTE"]}>
                    <CandidatosServico />
                  </ProtectedRoute>
                }
            />

            <Route
                path="/chat/:servicoId/:profissionalId"
                element={
                  <ProtectedRoute>
                    <ChatServico />
                  </ProtectedRoute>
                }
            />

            <Route
                path="/chat/:servicoId"
                element={<ChatServico />}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/inicio" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}