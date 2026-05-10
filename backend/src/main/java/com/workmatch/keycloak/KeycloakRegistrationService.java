package com.workmatch.keycloak;

import org.springframework.stereotype.Service;

@Service
public class KeycloakRegistrationService {

    private final KeycloakUserClient userClient;

    public KeycloakRegistrationService(KeycloakUserClient userClient) {
        this.userClient = userClient;
    }

    public String register(String login, String email, String nome, String senha, String role) {
        KeycloakUserRequest request = KeycloakUserRequest.of(login, email, nome, senha, role);
        return userClient.createUser(request);
    }

    public void rollback(String keycloakId) {
        if (keycloakId == null) return;
        try {
            userClient.deleteUser(keycloakId);
        } catch (Exception ignored) {
        }
    }
}