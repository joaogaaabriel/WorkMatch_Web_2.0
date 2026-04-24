package com.workmatch.dtq.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class AgendaResponse {

    private final UUID agendaId;
    private final LocalDate data;
    private final List<String> horarios;
}