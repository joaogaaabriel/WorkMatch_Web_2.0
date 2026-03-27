/**
 * WorkMatch 2.0 — GerenciarAgendaPage (ADMIN)
 */
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { profissionaisService, agendaService } from "../services/api";
import PageLayout from "../components/PageLayout";
import { Btn, Card, CardHeader, CardBody, CardTitle, Input, Badge, Spinner, EmptyState, Alert } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

function toDateStr(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const WDAYS  = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function MiniCalendar({ selected, onChange }) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const days = new Date(view.year, view.month+1, 0).getDate();
  const firstDOW = new Date(view.year, view.month, 1).getDay();
  const selStr = selected ? toDateStr(selected) : "";

  function prev() { setView(v => v.month===0 ? {year:v.year-1,month:11} : {...v,month:v.month-1}); }
  function next() { setView(v => v.month===11 ? {year:v.year+1,month:0} : {...v,month:v.month+1}); }

  return (
    <div>
      <div className="wm-cal-nav">
        <button className="wm-cal-nav__btn" onClick={prev}>‹</button>
        <span className="wm-cal-nav__title">{MONTHS[view.month]} {view.year}</span>
        <button className="wm-cal-nav__btn" onClick={next}>›</button>
      </div>
      <div className="wm-cal-weekdays">{WDAYS.map(d=><span key={d}>{d}</span>)}</div>
      <div className="wm-cal-grid">
        {Array.from({length:firstDOW}).map((_,i)=><div key={`e${i}`}/>)}
        {Array.from({length:days}).map((_,i)=>{
          const day=i+1, date=new Date(view.year,view.month,day), dateStr=toDateStr(date);
          const isToday=toDateStr(today)===dateStr, isSel=selStr===dateStr;
          const isPast=date<new Date(today.getFullYear(),today.getMonth(),today.getDate());
          return (
            <button key={day} disabled={isPast} onClick={()=>!isPast&&onChange(date)}
              className={`wm-cal-day${isToday?" wm-cal-day--today":""}${isSel?" wm-cal-day--selected":""}`}
            >{day}</button>
          );
        })}
      </div>
    </div>
  );
}

const HORARIOS_PADRAO = ["07:00","08:00","09:00","10:00","11:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

export default function GerenciarAgendaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const [prof, setProf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataSel, setDataSel] = useState(new Date());
  const [agendaId, setAgendaId] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [ocupados, setOcupados] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [horarioCustom, setHorarioCustom] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    profissionaisService.buscarPorId(id)
      .then(setProf)
      .catch(() => showToast("Profissional não encontrado.", "error"))
      .finally(() => setLoading(false));
  }, [id]);

  const carregarAgenda = useCallback(async (data) => {
    setLoadingSlots(true); setAgendaId(null); setSelecionados([]);
    try {
      const res = await agendaService.horariosPorData(id, toDateStr(data));
      const hs = Array.isArray(res.horarios) ? res.horarios.map(h=>String(h).slice(0,5)) : [];
      const oc = Array.isArray(res.ocupados) ? res.ocupados.map(h=>String(h).slice(0,5)) : [];
      setHorarios(hs); setOcupados(oc); setSelecionados(hs);
      if (res.agendaId) setAgendaId(res.agendaId);
    } catch { setHorarios([]); setOcupados([]); setSelecionados([]); }
    finally { setLoadingSlots(false); }
  }, [id]);

  useEffect(() => { carregarAgenda(dataSel); }, [dataSel, carregarAgenda]);

  function toggleSlot(h) {
    if (ocupados.includes(h)) return;
    setSelecionados(prev => prev.includes(h) ? prev.filter(x=>x!==h) : [...prev, h]);
  }

  function addCustom() {
    const v = horarioCustom.trim();
    if (!v || !/^\d{2}:\d{2}$/.test(v)) { showToast("Formato inválido. Use HH:mm", "warning"); return; }
    if (!selecionados.includes(v)) setSelecionados(prev=>[...prev,v].sort());
    setHorarioCustom("");
  }

  async function salvar() {
    if (selecionados.length === 0) { showToast("Selecione ao menos um horário.", "warning"); return; }
    setSalvando(true);
    try {
      const dataStr = toDateStr(dataSel);
      if (agendaId) {
        await agendaService.atualizarPorId(agendaId, { data: dataStr, horarios: selecionados });
      } else {
        await agendaService.criar(id, { data: dataStr, horarios: selecionados });
      }
      showToast("Agenda salva com sucesso!", "success");
      carregarAgenda(dataSel);
    } catch { showToast("Erro ao salvar agenda.", "error"); }
    finally { setSalvando(false); }
  }

  const dataLabel = dataSel.toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"});

  if (loading) return (
    <PageLayout title="Carregando..." backPath="/gerenciar-profissionais">
      <div style={{display:"flex",justifyContent:"center",padding:"var(--sp-16) 0"}}><Spinner size="lg"/></div>
    </PageLayout>
  );

  return (
    <PageLayout
      title={`Agenda — ${prof?.nome || "Profissional"}`}
      subtitle={prof?.especialidade}
      backPath="/gerenciar-profissionais"
    >
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"var(--sp-6)", alignItems:"start" }}>

        {/* Calendário */}
        <Card accent="blue">
          <CardHeader><CardTitle>📅 Selecionar data</CardTitle></CardHeader>
          <CardBody>
            <MiniCalendar selected={dataSel} onChange={setDataSel} />
            <p style={{ marginTop:"var(--sp-4)", textAlign:"center", fontSize:13, color:"var(--clr-text-light)" }}>
              {dataLabel}
            </p>
          </CardBody>
        </Card>

        {/* Horários */}
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--sp-4)" }}>
          <Card accent="purple">
            <CardHeader>
              <CardTitle>🕐 Horários para o dia</CardTitle>
              <Badge variant={selecionados.length > 0 ? "purple" : "neutral"}>{selecionados.length} selecionados</Badge>
            </CardHeader>
            <CardBody>
              {loadingSlots ? (
                <div style={{display:"flex",justifyContent:"center",padding:"var(--sp-8) 0"}}><Spinner/></div>
              ) : (
                <>
                  <p style={{ fontSize:12, color:"var(--clr-text-light)", marginBottom:"var(--sp-4)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>
                    Horários padrão — clique para ativar/desativar
                  </p>
                  <div className="wm-slots">
                    {HORARIOS_PADRAO.map(h => {
                      const isOcupado = ocupados.includes(h);
                      const isSel = selecionados.includes(h);
                      return (
                        <button
                          key={h}
                          className={`wm-slot${isSel && !isOcupado ? " wm-slot--selected" : ""}`}
                          onClick={() => toggleSlot(h)}
                          disabled={isOcupado}
                          style={isOcupado ? { opacity:0.45, cursor:"not-allowed", background:"var(--clr-bg)" } : {}}
                          title={isOcupado ? "Horário ocupado" : ""}
                        >
                          {h}
                          {isOcupado && <div style={{fontSize:9,marginTop:1,color:"var(--clr-danger)"}}>ocupado</div>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Horários adicionais (não padrão, já configurados) */}
                  {selecionados.filter(h=>!HORARIOS_PADRAO.includes(h)).length > 0 && (
                    <div style={{ marginTop:"var(--sp-4)" }}>
                      <p style={{ fontSize:12, color:"var(--clr-text-light)", marginBottom:"var(--sp-2)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>Horários personalizados</p>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:"var(--sp-2)" }}>
                        {selecionados.filter(h=>!HORARIOS_PADRAO.includes(h)).map(h=>(
                          <div key={h} style={{ display:"flex", alignItems:"center", gap:4, background:"var(--clr-purple-pale)", borderRadius:"var(--r-full)", padding:"4px 10px", fontSize:13, fontWeight:600, color:"var(--clr-purple)" }}>
                            {h}
                            {!ocupados.includes(h) && (
                              <button onClick={()=>setSelecionados(prev=>prev.filter(x=>x!==h))} style={{ background:"none",border:"none",cursor:"pointer",fontSize:14,color:"var(--clr-purple)",padding:0,lineHeight:1,marginLeft:2 }}>×</button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Horário customizado */}
                  <div style={{ marginTop:"var(--sp-5)", display:"flex", gap:"var(--sp-2)" }}>
                    <input
                      className="wm-input" style={{ flex:1 }}
                      type="time" value={horarioCustom}
                      onChange={e=>setHorarioCustom(e.target.value)}
                      placeholder="HH:mm"
                    />
                    <Btn variant="secondary" size="sm" onClick={addCustom}>+ Adicionar</Btn>
                  </div>
                </>
              )}
            </CardBody>
          </Card>

          {ocupados.length > 0 && (
            <Alert variant="warning" emoji="⚠️">
              {ocupados.length} horário{ocupados.length>1?"s":""} ocupado{ocupados.length>1?"s":""} neste dia — não podem ser removidos.
            </Alert>
          )}

          <Btn fullWidth size="lg" loading={salvando} onClick={salvar}>
            💾 Salvar agenda
          </Btn>

          <Btn variant="secondary" fullWidth onClick={() => setSelecionados([])}>
            Limpar seleção
          </Btn>
        </div>
      </div>

      <Toast {...toast} onClose={hideToast} />
    </PageLayout>
  );
}
