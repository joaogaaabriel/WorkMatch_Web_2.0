package com.workmatch.keycloak;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

import java.util.Map;

@Component
public class KeycloakIntrospectionClient {

    private final WebClient webClient;
    private final String introspectUrl;
    private final String clientId;
    private final String clientSecret;

    public KeycloakIntrospectionClient(
            WebClient.Builder webClientBuilder,
            @Value("${keycloak.server-url}") String serverUrl,
            @Value("${keycloak.realm}") String realm,
            @Value("${keycloak.client-id}") String clientId,
            @Value("${keycloak.client-secret}") String clientSecret) {
        this.webClient = webClientBuilder.build();
        this.introspectUrl = serverUrl + "/realms/" + realm + "/protocol/openid-connect/token/introspect";
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    public Mono<Boolean> isActive(String token) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("token", token);
        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);

        return webClient.post()
                .uri(introspectUrl)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .body(BodyInserters.fromFormData(form))
                .retrieve()
                .bodyToMono(Map.class)
                .map(body -> Boolean.TRUE.equals(body.get("active")))
                .onErrorReturn(false);
    }
}
