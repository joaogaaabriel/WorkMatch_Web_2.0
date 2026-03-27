/**
 * WorkMatch 2.0 — ProfissionalDetalhes (Agendamento)
 * Mantém contrato de API original; redesenha UX para público 40-70 anos
 */
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { profissionaisService, agendaService, agendamentosService } from "../services/api";
import PageLayout from "../components/PageLayout";
import { Card, Btn, Spinner, EmptyState, InfoRow, Badge, Divider, Avatar } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

function fakeRating(id) {
  return (4 + (Math.sin((id || 0) * 100) * 0.5 + 0.5)).toFixed(1);
}

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function normalizeTime(t) {
  if (!t) return "";
  let s = String(t).trim();
  if (/^\d:\d\d$/.test(s)) s = "0" + s;
  return s.split(":").slice(0,2).map((p,i) => i===0?p.padStart(2,"0"):p).join(":");
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

const WEEKDAYS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const MONTHS_PT = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

function MiniCalendar({ selected, onChange }) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const days = getDaysInMonth(view.year, view.month);
  const firstDay = getFirstDayOfWeek(view.year, view.month);
  const selectedStr = selected ? toDateStr(selected) : "";

  function prevMonth() {
    setView(v => {
      if (v.month === 0) return { year: v.year - 1, month: 11 };
      return { ...v, month: v.month - 1 };
    });
  }
  function nextMonth() {
    setView(v => {
      if (v.month === 11) return { year: v.year + 1, month: 0 };
      return { ...v, month: v.month + 1 };
    });
  }

  return (
    <div>
      {/* Header navegação */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <button onClick={prevMonth} style={{ background:"none", border:"1.5px solid var(--clr-border)", borderRadius:10, width:36, height:36, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
        <span style={{ fontWeight:800, fontSize:17, color:"var(--clr-text)" }}>
          {MONTHS_PT[view.month]} {view.year}
        </span>
        <button onClick={nextMonth} style={{ background:"none", border:"1.5px solid var(--clr-border)", borderRadius:10, width:36, height:36, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
      </div>

      {/* Dias da semana */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:6 }}>
        {WEEKDAYS.map(d => (
          <div key={d} style={{ textAlign:"center", fontSize:12, fontWeight:700, color:"var(--clr-muted)", padding:"4px 0" }}>{d}</div>
        ))}
      </div>

      {/* Dias */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const date = new Date(view.year, view.month, day);
          const dateStr = toDateStr(date);
          const isToday = toDateStr(today) === dateStr;
          const isSelected = selectedStr === dateStr;
          const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => !isPast && onChange(date)}
              style={{
                width:"100%",
                aspectRatio:"1",
                borderRadius:10,
                border: isSelected ? "none" : isToday ? "2px solid var(--clr-primary-lt)" : "none",
                background: isSelected ? "var(--clr-primary)" : isToday ? "var(--clr-primary-bg)" : "transparent",
                color: isSelected ? "#fff" : isPast ? "var(--clr-border)" : "var(--clr-text)",
                fontFamily:"var(--font-body)",
                fontSize:15,
                fontWeight: isSelected || isToday ? 800 : 500,
                cursor: isPast ? "not-allowed" : "pointer",
                opacity: isPast ? 0.4 : 1,
                transition:"all .15s",
              }}
              onMouseEnter={e => { if (!isPast && !isSelected) e.currentTarget.style.background = "var(--clr-primary-bg)"; }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isToday ? "var(--clr-primary-bg)" : "transparent"; }}
            >{day}</button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProfissionalDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const [profissional, setProfissional] = useState(null);
  const [loadingProf, setLoadingProf] = useState(true);

  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [horarios, setHorarios] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  const [confirmando, setConfirmando] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Buscar dados do profissional
  useEffect(() => {
    profissionaisService.buscarPorId(id)
      .then(setProfissional)
      .catch(() => showToast("Profissional não encontrado.", "error"))
      .finally(() => setLoadingProf(false));
  }, [id]);

  // Buscar horários ao trocar data
  const carregarHorarios = useCallback(async (data) => {
    if (!data) return;
    setLoadingHorarios(true);
    setHorarioSelecionado("");
    try {
      const res = await agendaService.horariosPorData(id, toDateStr(data));
      const horariosBackend = (res.horarios || []).map(normalizeTime);
      const ocupados = (res.ocupados || []).map(normalizeTime);
      const livres = horariosBackend
        .filter(h => !ocupados.includes(h))
        .sort((a, b) => {
          const [ha, ma] = a.split(":").map(Number);
          const [hb, mb] = b.split(":").map(Number);
          return ha - hb || ma - mb;
        });
      setHorarios(livres);
    } catch {
      setHorarios([]);
    } finally {
      setLoadingHorarios(false);
    }
  }, [id]);

  useEffect(() => {
    carregarHorarios(dataSelecionada);
  }, [dataSelecionada, carregarHorarios]);

  async function confirmarAgendamento() {
    if (!horarioSelecionado) return;
    setConfirmando(true);
    try {
      await agendamentosService.criar({
        profissionalId: id,
        data: toDateStr(dataSelecionada),
        horario: horarioSelecionado,
      });
      setShowConfirm(false);
      showToast("Agendamento confirmado com sucesso! 🎉", "success");
      setHorarioSelecionado("");
      carregarHorarios(dataSelecionada);
    } catch (err) {
      const msg = err.response?.data?.message || "Erro ao confirmar agendamento.";
      showToast(msg, "error");
    } finally {
      setConfirmando(false);
    }
  }

  if (loadingProf) {
    return (
      <PageLayout title="Carregando..." backPath="/home">
        <div style={{ display:"flex", justifyContent:"center", padding:"80px 0" }}>
          <Spinner size={48} />
        </div>
      </PageLayout>
    );
  }

  if (!profissional) {
    return (
      <PageLayout title="Profissional" backPath="/home">
        <EmptyState emoji="❌" title="Profissional não encontrado" description="O profissional não foi encontrado. Volte ao início."
          action={<Btn onClick={() => navigate("/home")}>Voltar ao início</Btn>} />
      </PageLayout>
    );
  }

  const rating = fakeRating(profissional.id);
  const dataLabel = dataSelecionada.toLocaleDateString("pt-BR", { weekday:"long", day:"2-digit", month:"long" });

  return (
    <PageLayout title={profissional.nome} subtitle={profissional.especialidade} backPath="/home">

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:24 }}>

        {/* ── Coluna esquerda: dados do profissional ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {/* Card perfil */}
          <Card>
            <div style={{
              height:100,
              background:"linear-gradient(135deg,#1e40af,#0d9488)",
            }} />
            <div style={{ padding:"0 24px 24px" }}>
              <div style={{ marginTop:-36, marginBottom:16 }}>
                <div style={{
                  width:72, height:72, borderRadius:"50%",
                  background:"linear-gradient(135deg,#1e40af,#3b82f6)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:28, fontWeight:900, color:"#fff",
                  border:"4px solid #fff",
                  boxShadow:"var(--shadow-md)",
                }}>
                  {(profissional.nome?.[0] || "P").toUpperCase()}
                </div>
              </div>

              <h2 style={{ fontSize:22, fontWeight:900, color:"var(--clr-text)", marginBottom:4 }}>
                {profissional.nome}
              </h2>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <Badge color="#d97706">{profissional.especialidade}</Badge>
                <span style={{ fontSize:14, color:"var(--clr-muted)", fontWeight:600 }}>⭐ {rating}</span>
              </div>

              <Divider style={{ marginBottom:16 }} />

              <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                {profissional.descricao && (
                  <InfoRow emoji="📝" label="Sobre" value={profissional.descricao} />
                )}
                {profissional.experienciaAnos > 0 && (
                  <InfoRow emoji="⏱️" label="Experiência" value={`${profissional.experienciaAnos} anos`} />
                )}
                {(profissional.cidade || profissional.estado) && (
                  <InfoRow emoji="📍" label="Localização" value={[profissional.cidade, profissional.estado].filter(Boolean).join(" — ")} />
                )}
                {profissional.telefone && (
                  <InfoRow emoji="📱" label="Telefone" value={profissional.telefone} />
                )}
                {profissional.email && (
                  <InfoRow emoji="✉️" label="E-mail" value={profissional.email} />
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* ── Coluna direita: agendamento ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {/* Calendário */}
          <Card style={{ padding:24 }}>
            <h3 style={{ fontSize:18, fontWeight:800, marginBottom:20, color:"var(--clr-text)" }}>
              📅 Escolha uma data
            </h3>
            <MiniCalendar selected={dataSelecionada} onChange={setDataSelecionada} />
          </Card>

          {/* Horários */}
          <Card style={{ padding:24 }}>
            <h3 style={{ fontSize:18, fontWeight:800, marginBottom:6, color:"var(--clr-text)" }}>
              🕐 Horários disponíveis
            </h3>
            <p style={{ fontSize:14, color:"var(--clr-muted)", marginBottom:16, fontWeight:500 }}>
              {dataLabel.charAt(0).toUpperCase() + dataLabel.slice(1)}
            </p>

            {loadingHorarios ? (
              <div style={{ display:"flex", justifyContent:"center", padding:"24px 0" }}>
                <Spinner size={32} />
              </div>
            ) : horarios.length === 0 ? (
              <EmptyState
                emoji="📭"
                title="Sem horários disponíveis"
                description="Não há horários para esta data. Tente outro dia."
              />
            ) : (
              <div style={{
                display:"grid",
                gridTemplateColumns:"repeat(auto-fill, minmax(90px, 1fr))",
                gap:10,
              }}>
                {horarios.map(h => (
                  <button
                    key={h}
                    onClick={() => setHorarioSelecionado(h === horarioSelecionado ? "" : h)}
                    style={{
                      padding:"14px 8px",
                      borderRadius:12,
                      border: h === horarioSelecionado ? "none" : "2px solid var(--clr-border)",
                      background: h === horarioSelecionado ? "var(--clr-primary)" : "var(--clr-surface)",
                      color: h === horarioSelecionado ? "#fff" : "var(--clr-text)",
                      fontSize:16,
                      fontWeight:700,
                      fontFamily:"var(--font-body)",
                      cursor:"pointer",
                      boxShadow: h === horarioSelecionado ? "var(--shadow-blue)" : "none",
                      transition:"all .15s",
                    }}
                    onMouseEnter={e => { if (h !== horarioSelecionado) e.currentTarget.style.borderColor = "var(--clr-primary-lt)"; }}
                    onMouseLeave={e => { if (h !== horarioSelecionado) e.currentTarget.style.borderColor = "var(--clr-border)"; }}
                  >{h}</button>
                ))}
              </div>
            )}

            {horarioSelecionado && (
              <div style={{ marginTop:20 }}>
                <Divider style={{ marginBottom:16 }} />
                <div style={{
                  background:"var(--clr-primary-bg)",
                  borderRadius:12,
                  padding:"14px 16px",
                  marginBottom:16,
                  border:"1px solid #bfdbfe",
                }}>
                  <p style={{ fontSize:14, color:"var(--clr-primary)", fontWeight:700, marginBottom:2 }}>Resumo do agendamento</p>
                  <p style={{ fontSize:15, color:"var(--clr-text)", fontWeight:600 }}>
                    {profissional.nome} · {horarioSelecionado} · {dataLabel}
                  </p>
                </div>
                <Btn fullWidth size="lg" onClick={() => setShowConfirm(true)}>
                  ✅ Confirmar agendamento
                </Btn>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ── Modal de confirmação ── */}
      {showConfirm && (
        <div style={{
          position:"fixed", inset:0, zIndex:500,
          background:"rgba(15,23,42,0.6)",
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:16,
          animation:"fadeIn .2s ease",
        }}>
          <Card style={{ padding:36, maxWidth:440, width:"100%" }}>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📅</div>
              <h2 style={{ fontSize:22, fontWeight:900, color:"var(--clr-text)", marginBottom:8 }}>
                Confirmar agendamento?
              </h2>
              <p style={{ color:"var(--clr-muted)", fontSize:16, lineHeight:1.6 }}>
                Você está agendando com <strong>{profissional.nome}</strong> para<br />
                <strong>{dataLabel}</strong> às <strong>{horarioSelecionado}</strong>.
              </p>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <Btn fullWidth size="lg" loading={confirmando} onClick={confirmarAgendamento}>
                ✅ Sim, confirmar
              </Btn>
              <Btn fullWidth variant="ghost" onClick={() => setShowConfirm(false)} disabled={confirmando}>
                Cancelar
              </Btn>
            </div>
          </Card>
        </div>
      )}

      <Toast {...toast} onClose={hideToast} />
    </PageLayout>
  );
}
