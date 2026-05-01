package com.workmatch.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class AgendaResponse {


    private final UUID agendaId;
    private final LocalDate data;
    private final List<String> horarios;


}