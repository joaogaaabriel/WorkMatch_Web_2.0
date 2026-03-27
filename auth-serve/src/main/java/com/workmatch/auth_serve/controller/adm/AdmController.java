package com.workmatch.auth_serve.controller.adm;

import com.workmatch.auth_serve.model.User;
import com.workmatch.auth_serve.repository.UserRepository;
import com.workmatch.auth_serve.repository.UserTokenRepository;
import java.time.LocalDate;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdmController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    // =========================
    // 🔹 CADASTRAR ADMIN
    // =========================
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody User novo) {
        try {
            if (novo == null || novo.getLogin() == null || novo.getSenha() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Login e senha são obrigatórios"));
            }

            if (userRepository.existsByLogin(novo.getLogin())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Login já está sendo usado"));
            }

            // Criptografar senha
            novo.setSenha(encoder.encode(novo.getSenha()));

            // Data de nascimento padrão
            if (novo.getDataNascimento() == null) {
                novo.setDataNascimento(LocalDate.now());
            }

            novo.setRole("ADMIN");

            userRepository.save(novo);

            return ResponseEntity.ok(Map.of(
                    "message", "Administrador criado com sucesso!",
                    "login", novo.getLogin()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of(
                            "error", "Erro interno ao criar administrador",
                            "details", e.getMessage()
                    ));
        }
    }
}
