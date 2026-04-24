package com.workmatch.service;

import java.util.UUID;

import com.workmatch.dtq.request.AgendaRequest;
import com.workmatch.dtq.response.AgendaResponse;

public interface AgendaService {

    UUID criar(UUID profissionalId, AgendaRequest request);

    void atualizar(UUID agendaId, AgendaRequest request);

    void deletar(UUID agendaId);

    AgendaResponse buscarPorId(UUID agendaId);
}