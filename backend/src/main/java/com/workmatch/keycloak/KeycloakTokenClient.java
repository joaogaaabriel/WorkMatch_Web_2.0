package com.workmatch.keycloak;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class KeycloakTokenClient {

    private final WebClient webClient;
    private final KeycloakProperties properties;

    public KeycloakTokenClient(WebClient.Builder webClientBuilder, KeycloakProperties properties) {
        this.webClient = webClientBuilder.build();
        this.properties = properties;
    }

    public String getAdminToken() {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "password");
        form.add("client_id", "admin-cli");
        form.add("username", properties.getAdminUsername());
        form.add("password", properties.getAdminPassword());

        KeycloakTokenResponse response = webClient.post()
                .uri(properties.getAdminTokenUrl())
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .body(BodyInserters.fromFormData(form))
                .retrieve()
                .bodyToMono(KeycloakTokenResponse.class)
                .block();

        if (response == null || response.getAccessToken() == null) {
            throw new KeycloakIntegrationException("Falha ao obter token de administrador do Keycloak");
        }

        return response.getAccessToken();
    }
}