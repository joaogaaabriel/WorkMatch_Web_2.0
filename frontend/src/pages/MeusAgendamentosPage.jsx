/**
 * WorkMatch 2.0 — MeusAgendamentosPage
 * BUG CORRIGIDO: template literals corretos nas URLs
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { agendamentosService } from "../services/api";
import PageLayout from "../components/PageLayout";
import { Card, Btn, Spinner, EmptyState, Badge } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

function formatarData(dataStr) {
  if (!dataStr) return "—";
  try {
    const [y, m, d] = dataStr.split("-");
    return new Date(+y, +m - 1, +d).toLocaleDateString("pt-BR", {
      weekday:"long", day:"2-digit", month:"long", year:"numeric"
    });
  } catch {
    return dataStr;
  }
}

function getStatusColor(status) {
  const map = {
    CONFIRMADO: { bg:"#dcfce7", color:"#15803d", label:"Confirmado ✓" },
    CANCELADO:  { bg:"#fee2e2", color:"#dc2626", label:"Cancelado" },
    PENDENTE:   { bg:"#fef9c3", color:"#a16207", label:"Pendente" },
  };
  return map[status] || { bg:"#f1f5f9", color:"#64748b", label:status || "—" };
}

function isFuturo(dataStr, horario) {
  try {
    const [y, m, d] = dataStr.split("-").map(Number);
    const [h, min] = (horario || "00:00").split(":").map(Number);
    return new Date(y, m - 1, d, h, min) > new Date();
  } catch {
    return false;
  }
}

export default function MeusAgendamentosPage() {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelando, setCancelando] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null); // id do agendamento

  async function carregar() {
    setLoading(true);
    try {
      const data = await agendamentosService.meus();
      const formatados = (Array.isArray(data) ? data : []).map(ag => ({
        id: ag.id,
        data: ag.data,
        horario: ag.horario,
        status: ag.status || "CONFIRMADO",
        profissional: ag.profissional?.nome || "—",
        especialidade: ag.profissional?.especialidade || "—",
        profissionalId: ag.profissional?.id,
      }));
      // Ordenar: futuros primeiro
      formatados.sort((a, b) => {
        const af = isFuturo(a.data, a.horario);
        const bf = isFuturo(b.data, b.horario);
        if (af && !bf) return -1;
        if (!af && bf) return 1;
        return a.data.localeCompare(b.data);
      });
      setAgendamentos(formatados);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      } else {
        showToast("Erro ao carregar agendamentos.", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function cancelar(id) {
    setCancelando(id);
    try {
      await agendamentosService.cancelar(id);
      showToast("Agendamento cancelado com sucesso.", "success");
      setConfirmCancel(null);
      carregar();
    } catch {
      showToast("Erro ao cancelar agendamento.", "error");
    } finally {
      setCancelando(null);
    }
  }

  const futuros = agendamentos.filter(ag => isFuturo(ag.data, ag.horario));
  const passados = agendamentos.filter(ag => !isFuturo(ag.data, ag.horario));

  return (
    <PageLayout
      title="Meus Agendamentos"
      subtitle={`${agendamentos.length} agendamento${agendamentos.length !== 1 ? "s" : ""} no total`}
      backPath="/home"
    >
      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:"80px 0" }}>
          <Spinner size={48} />
        </div>
      ) : agendamentos.length === 0 ? (
        <EmptyState
          emoji="📅"
          title="Nenhum agendamento ainda"
          description="Você ainda não fez nenhum agendamento. Encontre um profissional e agende agora!"
          action={
            <Btn onClick={() => navigate("/home")} size="lg">
              Encontrar profissionais →
            </Btn>
          }
        />
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:40 }}>

          {/* ── Próximos agendamentos ── */}
          {futuros.length > 0 && (
            <section>
              <h2 style={{ fontSize:20, fontWeight:800, color:"var(--clr-text)", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
                ⏰ Próximos agendamentos
                <span style={{ background:"var(--clr-primary)", color:"#fff", fontSize:13, fontWeight:700, borderRadius:99, padding:"2px 10px" }}>
                  {futuros.length}
                </span>
              </h2>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:20 }}>
                {futuros.map(ag => (
                  <AgendamentoCard
                    key={ag.id}
                    ag={ag}
                    futuro
                    onVer={() => navigate(`/profissional/${ag.profissionalId}`)}
                    onCancelar={() => setConfirmCancel(ag.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── Histórico ── */}
          {passados.length > 0 && (
            <section>
              <h2 style={{ fontSize:20, fontWeight:800, color:"var(--clr-text)", marginBottom:16 }}>
                🕐 Histórico
              </h2>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:20 }}>
                {passados.map(ag => (
                  <AgendamentoCard
                    key={ag.id}
                    ag={ag}
                    futuro={false}
                    onVer={() => navigate(`/profissional/${ag.profissionalId}`)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ── Modal cancelar ── */}
      {confirmCancel && (
        <div style={{
          position:"fixed", inset:0, zIndex:500,
          background:"rgba(15,23,42,0.6)",
          display:"flex", alignItems:"center", justifyContent:"center", padding:16,
          animation:"fadeIn .2s ease",
        }}>
          <Card style={{ padding:36, maxWidth:420, width:"100%" }}>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>⚠️</div>
              <h2 style={{ fontSize:22, fontWeight:900, color:"var(--clr-text)", marginBottom:8 }}>
                Cancelar agendamento?
              </h2>
              <p style={{ color:"var(--clr-muted)", fontSize:16, lineHeight:1.6 }}>
                Essa ação não pode ser desfeita. Tem certeza que deseja cancelar?
              </p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <Btn fullWidth variant="danger" size="lg" loading={cancelando === confirmCancel} onClick={() => cancelar(confirmCancel)}>
                Sim, cancelar
              </Btn>
              <Btn fullWidth variant="ghost" onClick={() => setConfirmCancel(null)} disabled={!!cancelando}>
                Não, voltar
              </Btn>
            </div>
          </Card>
        </div>
      )}

      <Toast {...toast} onClose={hideToast} />
    </PageLayout>
  );
}

function AgendamentoCard({ ag, futuro, onVer, onCancelar }) {
  const status = getStatusColor(ag.status);
  return (
    <Card accent={futuro ? "var(--clr-primary)" : "var(--clr-border)"}>
      <div style={{ padding:"20px 20px 16px" }}>
        {/* Topo */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div>
            <p style={{ fontSize:17, fontWeight:800, color:"var(--clr-text)", marginBottom:2 }}>
              {ag.profissional}
            </p>
            <p style={{ fontSize:14, color:"var(--clr-muted)", fontWeight:600 }}>
              {ag.especialidade}
            </p>
          </div>
          <span style={{
            fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:99,
            background: status.bg, color: status.color,
          }}>{status.label}</span>
        </div>

        {/* Detalhes */}
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"var(--clr-bg)", borderRadius:10 }}>
            <span style={{ fontSize:18 }}>📅</span>
            <div>
              <p style={{ fontSize:12, color:"var(--clr-muted)", fontWeight:600 }}>Data</p>
              <p style={{ fontSize:15, color:"var(--clr-text)", fontWeight:700 }}>{formatarData(ag.data)}</p>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"var(--clr-bg)", borderRadius:10 }}>
            <span style={{ fontSize:18 }}>🕐</span>
            <div>
              <p style={{ fontSize:12, color:"var(--clr-muted)", fontWeight:600 }}>Horário</p>
              <p style={{ fontSize:15, color:"var(--clr-text)", fontWeight:700 }}>{ag.horario}</p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {ag.profissionalId && (
            <Btn variant="secondary" fullWidth onClick={onVer}>
              Ver profissional →
            </Btn>
          )}
          {futuro && onCancelar && (
            <Btn variant="ghost" fullWidth onClick={onCancelar} style={{ color:"var(--clr-danger)", borderColor:"#fecaca" }}>
              Cancelar agendamento
            </Btn>
          )}
        </div>
      </div>
    </Card>
  );
}
