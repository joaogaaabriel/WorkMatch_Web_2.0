import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import PageLayout from "../components/PageLayout";
import { Card, Btn } from "../components/ui";
import { useToast } from "../hooks/useToast";

const ESPECIALIDADES = [
  "Todas", "Eletricista", "Encanador", "Pintor", "Pedreiro",
  "Marceneiro", "Jardineiro", "Diarista", "Técnico de TI", "Outro",
];

function IconMapPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function IconMessageCircle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

const STATUS_LABEL = {
  PUBLICADO:  "Publicado",
  NEGOCIANDO: "Negociando",
  CONTRATADO: "Contratado",
  ANDAMENTO:  "Em andamento",
  FINALIZADO: "Finalizado",
  ARQUIVADO:  "Arquivado",
};

const STATUS_CLASS = {
  PUBLICADO:  "wm-badge--blue",
  NEGOCIANDO: "wm-badge--yellow",
  CONTRATADO: "wm-badge--green",
  ANDAMENTO:  "wm-badge--green",
  FINALIZADO: "wm-badge--gray",
  ARQUIVADO:  "wm-badge--gray",
};

export default function HomeProfissional() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const { showToast, Toast } = useToast();

  const [servicos,       setServicos]       = useState([]);
  const [candidatados,   setCandidatados]   = useState(new Set());
  const [carregando,     setCarregando]     = useState(true);
  const [enviando,       setEnviando]       = useState(null); // id do serviço em processo
  const [filtroEsp,      setFiltroEsp]      = useState("Todas");
  const [filtroCidade,   setFiltroCidade]   = useState("");

  // Carrega serviços publicados e candidaturas já feitas
  useEffect(() => {
    if (!user?.id) return;

    const params = {};
    if (filtroEsp && filtroEsp !== "Todas") params.especialidade = filtroEsp;
    if (filtroCidade.trim())                params.cidade        = filtroCidade.trim();

    Promise.all([
      api.get("/api/servicos/publicados", { params }),
      api.get(`/api/candidaturas/profissional/${user.id}`).catch(() => ({ data: [] })),
    ])
      .then(([resServicos, resCandidaturas]) => {
        setServicos(resServicos.data ?? []);
        const ids = new Set((resCandidaturas.data ?? []).map(c => c.servicoId));
        setCandidatados(ids);
      })
      .catch(() => showToast("Erro ao carregar serviços.", "erro"))
      .finally(() => setCarregando(false));
  }, [user?.id, filtroEsp, filtroCidade]);

  async function handleCandidatar(servico) {
    if (enviando || candidatados.has(servico.id)) return;
    setEnviando(servico.id);

    try {
      await api.post("/api/candidaturas", {
        servicoId:      servico.id,
        profissionalId: user.id,
      });
      setCandidatados(prev => new Set([...prev, servico.id]));
      showToast("Candidatura enviada com sucesso!", "sucesso");
    } catch (err) {
      const msg = err.response?.data?.message ?? "Não foi possível enviar a candidatura.";
      showToast(msg, "erro");
    } finally {
      setEnviando(null);
    }
  }

  function handleChat(servico) {
    navigate(`/chat/${servico.id}/${user.id}`);
  }

  const servicosFiltrados = servicos.filter(s => {
    if (filtroEsp !== "Todas" && !s.especialidade?.toLowerCase().includes(filtroEsp.toLowerCase())) {
      return false;
    }
    if (filtroCidade.trim() && !s.cidade?.toLowerCase().includes(filtroCidade.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <PageLayout title="Serviços disponíveis" subtitle="Encontre oportunidades na sua área">
      <Toast />

      {/* Filtros */}
      <div className="wm-filters">
        <div className="wm-filters__chips">
          {ESPECIALIDADES.map(esp => (
            <button
              key={esp}
              className={`wm-chip${filtroEsp === esp ? " wm-chip--active" : ""}`}
              onClick={() => setFiltroEsp(esp)}
            >
              {esp}
            </button>
          ))}
        </div>
        <input
          className="wm-input wm-filters__city"
          placeholder="Filtrar por cidade..."
          value={filtroCidade}
          onChange={e => setFiltroCidade(e.target.value)}
        />
      </div>

      {/* Lista */}
      {carregando ? (
        <div className="wm-empty-state">Carregando serviços...</div>
      ) : servicosFiltrados.length === 0 ? (
        <div className="wm-empty-state">
          Nenhum serviço encontrado com esses filtros.
        </div>
      ) : (
        <div className="wm-card-grid">
          {servicosFiltrados.map(servico => {
            const jaCandidatou = candidatados.has(servico.id);
            const emEnvio      = enviando === servico.id;
            const podeCandidatar = servico.status === "PUBLICADO" && !jaCandidatou;
            const podeChat       = ["NEGOCIANDO","CONTRATADO","ANDAMENTO"].includes(servico.status)
                                   && servico.profissionalId === user.id;

            return (
              <Card key={servico.id}>
                <div className="wm-service-card">
                  <div className="wm-service-card__header">
                    <h3 className="wm-service-card__title">{servico.titulo}</h3>
                    <span className={`wm-badge ${STATUS_CLASS[servico.status] ?? "wm-badge--gray"}`}>
                      {STATUS_LABEL[servico.status] ?? servico.status}
                    </span>
                  </div>

                  <div className="wm-service-card__meta">
                    <span className="wm-service-card__meta-item">
                      <IconBriefcase /> {servico.especialidade}
                    </span>
                    {servico.cidade && (
                      <span className="wm-service-card__meta-item">
                        <IconMapPin /> {servico.cidade}{servico.estado ? ` — ${servico.estado}` : ""}
                      </span>
                    )}
                  </div>

                  {servico.descricao && (
                    <p className="wm-service-card__desc">
                      {servico.descricao.length > 140
                        ? servico.descricao.slice(0, 140) + "..."
                        : servico.descricao}
                    </p>
                  )}

                  <div className="wm-service-card__actions">
                    {podeCandidatar && (
                      <Btn
                        size="sm"
                        onClick={() => handleCandidatar(servico)}
                        disabled={emEnvio}
                      >
                        {emEnvio ? "Enviando..." : "Candidatar-se"}
                      </Btn>
                    )}

                    {jaCandidatou && servico.status === "PUBLICADO" && (
                      <span className="wm-text-muted" style={{ fontSize: 14 }}>
                        ✓ Candidatura enviada
                      </span>
                    )}

                    {podeChat && (
                      <Btn
                        size="sm"
                        variant="outline"
                        onClick={() => handleChat(servico)}
                      >
                        <IconMessageCircle /> Chat
                      </Btn>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
