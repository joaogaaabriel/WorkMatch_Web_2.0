package com.workmatch.controller;

import com.workmatch.Utils.CpfUtils;
import com.workmatch.repository.UsuariosRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/validar")
@CrossOrigin(origins = "*") // Ajustar conforme necessário
public class ValidacaoController {

    private final UsuariosRepository usuariosRepository;

    public ValidacaoController(UsuariosRepository usuariosRepository) {
        this.usuariosRepository = usuariosRepository;
    }

    // ==================================================
    // 🔍 1. VALIDA A ESTRUTURA DO CPF (cálculo dos dígitos)
    // ==================================================
    @PostMapping("/cpf")
    public ResponseEntity<?> validarCpf(@RequestBody Map<String, String> json) {
        try {
            if (json == null || !json.containsKey("cpf")) {
                return ResponseEntity.badRequest().body(Map.of(
                        "erro", "Requisição inválida: CPF não enviado."
                ));
            }

            String cpf = json.get("cpf");

            if (cpf == null || cpf.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "erro", "CPF não pode ser vazio."
                ));
            }

            boolean valido = CpfUtils.isValidCPF(cpf);

            return ResponseEntity.ok(Map.of(
                    "valido", valido
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "erro", "Erro interno ao validar CPF.",
                    "detalhes", e.getMessage()
            ));
        }
    }

    // ==================================================
    // 🔍 2. VERIFICA SE CPF EXISTE NO BANCO
    // ==================================================
    @GetMapping("/cpf-existe/{cpf}")
    public ResponseEntity<?> cpfExiste(@PathVariable String cpf) {
        try {
            if (cpf == null || cpf.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "erro", "CPF não pode ser vazio."
                ));
            }

            boolean existe = usuariosRepository.existsByCpf(cpf);

            return ResponseEntity.ok(Map.of(
                    "cpf", cpf,
                    "existe", existe
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "erro", "Erro interno ao verificar CPF.",
                    "detalhes", e.getMessage()
            ));
        }
    }

    // ==================================================
    // 🔍 3. VERIFICA SE EMAIL EXISTE NO BANCO
    // ==================================================
    @GetMapping("/email-existe/{email}")
    public ResponseEntity<?> emailExiste(@PathVariable String email) {
        try {
            if (email == null || email.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "erro", "E-mail não pode ser vazio."
                ));
            }

            boolean existe = usuariosRepository.existsByEmail(email);

            return ResponseEntity.ok(Map.of(
                    "email", email,
                    "existe", existe
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "erro", "Erro interno ao verificar e-mail.",
                    "detalhes", e.getMessage()
            ));
        }
    }
}
