package com.workmatch.controller;

import com.workmatch.keycloak.KeycloakIntegrationException;
import com.workmatch.keycloak.KeycloakUserClient;
import com.workmatch.model.Profissional;
import com.workmatch.model.Usuario;
import com.workmatch.repository.ProfissionalRepository;
import com.workmatch.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    private final UsuarioRepository      usuarioRepo;
    private final ProfissionalRepository profissionalRepo;
    private final KeycloakUserClient     keycloakUserClient;

    public PasswordResetController(UsuarioRepository usuarioRepo,
                                   ProfissionalRepository profissionalRepo,
                                   KeycloakUserClient keycloakUserClient) {
        this.usuarioRepo       = usuarioRepo;
        this.profissionalRepo  = profissionalRepo;
        this.keycloakUserClient = keycloakUserClient;
    }

    /*
     * Recebe { "login": "..." } ou { "email": "..." }
     * Localiza o usuário no banco e dispara o e-mail de recuperação via Keycloak.
     * Retorna sempre 200 para não vazar se o e-mail/login existe.
     */
    @PostMapping("/recuperar-senha")
    public ResponseEntity<Map<String, String>> recuperarSenha(@RequestBody Map<String, String> body) {
        String login = body.get("login");
        String email = body.get("email");

        String keycloakId = resolverKeycloakId(login, email);

        if (keycloakId != null) {
            try {
                keycloakUserClient.solicitarResetSenha(keycloakId);
            } catch (KeycloakIntegrationException ignored) {
                // Silenciado intencionalmente — não vazar informações de existência
            }
        }

        return ResponseEntity.ok(Map.of(
                "message", "Se o login informado estiver cadastrado, você receberá um e-mail de recuperação."
        ));
    }

    private String resolverKeycloakId(String login, String email) {
        if (login != null && !login.isBlank()) {
            Optional<Usuario> u = usuarioRepo.findByLogin(login);
            if (u.isPresent()) return u.get().getKeycloakId();

            Optional<Profissional> p = profissionalRepo.findByLogin(login);
            if (p.isPresent()) return p.get().getKeycloakId();
        }

        if (email != null && !email.isBlank()) {
            Optional<Usuario> u = usuarioRepo.findByEmail(email);
            if (u.isPresent()) return u.get().getKeycloakId();

            Optional<Profissional> p = profissionalRepo.findByEmail(email);
            if (p.isPresent()) return p.get().getKeycloakId();
        }

        return null;
    }
}
