/**
 * WorkMatch 2.0 — MeusAgendamentosPage
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { agendamentosService } from "../services/api";
import PageLayout from "../components/PageLayout";
import { Btn, Spinner, EmptyState, Badge } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

function formatarData(d) {
  if (!d) return "—";
  try { const [y,m,dd] = d.split("-"); return new Date(+y,+m-1,+dd).toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"}); }
  catch { return d; }
}

function isFuturo(data, horario) {
  try { const [y,m,d]=data.split("-").map(Number), [h,min]=(horario||"00:00").split(":").map(Number); return new Date(y,m-1,d,h,min) > new Date(); }
  catch { return false; }
}

const STATUS_MAP = {
  CONFIRMADO: { variant:"success", label:"Confirmado ✓" },
  CANCELADO:  { variant:"danger",  label:"Cancelado" },
  PENDENTE:   { variant:"warning", label:"Pendente" },
};

function AgendamentoCard({ ag, futuro, onVer, onCancelar }) {
  const status = STATUS_MAP[ag.status] || { variant:"neutral", label: ag.status || "—" };
  return (
    <div className={`wm-booking-card${futuro ? "" : " wm-booking-card--past"}`}>
      <div className="wm-booking-card__head">
        <div>
          <p className="wm-booking-card__name">{ag.profissional}</p>
          <p className="wm-booking-card__spec">{ag.especialidade}</p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="wm-booking-detail">
        <span className="wm-booking-detail__emoji">📅</span>
        <div>
          <p className="wm-booking-detail__label">Data</p>
          <p className="wm-booking-detail__val">{formatarData(ag.data)}</p>
        </div>
      </div>
      <div className="wm-booking-detail">
        <span className="wm-booking-detail__emoji">🕐</span>
        <div>
          <p className="wm-booking-detail__label">Horário</p>
          <p className="wm-booking-detail__val">{ag.horario}</p>
        </div>
      </div>

      <div style={{ display:"flex", gap:"var(--sp-2)", marginTop:"var(--sp-4)" }}>
        {ag.profissionalId && (
          <Btn variant="secondary" size="sm" onClick={onVer} style={{ flex:1 }}>Ver profissional →</Btn>
        )}
        {futuro && onCancelar && (
          <Btn variant="ghost" size="sm" onClick={onCancelar} style={{ color:"var(--clr-danger)", borderColor:"#fecaca", flex:1 }}>
            Cancelar
          </Btn>
        )}
      </div>
    </div>
  );
}

export default function MeusAgendamentosPage() {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelando, setCancelando] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);

  async function carregar() {
    setLoading(true);
    try {
      const data = await agendamentosService.meus();
      const fmt = (Array.isArray(data) ? data : []).map(ag => ({
        id: ag.id, data: ag.data, horario: ag.horario, status: ag.status || "CONFIRMADO",
        profissional: ag.profissional?.nome || "—", especialidade: ag.profissional?.especialidade || "—",
        profissionalId: ag.profissional?.id,
      })).sort((a,b) => {
        const af = isFuturo(a.data,a.horario), bf = isFuturo(b.data,b.horario);
        if (af && !bf) return -1; if (!af && bf) return 1;
        return a.data.localeCompare(b.data);
      });
      setAgendamentos(fmt);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) navigate("/login");
      else showToast("Erro ao carregar agendamentos.", "error");
    } finally { setLoading(false); }
  }

  useEffect(() => { carregar(); }, []);

  async function cancelar(id) {
    setCancelando(id);
    try {
      await agendamentosService.cancelar(id);
      showToast("Agendamento cancelado.", "success");
      setConfirmCancel(null);
      carregar();
    } catch { showToast("Erro ao cancelar.", "error"); }
    finally { setCancelando(null); }
  }

  const futuros  = agendamentos.filter(ag => isFuturo(ag.data, ag.horario));
  const passados = agendamentos.filter(ag => !isFuturo(ag.data, ag.horario));

  return (
    <PageLayout
      title="Meus Agendamentos"
      subtitle={`${agendamentos.length} agendamento${agendamentos.length !== 1 ? "s" : ""}`}
      backPath="/home"
    >
      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:"var(--sp-16) 0" }}><Spinner size="lg" /></div>
      ) : agendamentos.length === 0 ? (
        <EmptyState
          emoji="📅"
          title="Nenhum agendamento"
          description="Você ainda não fez nenhum agendamento. Encontre um profissional!"
          action={<Btn onClick={() => navigate("/home")}>Encontrar profissionais →</Btn>}
        />
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--sp-8)" }}>

          {futuros.length > 0 && (
            <section>
              <div style={{ display:"flex", alignItems:"center", gap:"var(--sp-3)", marginBottom:"var(--sp-4)" }}>
                <h2 className="wm-page-hero__title" style={{ fontSize:"1.4rem" }}>⏰ Próximos</h2>
                <Badge variant="purple">{futuros.length}</Badge>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"var(--sp-4)" }}>
                {futuros.map(ag => (
                  <AgendamentoCard
                    key={ag.id} ag={ag} futuro
                    onVer={() => navigate(`/profissional/${ag.profissionalId}`)}
                    onCancelar={() => setConfirmCancel(ag.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {passados.length > 0 && (
            <section>
              <h2 className="wm-page-hero__title" style={{ fontSize:"1.4rem", marginBottom:"var(--sp-4)" }}>🕐 Histórico</h2>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"var(--sp-4)" }}>
                {passados.map(ag => (
                  <AgendamentoCard
                    key={ag.id} ag={ag} futuro={false}
                    onVer={() => navigate(`/profissional/${ag.profissionalId}`)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Modal cancelar */}
      {confirmCancel && (
        <div className="wm-modal-overlay">
          <div className="wm-modal wm-modal--sm">
            <div className="wm-modal__header">
              <h2 className="wm-modal__title">Cancelar agendamento?</h2>
              <Btn variant="ghost" size="sm" onClick={() => setConfirmCancel(null)}>×</Btn>
            </div>
            <div className="wm-modal__body">
              <p style={{ color:"var(--clr-text-mid)", lineHeight:1.6 }}>
                Essa ação não pode ser desfeita. Tem certeza que deseja cancelar este agendamento?
              </p>
            </div>
            <div className="wm-modal__footer">
              <Btn variant="secondary" onClick={() => setConfirmCancel(null)} disabled={!!cancelando}>Não, voltar</Btn>
              <Btn variant="danger" loading={cancelando === confirmCancel} onClick={() => cancelar(confirmCancel)}>
                Sim, cancelar
              </Btn>
            </div>
          </div>
        </div>
      )}

      <Toast {...toast} onClose={hideToast} />
    </PageLayout>
  );
}
