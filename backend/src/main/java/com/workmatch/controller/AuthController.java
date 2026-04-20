package com.workmatch.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        return ResponseEntity.status(HttpStatus.GONE).body(Map.of(
            "error", "Endpoint de login incorreto.",
            "info",  "Use o auth-serve para autenticação: POST /api/login na porta 8082."
        ));
    }
}