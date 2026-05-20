package com.workmatch.keycloak;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
public class KeycloakUserRequest {

    private String username;
    private String email;
    private String firstName;
    private boolean enabled = true;

    @JsonIgnore
    private String senha;

    @JsonProperty("emailVerified")
    private boolean emailVerified = true;

    @JsonProperty("requiredActions")
    private List<String> requiredActions = List.of();

    @JsonProperty("attributes")
    private Map<String, List<String>> attributes;

    public static KeycloakUserRequest of(
            String login,
            String email,
            String nome,
            String senha,
            String role
    ) {
        KeycloakUserRequest req = new KeycloakUserRequest();
        req.username = login;
        req.email = email;
        req.firstName = nome;
        req.enabled = true;
        req.senha = senha;
        req.emailVerified = true;
        req.requiredActions = List.of();
        req.attributes = Map.of("role", List.of(role));
        return req;
    }
}