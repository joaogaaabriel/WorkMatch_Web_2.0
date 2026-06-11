package com.workmatch.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class AvaliacaoDTO {

    @NotNull
    private UUID servicoId;

    @NotNull
    private UUID clienteId;

    @NotNull
    @Min(1) @Max(5)
    private Integer nota;

    private String comentario;

    public UUID getServicoId()    { return servicoId; }
    public void setServicoId(UUID servicoId) { this.servicoId = servicoId; }

    public UUID getClienteId()    { return clienteId; }
    public void setClienteId(UUID clienteId) { this.clienteId = clienteId; }

    public Integer getNota()      { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
}
