/**
 * WorkMatch 2.0 — ProfissionalDetalhes
 */
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { profissionaisService, agendaService, agendamentosService } from "../services/api";
import PageLayout from "../components/PageLayout";
import { Btn, Spinner, EmptyState, InfoRow, Badge, Divider, Stars, Card, CardHeader, CardBody, CardTitle, Alert } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

function fakeRating(id) { return (4 + (Math.sin((id || 0) * 100) * 0.5 + 0.5)).toFixed(1); }
function toDateStr(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function normalizeTime(t) { if (!t) return ""; let s = String(t).trim(); if (/^\d:\d\d$/.test(s)) s = "0" + s; return s.split(":").slice(0,2).map((p,i) => i===0?p.padStart(2,"0"):p).join(":"); }

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const WDAYS  = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function MiniCalendar({ selected, onChange }) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const days = new Date(view.year, view.month + 1, 0).getDate();
  const firstDOW = new Date(view.year, view.month, 1).getDay();
  const selStr = selected ? toDateStr(selected) : "";

  function prev() { setView(v => v.month === 0 ? { year:v.year-1, month:11 } : { ...v, month:v.month-1 }); }
  function next() { setView(v => v.month === 11 ? { year:v.year+1, month:0 } : { ...v, month:v.month+1 }); }

  return (
    <div>
      <div className="wm-cal-nav">
        <button className="wm-cal-nav__btn" onClick={prev}>‹</button>
        <span className="wm-cal-nav__title">{MONTHS[view.month]} {view.year}</span>
        <button className="wm-cal-nav__btn" onClick={next}>›</button>
      </div>
      <div className="wm-cal-weekdays">{WDAYS.map(d => <span key={d}>{d}</span>)}</div>
      <div className="wm-cal-grid">
        {Array.from({ length: firstDOW }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const date = new Date(view.year, view.month, day);
          const dateStr = toDateStr(date);
          const isToday = toDateStr(today) === dateStr;
          const isSelected = selStr === dateStr;
          const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => !isPast && onChange(date)}
              className={`wm-cal-day${isToday ? " wm-cal-day--today" : ""}${isSelected ? " wm-cal-day--selected" : ""}`}
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
  const [loadingH, setLoadingH] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    profissionaisService.buscarPorId(id)
      .then(setProfissional)
      .catch(() => showToast("Profissional não encontrado.", "error"))
      .finally(() => setLoadingProf(false));
  }, [id]);

  const carregarHorarios = useCallback(async (data) => {
    if (!data) return;
    setLoadingH(true); setHorarioSelecionado("");
    try {
      const res = await agendaService.horariosPorData(id, toDateStr(data));
      const livres = (res.horarios || []).map(normalizeTime)
        .filter(h => !(res.ocupados || []).map(normalizeTime).includes(h))
        .sort((a,b) => { const [ha,ma]=a.split(":").map(Number), [hb,mb]=b.split(":").map(Number); return ha-hb||ma-mb; });
      setHorarios(livres);
    } catch { setHorarios([]); }
    finally { setLoadingH(false); }
  }, [id]);

  useEffect(() => { carregarHorarios(dataSelecionada); }, [dataSelecionada, carregarHorarios]);

  async function confirmar() {
    setConfirmando(true);
    try {
      await agendamentosService.criar({ profissionalId: id, data: toDateStr(dataSelecionada), horario: horarioSelecionado });
      setShowConfirm(false);
      showToast("Agendamento confirmado! 🎉", "success");
      setHorarioSelecionado("");
      carregarHorarios(dataSelecionada);
    } catch (err) {
      showToast(err.response?.data?.message || "Erro ao confirmar agendamento.", "error");
    } finally { setConfirmando(false); }
  }

  if (loadingProf) return (
    <PageLayout title="Carregando..." backPath="/home">
      <div style={{ display:"flex", justifyContent:"center", padding:"var(--sp-16) 0" }}><Spinner size="lg" /></div>
    </PageLayout>
  );

  if (!profissional) return (
    <PageLayout title="Profissional" backPath="/home">
      <EmptyState emoji="❌" title="Não encontrado" description="Volte ao início." action={<Btn onClick={() => navigate("/home")}>Voltar</Btn>} />
    </PageLayout>
  );

  const rating = fakeRating(profissional.id);
  const initials = (profissional.nome?.[0] || "P").toUpperCase();
  const dataLabel = dataSelecionada.toLocaleDateString("pt-BR", { weekday:"long", day:"2-digit", month:"long" });

  return (
    <PageLayout title={profissional.nome} subtitle={profissional.especialidade} backPath="/home">
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:"var(--sp-6)" }}>

        {/* Perfil */}
        <Card accent="purple">
          <div style={{ height:80, background:"linear-gradient(135deg, var(--clr-purple-mid) 0%, var(--clr-purple) 100%)" }} />
          <CardBody>
            <div style={{ marginTop:-40, marginBottom:"var(--sp-4)" }}>
              <div className="wm-avatar wm-avatar--lg wm-avatar--purple" style={{ border:"4px solid var(--clr-surface)", boxShadow:"var(--shadow-md)" }}>
                {initials}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"var(--sp-3)" }}>
              <h2 style={{ fontSize:20, fontWeight:700, color:"var(--clr-navy)" }}>{profissional.nome}</h2>
              <Stars rating={rating} />
            </div>
            <Badge variant="purple">{profissional.especialidade}</Badge>
            <Divider style={{ margin:"var(--sp-5) 0" }} />
            {profissional.descricao && <InfoRow emoji="📝" label="Sobre" value={profissional.descricao} />}
            {profissional.experienciaAnos > 0 && <InfoRow emoji="⏱️" label="Experiência" value={`${profissional.experienciaAnos} anos`} />}
            {(profissional.cidade || profissional.estado) && <InfoRow emoji="📍" label="Localização" value={[profissional.cidade,profissional.estado].filter(Boolean).join(" — ")} />}
            {profissional.telefone && <InfoRow emoji="📱" label="Telefone" value={profissional.telefone} />}
            {profissional.email && <InfoRow emoji="✉️" label="E-mail" value={profissional.email} />}
          </CardBody>
        </Card>

        {/* Agendamento */}
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--sp-5)" }}>
          {/* Calendário */}
          <Card accent="blue">
            <CardHeader><CardTitle>📅 Escolha uma data</CardTitle></CardHeader>
            <CardBody><MiniCalendar selected={dataSelecionada} onChange={setDataSelecionada} /></CardBody>
          </Card>

          {/* Horários */}
          <Card accent="teal">
            <CardHeader>
              <CardTitle>🕐 Horários disponíveis</CardTitle>
              <span style={{ fontSize:13, color:"var(--clr-text-light)" }}>{dataLabel}</span>
            </CardHeader>
            <CardBody>
              {loadingH ? (
                <div style={{ display:"flex", justifyContent:"center", padding:"var(--sp-8) 0" }}><Spinner /></div>
              ) : horarios.length === 0 ? (
                <EmptyState emoji="📭" title="Sem horários" description="Sem horários para esta data. Tente outro dia." />
              ) : (
                <div className="wm-slots">
                  {horarios.map(h => (
                    <button
                      key={h}
                      className={`wm-slot${h === horarioSelecionado ? " wm-slot--selected" : ""}`}
                      onClick={() => setHorarioSelecionado(h === horarioSelecionado ? "" : h)}
                    >{h}</button>
                  ))}
                </div>
              )}

              {horarioSelecionado && (
                <>
                  <Divider style={{ margin:"var(--sp-5) 0" }} />
                  <Alert variant="purple" emoji="📋">
                    <strong>{profissional.nome}</strong> · {horarioSelecionado} · {dataLabel}
                  </Alert>
                  <Btn fullWidth size="lg" style={{ marginTop:"var(--sp-4)" }} onClick={() => setShowConfirm(true)}>
                    ✅ Confirmar agendamento
                  </Btn>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modal confirmação */}
      {showConfirm && (
        <div className="wm-modal-overlay">
          <div className="wm-modal wm-modal--sm">
            <div className="wm-modal__header">
              <h2 className="wm-modal__title">Confirmar agendamento?</h2>
              <Btn variant="ghost" size="sm" onClick={() => setShowConfirm(false)}>×</Btn>
            </div>
            <div className="wm-modal__body" style={{ textAlign:"center" }}>
              <div style={{ fontSize:48, marginBottom:"var(--sp-4)" }}>📅</div>
              <p style={{ color:"var(--clr-text-mid)", lineHeight:1.6 }}>
                <strong>{profissional.nome}</strong><br />
                {dataLabel} às <strong>{horarioSelecionado}</strong>
              </p>
            </div>
            <div className="wm-modal__footer">
              <Btn variant="secondary" onClick={() => setShowConfirm(false)} disabled={confirmando}>Cancelar</Btn>
              <Btn loading={confirmando} onClick={confirmar}>Confirmar</Btn>
            </div>
          </div>
        </div>
      )}

      <Toast {...toast} onClose={hideToast} />
    </PageLayout>
  );
}
