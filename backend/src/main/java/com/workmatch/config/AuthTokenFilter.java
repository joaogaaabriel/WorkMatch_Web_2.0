package com.workmatch.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

public class AuthTokenFilter extends OncePerRequestFilter {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String INTROSPECT_URL = "http://localhost:8081/auth/introspect";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            try {
                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", authHeader);

                HttpEntity<String> entity = new HttpEntity<>(headers);

                ResponseEntity<Map> result = restTemplate.exchange(
                        INTROSPECT_URL,
                        HttpMethod.POST,
                        entity,
                        Map.class
                );

                Boolean active = (Boolean) result.getBody().get("active");

                if (Boolean.TRUE.equals(active)) {

                    String userId = (String) result.getBody().get("userId");

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userId,
                                    null,
                                    Collections.emptyList()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }

            } catch (Exception e) {
                System.out.println("Erro ao validar token: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}