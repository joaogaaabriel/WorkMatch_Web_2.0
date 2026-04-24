package com.workmatch.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AgendamentoResponse {

    public AgendamentoResponse(UUID id2, UUID id3, UUID id4, LocalDate data2, LocalTime horario2) {
        this.id = id2;
        this.usuarioId = id3;   
        this.profissionalId = id4;
        this.data = data2;

    }
    private UUID id;

    private UUID usuarioId;
    private UUID profissionalId;

    private LocalDate data;
    private String horario;
}