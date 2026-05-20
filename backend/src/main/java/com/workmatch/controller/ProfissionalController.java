package com.workmatch.controller;

import com.workmatch.dto.UsuarioDTO;
import com.workmatch.model.Profissional;
import com.workmatch.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/profissionais")
public class ProfissionalController {

    private final UsuarioService service;

    public ProfissionalController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody @Valid UsuarioDTO dto) {
        // Força o role para PROFISSIONAL independente do que vier no body
        dto.setRole("PROFISSIONAL");
        Profissional p = (Profissional) service.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", "Profissional cadastrado com sucesso",
                "usuario", Map.of("nome", p.getNome())
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable UUID id) {
        // Pode adicionar busca específica de profissional se necessário
        return ResponseEntity.ok(service.buscarPorId(id));
    }
}