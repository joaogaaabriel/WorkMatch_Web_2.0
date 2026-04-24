package com.workmatch.service;

import java.util.List;
import java.util.UUID;

import com.workmatch.model.Agendamento;

public interface AgendamentoService {

    Agendamento criar(Agendamento agendamento);

    List<Agendamento> meusAgendamentos(UUID usuarioId);

    void deletar(UUID id, UUID usuarioId);
}