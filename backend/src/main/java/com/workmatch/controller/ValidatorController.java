package com.workmatch.controller;

import com.workmatch.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/validar")
public class ValidatorController {

    private final UsuarioService usuarioService;

    public ValidatorController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/cpf")
    public ResponseEntity<?> validarCpf(@RequestBody Map<String, String> body) {
        String cpf = body.get("cpf");

        if (cpf == null || cpf.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "erro", "CPF é obrigatório"
            ));
        }

        boolean valido = cpf.length() == 11;

        return ResponseEntity.ok(Map.of("valido", valido));
    }

    @GetMapping("/cpf-existe/{cpf}")
    public ResponseEntity<?> cpfExiste(@PathVariable String cpf) {

        boolean existe = usuarioService.existePorCpf(cpf);

        return ResponseEntity.ok(Map.of(
                "existe", existe
        ));
    }
}