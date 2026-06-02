package com.workmatch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class MenssengerDTO {
    @NotNull
    private UUID servicoId;

    @NotNull
    private UUID remetenteId;

    @NotNull
    private UUID destinatarioId;

    @NotBlank
    private String conteudo;

    public UUID getServicoId() {
        return servicoId;
    }

    public void setServicoId(UUID servicoId) {
        this.servicoId = servicoId;
    }

    public UUID getRemetenteId() {
        return remetenteId;
    }

    public void setRemetenteId(UUID remetenteId) {
        this.remetenteId = remetenteId;
    }

    public UUID getDestinatarioId() {
        return destinatarioId;
    }

    public void setDestinatarioId(UUID destinatarioId) {
        this.destinatarioId = destinatarioId;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }
}