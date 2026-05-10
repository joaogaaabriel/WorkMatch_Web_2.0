package com.workmatch.keycloak;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

/**
 * Realiza o login de um usuário no Keycloak via Resource Owner Password Credentials Grant.
 * O gateway nunca vê a senha em texto claro depois desta chamada — só o token JWT.
 */
@Component
public class KeycloakLoginClient {

    private final WebClient webClient;
    private final KeycloakProperties properties;

    public KeycloakLoginClient(WebClient.Builder webClientBuilder,
                               KeycloakProperties properties) {
        this.webClient = webClientBuilder.build();
        this.properties = properties;
    }

    /**
     * Autentica o usuário e retorna a resposta completa de token do Keycloak.
     *
     * @param login login (username) do usuário
     * @param senha senha em texto claro (somente nesta chamada ponto-a-ponto com Keycloak)
     * @return {@link KeycloakTokenResponse} com access_token, refresh_token, expires_in etc.
     * @throws KeycloakIntegrationException se as credenciais forem inválidas ou houver erro de comunicação
     */
    public KeycloakTokenResponse login(String login, String senha) {

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
            throw new KeycloakIntegrationException("Credenciais inválidas");
        } catch (WebClientResponseException e) {
            throw new KeycloakIntegrationException("Erro no login Keycloak: " + e.getStatusCode());
        }
    }
}