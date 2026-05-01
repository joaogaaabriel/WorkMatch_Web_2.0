package com.workmatch.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class AgendaRequest {

    private LocalDate data;
    private List<String> horarios;


}
