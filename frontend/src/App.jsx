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
import ConfiguracaoPerfilPage  from "./pages/ConfiguracaoPerfilPage";
import SuporteClientePage      from "./pages/SuporteClientePage";

import "./styles.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/inicio" replace />} />

          <Route path="/inicio"   element={<InicioPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />

          <Route path="/home" element={
            <ProtectedRoute><HomePages /></ProtectedRoute>
          } />


          <Route path="/suporte" element={
            <ProtectedRoute roles={["CLIENTE"]}><SuporteClientePage /></ProtectedRoute>
          } />

          <Route path="/perfil" element={
            <ProtectedRoute roles={["CLIENTE"]}><ConfiguracaoPerfilPage /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/inicio" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
