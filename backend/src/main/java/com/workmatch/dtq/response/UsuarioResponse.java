package com.workmatch.dtq.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class UsuarioResponse {

    private final UUID id;
    private final String nome;
    private final String email;
    private final String login;
    private final String role;
}