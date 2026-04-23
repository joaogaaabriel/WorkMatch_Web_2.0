package com.workmatch.auth_serve.controller.adm;

import com.workmatch.auth_serve.model.User;
import com.workmatch.auth_serve.repository.UserRepository;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdmController {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Value("${ADMIN_SECRET_KEY:WorkMatchAdminSecret}")
    private String adminSecretKey;

    public AdmController(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(
            @RequestBody User novo,
            @RequestHeader(value = "X-Admin-Secret", required = false) String secret) {

        if (adminSecretKey == null || adminSecretKey.isBlank()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "ADMIN_SECRET_KEY não configurado no servidor"));
        }

        if (secret == null || !adminSecretKey.equals(secret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Acesso negado"));
        }

        try {

            if (novo.getLogin() == null || novo.getLogin().isBlank()
                    || novo.getSenha() == null || novo.getSenha().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Login e senha são obrigatórios"));
            }

            if (userRepository.existsByLogin(novo.getLogin())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Login já está em uso"));
            }

            if (userRepository.existsByCpf(novo.getCpf())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "CPF já cadastrado"));
            }

            if (userRepository.existsByEmail(novo.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "E-mail já cadastrado"));
            }

            if (userRepository.existsByRole("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Já existe um administrador cadastrado"));
            }

            novo.setSenha(encoder.encode(novo.getSenha()));
            novo.setDataNascimento(novo.getDataNascimento() != null ? novo.getDataNascimento() : LocalDate.now());
            novo.setRole("ADMIN");

            userRepository.save(novo);

            return ResponseEntity.ok(Map.of("message", "Administrador criado com sucesso"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Erro interno",
                            "details", e.getMessage()
                    ));
        }
    }
}