package com.workmatch.keycloak;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Component
public class KeycloakUserClient {

    private final WebClient webClient;
    private final KeycloakProperties properties;
    private final KeycloakTokenClient tokenClient;

    public KeycloakUserClient(WebClient.Builder webClientBuilder,
                              KeycloakProperties properties,
                              KeycloakTokenClient tokenClient) {
        this.webClient = webClientBuilder.build();
        this.properties = properties;
        this.tokenClient = tokenClient;
    }

    public String createUser(KeycloakUserRequest request) {
        String token = tokenClient.getAdminToken();

        try {
            var response = webClient.post()
                    .uri(properties.getUsersUrl())
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
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

            return extractKeycloakId(locationHeader);

        } catch (WebClientResponseException ex) {
            if (ex.getStatusCode() == HttpStatus.CONFLICT) {
                throw new KeycloakIntegrationException("Usuário já existe no Keycloak: " + request.getUsername());
            }
            throw new KeycloakIntegrationException("Erro ao criar usuário no Keycloak: " + ex.getMessage());
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
            throw new KeycloakIntegrationException("Erro ao remover usuário do Keycloak: " + ex.getMessage());
        }
    }

    private String extractKeycloakId(String locationUrl) {
        String[] parts = locationUrl.split("/");
        return parts[parts.length - 1];
    }
}