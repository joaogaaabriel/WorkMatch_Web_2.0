/**
 * WorkMatch 2.0 — App.jsx
 * Rotas idênticas às originais (não quebra contrato de navegação)
 */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import InicioPage              from "./pages/InicioPage";
import LoginPage               from "./pages/LoginPage";
import CadastroPage            from "./pages/CadastroPage";
import HomePages               from "./pages/HomePages";
import ProfissionalDetalhes    from "./pages/ProfissionalDetalhes";
import MeusAgendamentosPage    from "./pages/MeusAgendamentosPage";
import GerenciarProfissionaisPages from "./pages/GerenciarProfissionaisPages";
import GerenciarAgendaPage     from "./pages/GerenciarAgendaPage";
import ConfiguracaoPerfilPage  from "./pages/ConfiguracaoPerfilPage";
import SuporteClientePage      from "./pages/SuporteClientePage";

import "./styles.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redireciona / → /inicio */}
          <Route path="/" element={<Navigate to="/inicio" replace />} />

          {/* Rotas públicas */}
          <Route path="/inicio"   element={<InicioPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />

          {/* Rotas CLIENTE */}
          <Route path="/home" element={
            <ProtectedRoute><HomePages /></ProtectedRoute>
          } />

          <Route path="/profissional/:id" element={
            <ProtectedRoute roles={["CLIENTE"]}><ProfissionalDetalhes /></ProtectedRoute>
          } />

          {/* Rota antiga — compatibilidade */}
          <Route path="/perfil-profissional/:id" element={
            <ProtectedRoute roles={["CLIENTE"]}><ProfissionalDetalhes /></ProtectedRoute>
          } />

          <Route path="/meus-agendamentos" element={
            <ProtectedRoute roles={["CLIENTE"]}><MeusAgendamentosPage /></ProtectedRoute>
          } />

          <Route path="/suporte" element={
            <ProtectedRoute roles={["CLIENTE"]}><SuporteClientePage /></ProtectedRoute>
          } />

          <Route path="/perfil" element={
            <ProtectedRoute roles={["CLIENTE"]}><ConfiguracaoPerfilPage /></ProtectedRoute>
          } />

          {/* Rotas ADMIN */}
          <Route path="/gerenciar-profissionais" element={
            <ProtectedRoute roles={["ADMIN"]}><GerenciarProfissionaisPages /></ProtectedRoute>
          } />

          <Route path="/profissional/:id/agenda" element={
            <ProtectedRoute roles={["ADMIN"]}><GerenciarAgendaPage /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/inicio" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
