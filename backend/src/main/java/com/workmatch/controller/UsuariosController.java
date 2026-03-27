package com.workmatch.controller;

import com.workmatch.Utils.CpfUtils;
import com.workmatch.model.Usuarios;
import com.workmatch.repository.UsuariosRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

@RestController
@RequestMapping("/api/usuarios")
public class UsuariosController {

    private final UsuariosRepository usuariosRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuariosController(UsuariosRepository usuariosRepository, PasswordEncoder passwordEncoder) {
        this.usuariosRepository = usuariosRepository;
        this.passwordEncoder = passwordEncoder;
    }


    // ===========================
    // LISTAR USUÁRIOS
    // ===========================
    @GetMapping
    public ResponseEntity<?> listarUsuarios() {
        try {
            List<Usuarios> lista = usuariosRepository.findAll();
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao listar usuários: " + e.getMessage());
        }
    }

    // ===========================
    // BUSCAR POR ID
    // ===========================
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable UUID id) {
        return usuariosRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet((Supplier<? extends ResponseEntity<Usuarios>>) ResponseEntity.status(404).body("Usuário não encontrado."));
    }

    // ===========================
    // CRIAR USUÁRIO
    // ===========================
    @PostMapping
    public ResponseEntity<?> criarUsuario(@RequestBody Usuarios usuario) {
        try {
            usuario.setDataCadastro(LocalDateTime.now());

            // Validar CPF
            if (!CpfUtils.isValidCPF(usuario.getCpf())) {
                return ResponseEntity.badRequest().body("CPF inválido.");
            }

            // Campos obrigatórios
            if (usuario.getNome() == null || usuario.getNome().isBlank()) {
                return ResponseEntity.badRequest().body("Nome é obrigatório.");
            }

            if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
                return ResponseEntity.badRequest().body("E-mail é obrigatório.");
            }

            if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
                return ResponseEntity.badRequest().body("Senha é obrigatória.");
            }

            // Verificar duplicidade
            if (usuariosRepository.existsByEmail(usuario.getEmail())) {
                return ResponseEntity.status(409).body("E-mail já cadastrado.");
            }

            if (usuariosRepository.existsByCpf(usuario.getCpf())) {
                return ResponseEntity.status(409).body("CPF já cadastrado.");
            }

            // 🔥 CRIPTOGRAFAR A SENHA AQUI
            usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

            Usuarios salvo = usuariosRepository.save(usuario);
            return ResponseEntity.status(201).body(salvo);

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(409).body("Registro duplicado: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao criar usuário: " + e.getMessage());
        }
    }

    // ===========================
    // ATUALIZAR USUÁRIO
    // ===========================
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarUsuario(@PathVariable UUID id, @RequestBody Usuarios usuario) {
        try {
            return usuariosRepository.findById(id)
                    .map(existente -> {

                        if (!CpfUtils.isValidCPF(usuario.getCpf())) {
                            return ResponseEntity.badRequest().body("CPF inválido.");
                        }

                        existente.setNome(usuario.getNome());
                        existente.setEmail(usuario.getEmail());
                        existente.setCpf(usuario.getCpf());

                        Usuarios atualizado = usuariosRepository.save(existente);

                        return ResponseEntity.ok(atualizado);
                    })
                    .orElse(ResponseEntity.status(404).body("Usuário não encontrado."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao atualizar usuário: " + e.getMessage());
        }
    }

    // ===========================
    // EXCLUIR USUÁRIO
    // ===========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarUsuario(@PathVariable UUID id) {
        try {
            if (!usuariosRepository.existsById(id)) {
                return ResponseEntity.status(404).body("Usuário não encontrado.");
            }

            usuariosRepository.deleteById(id);
            return ResponseEntity.ok("Usuário removido com sucesso.");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao deletar usuário: " + e.getMessage());
        }
    }
}
