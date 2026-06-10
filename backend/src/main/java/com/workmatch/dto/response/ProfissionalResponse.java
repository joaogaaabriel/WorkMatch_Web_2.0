package com.workmatch.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

// B07 — DTO para retornar dados do profissional sem expor campos sensíveis
public record ProfissionalResponse(
        UUID       id,
        String     nome,
        String     especialidade,
        String     descricao,
        Integer    experienciaAnos,
        BigDecimal avaliacaoMedia,
        Integer    totalAvaliacoes,
        String     cidade,
        String     estado,
        Boolean    ativo
) {}
