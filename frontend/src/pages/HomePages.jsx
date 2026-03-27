/**
 * WorkMatch 2.0 — HomePages (listagem de profissionais)
 * BUG CORRIGIDO: URL com template literal (não aspas simples)
 */
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { profissionaisService } from "../services/api";
import PageLayout from "../components/PageLayout";
import { Card, Btn, Spinner, EmptyState, Badge } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

const ESPECIALIDADES = ["Todas", "Eletricista", "Encanador", "Jardineiro", "Faxineiro", "Pintor", "Pedreiro", "Marceneiro"];

function getInitials(nome) {
  if (!nome) return "P";
  const parts = nome.trim().split(" ").filter(Boolean);
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

function getBgByIndex(id) {
  const gradients = [
    "linear-gradient(135deg,#1e40af,#3b82f6)",
    "linear-gradient(135deg,#0d9488,#14b8a6)",
    "linear-gradient(135deg,#6d28d9,#8b5cf6)",
    "linear-gradient(135deg,#d97706,#f59e0b)",
    "linear-gradient(135deg,#0f172a,#1e40af)",
    "linear-gradient(135deg,#059669,#10b981)",
  ];
  return gradients[(id || 0) % gradients.length];
}

function fakeRating(id) {
  return (4 + (Math.sin((id || 0) * 100) * 0.5 + 0.5)).toFixed(1);
}

function Stars({ rating }) {
  const r = parseFloat(rating) || 4.5;
  return (
    <span style={{ display:"inline-flex", gap:2, alignItems:"center" }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize:14, color: i <= Math.floor(r) ? "#f59e0b" : "#d1d5db" }}>★</span>
      ))}
      <span style={{ fontSize:13, fontWeight:700, color:"var(--clr-text)", marginLeft:4 }}>{rating}</span>
    </span>
  );
}

export default function HomePages() {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroEsp, setFiltroEsp] = useState("Todas");

  useEffect(() => {
    profissionaisService.listar()
      .then(setProfissionais)
      .catch(() => showToast("Erro ao carregar profissionais.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = useMemo(() => {
    return profissionais.filter(p => {
      const matchBusca = !busca ||
        p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        p.especialidade?.toLowerCase().includes(busca.toLowerCase()) ||
        p.cidade?.toLowerCase().includes(busca.toLowerCase());
      const matchEsp = filtroEsp === "Todas" ||
        p.especialidade?.toLowerCase().includes(filtroEsp.toLowerCase());
      return matchBusca && matchEsp;
    });
  }, [profissionais, busca, filtroEsp]);

  return (
    <PageLayout
      title="Encontre profissionais"
      subtitle={`${profissionais.length} profissionais disponíveis`}
    >
      {/* ── Barra de busca ── */}
      <div style={{ marginBottom:24 }}>
        <div style={{ position:"relative", maxWidth:560 }}>
          <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:20 }}>🔍</span>
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome, especialidade ou cidade..."
            style={{
              width:"100%",
              padding:"16px 16px 16px 52px",
              fontSize:16,
              fontFamily:"var(--font-body)",
              fontWeight:500,
              color:"var(--clr-text)",
              background:"var(--clr-surface)",
              border:"2px solid var(--clr-border)",
              borderRadius:14,
              outline:"none",
              boxShadow:"var(--shadow-sm)",
              transition:"border-color .15s",
            }}
            onFocus={e => e.target.style.borderColor = "var(--clr-primary-lt)"}
            onBlur={e => e.target.style.borderColor = "var(--clr-border)"}
          />
          {busca && (
            <button
              onClick={() => setBusca("")}
              style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:18, color:"var(--clr-muted)" }}
            >×</button>
          )}
        </div>
      </div>

      {/* ── Filtros por especialidade ── */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:32 }}>
        {ESPECIALIDADES.map(esp => (
          <button
            key={esp}
            onClick={() => setFiltroEsp(esp)}
            style={{
              padding:"10px 20px",
              borderRadius:99,
              fontSize:14,
              fontWeight:700,
              fontFamily:"var(--font-body)",
              cursor:"pointer",
              border: filtroEsp === esp ? "none" : "1.5px solid var(--clr-border)",
              background: filtroEsp === esp ? "var(--clr-primary)" : "var(--clr-surface)",
              color: filtroEsp === esp ? "#fff" : "var(--clr-muted)",
              boxShadow: filtroEsp === esp ? "var(--shadow-blue)" : "none",
              transition:"all .15s",
            }}
          >{esp}</button>
        ))}
      </div>

      {/* ── States ── */}
      {loading && (
        <div style={{ display:"flex", justifyContent:"center", padding:"80px 0" }}>
          <Spinner size={48} />
        </div>
      )}

      {!loading && filtrados.length === 0 && (
        <EmptyState
          emoji="🔍"
          title="Nenhum profissional encontrado"
          description="Tente buscar por outro nome, especialidade ou limpe os filtros."
          action={
            <Btn variant="secondary" onClick={() => { setBusca(""); setFiltroEsp("Todas"); }}>
              Limpar filtros
            </Btn>
          }
        />
      )}

      {/* ── Grid de profissionais ── */}
      {!loading && filtrados.length > 0 && (
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",
          gap:24,
        }}>
          {filtrados.map((p, i) => {
            const rating = fakeRating(p.id);
            const bg = getBgByIndex(p.id);
            const initials = getInitials(p.nome);

            return (
              <Card
                key={p.id}
                hoverable
                className={`animate-fadeUp delay-${Math.min(i + 1, 5)}`}
                style={{ cursor:"pointer" }}
                onClick={() => navigate(`/profissional/${p.id}`)}
              >
                {/* Avatar header */}
                <div style={{
                  height:120,
                  background:bg,
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"center",
                }}>
                  <div style={{
                    width:72,
                    height:72,
                    borderRadius:"50%",
                    background:"rgba(255,255,255,0.18)",
                    border:"3px solid rgba(255,255,255,0.4)",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontSize:28,
                    fontWeight:900,
                    color:"#fff",
                  }}>{initials}</div>
                </div>

                {/* Info */}
                <div style={{ padding:"20px 20px 16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <h3 style={{ fontSize:18, fontWeight:800, color:"var(--clr-text)", lineHeight:1.2 }}>
                      {p.nome || "Profissional"}
                    </h3>
                    <Stars rating={rating} />
                  </div>

                  <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:16 }}>🔧</span>
                      <span style={{ fontSize:15, fontWeight:700, color:"var(--clr-text)" }}>
                        {p.especialidade || "—"}
                      </span>
                    </div>
                    {(p.cidade || p.estado) && (
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:16 }}>📍</span>
                        <span style={{ fontSize:14, color:"var(--clr-muted)", fontWeight:500 }}>
                          {[p.cidade, p.estado].filter(Boolean).join(" — ")}
                        </span>
                      </div>
                    )}
                    {p.experienciaAnos > 0 && (
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:16 }}>⏱️</span>
                        <span style={{ fontSize:14, color:"var(--clr-muted)", fontWeight:500 }}>
                          {p.experienciaAnos} {p.experienciaAnos === 1 ? "ano" : "anos"} de experiência
                        </span>
                      </div>
                    )}
                  </div>

                  <Btn
                    variant="primary"
                    fullWidth
                    size="md"
                    onClick={e => { e.stopPropagation(); navigate(`/profissional/${p.id}`); }}
                  >
                    📅 Agendar serviço
                  </Btn>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Contador de resultados ── */}
      {!loading && filtrados.length > 0 && (
        <p style={{ textAlign:"center", color:"var(--clr-subtle)", fontSize:14, marginTop:40, fontWeight:500 }}>
          Mostrando {filtrados.length} de {profissionais.length} profissionais
        </p>
      )}

      <Toast {...toast} onClose={hideToast} />
    </PageLayout>
  );
}
