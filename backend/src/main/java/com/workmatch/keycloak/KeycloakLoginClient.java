package com.workmatch.keycloak;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Component
public class KeycloakLoginClient {

    private static final Logger log = LoggerFactory.getLogger(KeycloakLoginClient.class);

    private final WebClient webClient;
    private final KeycloakProperties properties;

    public KeycloakLoginClient(WebClient.Builder webClientBuilder,
                               KeycloakProperties properties) {
        this.webClient  = webClientBuilder.build();
        this.properties = properties;
    }

    public KeycloakTokenResponse login(String login, String senha) {
        // D12 corrigido — bloco de debug com fragmento do client secret removido

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type",    "password");
        form.add("client_id",     properties.getClientId());
        form.add("client_secret", properties.getClientSecret());
        form.add("username",      login);
        form.add("password",      senha);
        form.add("scope",         "openid");

        try {
            KeycloakTokenResponse response = webClient.post()
                    .uri(properties.getTokenUrl())
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                    .body(BodyInserters.fromFormData(form))
                    .retrieve()
                    .bodyToMono(KeycloakTokenResponse.class)
                    .block();

            if (response == null || response.getAccessToken() == null) {
                throw new KeycloakIntegrationException("Resposta de login nula do Keycloak");
            }

            return response;

        } catch (WebClientResponseException.Unauthorized e) {
            log.error("Keycloak retornou 401. Response body: {}", e.getResponseBodyAsString());
            throw new KeycloakIntegrationException("Credenciais inválidas");
        } catch (WebClientResponseException e) {
            log.error("Keycloak retornou {}. Response body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new KeycloakIntegrationException("Erro no login Keycloak: " + e.getStatusCode());
        } catch (Exception e) {
            log.error("Erro inesperado ao chamar Keycloak: {}", e.getMessage(), e);
            throw new KeycloakIntegrationException("Erro de comunicação com Keycloak");
        }
    }
}
