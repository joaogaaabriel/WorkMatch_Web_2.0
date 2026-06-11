package com.workmatch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class MenssengerDTO {

    @NotNull
    private UUID servicoId;

    @NotNull
    private UUID remetenteId;

    /*
     * "PROFISSIONAL" ou "CLIENTE".
     * Nulo é tratado como "PROFISSIONAL" para compatibilidade com chamadas legadas.
     */
    private String remetenteTipo;

    /*
     * Obrigatório quando remetenteTipo = "PROFISSIONAL" (o destinatário é o cliente).
     * Ignorado quando remetenteTipo = "CLIENTE" (o destinatário é inferido do serviço).
     */
    private UUID destinatarioId;

    @NotBlank
    private String conteudo;

    public UUID getServicoId() { return servicoId; }
    public void setServicoId(UUID servicoId) { this.servicoId = servicoId; }

    public UUID getRemetenteId() { return remetenteId; }
    public void setRemetenteId(UUID remetenteId) { this.remetenteId = remetenteId; }

    public String getRemetenteTipo() { return remetenteTipo; }
    public void setRemetenteTipo(String remetenteTipo) { this.remetenteTipo = remetenteTipo; }

    public UUID getDestinatarioId() { return destinatarioId; }
    public void setDestinatarioId(UUID destinatarioId) { this.destinatarioId = destinatarioId; }

    public String getConteudo() { return conteudo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }
}
