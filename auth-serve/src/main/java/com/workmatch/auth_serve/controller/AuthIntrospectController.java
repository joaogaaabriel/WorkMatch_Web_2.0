package com.workmatch.auth_serve.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.workmatch.auth_serve.model.UserToken;
import com.workmatch.auth_serve.repository.UserTokenRepository;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthIntrospectController {

    @Autowired
    private UserTokenRepository userTokenRepository;

    @PostMapping("/introspect")
    public ResponseEntity<Map<String, Object>> introspect(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        Map<String, Object> response = new HashMap<>();

        String token = extractToken(authorizationHeader);

        if (token == null) {
            return inactive(response);
        }

        UserToken userToken = userTokenRepository.findByToken(token);

        if (userToken == null) {
            return inactive(response);
        }

        if (!userToken.isActive() || userToken.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            return inactive(response);
        }

        response.put("active", true);
        response.put("role", userToken.getRole());

        return ResponseEntity.ok(response);
    }

    private String extractToken(String header) {
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    private ResponseEntity<Map<String, Object>> inactive(Map<String, Object> response) {
        response.put("active", false);
        return ResponseEntity.ok(response);
    }
}