package com.workmatch.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public class MenssengerResponse {

    private UUID          id;
    private UUID          servicoId;
    private UUID          remetenteId;
    private String        remetenteNome;
    private String        remetenteTipo;   // "PROFISSIONAL" ou "CLIENTE"
    private UUID          destinatarioId;
    private String        conteudo;
    private LocalDateTime enviadoEm;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getServicoId() { return servicoId; }
    public void setServicoId(UUID servicoId) { this.servicoId = servicoId; }

    public UUID getRemetenteId() { return remetenteId; }
    public void setRemetenteId(UUID remetenteId) { this.remetenteId = remetenteId; }

    public String getRemetenteNome() { return remetenteNome; }
    public void setRemetenteNome(String remetenteNome) { this.remetenteNome = remetenteNome; }

    public String getRemetenteTipo() { return remetenteTipo; }
    public void setRemetenteTipo(String remetenteTipo) { this.remetenteTipo = remetenteTipo; }

    public UUID getDestinatarioId() { return destinatarioId; }
    public void setDestinatarioId(UUID destinatarioId) { this.destinatarioId = destinatarioId; }

    public String getConteudo() { return conteudo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }

    public LocalDateTime getEnviadoEm() { return enviadoEm; }
    public void setEnviadoEm(LocalDateTime enviadoEm) { this.enviadoEm = enviadoEm; }
}
