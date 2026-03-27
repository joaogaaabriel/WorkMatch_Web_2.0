/**
 * WorkMatch 2.0 — GerenciarAgendaPage (ADMIN)
 * BUG CORRIGIDO: URL com /${id} correto; template literals
 */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { agendaService, profissionaisService } from "../services/api";
import PageLayout from "../components/PageLayout";
import { Card, Btn, Input, Spinner, EmptyState } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

const MONTHS_PT = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const WEEKDAYS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDOW(y, m) { return new Date(y, m, 1).getDay(); }

export default function GerenciarAgendaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const [profissional, setProfissional] = useState(null);
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState(null);

  // Agenda do dia selecionado
  const [horarioInput, setHorarioInput] = useState("");
  const [horariosTemp, setHorariosTemp] = useState([]);
  const [agendaId, setAgendaId] = useState(null);

  async function carregar() {
    setLoading(true);
    try {
      const [prof, ags] = await Promise.all([
        profissionaisService.buscarPorId(id),
        agendaService.buscarAgendas(id),
      ]);
      setProfissional(prof);
      setAgendas(Array.isArray(ags) ? ags : []);
    } catch {
      showToast("Erro ao carregar dados.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [id]);

  function selectDay(date) {
    setSelectedDate(date);
    const dateStr = toDateStr(date);
    const agenda = agendas.find(a => a.data === dateStr);
    if (agenda) {
      setAgendaId(agenda.id);
      setHorariosTemp(agenda.horarios?.map(h => (typeof h === "object" ? h.horario : h)) || []);
    } else {
      setAgendaId(null);
      setHorariosTemp([]);
    }
    setHorarioInput("");
  }

  function addHorario() {
    const h = horarioInput.trim();
    if (!h) return;
    if (!/^\d{1,2}:\d{2}$/.test(h)) {
      showToast("Formato de horário inválido. Use HH:MM.", "warning");
      return;
    }
    if (horariosTemp.includes(h)) {
      showToast("Horário já adicionado.", "warning");
      return;
    }
    const sorted = [...horariosTemp, h].sort((a, b) => {
      const [ha, ma] = a.split(":").map(Number);
      const [hb, mb] = b.split(":").map(Number);
      return ha - hb || ma - mb;
    });
    setHorariosTemp(sorted);
    setHorarioInput("");
  }

  function removeHorario(h) {
    setHorariosTemp(prev => prev.filter(x => x !== h));
  }

  async function salvarAgenda() {
    if (!selectedDate) return;
    setSaving(true);
    const dateStr = toDateStr(selectedDate);
    try {
      if (agendaId) {
        await agendaService.atualizarAgenda(agendaId, { data: dateStr, horarios: horariosTemp });
        showToast("Agenda atualizada! ✓", "success");
      } else {
        await agendaService.criarAgenda(id, { data: dateStr, horarios: horariosTemp });
        showToast("Agenda criada! ✓", "success");
      }
      await carregar();
      // Reseleciona o dia para atualizar os dados
      selectDay(selectedDate);
    } catch {
      showToast("Erro ao salvar agenda.", "error");
    } finally {
      setSaving(false);
    }
  }

  // Dias com agenda configurada
  const diasComAgenda = new Set(agendas.map(a => a.data));

  const days = getDaysInMonth(view.year, view.month);
  const firstDOW = getFirstDOW(view.year, view.month);

  function prevMonth() {
    setView(v => v.month === 0 ? { year:v.year-1, month:11 } : { ...v, month:v.month-1 });
    setSelectedDate(null);
  }
  function nextMonth() {
    setView(v => v.month === 11 ? { year:v.year+1, month:0 } : { ...v, month:v.month+1 });
    setSelectedDate(null);
  }

  return (
    <PageLayout
      title={profissional ? `Agenda — ${profissional.nome}` : "Gerenciar Agenda"}
      subtitle={profissional?.especialidade}
      backPath="/gerenciar-profissionais"
    >
      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:"80px 0" }}>
          <Spinner size={48} />
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:24 }}>

          {/* ── Calendário ── */}
          <Card style={{ padding:28 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <button onClick={prevMonth} style={{ background:"none", border:"1.5px solid var(--clr-border)", borderRadius:10, width:38, height:38, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
              <span style={{ fontWeight:800, fontSize:18, color:"var(--clr-text)" }}>
                {MONTHS_PT[view.month]} {view.year}
              </span>
              <button onClick={nextMonth} style={{ background:"none", border:"1.5px solid var(--clr-border)", borderRadius:10, width:38, height:38, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
            </div>

            {/* Cabeçalho semana */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:6 }}>
              {WEEKDAYS.map(d => (
                <div key={d} style={{ textAlign:"center", fontSize:12, fontWeight:700, color:"var(--clr-muted)", padding:"4px 0" }}>{d}</div>
              ))}
            </div>

            {/* Dias */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
              {Array.from({ length: firstDOW }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: days }).map((_, i) => {
                const day = i + 1;
                const date = new Date(view.year, view.month, day);
                const dateStr = toDateStr(date);
                const hasAgenda = diasComAgenda.has(dateStr);
                const isSelected = selectedDate && toDateStr(selectedDate) === dateStr;
                const isToday = toDateStr(today) === dateStr;

                return (
                  <button
                    key={day}
                    onClick={() => selectDay(date)}
                    style={{
                      width:"100%", aspectRatio:"1",
                      borderRadius:10,
                      border: isSelected ? "none" : isToday ? "2px solid var(--clr-primary-lt)" : "none",
                      background: isSelected ? "var(--clr-primary)" : isToday ? "var(--clr-primary-bg)" : "transparent",
                      color: isSelected ? "#fff" : "var(--clr-text)",
                      fontSize:15, fontWeight: isSelected ? 800 : 500,
                      fontFamily:"var(--font-body)",
                      cursor:"pointer",
                      position:"relative",
                      transition:"all .15s",
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "var(--clr-primary-bg)"; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isToday ? "var(--clr-primary-bg)" : "transparent"; }}
                  >
                    {day}
                    {hasAgenda && !isSelected && (
                      <span style={{
                        position:"absolute", bottom:3, left:"50%", transform:"translateX(-50%)",
                        width:5, height:5, borderRadius:"50%",
                        background:"var(--clr-teal)",
                        display:"block",
                      }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legenda */}
            <div style={{ display:"flex", gap:16, marginTop:20, flexWrap:"wrap" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:10, height:10, borderRadius:"50%", background:"var(--clr-teal)", display:"inline-block" }} />
                <span style={{ fontSize:13, color:"var(--clr-muted)", fontWeight:600 }}>Com agenda</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:10, height:10, borderRadius:"50%", background:"var(--clr-primary)", display:"inline-block" }} />
                <span style={{ fontSize:13, color:"var(--clr-muted)", fontWeight:600 }}>Selecionado</span>
              </div>
            </div>
          </Card>

          {/* ── Horários do dia ── */}
          <Card style={{ padding:28 }}>
            {!selectedDate ? (
              <EmptyState
                emoji="👆"
                title="Selecione um dia"
                description="Clique em um dia no calendário para ver e configurar os horários disponíveis."
              />
            ) : (
              <>
                <h3 style={{ fontSize:18, fontWeight:900, marginBottom:4, color:"var(--clr-text)" }}>
                  {selectedDate.toLocaleDateString("pt-BR", { weekday:"long", day:"2-digit", month:"long" })}
                </h3>
                <p style={{ fontSize:14, color:"var(--clr-muted)", marginBottom:24, fontWeight:500 }}>
                  {agendaId ? "✅ Agenda configurada — edite os horários abaixo" : "📝 Sem agenda — adicione horários abaixo"}
                </p>

                {/* Adicionar horário */}
                <div style={{ display:"flex", gap:10, marginBottom:20 }}>
                  <div style={{ flex:1 }}>
                    <Input
                      name="horario"
                      placeholder="08:00"
                      value={horarioInput}
                      onChange={e => setHorarioInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addHorario()}
                      icon="🕐"
                      hint="Pressione Enter para adicionar"
                    />
                  </div>
                  <Btn onClick={addHorario} style={{ flexShrink:0, alignSelf:"flex-start", marginTop:0 }}>
                    + Adicionar
                  </Btn>
                </div>

                {/* Lista de horários */}
                {horariosTemp.length === 0 ? (
                  <p style={{ color:"var(--clr-muted)", fontSize:15, textAlign:"center", padding:"24px 0", fontWeight:500 }}>
                    Nenhum horário adicionado ainda.
                  </p>
                ) : (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:24 }}>
                    {horariosTemp.map(h => (
                      <div key={h} style={{
                        display:"flex", alignItems:"center", gap:8,
                        background:"var(--clr-primary-bg)",
                        border:"1.5px solid #bfdbfe",
                        borderRadius:10, padding:"10px 14px",
                      }}>
                        <span style={{ fontSize:15, fontWeight:700, color:"var(--clr-primary)" }}>{h}</span>
                        <button
                          onClick={() => removeHorario(h)}
                          style={{
                            background:"none", border:"none", cursor:"pointer",
                            color:"var(--clr-danger)", fontSize:16, lineHeight:1,
                            padding:"0 2px",
                          }}
                          title="Remover horário"
                        >×</button>
                      </div>
                    ))}
                  </div>
                )}

                <Btn fullWidth size="lg" loading={saving} onClick={salvarAgenda}>
                  💾 Salvar agenda do dia
                </Btn>
              </>
            )}
          </Card>
        </div>
      )}

      {/* ── Resumo agendas configuradas ── */}
      {!loading && agendas.length > 0 && (
        <div style={{ marginTop:32 }}>
          <h3 style={{ fontSize:18, fontWeight:800, marginBottom:16, color:"var(--clr-text)" }}>
            📋 Agendas configuradas ({agendas.length})
          </h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:12 }}>
            {agendas
              .slice()
              .sort((a,b) => a.data.localeCompare(b.data))
              .map(a => (
                <div
                  key={a.id}
                  onClick={() => selectDay(new Date(a.data + "T12:00:00"))}
                  style={{
                    background:"var(--clr-surface)",
                    border:"1.5px solid var(--clr-border)",
                    borderRadius:12, padding:"14px 16px",
                    cursor:"pointer",
                    transition:"all .15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--clr-primary-lt)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--clr-border)"}
                >
                  <p style={{ fontWeight:700, fontSize:15, color:"var(--clr-text)", marginBottom:4 }}>
                    {new Date(a.data + "T12:00:00").toLocaleDateString("pt-BR", { weekday:"short", day:"2-digit", month:"short" })}
                  </p>
                  <p style={{ fontSize:13, color:"var(--clr-muted)", fontWeight:600 }}>
                    {a.horarios?.length || 0} horário{a.horarios?.length !== 1 ? "s" : ""}
                  </p>
                </div>
              ))
            }
          </div>
        </div>
      )}

      <Toast {...toast} onClose={hideToast} />
    </PageLayout>
  );
}
