package com.workmatch.controller;

import com.workmatch.repository.ProfissionalRepository;
import com.workmatch.repository.UsuarioRepository;
import com.workmatch.validation.CpfValida;
import com.workmatch.validation.EmailValida;
import com.workmatch.validation.TelefoneValida;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

/**
 * Endpoints de validação usados pelo frontend durante o cadastro passo a passo.
 * A lógica de validação é delegada aos validators já existentes
 * (CpfValidator, EmailValidator, TelefoneValidator) via Jakarta Bean Validation,
 * sem nenhuma duplicação de regra.
 */
@RestController
@RequestMapping("/api/validar")
public class ValidatorController {

    private final UsuarioRepository      usuarioRepo;
    private final ProfissionalRepository profissionalRepo;
    private final Validator              validator;

    public ValidatorController(UsuarioRepository usuarioRepo,
                               ProfissionalRepository profissionalRepo,
                               Validator validator) {
        this.usuarioRepo      = usuarioRepo;
        this.profissionalRepo = profissionalRepo;
        this.validator        = validator;
    }

    // ── CPF ───────────────────────────────────────────────────────────────────

    /** POST /api/validar/cpf — valida formato/dígitos via CpfValidator */
    @PostMapping("/cpf")
    public ResponseEntity<Map<String, Boolean>> validarCpf(@RequestBody Map<String, String> body) {
        String cpf = body.getOrDefault("cpf", "");
        boolean valido = isValido(new CpfHolder(cpf), "cpf");
        return ResponseEntity.ok(Map.of("valido", valido));
    }

    /** GET /api/validar/cpf-existe/{cpf} — verifica duplicidade no BD */
    @GetMapping("/cpf-existe/{cpf}")
    public ResponseEntity<Map<String, Boolean>> cpfExiste(@PathVariable String cpf) {
        String cpfLimpo = cpf.replaceAll("\\D", "");
        boolean existe = usuarioRepo.existsByCpf(cpfLimpo)
                || profissionalRepo.existsByCpf(cpfLimpo);
        return ResponseEntity.ok(Map.of("existe", existe));
    }

    // ── E-mail ────────────────────────────────────────────────────────────────

    /** GET /api/validar/email-existe/{email} — verifica duplicidade no BD */
    @GetMapping("/email-existe/{email}")
    public ResponseEntity<Map<String, Boolean>> emailExiste(@PathVariable String email) {
        boolean existe = usuarioRepo.existsByEmail(email)
                || profissionalRepo.existsByEmail(email);
        return ResponseEntity.ok(Map.of("existe", existe));
    }

    // ── Telefone ──────────────────────────────────────────────────────────────

    /** POST /api/validar/telefone — valida DDD e formato via TelefoneValidator */
    @PostMapping("/telefone")
    public ResponseEntity<Map<String, Boolean>> validarTelefone(@RequestBody Map<String, String> body) {
        String telefone = body.getOrDefault("telefone", "");
        boolean valido = isValido(new TelefoneHolder(telefone), "telefone");
        return ResponseEntity.ok(Map.of("valido", valido));
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    /**
     * Dispara o Bean Validation programaticamente em um holder temporário
     * e retorna true se não houver violações no campo informado.
     */
    private <T> boolean isValido(T holder, String campo) {
        Set<ConstraintViolation<T>> violations = validator.validate(holder);
        return violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals(campo));
    }

    // ── Holders internos (portam a anotação de validação para uso programático) ──

    @Getter @Setter
    static class CpfHolder {
        @CpfValida
        private String cpf;
        CpfHolder(String cpf) { this.cpf = cpf; }
    }

    @Getter @Setter
    static class EmailHolder {
        @EmailValida
        private String email;
        EmailHolder(String email) { this.email = email; }
    }

    @Getter @Setter
    static class TelefoneHolder {
        @TelefoneValida
        private String telefone;
        TelefoneHolder(String telefone) { this.telefone = telefone; }
    }
}