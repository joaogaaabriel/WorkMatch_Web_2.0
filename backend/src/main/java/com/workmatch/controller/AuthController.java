package com.workmatch.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class AuthController {

    private final AuthenticationManager authManager;

    public AuthController(AuthenticationManager authManager) {
        this.authManager = authManager;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            if (body == null || !body.containsKey("email") || !body.containsKey("senha")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email e senha são obrigatórios"));
            }

            String email = body.get("email");
            String senha = body.get("senha");

            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, senha)
            );

            // Aqui você pode gerar token UUID ou JWT
            String token = java.util.UUID.randomUUID().toString().replace("-", "");

            return ResponseEntity.ok(Map.of(
                    "status", "OK",
                    "email", email,
                    "token", token
            ));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Email ou senha inválidos"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro interno ao autenticar", "details", e.getMessage()));
        }
    }
}
