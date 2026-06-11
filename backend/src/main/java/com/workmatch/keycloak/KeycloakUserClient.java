package com.workmatch.keycloak;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;

@Component
public class KeycloakUserClient {

    private final WebClient          webClient;
    private final KeycloakProperties properties;
    private final KeycloakTokenClient tokenClient;

    public KeycloakUserClient(WebClient.Builder webClientBuilder,
                               KeycloakProperties properties,
                               KeycloakTokenClient tokenClient) {
        this.webClient   = webClientBuilder.build();
        this.properties  = properties;
        this.tokenClient = tokenClient;
    }

    public String createUser(KeycloakUserRequest request) {
        String token = tokenClient.getAdminToken();

        try {
            var response = webClient.post()
                    .uri(properties.getUsersUrl())
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .toBodilessEntity()
                    .block();

            if (response == null) {
                throw new KeycloakIntegrationException("Resposta nula ao criar usuário no Keycloak");
            }

            String locationHeader = response.getHeaders().getFirst(HttpHeaders.LOCATION);
            if (locationHeader == null) {
                throw new KeycloakIntegrationException("Header Location ausente na resposta do Keycloak");
            }

            String userId = extractKeycloakId(locationHeader);
            resetPassword(userId, request.getSenha());
            return userId;

        } catch (WebClientResponseException ex) {
            if (ex.getStatusCode() == HttpStatus.CONFLICT) {
                throw new KeycloakIntegrationException("Usuário já existe no Keycloak: " + request.getUsername());
            }
            throw new KeycloakIntegrationException("Erro ao criar usuário no Keycloak: " + ex.getResponseBodyAsString());
        }
    }

    public void resetPassword(String userId, String senha) {
        String token = tokenClient.getAdminToken();

        Map<String, Object> payload = Map.of(
                "type",      "password",
                "temporary", false,
                "value",     senha
        );

        try {
            webClient.put()
                    .uri(properties.getUsersUrl() + "/" + userId + "/reset-password")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(payload)
                    .retrieve()
                    .toBodilessEntity()
                    .block();

        } catch (WebClientResponseException ex) {
            throw new KeycloakIntegrationException("Erro ao definir senha no Keycloak: " + ex.getResponseBodyAsString());
        }
    }

    /*
     * Dispara o e-mail de recuperação de senha via Keycloak.
     * Requer que o realm tenha SMTP configurado no painel do Keycloak.
     * Ação: UPDATE_PASSWORD — o usuário receberá um link para redefinir a senha.
     */
    public void solicitarResetSenha(String keycloakId) {
        String token = tokenClient.getAdminToken();

        try {
            webClient.put()
                    .uri(properties.getUsersUrl() + "/" + keycloakId + "/execute-actions-email")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(List.of("UPDATE_PASSWORD"))
                    .retrieve()
                    .toBodilessEntity()
                    .block();

        } catch (WebClientResponseException ex) {
            throw new KeycloakIntegrationException(
                    "Erro ao solicitar reset de senha no Keycloak: " + ex.getResponseBodyAsString());
        }
    }

    public void deleteUser(String keycloakId) {
        String token = tokenClient.getAdminToken();

        try {
            webClient.delete()
                    .uri(properties.getUsersUrl() + "/" + keycloakId)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .retrieve()
                    .toBodilessEntity()
                    .block();

        } catch (WebClientResponseException ex) {
            throw new KeycloakIntegrationException("Erro ao remover usuário do Keycloak: " + ex.getResponseBodyAsString());
        }
    }

    private String extractKeycloakId(String locationUrl) {
        String[] parts = locationUrl.split("/");
        return parts[parts.length - 1];
    }
}
