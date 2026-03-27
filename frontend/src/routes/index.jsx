import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";

import InicioPage from "../pages/InicioPage";
import LoginPage from "../pages/LoginPage";
import CadastroPage from "../pages/CadastroPage";
import ProfissionalDetalhes from "../pages/ProfissionalDetalhes";
import HomePage from "../pages/HomePages";
import GerenciarProfissionaisPages from "../pages/GerenciarProfissionaisPages";
import GerenciarAgendaPage from "../pages/GerenciarAgendaPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/inicio" replace />} />

      {/* Público */}
      <Route path="/inicio" element={<InicioPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />

      {/* Todos logados */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* Cliente */}
      <Route
        path="/profissional/:id"
        element={
          <ProtectedRoute roles={["CLIENTE"]}>
            <ProfissionalDetalhes />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/gerenciar-profissionais"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <GerenciarProfissionaisPages />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profissional/:id/agenda"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <GerenciarAgendaPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );

  
}
