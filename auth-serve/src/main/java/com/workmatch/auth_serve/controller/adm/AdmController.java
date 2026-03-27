package com.workmatch.auth_serve.controller.adm;

import com.workmatch.auth_serve.model.User;
import com.workmatch.auth_serve.repository.UserRepository;
import java.time.LocalDate;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * BUG 010 CORRIGIDO
 *
 * ANTES: /admin/create-admin era totalmente público — qualquer pessoa
 * podia fazer uma requisição POST e criar um usuário ADMIN.
 *
 * SOLUÇÃO: O endpoint agora exige um header "X-Admin-Secret" com uma
 * chave definida via variável de ambiente ADMIN_SECRET_KEY.
 *
 * Configure no Render/Railway/docker-compose:
 *   ADMIN_SECRET_KEY=sua_chave_super_secreta_aqui
 *
 * Sem esse header correto, a requisição retorna 403.
 */
@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdmController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    // Lida da variável de ambiente ADMIN_SECRET_KEY
    // Valor padrão vazio força configuração obrigatória em produção
    @Value("${ADMIN_SECRET_KEY:}")
    private String adminSecretKey;

    // =========================
    // 🔹 CADASTRAR ADMIN (protegido)
    // =========================
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(
            @RequestBody User novo,
            @RequestHeader(value = "X-Admin-Secret", required = false) String secret) {

        // BUG 010 FIX: validar chave secreta antes de qualquer operação
        if (adminSecretKey == null || adminSecretKey.isBlank()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Criação de admin não configurada no servidor. Defina ADMIN_SECRET_KEY."));
        }

        if (secret == null || !adminSecretKey.equals(secret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Acesso negado. Chave de administrador inválida ou ausente."));
        }

        try {
            if (novo == null || novo.getLogin() == null || novo.getSenha() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Login e senha são obrigatórios"));
            }

            if (userRepository.existsByLogin(novo.getLogin())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Login já está sendo usado"));
            }

            novo.setSenha(encoder.encode(novo.getSenha()));

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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Erro interno ao criar administrador",
                            "details", e.getMessage()
                    ));
        }
    }
}
