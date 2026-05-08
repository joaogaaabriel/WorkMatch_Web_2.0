package com.workmatch.controller;

import com.workmatch.dto.ProfissionalDTO;
import com.workmatch.model.Profissional;

import com.workmatch.service.ProfissionalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/profissionais")
public class ProfissionalController {

    private final ProfissionalService service;

    public ProfissionalController(ProfissionalService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody @Valid ProfissionalDTO dto) {
        Profissional profissional = service.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", "Profissional cadastrado com sucesso",
                "profissional", Map.of("nome", profissional.getNome())
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profissional> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<Profissional>> listar(
            @RequestParam(required = false) String especialidade,
            @RequestParam(required = false) String cidade
    ) {
        return ResponseEntity.ok(service.listar(especialidade, cidade));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizer(@PathVariable UUID id, @RequestBody @Valid ProfissionalDTO dto) {
        Profissional profissional = service.actualizer(id, dto);
        return ResponseEntity.ok(Map.of(
                "success", "Profissional atualizado com sucesso",
                "profissional", Map.of("nome", profissional.getNome())
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletable(@PathVariable UUID id) {
        service.deletable(id);
        return ResponseEntity.noContent().build();
    }
}