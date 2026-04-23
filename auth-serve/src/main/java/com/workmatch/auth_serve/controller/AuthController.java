package com.workmatch.auth_serve.controller;

import com.workmatch.auth_serve.model.LoginRequest;
import com.workmatch.auth_serve.model.User;
import com.workmatch.auth_serve.model.UserToken;
import com.workmatch.auth_serve.repository.UserRepository;
import com.workmatch.auth_serve.repository.UserTokenRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserTokenRepository tokenRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest login) {
        try {

            String credencial;

            if (login.getEmail() != null && !login.getEmail().isBlank()) {
                credencial = login.getEmail().trim();
            } else if (login.getLogin() != null && !login.getLogin().isBlank()) {
                credencial = login.getLogin().trim();
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email/login e senha são obrigatórios"));
            }

            String senha = login.getSenha();

            if (senha == null || senha.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Senha é obrigatória"));
            }

            User user = userRepository.findByEmail(credencial)
                    .or(() -> userRepository.findByLogin(credencial))
                    .orElse(null);

            if (user == null) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Usuário não encontrado"));
            }

            if (!encoder.matches(senha, user.getSenha())) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Senha incorreta"));
            }

            List<UserToken> tokens = tokenRepository.findByUserId(user.getId().toString());
            tokens.forEach(t -> t.setActive(false));
            tokenRepository.saveAll(tokens);

            String token = UUID.randomUUID().toString().replace("-", "");

            LocalDateTime agora = LocalDateTime.now();

            UserToken novoToken = new UserToken();
            novoToken.setUserId(user.getId().toString());
            novoToken.setToken(token);
            novoToken.setRole(user.getRole());
            novoToken.setCreatedAt(agora);
            novoToken.setExpiresAt(agora.plusHours(2));
            novoToken.setActive(true);

            tokenRepository.save(novoToken);

            return ResponseEntity.ok(Map.of(
                    "active", true,
                    "role", user.getRole()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Erro interno", "details", e.getMessage()));
        }
    }

}
