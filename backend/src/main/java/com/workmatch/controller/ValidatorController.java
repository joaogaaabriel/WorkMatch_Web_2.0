package com.workmatch.controller;

import com.workmatch.service.UsuarioService;
import com.workmatch.validation.CpfValidator;
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

        System.out.println("CPF recebido: " + cpf);
        System.out.println("VALIDADOR NOVO");

        cpf = cpf.replaceAll("\\D", "");

        CpfValidator validator = new CpfValidator();

        boolean valido = validator.isValid(cpf, null);

        return ResponseEntity.ok(
                Map.of("valido", valido)
        );
    }

    @GetMapping("/cpf-existe/{cpf}")
    public ResponseEntity<?> cpfExiste(@PathVariable String cpf) {

        boolean existe = usuarioService.existePorCpf(cpf);

        return ResponseEntity.ok(Map.of(
                "existe", existe
        ));
    }
}