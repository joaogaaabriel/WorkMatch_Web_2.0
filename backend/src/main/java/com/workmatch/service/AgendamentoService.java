package com.workmatch.service;

import java.util.List;
import java.util.UUID;

import com.workmatch.dto.request.AgendamentoRequest;
import com.workmatch.dto.response.AgendamentoResponse;
import com.workmatch.model.Agendamento;

public interface AgendamentoService {

    AgendamentoResponse criar(AgendamentoRequest request);

    List<Agendamento> meusAgendamentos(UUID usuarioId);

    void deletar(UUID id, UUID usuarioId);
}