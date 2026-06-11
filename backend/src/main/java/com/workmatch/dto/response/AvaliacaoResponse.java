package com.workmatch.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record AvaliacaoResponse(
        UUID          id,
        UUID          servicoId,
        UUID          profissionalId,
        String        profissionalNome,
        UUID          clienteId,
        String        clienteNome,
        Integer       nota,
        String        comentario,
        LocalDateTime criadoEm
) {}
