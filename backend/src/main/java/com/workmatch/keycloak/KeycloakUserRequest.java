package com.workmatch.keycloak;

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

    @JsonProperty("emailVerified")
    private boolean emailVerified = true; // evita bloqueio de login por e-mail não verificado

    @JsonProperty("requiredActions")
    private List<String> requiredActions = List.of();

    @JsonProperty("credentials")
    private List<Map<String, Object>> credentials;

    @JsonProperty("attributes")
    private Map<String, List<String>> attributes;

    public static KeycloakUserRequest of(String login, String email, String nome, String senha, String role) {
        KeycloakUserRequest req = new KeycloakUserRequest();
        req.username = login;
        req.email = email;
        req.firstName = nome;
        req.enabled = true;
        req.emailVerified = true;
        req.requiredActions = List.of();
        req.credentials = List.of(Map.of(
                "type", "password",
                "value", senha,
                "temporary", false
        ));
        req.attributes = Map.of(
                "role", List.of(role)
        );
        return req;
    }
}