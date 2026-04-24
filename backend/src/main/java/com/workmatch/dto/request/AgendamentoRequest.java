package com.workmatch.dto.request;

import java.time.LocalDate;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AgendamentoRequest {

    private UUID usuarioId;
    private UUID profissionalId;

    private LocalDate data;
    private String horario;
}