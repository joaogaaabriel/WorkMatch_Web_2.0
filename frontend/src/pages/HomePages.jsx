/**
 * WorkMatch 2.0 — HomePages
 */
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { Btn, Spinner, EmptyState, Stars, Avatar, Badge } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

const ESPECIALIDADES = ["Todas","Eletricista","Encanador","Jardineiro","Faxineiro","Pintor","Pedreiro","Marceneiro"];
const AV_COLORS = ["blue","purple","teal","navy","blue","purple","teal","navy"];

function fakeRating(id) { return (4 + (Math.sin((id || 0) * 100) * 0.5 + 0.5)).toFixed(1); }
function getInitials(nome) {
  if (!nome) return "P";
  const parts = nome.trim().split(" ").filter(Boolean);
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

const BANNER_COLORS = [
  "linear-gradient(135deg, var(--clr-blue) 0%, #1a4e8f 100%)",
  "linear-gradient(135deg, var(--clr-purple-mid) 0%, var(--clr-purple) 100%)",
  "linear-gradient(135deg, var(--clr-teal) 0%, #0f766e 100%)",
  "linear-gradient(135deg, var(--clr-navy-deep) 0%, var(--clr-navy-mid) 100%)",
];

export default function HomePages() {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [loading, setLoading] = useState(true);


  return (
    <PageLayout title="Encontre profissionais" subtitle={`${profissionais.length} disponíveis`}>

      {/* Busca */}
      <div style={{ display: "flex", gap: "var(--sp-4)", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div className="wm-search-wrapper" style={{ flex: 1, minWidth: 240 }}>
          <span className="wm-search-icon">🔍</span>
          <input
            className="wm-input wm-search-input"
            value={busca} onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome, especialidade ou cidade..."
          />
        </div>
        {busca && (
          <Btn variant="ghost" size="sm" onClick={() => setBusca("")}>Limpar</Btn>
        )}
      </div>

      {/* Filtros */}
      <div className="wm-filter-chips">
        {ESPECIALIDADES.map(esp => (
          <button key={esp} className={`wm-chip${filtro === esp ? " wm-chip--active" : ""}`} onClick={() => setFiltro(esp)}>
            {esp}
          </button>
        ))}
      </div>

      {/* Estados */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "var(--sp-16) 0" }}>
          <Spinner size="lg" />
        </div>
      )}

      {!loading && filtrados.length === 0 && (
        <EmptyState
          emoji="🔍"
          title="Nenhum profissional encontrado"
          description="Tente buscar por outro nome ou especialidade."
          action={<Btn variant="secondary" onClick={() => { setBusca(""); setFiltro("Todas"); }}>Limpar filtros</Btn>}
        />
      )}

      {/* Grid */}
      {!loading && filtrados.length > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "var(--sp-5)" }}>
            {filtrados.map((p, i) => {
              const rating = fakeRating(p.id);
              const color = BANNER_COLORS[i % BANNER_COLORS.length];
              const initials = getInitials(p.nome);

              return (
                <div key={p.id} className={`wm-prof-card wm-animate-fadeUp wm-delay-${Math.min(i+1,5)}`} onClick={() => navigate(`/profissional/${p.id}`)}>
                  {/* Banner */}
                  <div className="wm-prof-card__banner" style={{ background: color }}>
                    <div className={`wm-avatar wm-avatar--lg wm-avatar--${AV_COLORS[i % AV_COLORS.length]}`} style={{ border: "3px solid rgba(255,255,255,0.3)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                      {initials}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="wm-prof-card__body">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--sp-3)" }}>
                      <p className="wm-prof-card__name">{p.nome || "Profissional"}</p>
                      <Stars rating={rating} />
                    </div>

                    <div className="wm-prof-card__spec">
                      <span>🔧</span>
                      <span>{p.especialidade || "—"}</span>
                    </div>

                    {(p.cidade || p.estado) && (
                      <div className="wm-prof-card__loc">
                        <span>📍</span>
                        <span>{[p.cidade, p.estado].filter(Boolean).join(" — ")}</span>
                      </div>
                    )}

                    <div className="wm-prof-card__footer">
                      {p.experienciaAnos > 0 && (
                        <span style={{ fontSize: 12, color: "var(--clr-text-light)", fontWeight: 500 }}>
                          ⏱️ {p.experienciaAnos} {p.experienciaAnos === 1 ? "ano" : "anos"}
                        </span>
                      )}
                      <Btn
                        variant="primary"
                        size="sm"
                        onClick={e => { e.stopPropagation(); navigate(`/profissional/${p.id}`); }}
                        style={{ marginLeft: "auto" }}
                      >
                        Agendar
                      </Btn>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p style={{ textAlign: "center", color: "var(--clr-text-light)", fontSize: 13 }}>
            {filtrados.length} de {profissionais.length} profissionais
          </p>
        </>
      )}

      <Toast {...toast} onClose={hideToast} />
    </PageLayout>
  );
}
