package com.workmatch.dto.response;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AgendamentoResponse {
    
    private UUID id;

    private UUID usuarioId;
    private UUID profissionalId;

    private LocalDate data;
    private String horario;
}