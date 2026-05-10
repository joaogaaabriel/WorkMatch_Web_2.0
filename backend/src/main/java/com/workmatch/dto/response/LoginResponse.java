package com.workmatch.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class LoginResponse {

    private String token;
    private String refreshToken;
    private Integer expiresIn;

    private UUID   id;
    private String nome;
    private String email;
    private String login;
    private String role;
}