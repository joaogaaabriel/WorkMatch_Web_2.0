package com.workmatch.dto.response;

import java.util.UUID;

public record LoginResponseDTO(
        UUID id,
        String nome,
        String email,
        String role,
        String token
) {}