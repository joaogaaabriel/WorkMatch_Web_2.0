import { useState } from "react";
import api from "../services/api";
import { Btn } from "./ui";

function IconStar({ filled }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function AvaliacaoModal({ servico, clienteId, onClose, onSucesso }) {
  const [nota,       setNota]       = useState(0);
  const [hover,      setHover]      = useState(0);
  const [comentario, setComentario] = useState("");
  const [salvando,   setSalvando]   = useState(false);
  const [erro,       setErro]       = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (nota === 0) { setErro("Selecione uma nota de 1 a 5 estrelas."); return; }

    setSalvando(true);
    setErro(null);

    try {
      await api.post("/api/avaliacoes", {
        servicoId:  servico.id,
        clienteId,
        nota,
        comentario: comentario.trim() || null,
      });
      onSucesso();
    } catch (err) {
      setErro(err.response?.data?.message ?? "Erro ao enviar avaliação.");
    } finally {
      setSalvando(false);
    }
  }

  const estrelaAtiva = hover || nota;

  return (
    <div className="wm-modal-overlay" onClick={onClose}>
      <div className="wm-modal" onClick={e => e.stopPropagation()} role="dialog"
        aria-modal="true" aria-labelledby="modal-avaliacao-titulo">

        <div className="wm-modal__header">
          <h2 id="modal-avaliacao-titulo" className="wm-modal__title">
            Avaliar profissional
          </h2>
          <button className="wm-modal__close" onClick={onClose} aria-label="Fechar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M2 2l12 12M14 2L2 14" />
            </svg>
          </button>
        </div>

        <div className="wm-modal__body">
          <p className="wm-modal__service-name">{servico.titulo}</p>
          {servico.profissionalNome && (
            <p className="wm-modal__prof-name">Profissional: {servico.profissionalNome}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="wm-stars" role="group" aria-label="Nota de 1 a 5">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  className={`wm-stars__btn${n <= estrelaAtiva ? " wm-stars__btn--active" : ""}`}
                  onClick={() => setNota(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
                >
                  <IconStar filled={n <= estrelaAtiva} />
                </button>
              ))}
            </div>
            {nota > 0 && (
              <p className="wm-stars__label">
                {["", "Péssimo", "Ruim", "Regular", "Bom", "Excelente"][nota]}
              </p>
            )}

            <div className="wm-form-group" style={{ marginTop: 16 }}>
              <label className="wm-label">Comentário (opcional)</label>
              <textarea
                className="wm-input"
                rows={3}
                maxLength={500}
                placeholder="Conte como foi a experiência com o profissional..."
                value={comentario}
                onChange={e => setComentario(e.target.value)}
              />
            </div>

            {erro && <p className="wm-field-error" style={{ marginTop: 8 }}>{erro}</p>}

            <div className="wm-modal__actions">
              <Btn type="button" variant="outline" onClick={onClose} disabled={salvando}>
                Cancelar
              </Btn>
              <Btn type="submit" disabled={salvando || nota === 0}>
                {salvando ? "Enviando..." : "Enviar avaliação"}
              </Btn>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
