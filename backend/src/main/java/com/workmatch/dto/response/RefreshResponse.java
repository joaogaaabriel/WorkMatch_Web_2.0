package com.workmatch.dto.response;

public record RefreshResponse(
        String  token,
        String  refreshToken,
        Integer expiresIn,
        Integer refreshExpiresIn
) {}
