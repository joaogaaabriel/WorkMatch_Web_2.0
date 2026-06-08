/**
 * WorkMatch — pages/CandidatosServico.jsx
 * CEL Design System v3.0
 *
 * Lógica 100% preservada:
 *  - carregar() / fetch candidaturas
 *  - navigate para chat
 *  - candidatos state / loading state
 *
 * Alterações visuais:
 *  - emoji="👷" EmptyState → icon SVG HardHat
 *  - "💬 Abrir conversa" → SVG MessageSquare + texto
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams }     from "react-router-dom";
import PageLayout                     from "../components/PageLayout";
import { Card, CardBody, Btn, Spinner, EmptyState } from "../components/ui";

const API_URL = import.meta.env.VITE_API_URL;

/* =========================================================
   ÍCONES SVG — inline, Lucide-style
========================================================= */

const IcoHardHat = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/>
    <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/>
    <path d="M4 15v-3a8 8 0 0 1 16 0v3"/>
  </svg>
);

const IcoMessageSquare = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

/* =========================================================
   COMPONENTE
========================================================= */

export default function CandidatosServico() {
  const { servicoId } = useParams();
  const navigate      = useNavigate();

  const [candidatos, setCandidatos] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => { carregar(); }, []);

  /* ── Lógica preservada integralmente ── */

  async function carregar() {
    try {
      const response = await fetch(`${API_URL}/api/candidaturas/servico/${servicoId}`);
      const data     = await response.json();
      setCandidatos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout
      title="Candidatos"
      subtitle="Profissionais interessados"
      backPath="/meus-servicos"
    >

      {/* Loading — Spinner CEL centralizado */}
      {loading && <Spinner size="md" center />}

      {/* Estado vazio — icon SVG, sem emoji 👷 */}
      {!loading && candidatos.length === 0 && (
        <EmptyState
          icon={<IcoHardHat />}
          title="Nenhum candidato"
          description="Ainda não existem profissionais interessados neste serviço."
        />
      )}

      {/* Lista de candidatos */}
      {!loading && candidatos.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
          {candidatos.map((candidato, i) => (
            <div key={candidato.id} className={`wm-animate-fadeUp wm-delay-${Math.min(i + 1, 5)}`}>
              <Card>
                <CardBody>
                  <div style={{
                    display:        "flex",
                    justifyContent: "space-between",
                    alignItems:     "center",
                    flexWrap:       "wrap",
                    gap:            "var(--sp-3)",
                  }}>

                    {/* Dados do profissional */}
                    <div>
                      <h3 style={{ color: "var(--clr-navy)", fontWeight: 700, marginBottom: 6, fontSize: 15 }}>
                        {candidato.profissionalNome}
                      </h3>
                      {candidato.especialidade && (
                        <p style={{ color: "var(--clr-text-mid)", fontSize: 14 }}>
                          {candidato.especialidade}
                        </p>
                      )}
                    </div>

                    {/* Botão conversa — SVG MessageSquare, sem 💬 */}
                    <Btn
                      variant="primary"
                      onClick={() => navigate(`/chat/${servicoId}/${candidato.profissionalId}`)}
                    >
                      <IcoMessageSquare /> Abrir conversa
                    </Btn>

                  </div>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      )}

    </PageLayout>
  );
}
