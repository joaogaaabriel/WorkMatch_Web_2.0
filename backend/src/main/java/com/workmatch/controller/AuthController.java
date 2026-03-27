package com.workmatch.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * BUG 009 CORRIGIDO
 *
 * O endpoint /api/login do backend principal gerava um token UUID aleatório
 * mas NÃO persistia esse token em nenhuma tabela — tornando-o inútil,
 * pois o auth-serve não reconheceria esse token em /auth/introspect.
 *
 * SOLUÇÃO: Este controller agora retorna um erro claro orientando
 * o cliente a usar o auth-serve correto (porta 8082 / VITE_API_URL1).
 *
 * O login REAL é feito exclusivamente no auth-serve:
 *   POST http://auth-serve:8082/api/login
 *
 * Esse controller existe apenas para evitar 404 caso alguém
 * chame /api/login no backend por engano, e orientar corretamente.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        return ResponseEntity.status(301).body(Map.of(
            "error", "Endpoint de login incorreto.",
            "info",  "Use o auth-serve para autenticação: POST /api/login na porta 8082.",
            "docs",  "O token gerado aqui não é validado pelo sistema. Use VITE_API_URL1."
        ));
    }
}
