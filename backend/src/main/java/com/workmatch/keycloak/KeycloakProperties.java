package com.workmatch.keycloak;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Setter
@Getter
@Component
@ConfigurationProperties(prefix = "keycloak")
public class KeycloakProperties {

    private String serverUrl;
    private String realm;
    private String clientId;
    private String clientSecret;
    private String adminUsername;
    private String adminPassword;

    public String getAdminTokenUrl() {
        return serverUrl + "/realms/master/protocol/openid-connect/token";
    }

    public String getUsersUrl() {
        return serverUrl + "/admin/realms/" + realm + "/users";
    }

    public String getTokenUrl() {
        return serverUrl + "/realms/" + realm + "/protocol/openid-connect/token";
    }

    public String getIntrospectUrl() {
        return serverUrl + "/realms/" + realm + "/protocol/openid-connect/token/introspect";
    }
}