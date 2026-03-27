import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import InicioPage from "./pages/InicioPage";
import LoginPage from "./pages/LoginPage";
import CadastroPage from "./pages/CadastroPage";
import ProfissionalDetalhes from "./pages/ProfissionalDetalhes";
import HomePage from "./pages/HomePages";
import GerenciarProfissionaisPages from "./pages/GerenciarProfissionaisPages";
import GerenciarAgendaPage from "./pages/GerenciarAgendaPage";
import MeusAgendamentosPage from "./pages/MeusAgendamentosPage";
import SuporteClientePage from "./pages/SuporteClientePage";
import ConfiguracaoPerfilPage from "./pages/ConfiguracaoPerfilPage"; // NOVA IMPORT

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Redireciona / → /inicio */}
          <Route path="/" element={<Navigate to="/inicio" replace />} />

          {/* Rotas públicas */}
          <Route path="/inicio" element={<InicioPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />

          {/* Home após login */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* PERFIL DO PROFISSIONAL — rota oficial */}
          <Route
            path="/profissional/:id"
            element={
              <ProtectedRoute roles={["CLIENTE"]}>
                <ProfissionalDetalhes />
              </ProtectedRoute>
            }
          />

          {/* PERFIL DO PROFISSIONAL — rota antiga (compatibilidade) */}
          <Route
            path="/perfil-profissional/:id"
            element={
              <ProtectedRoute roles={["CLIENTE"]}>
                <ProfissionalDetalhes />
              </ProtectedRoute>
            }
          />

          {/* Meus agendamentos (CLIENTE) */}
          <Route
            path="/meus-agendamentos"
            element={
              <ProtectedRoute roles={["CLIENTE"]}>
                <MeusAgendamentosPage />
              </ProtectedRoute>
            }
          />

          {/* Suporte ao Cliente (CLIENTE) */}
          <Route
            path="/suporte"
            element={
              <ProtectedRoute roles={["CLIENTE"]}>
                <SuporteClientePage />
              </ProtectedRoute>
            }
          />

          {/* Configuração de Perfil (CLIENTE) */}
          <Route
            path="/perfil"
            element={
              <ProtectedRoute roles={["CLIENTE"]}>
                <ConfiguracaoPerfilPage />
              </ProtectedRoute>
            }
          />

          {/* Gerenciamento de profissionais (ADMIN) */}
          <Route
            path="/gerenciar-profissionais"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <GerenciarProfissionaisPages />
              </ProtectedRoute>
            }
          />

          {/* Gerenciar agenda do profissional (ADMIN) */}
          <Route
            path="/profissional/:id/agenda"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <GerenciarAgendaPage />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;